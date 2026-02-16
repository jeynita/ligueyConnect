import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation basique
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis"
      });
    }

    // Validation longueur mot de passe
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 8 caractères"
      });
    }

    // Validation du rôle (optionnel, car il y a un defaultValue)
    const validRoles = ['demandeur', 'prestataire', 'recruteur', 'client', 'admin'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Rôle invalide. Choisissez : demandeur, prestataire, client, recruteur ou admin"
      });
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Un compte existe déjà avec cet email"
      });
    }

    // Hash du mot de passe (10 rounds par défaut)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec le rôle
    const user = await Users.create({
      email,
      password: hashedPassword,
      role: role || 'client'
    });

    // Générer le token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error("Register error:", error);

    // Gestion des erreurs Sequelize
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: error.errors[0].message
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du compte"
    });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis"
      });
    }

    // Chercher l'utilisateur avec le mot de passe (scope)
    const user = await Users.scope("withPassword").findOne({
      where: { email }
    });

    // Message générique pour éviter l'énumération d'utilisateurs
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Compte désactivé. Contactez l'administrateur."
      });
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    // Mettre à jour lastLogin
    await user.update({ lastLogin: new Date() });

    // Générer le token avec le rôle
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      success: true,
      message: "Connexion réussie",
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin
        },
        token
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion"
    });
  }
};

/* ================= GET CURRENT USER ================= */
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await Users.findByPk(userId, {
      attributes: ['id', 'email', 'role', 'isActive', 'createdAt', 'lastLogin']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'utilisateur"
    });
  }
};

/* ================= DEMANDER UN CODE DE RÉINITIALISATION ================= */
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifier que l'utilisateur existe
    const user = await Users.findOne({ where: { email } });
    
    if (!user) {
      // Pour des raisons de sécurité, on ne dit pas si l'email existe ou non
      return res.json({
        success: true,
        message: "Si cet email existe, un code de réinitialisation a été généré. Contactez l'administrateur."
      });
    }

    // Générer un code à 6 chiffres
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Sauvegarder le code et sa date d'expiration (1 heure)
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    await user.update({
      resetPasswordCode: resetCode,
      resetPasswordExpires: resetExpires
    });

    // IMPORTANT : Afficher le code dans la console du serveur
    console.log("=".repeat(60));
    console.log("🔐 CODE DE RÉINITIALISATION DE MOT DE PASSE");
    console.log("=".repeat(60));
    console.log(`Email      : ${email}`);
    console.log(`Code       : ${resetCode}`);
    console.log(`Expire à   : ${resetExpires.toLocaleString('fr-FR')}`);
    console.log("=".repeat(60));

    res.json({
      success: true,
      message: "Un code de réinitialisation a été généré. Contactez l'administrateur pour l'obtenir.",
      // EN DÉVELOPPEMENT SEULEMENT - À RETIRER EN PRODUCTION
      devCode: process.env.NODE_ENV === "development" ? resetCode : undefined
    });

  } catch (error) {
    console.error("Request password reset error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la demande de réinitialisation"
    });
  }
};

/* ================= RÉINITIALISER LE MOT DE PASSE AVEC LE CODE ================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Trouver l'utilisateur
    const user = await Users.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    // Vérifier que le code existe
    if (!user.resetPasswordCode) {
      return res.status(400).json({
        success: false,
        message: "Aucune demande de réinitialisation en cours"
      });
    }

    // Vérifier que le code correspond
    if (user.resetPasswordCode !== code) {
      return res.status(400).json({
        success: false,
        message: "Code invalide"
      });
    }

    // Vérifier que le code n'a pas expiré
    if (new Date() > new Date(user.resetPasswordExpires)) {
      return res.status(400).json({
        success: false,
        message: "Le code a expiré. Veuillez faire une nouvelle demande."
      });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et effacer le code
    await user.update({
      password: hashedPassword,
      resetPasswordCode: null,
      resetPasswordExpires: null
    });

    console.log(`✅ Mot de passe réinitialisé pour : ${email}`);

    res.json({
      success: true,
      message: "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter."
    });

  } catch (error) {
    console.error("Reset password error:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: error.errors[0].message
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la réinitialisation du mot de passe"
    });
  }
};