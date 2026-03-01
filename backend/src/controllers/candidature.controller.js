// src/controllers/candidature.controller.js

import Candidature from "../models/Candidature.js";
import Offre       from "../models/Offre.js";
import Users       from "../models/Users.js";
import Profile     from "../models/Profile.js";

// ── GET /api/offres/candidatures ─────────────────────────────────────────────
// Retourne toutes les candidatures du demandeur connecté
export const getMyCandidatures = async (req, res) => {
  try {
    const userId = req.user.id; // injecté par isAuthenticated

    const candidatures = await Candidature.findAll({
      where: { userId },
      include: [
        {
          model: Offre,
          as: "offre",      // vérifie que l'alias correspond à ton association
          attributes: [
            "id", "title", "city", "region",
            "contractType", "companyName", "status",
            "salaryMin", "salaryMax", "salaryPeriod",
            "applicationDeadline",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: candidatures });

  } catch (error) {
    console.error("❌ getMyCandidatures :", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des candidatures",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ── POST /api/offres/:offreId/postuler ───────────────────────────────────────
export const createCandidature = async (req, res) => {
  try {
    const userId   = req.user.id;
    const offreId  = req.params.offreId;
    const { coverLetter, cvText } = req.body;

    // Vérifier que l'offre existe
    const offre = await Offre.findByPk(offreId);
    if (!offre) {
      return res.status(404).json({ success: false, message: "Offre introuvable" });
    }

    // Vérifier si déjà postulé
    const existing = await Candidature.findOne({ where: { userId, offreId } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Vous avez déjà postulé à cette offre",
      });
    }

    const candidature = await Candidature.create({
      userId,
      offreId,
      coverLetter: coverLetter?.trim() || null,
      cvText:      cvText?.trim()      || null,
      status:      "en_attente",
    });

    res.status(201).json({ success: true, data: candidature });

  } catch (error) {
    console.error("❌ createCandidature :", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi de la candidature",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ── GET /api/offres/:offreId/candidatures (Recruteur) ────────────────────────
export const getCandidaturesByOffre = async (req, res) => {
  try {
    const { offreId } = req.params;

    const candidatures = await Candidature.findAll({
      where: { offreId },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "email"],
          include: [{ model: Profile, as: "profile", attributes: ["firstName", "lastName", "phone", "city"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: candidatures });

  } catch (error) {
    console.error("❌ getCandidaturesByOffre :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ── PATCH /api/offres/:offreId/candidatures/:candidatureId/statut ────────────
export const updateCandidatureStatus = async (req, res) => {
  try {
    const { candidatureId } = req.params;
    const { status } = req.body;

    const allowed = ["en_attente", "vue", "retenue", "rejetee"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Statut invalide. Valeurs acceptées : ${allowed.join(", ")}`,
      });
    }

    const [updated] = await Candidature.update(
      { status },
      { where: { id: candidatureId } }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Candidature introuvable" });
    }

    res.json({ success: true, message: "Statut mis à jour" });

  } catch (error) {
    console.error("❌ updateCandidatureStatus :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
