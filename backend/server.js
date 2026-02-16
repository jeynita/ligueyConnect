// import express from "express";
// import dotenv from "dotenv";
// import sequelize from "./src/config/db.js";
// import "./src/models/Users.js";
// import authRoutes from "./src/routes/auth.routes.js";

// dotenv.config();

// const app = express();
// app.use(express.json());

// const startServer = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log("DB connected");


//         console.log("Tables created");

//         console.log("DB synced");

//         app.listen(process.env.PORT, () => {
//         console.log(`Server running on port ${process.env.PORT}`);
//         });

//     } catch (error) {
//         console.error("DB error:", error);
//     }
// };
// app.use("/api/auth", authRoutes);


// app.get("/", (req, res) => {
// res.send("API Liguey Connect is running ");
// });

// startServer();


import express from "express";
import dotenv from "dotenv";
import sequelize from "./src/config/db.js";
import "./src/models/Users.js";
import "./src/models/Profile.js";
import "./src/models/Service.js";
import "./src/models/Candidature.js"; 
import "./src/models/Offre.js"; 
import  "./src/models/Message.js"; 
import "./src/models/Conversation.js";
import profileRoutes from "./src/routes/profile.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import serviceRoutes from "./src/routes/service.routes.js";
import offreRoutes from "./src/routes/offre.routes.js";
import messageRoutes from "./src/routes/message.routes.js";
import { 
  helmetConfig, 
  corsConfig, 
  generalLimiter, 
  logger 
} from "./src/middlewares/security.middleware.js";
import { 
  notFoundHandler, 
  errorHandler 
} from "./src/middlewares/error.middleware.js";

// Configuration des variables d'environnement
dotenv.config();

const app = express();

/* ================= MIDDLEWARES DE SÉCURITÉ ================= */

// Logging des requêtes
app.use(logger);

// Sécurité headers HTTP (Helmet)
app.use(helmetConfig);

// CORS
app.use(corsConfig);

// Rate limiting général
app.use(generalLimiter);

// Parse JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ================= ROUTES ================= */

// Route de test
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Liguey Connect is running 🚀",
    version: "1.0.0"
  });
});

// Routes d'authentification
app.use("/api/auth", authRoutes);
app.use ("/api/profiles", profileRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/offres", offreRoutes);
app.use("/api/messages", messageRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

/* ================= GESTION DES ERREURS ================= */

// Route non trouvée (404)
app.use(notFoundHandler);

// Gestionnaire d'erreurs global
app.use(errorHandler);

/* ================= DÉMARRAGE DU SERVEUR ================= */

const startServer = async () => {
  try {
    // Test de connexion à la base de données
    await sequelize.authenticate();
    console.log(" Connexion à la base de données réussie");


    // Synchronisation des modèles (sans force: true en production)
    console.log("NODE_ENV =", process.env.NODE_ENV);
    if (process.env.NODE_ENV === "development") {
      //await sequelize.sync({ alter: true });
      await sequelize.sync({ force: true });
      console.log(" Tables synchronisées (mode development)");
    } else {
      await sequelize.sync();
      console.log(" Tables synchronisées (mode production)");
    }

    // Démarrage du serveur
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`Environnement: ${process.env.NODE_ENV || "development"}`);
      console.log(`URL: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Erreur de démarrage:", error);
    process.exit(1);
  }
};

startServer();
