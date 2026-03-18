    import express from "express";
    import {
    createService,
    getMyServices,
    getServiceById,
    updateService,
    deleteService,
    searchServices,
    getCategories
    } from "../controllers/service.controller.js";
    import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
    import { body } from "express-validator";
    import { validateRequest } from "../middlewares/validation.middleware.js";

    const router = express.Router();

    /* ================= VALIDATION RULES ================= */

    const createServiceValidation = [
    body("title")
        .trim()
        .notEmpty().withMessage("Le titre est requis")
        .isLength({ min: 5, max: 200 }).withMessage("Le titre doit contenir entre 5 et 200 caractères"),
    
    body("description")
        .trim()
        .notEmpty().withMessage("La description est requise")
        .isLength({ min: 20, max: 2000 }).withMessage("La description doit contenir entre 20 et 2000 caractères"),
    
    body("category")
        .notEmpty().withMessage("La catégorie est requise")
        .isIn([
        'plomberie', 'electricite', 'menuiserie', 'maconnerie', 'peinture',
        'immobilier', 'mecanique', 'informatique', 'nettoyage', 'restauration',
        'couture', 'coiffure', 'cours_particuliers', 'demenagement', 'autre'
        ]).withMessage("Catégorie invalide"),
    
    body("priceType")
        .optional()
        .isIn(['heure', 'jour', 'forfait', 'devis']).withMessage("Type de tarif invalide"),
    
    body("priceMin")
        .optional()
        .isFloat({ min: 0 }).withMessage("Le prix minimum doit être un nombre positif"),
    
    body("priceMax")
        .optional()
        .isFloat({ min: 0 }).withMessage("Le prix maximum doit être un nombre positif"),
    
    body("city")
        .trim()
        .notEmpty().withMessage("La ville est requise"),
    
    body("availability")
        .optional()
        .isIn(['disponible', 'occupe', 'indisponible']).withMessage("Disponibilité invalide")
    ];

    /* ================= ROUTES ================= */

    // GET /api/services/categories - Liste des catégories (public)
    router.get("/categories", getCategories);

    // GET /api/services/search - Rechercher des services (public)
    router.get("/search", searchServices);

    // GET /api/services/me - Mes services (prestataire authentifié)
    router.get("/me", verifyToken, checkRole('prestataire'), getMyServices);

    // POST /api/services - Créer un service (prestataire uniquement)
    router.post(
    "/",
    verifyToken,
    checkRole('prestataire'),
    createServiceValidation,
    validateRequest,
    createService
    );

    // GET /api/services/:id - Voir un service spécifique (public)
    router.get("/:id", getServiceById);

    // PUT /api/services/:id - Mettre à jour un service (propriétaire uniquement)
    router.put(
    "/:id",
    verifyToken,
    checkRole('prestataire'),
    createServiceValidation,
    validateRequest,
    updateService
    );

    // DELETE /api/services/:id - Supprimer un service (propriétaire uniquement)
    router.delete(
    "/:id",
    verifyToken,
    checkRole('prestataire'),
    deleteService
    );

    export default router;