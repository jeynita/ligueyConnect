    // import Profile from "../models/Profile.js";
    // import Users from "../models/Users.js";

    // /* ================= GET PROFILE (Par userId) ================= */
    // export const getProfile = async (req, res) => {
    // try {
    //     const { userId } = req.params;

    //     const profile = await Profile.findOne({
    //     where: { userId },
    //     include: [{
    //         model: Users,
    //         as: 'user',
    //         attributes: ['id', 'email', 'role', 'isActive']
    //     }]
    //     });

    //     if (!profile) {
    //     return res.status(404).json({
    //         success: false,
    //         message: "Profil non trouvé"
    //     });
    //     }

    //     res.json({
    //     success: true,
    //     data: profile
    //     });

    // } catch (error) {
    //     console.error("Get profile error:", error);
    //     res.status(500).json({
    //     success: false,
    //     message: "Erreur lors de la récupération du profil"
    //     });
    // }
    // };

    // /* ================= GET MY PROFILE (Utilisateur connecté) ================= */
    // export const getMyProfile = async (req, res) => {
    // try {
    //     // req.user est ajouté par le middleware auth
    //     const userId = req.user.id;

    //     console.log("Utilisateur authentifie:", req.user);

    //     let profile = await Profile.findOne({
    //     where: { userId },
    //     include: [{
    //         model: Users,
    //         as: 'user',
    //         attributes: ['id', 'email', 'role', 'isActive', 'createdAt']
    //     }]
    //     });

    //     // Si le profil n'existe pas, le créer
    //     if (!profile) {
    //     profile = await Profile.create({
    //         userId,
    //         profileCompleteness: 10 // 10% (juste email créé)
    //     });

    //     // Recharger avec les relations
    //     profile = await Profile.findOne({
    //         where: { userId },
    //         include: [{
    //         model: Users,
    //         as: 'user',
    //         attributes: ['id', 'email', 'role', 'isActive', 'createdAt']
    //         }]
    //     });
    //     }

    //     res.json({
    //     success: true,
    //     data: profile
    //     });

    // } catch (error) {
    //     console.error("Get my profile error:", error);
    //     res.status(500).json({
    //     success: false,
    //     message: "Erreur lors de la récupération du profil"
    //     });
    // }
    // };

    // /* ================= UPDATE PROFILE ================= */
    // export const updateProfile = async (req, res) => {
    // try {
    //     const userId = req.user.id;
    //     const {
    //     firstName,
    //     lastName,
    //     phone,
    //     bio,
    //     address,
    //     city,
    //     region,
    //     profession,
    //     skills,
    //     experience,
    //     hourlyRate,
    //     availability,
    //     companyName,
    //     companySize
    //     } = req.body;

    //     // Trouver ou créer le profil
    //     let [profile, created] = await Profile.findOrCreate({
    //     where: { userId },
    //     defaults: {
    //         userId,
    //         firstName,
    //         lastName,
    //         phone,
    //         bio,
    //         address,
    //         city,
    //         region,
    //         profession,
    //         skills,
    //         experience,
    //         hourlyRate,
    //         availability,
    //         companyName,
    //         companySize
    //     }
    //     });

    //     // Si le profil existe déjà, le mettre à jour
    //     if (!created) {
    //     await profile.update({
    //         firstName,
    //         lastName,
    //         phone,
    //         bio,
    //         address,
    //         city,
    //         region,
    //         profession,
    //         skills,
    //         experience,
    //         hourlyRate,
    //         availability,
    //         companyName,
    //         companySize
    //     });
    //     }

    //     // Calculer le pourcentage de complétion
    //     const completeness = calculateProfileCompleteness(profile);
    //     await profile.update({ profileCompleteness: completeness });

    //     // Recharger avec les relations
    //     profile = await Profile.findOne({
    //     where: { userId },
    //     include: [{
    //         model: Users,
    //         as: 'user',
    //         attributes: ['id', 'email', 'role']
    //     }]
    //     });

    //     res.json({
    //     success: true,
    //     message: "Profil mis à jour avec succès",
    //     data: profile
    //     });

    // } catch (error) {
    //     console.error("Update profile error:", error);
    //     res.status(500).json({
    //     success: false,
    //     message: "Erreur lors de la mise à jour du profil"
    //     });
    // }
    // };

    // /* ================= CALCULER LE POURCENTAGE DE COMPLÉTION ================= */
    // function calculateProfileCompleteness(profile) {
    // let score = 10; // 10% de base (compte créé)

    // if (profile.firstName) score += 10;
    // if (profile.lastName) score += 10;
    // if (profile.phone) score += 10;
    // if (profile.bio) score += 15;
    // if (profile.address) score += 10;
    // if (profile.city) score += 5;
    // if (profile.profession) score += 15;
    // if (profile.skills && profile.skills.length > 0) score += 15;
    // if (profile.experience) score += 10;

    // return Math.min(score, 100);
    // }

    // /* ================= SEARCH PROFILES (Recherche publique) ================= */
    // export const searchProfiles = async (req, res) => {
    // try {
    //     const { 
    //     role, 
    //     profession, 
    //     city, 
    //     region,
    //     skills,
    //     availability 
    //     } = req.query;

    //     // Construire les filtres
    //     const whereProfile = {};
    //     const whereUser = {};

    //     if (profession) whereProfile.profession = { [Op.like]: `%${profession}%` };
    //     if (city) whereProfile.city = city;
    //     if (region) whereProfile.region = region;
    //     if (availability) whereProfile.availability = availability;

    //     if (role) whereUser.role = role;
    //     whereUser.isActive = true; // Seulement les comptes actifs

    //     const profiles = await Profile.findAll({
    //     where: whereProfile,
    //     include: [{
    //         model: Users,
    //         as: 'user',
    //         where: whereUser,
    //         attributes: ['id', 'email', 'role']
    //     }],
    //     order: [
    //         ['rating', 'DESC'],
    //         ['profileCompleteness', 'DESC']
    //     ],
    //     limit: 50
    //     });

    //     res.json({
    //     success: true,
    //     count: profiles.length,
    //     data: profiles
    //     });

    // } catch (error) {
    //     console.error("Search profiles error:", error);
    //     res.status(500).json({
    //     success: false,
    //     message: "Erreur lors de la recherche"
    //     });
    // }
    // }; 

    const jwt = require('jsonwebtoken');

