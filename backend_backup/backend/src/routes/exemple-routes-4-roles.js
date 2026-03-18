import express from "express";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= EXEMPLES D'UTILISATION DES MIDDLEWARES ================= */

/**
 * EXEMPLE 1 : Route accessible uniquement aux PRESTATAIRES
 * Utilisation : Création d'un service
 */
router.post(
  "/create",
  verifyToken,                      // 1. Vérifier le token
  checkRole(["prestataire"]),       // 2. Vérifier que c'est un prestataire
  async (req, res) => {
    // Logique de création de service
    res.json({
      success: true,
      message: "Service créé par le prestataire",
      user: req.user
    });
  }
);

/**
 * EXEMPLE 2 : Route accessible aux PRESTATAIRES et DEMANDEURS D'EMPLOI
 * Utilisation : Consulter les offres d'emploi
 */
router.get(
  "/jobs",
  verifyToken,
  checkRole(["prestataire", "demandeur_emploi"]),
  async (req, res) => {
    res.json({
      success: true,
      message: "Liste des offres d'emploi",
      userRole: req.user.role
    });
  }
);

/**
 * EXEMPLE 3 : Route accessible uniquement aux RECRUTEURS
 * Utilisation : Publier une offre d'emploi
 */
router.post(
  "/offres/create",
  verifyToken,
  checkRole(["recruteur"]),
  async (req, res) => {
    res.json({
      success: true,
      message: "Offre publiée par le recruteur",
      company: req.user.companyName
    });
  }
);

/**
 * EXEMPLE 4 : Route accessible aux CLIENTS et RECRUTEURS
 * Utilisation : Rechercher des prestataires
 */
router.get(
  "/search-prestataires",
  verifyToken,
  checkRole(["client", "recruteur"]),
  async (req, res) => {
    res.json({
      success: true,
      message: "Recherche de prestataires",
      searchBy: req.user.role === "client" ? "Client particulier" : "Recruteur entreprise"
    });
  }
);

/**
 * EXEMPLE 5 : Route accessible à TOUS les utilisateurs authentifiés
 * Utilisation : Voir son propre profil
 */
router.get(
  "/me",
  verifyToken,
  checkRole(["prestataire", "demandeur_emploi", "recruteur", "client"]),
  async (req, res) => {
    res.json({
      success: true,
      user: req.user
    });
  }
);

/**
 * EXEMPLE 6 : Route PUBLIQUE (pas de vérification)
 * Utilisation : Page d'accueil, liste publique
 */
router.get("/public-services", async (req, res) => {
  res.json({
    success: true,
    message: "Services publics - pas d'authentification requise"
  });
});

/* ================= LOGIQUE PAR RÔLE ================= */

/**
 * PRESTATAIRE 🔧
 * - Peut créer des services
 * - Peut postuler à des offres
 * - Peut définir sa disponibilité
 * - Peut définir ses tarifs
 */
router.post("/services", verifyToken, checkRole(["prestataire"]), async (req, res) => {
  try {
    // Créer un service
    res.json({
      success: true,
      message: "Service créé",
      serviceData: req.body
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DEMANDEUR D'EMPLOI 💼
 * - Peut postuler à des offres d'emploi
 * - Peut définir son type de contrat recherché (CDI, CDD, etc.)
 * - Peut ajouter ses références
 */
router.post("/candidatures", verifyToken, checkRole(["demandeur_emploi"]), async (req, res) => {
  try {
    // Postuler à une offre
    res.json({
      success: true,
      message: "Candidature envoyée",
      candidatureData: req.body
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * RECRUTEUR 🏢
 * - Peut publier des offres d'emploi
 * - Peut rechercher des prestataires/candidats
 * - Peut voir les candidatures
 */
router.post("/offres", verifyToken, checkRole(["recruteur"]), async (req, res) => {
  try {
    // Publier une offre
    res.json({
      success: true,
      message: "Offre publiée",
      offreData: req.body
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * CLIENT 🛍️
 * - Peut rechercher des prestataires
 * - Peut demander des services
 * - Peut laisser des avis
 */
router.post("/demandes", verifyToken, checkRole(["client"]), async (req, res) => {
  try {
    // Créer une demande de service
    res.json({
      success: true,
      message: "Demande de service créée",
      demandeData: req.body
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================= ROUTES MIXTES ================= */

/**
 * Postuler (Prestataire ET Demandeur d'emploi)
 */
router.post(
  "/apply/:offreId",
  verifyToken,
  checkRole(["prestataire", "demandeur_emploi"]),
  async (req, res) => {
    const userType = req.user.role === "prestataire" ? "Service" : "Emploi";
    res.json({
      success: true,
      message: `Candidature pour ${userType} envoyée`,
      offreId: req.params.offreId
    });
  }
);

/**
 * Rechercher (Client ET Recruteur)
 */
router.get(
  "/search",
  verifyToken,
  checkRole(["client", "recruteur"]),
  async (req, res) => {
    const searchType = req.user.role === "client" 
      ? "services ponctuels" 
      : "candidats pour emploi";
    
    res.json({
      success: true,
      message: `Recherche de ${searchType}`,
      filters: req.query
    });
  }
);

export default router;