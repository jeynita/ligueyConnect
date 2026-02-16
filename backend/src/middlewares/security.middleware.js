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
  windowMs: 15 * 60 * 1000, // 15 minutes
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
  windowMs: 15 * 60 * 1000, // 15 minutes
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
