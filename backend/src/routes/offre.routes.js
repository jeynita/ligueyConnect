    import express from "express";
    import {
    createOffre,
    getMyOffres,
    getOffreById,
    updateOffre,
    deleteOffre,
    searchOffres,
    postuler,
    getMyCandidatures,
    getCandidaturesByOffre,
    updateCandidatureStatus,
    getSectors
    } from "../controllers/offre.controller.js";
    import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
    import { body } from "express-validator";
    import { validateRequest } from "../middlewares/validation.middleware.js";

    const router = express.Router();

    /* ================= VALIDATION RULES ================= */

    const createOffreValidation = [
    body("title")
        .trim()
        .notEmpty().withMessage("Le titre est requis")
        .isLength({ min: 5, max: 200 }).withMessage("Le titre doit contenir entre 5 et 200 caractères"),
    
    body("description")
        .trim()
        .notEmpty().withMessage("La description est requise")
        .isLength({ min: 50, max: 5000 }).withMessage("La description doit contenir entre 50 et 5000 caractères"),
    
    body("contractType")
        .notEmpty().withMessage("Le type de contrat est requis")
        .isIn(['CDD', 'CDI', 'stage', 'freelance', 'temporaire']).withMessage("Type de contrat invalide"),
    
    body("city")
        .trim()
        .notEmpty().withMessage("La ville est requise"),
    
    body("salaryMin")
        .optional()
        .isFloat({ min: 0 }).withMessage("Le salaire minimum doit être un nombre positif"),
    
    body("salaryMax")
        .optional()
        .isFloat({ min: 0 }).withMessage("Le salaire maximum doit être un nombre positif"),
    
    body("numberOfPositions")
        .optional()
        .isInt({ min: 1 }).withMessage("Le nombre de postes doit être au moins 1")
    ];

    const postulerValidation = [
    body("coverLetter")
        .optional()
        .isLength({ max: 2000 }).withMessage("La lettre de motivation ne peut pas dépasser 2000 caractères"),
    
    body("cvText")
        .optional()
        .isLength({ max: 5000 }).withMessage("Le CV ne peut pas dépasser 5000 caractères")
    ];

    const updateCandidatureValidation = [
    body("status")
        .notEmpty().withMessage("Le statut est requis")
        .isIn(['en_attente', 'vue', 'retenue', 'rejetee']).withMessage("Statut invalide")
    ];

    /* ================= ROUTES ================= */

    // GET /api/offres/sectors - Liste des secteurs (public)
    router.get("/sectors", getSectors);

    // GET /api/offres/search - Rechercher des offres (public)
    router.get("/search", searchOffres);

    // GET /api/offres/me - Mes offres (recruteur authentifié)
    router.get("/me", verifyToken, checkRole('recruteur'), getMyOffres);

    // GET /api/offres/candidatures - Mes candidatures (demandeur authentifié)
    router.get("/candidatures", verifyToken, checkRole('demandeur'), getMyCandidatures);

    // POST /api/offres - Créer une offre (recruteur uniquement)
    router.post(
    "/",
    verifyToken,
    checkRole('recruteur'),
    createOffreValidation,
    validateRequest,
    createOffre
    );

    // GET /api/offres/:id - Voir une offre spécifique (public)
    router.get("/:id", getOffreById);

    // PUT /api/offres/:id - Mettre à jour une offre (propriétaire uniquement)
    router.put(
    "/:id",
    verifyToken,
    checkRole('recruteur'),
    createOffreValidation,
    validateRequest,
    updateOffre
    );

    // DELETE /api/offres/:id - Supprimer une offre (propriétaire uniquement)
    router.delete(
    "/:id",
    verifyToken,
    checkRole('recruteur'),
    deleteOffre
    );

    // POST /api/offres/:id/postuler - Postuler à une offre (demandeur uniquement)
    router.post(
    "/:id/postuler",
    verifyToken,
    checkRole('demandeur'),
    postulerValidation,
    validateRequest,
    postuler
    );

    // GET /api/offres/:id/candidatures - Voir les candidatures d'une offre (recruteur propriétaire)
    router.get(
    "/:id/candidatures",
    verifyToken,
    checkRole('recruteur'),
    getCandidaturesByOffre
    );

    // PUT /api/offres/candidatures/:candidatureId - Mettre à jour le statut d'une candidature (recruteur)
    router.put(
    "/candidatures/:candidatureId",
    verifyToken,
    checkRole('recruteur'),
    updateCandidatureValidation,
    validateRequest,
    updateCandidatureStatus
    );

    export default router;