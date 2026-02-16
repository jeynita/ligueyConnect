    import express from "express";
    import {
    getProfile,
    getMyProfile,
    updateProfile,
    searchProfiles
    } from "../controllers/profile.controller.js";
    import { verifyToken } from "../middlewares/auth.middleware.js";
    import { body } from "express-validator";
    import { validateRequest } from "../middlewares/validation.middleware.js";

    const router = express.Router();

    /* ================= VALIDATION RULES ================= */

    const updateProfileValidation = [
    body("firstName")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("Prénom trop long (max 100 caractères)"),
    
    body("lastName")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("Nom trop long (max 100 caractères)"),
    
    body("phone")
        .optional()
        .matches(/^(\+221)?[0-9]{9}$/).withMessage("Numéro de téléphone invalide (format: 771234567 ou +221771234567)"),
    
    body("bio")
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage("Bio trop longue (max 1000 caractères)"),
    
    body("city")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("Ville trop longue"),
    
    body("profession")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("Profession trop longue"),
    
    body("skills")
        .optional()
        .isArray().withMessage("Les compétences doivent être un tableau"),
    
    body("hourlyRate")
        .optional()
        .isFloat({ min: 0 }).withMessage("Le tarif horaire doit être un nombre positif"),
    
    body("availability")
        .optional()
        .isIn(['disponible', 'occupe', 'indisponible']).withMessage("Disponibilité invalide")
    ];

    /* ================= ROUTES ================= */

    // POST /api/profiles - Créer/Mettre à jour son profil (authentifié)
    router.post(
    "/",
    verifyToken,
    updateProfileValidation,
    validateRequest,
    updateProfile
    );

    // GET /api/profiles/me - Mon profil (authentifié)
    router.get("/me", verifyToken, getMyProfile);

    // PUT /api/profiles/me - Mettre à jour mon profil (authentifié)
    router.put(
    "/me",
    verifyToken,
    updateProfileValidation,
    validateRequest,
    updateProfile
    );

    // GET /api/profiles/search - Rechercher des profils (public)
    router.get("/search", searchProfiles);

    // GET /api/profiles/:userId - Voir un profil spécifique (public)
    router.get("/:userId", getProfile);

    export default router;