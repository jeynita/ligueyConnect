// import express from "express";
// import { 
//   register, 
//   login, 
//   getCurrentUser,
//   requestPasswordReset,
//   resetPassword
// } from "../controllers/auth.controller.js";
// import { verifyToken } from "../middlewares/auth.middleware.js";
// import { authLimiter } from "../middlewares/security.middleware.js";
// import { body } from "express-validator";
// import { validateRequest } from "../middlewares/validation.middleware.js";

// const router = express.Router();

// // Validation rules...
// // (inchangées, tes règles actuelles sont OK)

// /* ================= ROUTES ================= */

// // POST /api/auth/register
// router.post(
//   "/register",
//   authLimiter,   // ✅ limiter avec skip OPTIONS
//   registerValidation,
//   validateRequest,
//   register
// );

// // POST /api/auth/login
// router.post(
//   "/login",
//   authLimiter,
//   loginValidation,
//   validateRequest,
//   login
// );

// // GET /api/auth/me
// router.get("/me", verifyToken, getCurrentUser);

// // POST /api/auth/forgot-password
// router.post(
//   "/forgot-password",
//   authLimiter,
//   requestPasswordResetValidation,
//   validateRequest,
//   requestPasswordReset
// );

// // POST /api/auth/reset-password
// router.post(
//   "/reset-password",
//   authLimiter,
//   resetPasswordValidation,
//   validateRequest,
//   resetPassword
// );

// export default router; 
import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authLimiter } from "../middlewares/security.middleware.js";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validation.middleware.js";

const router = express.Router();

/* ================= VALIDATION RULES ================= */

const registerValidation = [
  body("email")
    .trim()
    .isEmail().withMessage("Email invalide")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 }).withMessage("Le mot de passe doit contenir au moins 8 caractères")
    .matches(/[A-Z]/).withMessage("Le mot de passe doit contenir au moins une majuscule")
    .matches(/[a-z]/).withMessage("Le mot de passe doit contenir au moins une minuscule")
    .matches(/[0-9]/).withMessage("Le mot de passe doit contenir au moins un chiffre")
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail().withMessage("Email invalide")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Mot de passe requis")
];

/* ================= ROUTES ================= */

router.post(
  "/register",
  authLimiter,
  registerValidation,
  validateRequest,
  register
);

router.post(
  "/login",
  authLimiter,
  loginValidation,
  validateRequest,
  login
);

export default router;