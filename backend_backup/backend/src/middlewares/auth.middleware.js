  // // import jwt from "jsonwebtoken";
  // // import Users from "../models/Users.js";

  // // export const verifyToken = async (req, res, next) => {
  // //   try {
  // //     // Récupérer le token depuis le header
  // //     const authHeader = req.headers.authorization;

  // //     if (!authHeader || !authHeader.startsWith("Bearer ")) {
  // //       return res.status(401).json({
  // //         success: false,
  // //         message: "Token manquant. Veuillez vous connecter."
  // //       });
  // //     }

  // //     const token = authHeader.split(" ")[1];

  // //     if (!token) {
  // //       return res.status(401).json({
  // //         success: false,
  // //         message: "Token invalide"
  // //       });
  // //     }

  // //     // Vérifier le token
  // //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // //     // Vérifier que l'utilisateur existe toujours
  // //     const user = await Users.findByPk(decoded.id);

  // //     if (!user) {
  // //       return res.status(401).json({
  // //         success: false,
  // //         message: "Utilisateur non trouvé"
  // //       });
  // //     }

  // //     if (!user.isActive) {
  // //       return res.status(403).json({
  // //         success: false,
  // //         message: "Compte désactivé"
  // //       });
  // //     }

  // //     // Ajouter l'utilisateur à la requête
  // //     req.user = {
  // //       id: user.id,
  // //       email: user.email,
  // //       role: user.role
  // //     };

  // //     next();

  // //   } catch (error) {
  // //     if (error.name === "TokenExpiredError") {
  // //       return res.status(401).json({
  // //         success: false,
  // //         message: "Token expiré. Veuillez vous reconnecter."
  // //       });
  // //     }

  // //     if (error.name === "JsonWebTokenError") {
  // //       return res.status(401).json({
  // //         success: false,
  // //         message: "Token invalide"
  // //       });
  // //     }

  // //     res.status(500).json({
  // //       success: false,
  // //       message: "Erreur d'authentification"
  // //     });
  // //   }
  // // };

  // // export const checkRole = (...roles) => {
  // //   return (req, res, next) => {
  // //     if (!req.user) {
  // //       return res.status(401).json({
  // //         success: false,
  // //         message: "Non authentifié"
  // //       });
  // //     }

  // //     if (!roles.includes(req.user.role)) {
  // //       return res.status(403).json({
  // //         success: false,
  // //         message: `Accès refusé. Rôle requis : ${roles.join(" ou ")}`
  // //       });
  // //     }

  // //     next();
  // //   };
  // // };

  // const jwt = require('jsonwebtoken');
  
  // /**
  //  * Middleware d'authentification JWT
  //  * Vérifie le token dans l'en-tête Authorization
  //  */
  // const authMiddleware = async (req, res, next) => {
  //   try {
  //     // Récupérer le token depuis l'en-tête Authorization
  //     const authHeader = req.headers.authorization;
  
  //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //       return res.status(401).json({
  //         success: false,
  //         message: 'Accès non autorisé. Token manquant.'
  //       });
  //     }
  
  //     // Extraire le token
  //     const token = authHeader.split(' ')[1];
  
  //     if (!token) {
  //       return res.status(401).json({
  //         success: false,
  //         message: 'Accès non autorisé. Token invalide.'
  //       });
  //     }
  
  //     // Vérifier et décoder le token
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  //     // Récupérer l'utilisateur depuis la base de données
  //     const db = req.app.locals.db;
  //     const [users] = await db.query(
  //       'SELECT id, email, role FROM users WHERE id = ?',
  //       [decoded.id]
  //     );
  
  //     if (users.length === 0) {
  //       return res.status(401).json({
  //         success: false,
  //         message: 'Utilisateur non trouvé'
  //       });
  //     }
  
  //     // Attacher l'utilisateur à la requête
  //     req.user = users[0];
  
  //     // Passer au middleware/contrôleur suivant
  //     next();
  
  //   } catch (error) {
  //     console.error('Erreur middleware auth:', error);
  
  //     if (error.name === 'TokenExpiredError') {
  //       return res.status(401).json({
  //         success: false,
  //         message: 'Token expiré. Veuillez vous reconnecter.'
  //       });
  //     }
  
  //     if (error.name === 'JsonWebTokenError') {
  //       return res.status(401).json({
  //         success: false,
  //         message: 'Token invalide.'
  //       });
  //     }
  
  //     return res.status(500).json({
  //       success: false,
  //       message: 'Erreur lors de la vérification de l\'authentification',
  //       error: error.message
  //     });
  //   }
  // };
  
  // module.exports = authMiddleware;
  

  import jwt from "jsonwebtoken";
  import Users from "../models/Users.js";
  
  /**
   * Middleware pour vérifier le token JWT
   */
  export const verifyToken = async (req, res, next) => {
    try {
      // Récupérer le token depuis l'en-tête Authorization
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Accès non autorisé. Token manquant."
        });
      }
  
      // Extraire le token
      const token = authHeader.split(" ")[1];
  
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Accès non autorisé. Token invalide."
        });
      }
  
      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Récupérer l'utilisateur depuis la base de données
      const user = await Users.findByPk(decoded.id, {
        attributes: { exclude: ["password"] }
      });
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Utilisateur non trouvé"
        });
      }
  
      // Attacher l'utilisateur à la requête
      req.user = user;
  
      // Passer au middleware/contrôleur suivant
      next();
  
    } catch (error) {
      console.error("Erreur middleware auth:", error);
  
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expiré. Veuillez vous reconnecter."
        });
      }
  
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Token invalide."
        });
      }
  
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification de l'authentification",
        error: error.message
      });
    }
  };
  
  /**
   * Middleware pour vérifier le rôle de l'utilisateur
   * @param {string[]} allowedRoles - Tableau des rôles autorisés
   * @returns {Function} Middleware Express
   * 
   * @example
   * // Autoriser uniquement les prestataires
   * router.post('/service', verifyToken, checkRole(['prestataire']), createService);
   * 
   * // Autoriser prestataires et demandeurs d'emploi
   * router.get('/jobs', verifyToken, checkRole(['prestataire', 'demandeur_emploi']), getJobs);
   * 
   * // Autoriser tous sauf clients
   * router.post('/apply', verifyToken, checkRole(['prestataire', 'demandeur_emploi', 'recruteur']), apply);
   */
  export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
      try {
        // Vérifier que l'utilisateur est attaché à la requête
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: "Authentification requise"
          });
        }
  
        // Vérifier que l'utilisateur a un rôle
        if (!req.user.role) {
          return res.status(403).json({
            success: false,
            message: "Rôle utilisateur non défini"
          });
        }
  
        // Vérifier si le rôle de l'utilisateur est autorisé
        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            message: `Accès refusé. Rôles autorisés: ${allowedRoles.join(", ")}`,
            userRole: req.user.role
          });
        }
  
        // Rôle autorisé, continuer
        next();
  
      } catch (error) {
        console.error("Erreur checkRole middleware:", error);
        return res.status(500).json({
          success: false,
          message: "Erreur lors de la vérification des permissions",
          error: error.message
        });
      }
    };
  };
  
  /**
   * Middleware pour vérifier que l'utilisateur est propriétaire d'une ressource
   * Utilise req.params.id ou req.params.userId pour comparer avec req.user.id
   */
  export const checkOwnership = (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentification requise"
        });
      }
  
      // Récupérer l'ID de la ressource
      const resourceUserId = req.params.userId || req.params.id;
  
      // Vérifier la propriété
      if (parseInt(resourceUserId) !== parseInt(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: "Accès refusé. Vous n'êtes pas autorisé à accéder à cette ressource."
        });
      }
  
      next();
  
    } catch (error) {
      console.error("Erreur checkOwnership middleware:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification de propriété",
        error: error.message
      });
    }
  };
  
  /**
   * Middleware optionnel : autoriser l'accès même sans token
   * Utile pour les routes publiques qui bénéficient d'infos utilisateur si disponibles
   */
  export const optionalAuth = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // Pas de token, continuer quand même
        req.user = null;
        return next();
      }
  
      const token = authHeader.split(" ")[1];
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Users.findByPk(decoded.id, {
          attributes: { exclude: ["password"] }
        });
        req.user = user;
      } catch (error) {
        // Token invalide, continuer sans utilisateur
        req.user = null;
      }
  
      next();
  
    } catch (error) {
      console.error("Erreur optionalAuth middleware:", error);
      req.user = null;
      next();
    }
  };
  
  // Export par défaut (pour compatibilité)
  export default {
    verifyToken,
    checkRole,
    checkOwnership,
    optionalAuth
  };
  