// Calculer le pourcentage de complétion du profil
const calculateProfileCompleteness = (profile, userRole) => {
  const fields = {
    common: ['firstName', 'lastName', 'phone', 'bio', 'address', 'city', 'region', 'profession', 'skills', 'experience'],
    prestataire: ['hourlyRate', 'availability', 'transportMode', 'workZones'],
    demandeur_emploi: ['contractType', 'expectedSalary', 'availabilityDelay', 'educationLevel', 'references'],
    recruteur: ['companyName', 'companySize', 'companySector'],
    client: ['servicePreferences', 'budgetRange', 'clientType']
  };

  const requiredFields = [...fields.common, ...(fields[userRole] || [])];
  const filledFields = requiredFields.filter(field => {
    const value = profile[field];
    if (Array.isArray(value)) return value.length > 0;
    return value && value.toString().trim() !== '';
  });

  return Math.round((filledFields.length / requiredFields.length) * 100);
};

// GET - Récupérer le profil de l'utilisateur connecté
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const db = req.app.locals.db;

    const [profiles] = await db.query(
      'SELECT * FROM profiles WHERE userId = ?',
      [userId]
    );

    if (profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Profil non trouvé'
      });
    }

    let profile = profiles[0];

    // Parser les compétences si c'est une chaîne
    if (typeof profile.skills === 'string') {
      try {
        profile.skills = profile.skills.split(',').map(s => s.trim()).filter(s => s);
      } catch (e) {
        profile.skills = [];
      }
    }

    // Calculer la complétion
    profile.profileCompleteness = calculateProfileCompleteness(profile, userRole);

    res.json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.error('Erreur getMyProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

// PUT - Mettre à jour le profil
exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const db = req.app.locals.db;

    const {
      // Informations personnelles
      firstName,
      lastName,
      phone,
      bio,
      
      // Localisation
      address,
      city,
      region,
      
      // Informations professionnelles
      profession,
      skills,
      experience,
      
      // Prestataire
      hourlyRate,
      availability,
      transportMode,
      workZones,
      
      // Demandeur d'emploi
      contractType,
      expectedSalary,
      availabilityDelay,
      educationLevel,
      references,
      hasWorkPermit,
      
      // Recruteur
      companyName,
      companySize,
      companySector,
      companyNinea,
      
      // Client
      servicePreferences,
      budgetRange,
      clientType
    } = req.body;

    // Convertir skills en chaîne si c'est un tableau
    const skillsString = Array.isArray(skills) ? skills.join(',') : skills;

    // Construire la requête de mise à jour
    const updateQuery = `
      UPDATE profiles SET
        firstName = ?,
        lastName = ?,
        phone = ?,
        bio = ?,
        address = ?,
        city = ?,
        region = ?,
        profession = ?,
        skills = ?,
        experience = ?,
        hourlyRate = ?,
        availability = ?,
        transportMode = ?,
        workZones = ?,
        contractType = ?,
        expectedSalary = ?,
        availabilityDelay = ?,
        educationLevel = ?,
        \`references\` = ?,
        hasWorkPermit = ?,
        companyName = ?,
        companySize = ?,
        companySector = ?,
        companyNinea = ?,
        servicePreferences = ?,
        budgetRange = ?,
        clientType = ?,
        updatedAt = NOW()
      WHERE userId = ?
    `;

    await db.query(updateQuery, [
      firstName || null,
      lastName || null,
      phone || null,
      bio || null,
      address || null,
      city || null,
      region || null,
      profession || null,
      skillsString || null,
      experience || null,
      hourlyRate || null,
      availability || null,
      transportMode || null,
      workZones || null,
      contractType || null,
      expectedSalary || null,
      availabilityDelay || null,
      educationLevel || null,
      references || null,
      hasWorkPermit || false,
      companyName || null,
      companySize || null,
      companySector || null,
      companyNinea || null,
      servicePreferences || null,
      budgetRange || null,
      clientType || null,
      userId
    ]);

    // Récupérer le profil mis à jour
    const [updatedProfiles] = await db.query(
      'SELECT * FROM profiles WHERE userId = ?',
      [userId]
    );

    let profile = updatedProfiles[0];

    // Parser les compétences
    if (typeof profile.skills === 'string') {
      try {
        profile.skills = profile.skills.split(',').map(s => s.trim()).filter(s => s);
      } catch (e) {
        profile.skills = [];
      }
    }

    // Calculer la complétion
    profile.profileCompleteness = calculateProfileCompleteness(profile, userRole);

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: profile
    });

  } catch (error) {
    console.error('Erreur updateMyProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
};

// GET - Récupérer un profil par ID
exports.getProfileById = async (req, res) => {
  try {
    const profileId = req.params.id;
    const db = req.app.locals.db;

    const [profiles] = await db.query(
      `SELECT p.*, u.email, u.role 
       FROM profiles p
       JOIN users u ON p.userId = u.id
       WHERE p.id = ?`,
      [profileId]
    );

    if (profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Profil non trouvé'
      });
    }

    let profile = profiles[0];

    // Parser les compétences
    if (typeof profile.skills === 'string') {
      try {
        profile.skills = profile.skills.split(',').map(s => s.trim()).filter(s => s);
      } catch (e) {
        profile.skills = [];
      }
    }

    // Calculer la complétion
    profile.profileCompleteness = calculateProfileCompleteness(profile, profile.role);

    res.json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.error('Erreur getProfileById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

// GET - Rechercher des profils
exports.searchProfiles = async (req, res) => {
  try {
    const {
      role,
      city,
      region,
      profession,
      skills,
      availability,
      minRate,
      maxRate,
      page = 1,
      limit = 20
    } = req.query;

    const db = req.app.locals.db;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, u.email, u.role
      FROM profiles p
      JOIN users u ON p.userId = u.id
      WHERE 1=1
    `;
    const params = [];

    // Filtres
    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }

    if (city) {
      query += ' AND p.city = ?';
      params.push(city);
    }

    if (region) {
      query += ' AND p.region = ?';
      params.push(region);
    }

    if (profession) {
      query += ' AND p.profession LIKE ?';
      params.push(`%${profession}%`);
    }

    if (skills) {
      query += ' AND p.skills LIKE ?';
      params.push(`%${skills}%`);
    }

    if (availability) {
      query += ' AND p.availability = ?';
      params.push(availability);
    }

    if (minRate) {
      query += ' AND p.hourlyRate >= ?';
      params.push(minRate);
    }

    if (maxRate) {
      query += ' AND p.hourlyRate <= ?';
      params.push(maxRate);
    }

    // Pagination
    query += ' ORDER BY p.updatedAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [profiles] = await db.query(query, params);

    // Parser les compétences pour chaque profil
    profiles.forEach(profile => {
      if (typeof profile.skills === 'string') {
        try {
          profile.skills = profile.skills.split(',').map(s => s.trim()).filter(s => s);
        } catch (e) {
          profile.skills = [];
        }
      }
      profile.profileCompleteness = calculateProfileCompleteness(profile, profile.role);
    });

    // Compter le total
    let countQuery = `
      SELECT COUNT(*) as total
      FROM profiles p
      JOIN users u ON p.userId = u.id
      WHERE 1=1
    `;
    const countParams = params.slice(0, -2); // Exclure LIMIT et OFFSET

    if (role) countQuery += ' AND u.role = ?';
    if (city) countQuery += ' AND p.city = ?';
    if (region) countQuery += ' AND p.region = ?';
    if (profession) countQuery += ' AND p.profession LIKE ?';
    if (skills) countQuery += ' AND p.skills LIKE ?';
    if (availability) countQuery += ' AND p.availability = ?';
    if (minRate) countQuery += ' AND p.hourlyRate >= ?';
    if (maxRate) countQuery += ' AND p.hourlyRate <= ?';

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: profiles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur searchProfiles:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche de profils',
      error: error.message
    });
  }
};

module.exports = exports;
