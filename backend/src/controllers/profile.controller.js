    import Profile from "../models/Profile.js";
    import Users from "../models/Users.js";

    /* ================= GET PROFILE (Par userId) ================= */
    export const getProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const profile = await Profile.findOne({
        where: { userId },
        include: [{
            model: Users,
            as: 'user',
            attributes: ['id', 'email', 'role', 'isActive']
        }]
        });

        if (!profile) {
        return res.status(404).json({
            success: false,
            message: "Profil non trouvé"
        });
        }

        res.json({
        success: true,
        data: profile
        });

    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du profil"
        });
    }
    };

    /* ================= GET MY PROFILE (Utilisateur connecté) ================= */
    export const getMyProfile = async (req, res) => {
    try {
        // req.user est ajouté par le middleware auth
        const userId = req.user.id;

        console.log("Utilisateur authentifie:", req.user);

        let profile = await Profile.findOne({
        where: { userId },
        include: [{
            model: Users,
            as: 'user',
            attributes: ['id', 'email', 'role', 'isActive', 'createdAt']
        }]
        });

        // Si le profil n'existe pas, le créer
        if (!profile) {
        profile = await Profile.create({
            userId,
            profileCompleteness: 10 // 10% (juste email créé)
        });

        // Recharger avec les relations
        profile = await Profile.findOne({
            where: { userId },
            include: [{
            model: Users,
            as: 'user',
            attributes: ['id', 'email', 'role', 'isActive', 'createdAt']
            }]
        });
        }

        res.json({
        success: true,
        data: profile
        });

    } catch (error) {
        console.error("Get my profile error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du profil"
        });
    }
    };

    /* ================= UPDATE PROFILE ================= */
    export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
        firstName,
        lastName,
        phone,
        bio,
        address,
        city,
        region,
        profession,
        skills,
        experience,
        hourlyRate,
        availability,
        companyName,
        companySize
        } = req.body;

        // Trouver ou créer le profil
        let [profile, created] = await Profile.findOrCreate({
        where: { userId },
        defaults: {
            userId,
            firstName,
            lastName,
            phone,
            bio,
            address,
            city,
            region,
            profession,
            skills,
            experience,
            hourlyRate,
            availability,
            companyName,
            companySize
        }
        });

        // Si le profil existe déjà, le mettre à jour
        if (!created) {
        await profile.update({
            firstName,
            lastName,
            phone,
            bio,
            address,
            city,
            region,
            profession,
            skills,
            experience,
            hourlyRate,
            availability,
            companyName,
            companySize
        });
        }

        // Calculer le pourcentage de complétion
        const completeness = calculateProfileCompleteness(profile);
        await profile.update({ profileCompleteness: completeness });

        // Recharger avec les relations
        profile = await Profile.findOne({
        where: { userId },
        include: [{
            model: Users,
            as: 'user',
            attributes: ['id', 'email', 'role']
        }]
        });

        res.json({
        success: true,
        message: "Profil mis à jour avec succès",
        data: profile
        });

    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour du profil"
        });
    }
    };

    /* ================= CALCULER LE POURCENTAGE DE COMPLÉTION ================= */
    function calculateProfileCompleteness(profile) {
    let score = 10; // 10% de base (compte créé)

    if (profile.firstName) score += 10;
    if (profile.lastName) score += 10;
    if (profile.phone) score += 10;
    if (profile.bio) score += 15;
    if (profile.address) score += 10;
    if (profile.city) score += 5;
    if (profile.profession) score += 15;
    if (profile.skills && profile.skills.length > 0) score += 15;
    if (profile.experience) score += 10;

    return Math.min(score, 100);
    }

    /* ================= SEARCH PROFILES (Recherche publique) ================= */
    export const searchProfiles = async (req, res) => {
    try {
        const { 
        role, 
        profession, 
        city, 
        region,
        skills,
        availability 
        } = req.query;

        // Construire les filtres
        const whereProfile = {};
        const whereUser = {};

        if (profession) whereProfile.profession = { [Op.like]: `%${profession}%` };
        if (city) whereProfile.city = city;
        if (region) whereProfile.region = region;
        if (availability) whereProfile.availability = availability;

        if (role) whereUser.role = role;
        whereUser.isActive = true; // Seulement les comptes actifs

        const profiles = await Profile.findAll({
        where: whereProfile,
        include: [{
            model: Users,
            as: 'user',
            where: whereUser,
            attributes: ['id', 'email', 'role']
        }],
        order: [
            ['rating', 'DESC'],
            ['profileCompleteness', 'DESC']
        ],
        limit: 50
        });

        res.json({
        success: true,
        count: profiles.length,
        data: profiles
        });

    } catch (error) {
        console.error("Search profiles error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la recherche"
        });
    }
    };