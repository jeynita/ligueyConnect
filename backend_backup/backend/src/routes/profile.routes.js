import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import Profile from '../models/Profile.js';
import Users from '../models/Users.js';
import { Op } from 'sequelize';

const router = express.Router();

/* ================= FONCTIONS D'AIDE ================= */

const calculateProfileCompleteness = (profile, userRole) => {
  const fields = {
    common: ['firstName', 'lastName', 'phone', 'bio', 'city', 'region', 'profession', 'skills', 'experience'],
    prestataire: ['hourlyRate', 'availability'],
    demandeur_emploi: ['educationLevel'],
    recruteur: ['companyName', 'companySize'],
    client: []
  };

  const requiredFields = [...fields.common, ...(fields[userRole] || [])];
  const filledFields = requiredFields.filter(field => {
    const value = profile[field];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    return value !== null && value !== undefined;
  });

  return Math.round((filledFields.length / requiredFields.length) * 100);
};

/* ================= ROUTES ================= */

/**
 * @route   GET /api/profiles/me
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: { userId: req.user.id },
      include: [{
        model: Users,
        as: 'user',
        attributes: ['id', 'email', 'role']
      }]
    });

    if (!profile) {
      return res.json({ success: true, data: null, message: 'Aucun profil trouvé.' });
    }

    const profileData = profile.toJSON();
    profileData.profileCompleteness = calculateProfileCompleteness(profileData, req.user.role);

    res.json({ success: true, data: profileData });
  } catch (error) {
    console.error('Erreur Profile GET /me:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
});

/**
 * @route   PUT /api/profiles/me
 */
router.put('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    let profile = await Profile.findOne({ where: { userId } });

    // Sécurité pour les champs JSON (skills)
    const dataToSave = { ...req.body };
    if (dataToSave.skills && typeof dataToSave.skills === 'string') {
        try { dataToSave.skills = JSON.parse(dataToSave.skills); } catch (e) { /* déjà un objet */ }
    }

    if (!profile) {
      profile = await Profile.create({ ...dataToSave, userId });
    } else {
      await profile.update(dataToSave);
    }

    const updatedProfile = await Profile.findOne({
      where: { userId },
      include: [{ model: Users, as: 'user', attributes: ['id', 'email', 'role'] }]
    });

    const profileData = updatedProfile.toJSON();
    profileData.profileCompleteness = calculateProfileCompleteness(profileData, req.user.role);

    res.json({ success: true, message: 'Profil enregistré avec succès', data: profileData });
  } catch (error) {
    console.error('Erreur Profile PUT /me:', error);
    
    // Si c'est une erreur de validation Sequelize (ex: format téléphone)
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }

    res.status(500).json({ success: false, message: 'Erreur lors de la sauvegarde', error: error.message });
  }
});

/**
 * @route   GET /api/profiles/search
 */
router.get('/search', async (req, res) => {
  try {
    const { role, city, profession, skills } = req.query;
    const where = {};
    const userWhere = {};

    if (role) userWhere.role = role;
    if (city) where.city = city;
    if (profession) where.profession = { [Op.like]: `%${profession}%` };
    
    // Recherche simplifiée pour les skills
    if (skills) where.skills = { [Op.like]: `%${skills}%` };

    const profiles = await Profile.findAll({
      where,
      include: [{
        model: Users,
        as: 'user',
        where: userWhere,
        attributes: ['id', 'email', 'role']
      }]
    });

    res.json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/profiles/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id, {
      include: [{ model: Users, as: 'user', attributes: ['id', 'email', 'role'] }]
    });

    if (!profile) return res.status(404).json({ success: false, message: 'Profil introuvable' });

    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;