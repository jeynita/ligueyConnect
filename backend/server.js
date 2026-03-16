// ✅ CORRECTION 1 : dotenv EN PREMIER — avant tout import qui lit process.env
// En ESM, "import dotenv from dotenv + dotenv.config()" s'exécutait APRÈS les
// autres imports, donc corsConfig lisait FRONTEND_URL=undefined au démarrage.
import "dotenv/config";

import express from "express";
import sequelize from "./src/config/db.js";

// ⚠️ ORDRE D'IMPORT IMPORTANT : Users et Profile d'abord
import Users        from "./src/models/Users.js";
import Profile      from "./src/models/Profile.js";
// Puis les autres modèles qui dépendent de Users et Profile
import Service      from "./src/models/Service.js";
import Offre        from "./src/models/Offre.js";
import Candidature  from "./src/models/Candidature.js";
import Message      from "./src/models/Message.js";
import Conversation from "./src/models/Conversation.js";

import profileRoutes     from "./src/routes/profile.routes.js";
import authRoutes        from "./src/routes/auth.routes.js";
import serviceRoutes     from "./src/routes/service.routes.js";
import offreRoutes       from "./src/routes/offre.routes.js";
// ✅ CORRECTION 2 : import des routes candidatures (source des 404)
import candidatureRoutes from "./src/routes/candidature.routes.js";
import messageRoutes     from "./src/routes/message.routes.js";

import { 
  helmetConfig, 
  corsConfig,         // ✅ CORRECTION 3 : corsConfig doit lire FRONTEND_URL
  generalLimiter, 
  logger 
} from "./src/middlewares/security.middleware.js";
import { 
  notFoundHandler, 
  errorHandler 
} from "./src/middlewares/error.middleware.js";

const app = express();

/* ================= MIDDLEWARES DE SÉCURITÉ ================= */

// Logging des requêtes
app.use(logger);

// CORS — doit être AVANT express.json et toutes les routes
app.use(corsConfig);

// Gestion des requêtes OPTIONS (preflight CORS)
app.options('*', corsConfig);

// Rate limiting général
app.use(generalLimiter);

// Parse JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ================= ROUTES ================= */

// Route de test avec info sur les 4 rôles
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Liguey Connect is running 🚀",
    version: "2.0.0",
    description: "Plateforme hybride de mise en relation professionnelle au Sénégal",
    roles: {
      prestataire: {
        icon: "🔧",
        description: "Travailleur indépendant proposant des services à la tâche",
        exemples: ["Plombier", "Électricien", "Mécanicien", "Maçon"]
      },
      demandeur_emploi: {
        icon: "💼",
        description: "Personne cherchant un emploi stable (CDI/CDD)",
        exemples: ["Gardien", "Chauffeur", "Ouvrier"]
      },
      recruteur: {
        icon: "🏢",
        description: "Entreprise cherchant à recruter",
        exemples: ["Restaurant", "Société BTP", "Commerce"]
      },
      client: {
        icon: "🛍️",
        description: "Particulier cherchant des services ponctuels",
        exemples: ["Famille", "Propriétaire", "Particulier"]
      }
    },
    endpoints: {
      auth: "/api/auth",
      profiles: "/api/profiles",
      services: "/api/services",
      offres: "/api/offres",
      messages: "/api/messages"
    }
  });
});

// Health check amélioré
app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    
    const stats = await Users.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['role']
    });

    res.json({
      success: true,
      status: "OK",
      timestamp: new Date().toISOString(),
      database: "connected",
      environment: process.env.NODE_ENV || "development",
      statistics: stats.reduce((acc, stat) => {
        acc[stat.role] = parseInt(stat.get('count'));
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: "ERROR",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error.message
    });
  }
});

