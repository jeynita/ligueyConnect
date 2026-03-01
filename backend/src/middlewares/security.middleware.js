// import express from "express";
// import dotenv from "dotenv";
// import sequelize from "./src/config/db.js";

// import "./src/models/Users.js";
// import "./src/models/Profile.js";
// import "./src/models/Service.js";
// import "./src/models/Candidature.js";
// import "./src/models/Offre.js";
// import "./src/models/Message.js";
// import "./src/models/Conversation.js";

// import profileRoutes from "./src/routes/profile.routes.js";
// import authRoutes from "./src/routes/auth.routes.js";
// import serviceRoutes from "./src/routes/service.routes.js";
// import offreRoutes from "./src/routes/offre.routes.js";
// import messageRoutes from "./src/routes/message.routes.js";

// import {
//   helmetConfig,
//   corsConfig,
//   generalLimiter,
//   logger
// } from "./src/middlewares/security.middleware.js";

// import {
//   notFoundHandler,
//   errorHandler
// } from "./src/middlewares/error.middleware.js";

// dotenv.config();

// const app = express();

// /* ================= MIDDLEWARES ================= */

// // 🔐 Headers de sécurité
// app.use(helmetConfig);

// // 🌍 CORS officiel
// app.use(corsConfig); // ✅ Avant tout

// // 📦 Body parser
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // 📊 Logger
// app.use(logger);

// // 🚦 Rate limiting général
// app.use(generalLimiter);

// /* ================= ROUTES ================= */

// // Route de test
// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "API Liguey Connect is running 🚀",
//     version: "1.0.0",
//   });
// });

// // Health check
// app.get("/health", (req, res) => {
//   res.json({
//     success: true,
//     status: "OK",
//     timestamp: new Date().toISOString(),
//   });
// });

// // Routes principales
// app.use("/api/auth", authRoutes);
// app.use("/api/profiles", profileRoutes);
// app.use("/api/services", serviceRoutes);
// app.use("/api/offres", offreRoutes);
// app.use("/api/messages", messageRoutes);

// /* ================= ERRORS ================= */

// app.use(notFoundHandler);
// app.use(errorHandler);

// /* ================= SERVER START ================= */

// const startServer = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("✓ Base de données connectée");

//     if (process.env.NODE_ENV === "development") {
//       await sequelize.sync({ alter: true });
//       console.log("✓ Tables synchronisées (dev)");
//     } else {
//       await sequelize.sync();
//       console.log("✓ Tables synchronisées (prod)");
//     }

//     const PORT = process.env.PORT || 3000;

//     app.listen(PORT, () => {
//       console.log(`\n🚀 Serveur lancé sur http://localhost:${PORT}`);
//       console.log(`🌍 CORS autorisé pour : ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
//     });

//   } catch (error) {
//     console.error("❌ Erreur au démarrage :", error);
//     process.exit(1);
//   }
// };

// startServer(); 

import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

/* ================= HELMET (Sécurité headers HTTP) ================= */
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
});

/* ================= CORS ================= */
export const corsConfig = cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
});

/* ================= RATE LIMITING ================= */

// Rate limiter général (100 requêtes par 15 minutes)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Trop de requêtes. Réessayez dans 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter pour l'authentification (5 tentatives par 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: "Trop de tentatives de connexion. Réessayez dans 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});

/* ================= LOGGING ================= */
export const logger = morgan(
  process.env.NODE_ENV === "production" ? "combined" : "dev"
);