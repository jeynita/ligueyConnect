// src/middlewares/cors.middleware.js
// ✅ Séparé de security.middleware.js pour pouvoir modifier les origines
//    sans toucher au reste de la sécurité.

import cors from "cors";

const allowedOrigins = [
  process.env.FRONTEND_URL,        // Vercel en prod   → https://xxx.vercel.app
  "http://localhost:5173",          // Vite dev
  "http://localhost:3000",          // CRA dev (au cas où)
].filter(Boolean);                  // Supprime les undefined si FRONTEND_URL n'est pas défini

export const corsConfig = cors({
  origin: (origin, callback) => {
    // Autorise les requêtes sans origin : Postman, curl, apps mobiles
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`🚫 CORS bloqué pour : ${origin}`);
    callback(new Error(`Origine non autorisée par CORS : ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["X-Total-Count"],  // utile pour la pagination
});
