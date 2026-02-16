// // import jwt from "jsonwebtoken";

// // const authMiddleware = (req, res, next) => {
// //   const authHeader = req.headers.authorization;

// //   if (!authHeader) {
// //     return res.status(401).json({ message: "No token provided" });
// //   }

// //   const token = authHeader.split(" ")[1];

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded;
// //     next();
// //   } catch (error) {
// //     res.status(401).json({ message: "Invalid token" });
// //   }
// // };

// // export default authMiddleware;


// import jwt from "jsonwebtoken";
// import Users from "../models/Users.js";

// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     // Vérifier la présence du header
//     if (!authHeader) {
//       return res.status(401).json({
//         success: false,
//         message: "Token d'authentification manquant"
//       });
//     }

//     // Vérifier le format Bearer
//     if (!authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Format de token invalide. Utilisez: Bearer <token>"
//       });
//     }

//     // Extraire le token
//     const token = authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Token manquant"
//       });
//     }

//     // Vérifier le token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Vérifier si l'utilisateur existe encore
//     const user = await Users.findByPk(decoded.id);

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Utilisateur introuvable"
//       });
//     }

//     // Vérifier si le compte est actif
//     if (!user.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: "Compte désactivé"
//       });
//     }

//     // Attacher l'utilisateur à la requête
//     req.user = {
//       id: user.id,
//       email: user.email,
//       role: user.role 
//     };

//     next();

//   } catch (error) {
//     // Gestion spécifique des erreurs JWT
//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({
//         success: false,
//         message: "Token invalide"
//       });
//     }

//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         message: "Token expiré. Veuillez vous reconnecter."
//       });
//     }

//     console.error("Auth middleware error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Erreur d'authentification"
//     });
//   }
// };

// //MIDDLEWARE DE VERIFICATION DE ROLE
// export const checkRole 

// export default authMiddleware;


import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

/* ================= MIDDLEWARE D'AUTHENTIFICATION ================= */
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Vérifier la présence du header
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token d'authentification manquant"
      });
    }

    // Vérifier le format Bearer
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Format de token invalide. Utilisez: Bearer <token>"
      });
    }

    // Extraire le token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token manquant"
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier si l'utilisateur existe encore
    const user = await Users.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur introuvable"
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Compte désactivé"
      });
    }

    // Attacher l'utilisateur à la requête (avec le rôle aussi)
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role // ⬅️ AJOUTER le rôle (important pour checkRole)
    };

    next();

  } catch (error) {
    // Gestion spécifique des erreurs JWT
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token invalide"
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expiré. Veuillez vous reconnecter."
      });
    }

    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur d'authentification"
    });
  }
};

/* ================= MIDDLEWARE DE VÉRIFICATION DE RÔLE ================= */
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Non authentifié"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Cette action nécessite le rôle : ${allowedRoles.join(' ou ')}`
      });
    }

    next();
  };
};

// ⬇️ GARDER aussi l'export default pour la compatibilité
export default verifyToken;