// Routes
app.use("/api/auth",     authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/offres",   offreRoutes);
// ✅ CORRECTION 4 : candidatureRoutes monté sur /api/offres
// → expose GET  /api/offres/candidatures       (appelé par CandidatureList.jsx)
// → expose POST /api/offres/:offreId/postuler  (appelé par OffrePostuler.jsx)
// ⚠️  Doit être après offreRoutes mais la route statique /candidatures
//     dans candidature.routes.js sera matchée avant /:offreId grâce à l'ordre
//     de déclaration dans le fichier de routes.
app.use("/api/offres",   candidatureRoutes);
app.use("/api/messages", messageRoutes);

/* ================= GESTION DES ERREURS ================= */

app.use(notFoundHandler);
app.use(errorHandler);

/* ================= DÉMARRAGE DU SERVEUR ================= */

const startServer = async () => {
  try {
    console.log("🔄 Démarrage de Liguey Connect API...\n");

    await sequelize.authenticate();
    console.log("✅ Connexion à la base de données réussie");

    // if (process.env.NODE_ENV === "development") {
    //   await sequelize.sync({ alter: true });
    //   console.log("✅ Tables synchronisées (mode development)");
    // } else {
    //   // ✅ CORRECTION 5 : En production, ne PAS modifier la structure automatiquement
    //   await sequelize.sync({ alter: false });
    //   console.log("✅ Tables synchronisées (mode production)");
    // }
// ✅ METTEZ ÇA À LA PLACE
if (process.env.NODE_ENV !== "production") {
  await sequelize.sync({ alter: true });
  console.log("✅ Tables synchronisées (mode development)");
} else {
  console.log("⚠️  Production : tables créées via SQL");
}
    const roles = await Users.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('role')), 'role']],
      raw: true
    });
    
    const availableRoles = roles.map(r => r.role);
    console.log("📋 Rôles détectés:", availableRoles.length > 0 ? availableRoles.join(', ') : 'Aucun utilisateur');

    // ✅ process.env.PORT en premier — Railway/Render l'injectent automatiquement
    const PORT = process.env.PORT || 5000;
    // ✅ CORRECTION 6 : Écouter sur 0.0.0.0 (OBLIGATOIRE pour Railway/Render)
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           🚀 LIGUEY CONNECT API v2.0                      ║
║           Plateforme Hybride d'Emploi au Sénégal 🇸🇳       ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  📡 Serveur:        http://localhost:${PORT.toString().padEnd(23)} ║
║  📍 Environnement:  ${(process.env.NODE_ENV || 'development').padEnd(33)} ║
║  🌐 CORS:           ${(process.env.FRONTEND_URL || 'http://localhost:5173').padEnd(33)} ║
║  🗄️  Base:           ${(process.env.DB_NAME || 'liguey_connect').padEnd(33)} ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  👥 Rôles Supportés:                                      ║
║                                                            ║
║     🔧 Prestataire        → Services à la tâche          ║
║                              (Plombier, Électricien...)   ║
║                                                            ║
║     💼 Demandeur d'emploi → Emploi stable (CDI/CDD)      ║
║                              (Gardien, Chauffeur...)      ║
║                                                            ║
║     🏢 Recruteur          → Entreprise qui recrute       ║
║                              (Restaurant, BTP...)         ║
║                                                            ║
║     🛍️  Client             → Particulier                  ║
║                              (Famille, Propriétaire...)   ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  📚 Documentation:  http://localhost:${PORT}                  ║
║  ❤️  Health Check:   http://localhost:${PORT}/health          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
      console.log("✅ Serveur prêt à recevoir des requêtes!\n");
    });

  } catch (error) {
    console.error("\n❌ ERREUR DE DÉMARRAGE:");
    console.error("   Message:", error.message);
    console.error("   Stack:", error.stack);
    console.error("\n💡 Vérifications:");
    console.error("   1. MySQL est démarré?");
    console.error("   2. Fichier .env correctement configuré?");
    console.error("   3. Base de données créée?");
    console.error("   4. Migrations exécutées?\n");
    process.exit(1);
  }
};

// Gestion de l'arrêt gracieux
const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️  ${signal} reçu. Arrêt gracieux...`);
  try {
    await sequelize.close();
    console.log("✅ Connexion à la base de données fermée");
    console.log("👋 Au revoir!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de la fermeture:", error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error('❌ ERREUR NON CAPTURÉE:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ PROMESSE REJETÉE NON GÉRÉE:', reason);
  gracefulShutdown('unhandledRejection');
});

startServer();

export default app;