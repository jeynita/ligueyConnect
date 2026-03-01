// src/routes/candidature.routes.js
// Monté sous /api/offres dans server.js
// → routes finales :
//   GET  /api/offres/candidatures                        (demandeur : mes candidatures)
//   POST /api/offres/:offreId/postuler                   (demandeur : postuler)
//   GET  /api/offres/:offreId/candidatures               (recruteur : candidatures d'une offre)
//   PATCH /api/offres/:offreId/candidatures/:id/statut  (recruteur : changer le statut)

import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getMyCandidatures,
  createCandidature,
  getCandidaturesByOffre,
  updateCandidatureStatus,
} from "../controllers/candidature.controller.js"; // adapte si nécessaire

const router = Router();

// ── Demandeur ─────────────────────────────────────────────────────────────────

// GET /api/offres/candidatures
// ✅ Route appelée par CandidatureList.jsx — doit être définie AVANT /:offreId
router.get("/candidatures", verifyToken, getMyCandidatures);

// POST /api/offres/:offreId/postuler
router.post("/:offreId/postuler", verifyToken, createCandidature);

// ── Recruteur ─────────────────────────────────────────────────────────────────

// GET /api/offres/:offreId/candidatures
router.get("/:offreId/candidatures", verifyToken, getCandidaturesByOffre);

// PATCH /api/offres/:offreId/candidatures/:candidatureId/statut
router.patch("/:offreId/candidatures/:candidatureId/statut", verifyToken, updateCandidatureStatus);

export default router;
