import express from "express";
import { 
  register, 
  login, 
  getCurrentUser,
  requestPasswordReset,
  resetPassword
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/security.middleware.js";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validation.middleware.js";

const router = express.Router();

/* ================= VALIDATION RULES ================= */

const registerValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("L'email est requis")
    .isEmail().withMessage("Email invalide")
    .normalizeEmail(),
  
  body("password")
    .trim()
    .notEmpty().withMessage("Le mot de passe est requis")
    .isLength({ min: 8 }).withMessage("Le mot de passe doit contenir au moins 8 caractères")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"),
  
  body("role")
    .optional()
    .isIn(['demandeur', 'prestataire', 'recruteur', 'client', 'admin'])
    .withMessage("Rôle invalide")
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("L'email est requis")
    .isEmail().withMessage("Email invalide")
    .normalizeEmail(),
  
  body("password")
    .trim()
    .notEmpty().withMessage("Le mot de passe est requis")
];

const requestPasswordResetValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("L'email est requis")
    .isEmail().withMessage("Email invalide")
    .normalizeEmail()
];

const resetPasswordValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("L'email est requis")
    .isEmail().withMessage("Email invalide")
    .normalizeEmail(),
  
  body("code")
    .trim()
    .notEmpty().withMessage("Le code est requis")
    .isLength({ min: 6, max: 6 }).withMessage("Le code doit contenir 6 chiffres"),
  
  body("newPassword")
    .trim()
    .notEmpty().withMessage("Le nouveau mot de passe est requis")
    .isLength({ min: 8 }).withMessage("Le mot de passe doit contenir au moins 8 caractères")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre")
];

/* ================= ROUTES ================= */

// POST /api/auth/register
router.post(
  "/register",
  authLimiter,
  registerValidation,
  validateRequest,
  register
);

// POST /api/auth/login
router.post(
  "/login",
  authLimiter,
  loginValidation,
  validateRequest,
  login
);

// GET /api/auth/me
router.get(
  "/me",
  verifyToken,
  getCurrentUser
);

// POST /api/auth/forgot-password
router.post(
  "/forgot-password",
  authLimiter,
  requestPasswordResetValidation,
  validateRequest,
  requestPasswordReset
);

// POST /api/auth/reset-password
router.post(
  "/reset-password",
  authLimiter,
  resetPasswordValidation,
  validateRequest,
  resetPassword
);

export default router;