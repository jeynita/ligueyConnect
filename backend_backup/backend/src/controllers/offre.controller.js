        import Offre from "../models/Offre.js";
        import Candidature from "../models/Candidature.js";
        import Users from "../models/Users.js";
        import Profile from "../models/Profile.js";
        import { Op } from "sequelize";

        /* ================= CRÉER UNE OFFRE (Recruteurs uniquement) ================= */
        export const createOffre = async (req, res) => {
        try {
            const userId = req.user.id;
            const userRole = req.user.role;

            // Vérifier que l'utilisateur est un recruteur
            if (userRole !== 'recruteur') {
            return res.status(403).json({
                success: false,
                message: "Seuls les recruteurs peuvent créer des offres d'emploi"
            });
            }

            const {
            title,
            description,
            contractType,
            sector,
            city,
            region,
            address,
            salaryMin,
            salaryMax,
            salaryPeriod,
            experienceRequired,
            educationLevel,
            skills,
            languages,
            numberOfPositions,
            workSchedule,
            startDate,
            applicationDeadline,
            companyName
            } = req.body;

            // Créer l'offre
            const offre = await Offre.create({
            userId,
            title,
            description,
            contractType,
            sector,
            city,
            region,
            address,
            salaryMin,
            salaryMax,
            salaryPeriod,
            experienceRequired,
            educationLevel,
            skills,
            languages,
            numberOfPositions,
            workSchedule,
            startDate,
            applicationDeadline,
            companyName,
            status: 'active'
            });

            // Recharger avec les relations
            const createdOffre = await Offre.findByPk(offre.id, {
            include: [
                {
                model: Users,
                as: 'user',
                attributes: ['id', 'email', 'role']
                },
                {
                model: Profile,
                as: 'profile',
                attributes: ['firstName', 'lastName', 'companyName', 'phone']
                }
            ]
            });

            res.status(201).json({
            success: true,
            message: "Offre créée avec succès",
            data: createdOffre
            });

        } catch (error) {
            console.error("Create offre error:", error);

            if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message
            });
            }

            res.status(500).json({
            success: false,
            message: "Erreur lors de la création de l'offre"
            });
        }
        };

        /* ================= RÉCUPÉRER MES OFFRES (Recruteur) ================= */
        export const getMyOffres = async (req, res) => {
        try {
            const userId = req.user.id;

            const offres = await Offre.findAll({
            where: { userId },
            include: [
                {
                model: Profile,
                as: 'profile',
                attributes: ['firstName', 'lastName', 'companyName']
                }
            ],
            order: [['createdAt', 'DESC']]
            });

            res.json({
            success: true,
            count: offres.length,
            data: offres
            });

        } catch (error) {
            console.error("Get my offres error:", error);
            res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des offres"
            });
        }
        };

        /* ================= RÉCUPÉRER UNE OFFRE PAR ID ================= */
        export const getOffreById = async (req, res) => {
        try {
            const { id } = req.params;

            const offre = await Offre.findByPk(id, {
            include: [
                {
                model: Users,
                as: 'user',
                attributes: ['id', 'email', 'role']
                },
                {
                model: Profile,
                as: 'profile',
                attributes: ['firstName', 'lastName', 'companyName', 'companySize', 'phone', 'city']
                }
            ]
            });

            if (!offre) {
            return res.status(404).json({
                success: false,
                message: "Offre non trouvée"
            });
            }

            // Incrémenter le compteur de vues
            await offre.increment('viewCount');

            res.json({
            success: true,
            data: offre
            });

        } catch (error) {
            console.error("Get offre error:", error);
            res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération de l'offre"
            });
        }
        };

        /* ================= METTRE À JOUR UNE OFFRE ================= */
        export const updateOffre = async (req, res) => {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const offre = await Offre.findByPk(id);

            if (!offre) {
            return res.status(404).json({
                success: false,
                message: "Offre non trouvée"
            });
            }

            // Vérifier que c'est bien le propriétaire
            if (offre.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Vous n'êtes pas autorisé à modifier cette offre"
            });
            }

            // Mettre à jour
            const {
            title,
            description,
            contractType,
            sector,
            city,
            region,
            address,
            salaryMin,
            salaryMax,
            salaryPeriod,
            experienceRequired,
            educationLevel,
            skills,
            languages,
            numberOfPositions,
            workSchedule,
            startDate,
            applicationDeadline,
            companyName,
            status
            } = req.body;

            await offre.update({
            title,
            description,
            contractType,
            sector,
            city,
            region,
            address,
            salaryMin,
            salaryMax,
            salaryPeriod,
            experienceRequired,
            educationLevel,
            skills,
            languages,
            numberOfPositions,
            workSchedule,
            startDate,
            applicationDeadline,
            companyName,
            status
            });

            // Recharger avec les relations
            const updatedOffre = await Offre.findByPk(id, {
            include: [
                {
                model: Users,
                as: 'user',
                attributes: ['id', 'email', 'role']
                },
                {
                model: Profile,
                as: 'profile',
                attributes: ['firstName', 'lastName', 'companyName']
                }
            ]
            });

            res.json({
            success: true,
            message: "Offre mise à jour avec succès",
            data: updatedOffre
            });

        } catch (error) {
            console.error("Update offre error:", error);
            res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour de l'offre"
            });
        }
        };

        /* ================= SUPPRIMER UNE OFFRE ================= */
        export const deleteOffre = async (req, res) => {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const offre = await Offre.findByPk(id);

            if (!offre) {
            return res.status(404).json({
                success: false,
                message: "Offre non trouvée"
            });
            }

            // Vérifier que c'est bien le propriétaire
            if (offre.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Vous n'êtes pas autorisé à supprimer cette offre"
            });
            }

            await offre.destroy();

            res.json({
            success: true,
            message: "Offre supprimée avec succès"
            });

        } catch (error) {
            console.error("Delete offre error:", error);
            res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de l'offre"
            });
        }
        };

        /* ================= RECHERCHER DES OFFRES (Public) ================= */
        export const searchOffres = async (req, res) => {
        try {
            const {
            contractType,
            city,
            region,
            sector,
            experienceRequired,
            salaryMin,
            search
            } = req.query;

            // Construire les filtres
            const where = {
            status: 'active' // Seulement les offres actives
            };

            if (contractType) where.contractType = contractType;
            if (city) where.city = city;
            if (region) where.region = region;
            if (sector) where.sector = sector;
            if (experienceRequired) where.experienceRequired = experienceRequired;

            // Recherche textuelle
            if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
            }

            // Filtre salaire
            if (salaryMin) {
            where.salaryMin = { [Op.gte]: salaryMin };
            }

            const offres = await Offre.findAll({
            where,
            include: [
                {
                model: Users,
                as: 'user',
                attributes: ['id', 'email', 'role'],
                where: { isActive: true }
                },
                {
                model: Profile,
                as: 'profile',
                attributes: ['firstName', 'lastName', 'companyName', 'city']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 50
            });

            res.json({
            success: true,
            count: offres.length,
            data: offres
            });

        } catch (error) {
            console.error("Search offres error:", error);
            res.status(500).json({
            success: false,
            message: "Erreur lors de la recherche"
            });
        }
        };
        /* ================= POSTULER À UNE OFFRE (Demandeurs uniquement) ================= */
    export const postuler = async (req, res) => {
    try {
        const candidatId = req.user.id;
        const userRole = req.user.role;
        const { id: offreId } = req.params;

        // Vérifier que l'utilisateur est un demandeur
        if (userRole !== 'demandeur') {
        return res.status(403).json({
            success: false,
            message: "Seuls les demandeurs d'emploi peuvent postuler"
        });
        }

        // Vérifier que l'offre existe et est active
        const offre = await Offre.findByPk(offreId);
        if (!offre) {
        return res.status(404).json({
            success: false,
            message: "Offre non trouvée"
        });
        }

        if (offre.status !== 'active') {
        return res.status(400).json({
            success: false,
            message: "Cette offre n'est plus active"
        });
        }

        // Vérifier que le candidat n'a pas déjà postulé
        const existingCandidature = await Candidature.findOne({
        where: { offreId, candidatId }
        });

        if (existingCandidature) {
        return res.status(400).json({
            success: false,
            message: "Vous avez déjà postulé à cette offre"
        });
        }

        const { coverLetter, cvText } = req.body;

        // Créer la candidature
        const candidature = await Candidature.create({
        offreId,
        candidatId,
        coverLetter,
        cvText,
        status: 'en_attente'
        });

        // Incrémenter le compteur de candidatures de l'offre
        await offre.increment('applicationCount');

        // Recharger avec les relations
        const createdCandidature = await Candidature.findByPk(candidature.id, {
        include: [
            {
            model: Offre,
            as: 'offre',
            attributes: ['id', 'title', 'contractType', 'city']
            },
            {
            model: Profile,
            as: 'candidatProfile',
            attributes: ['firstName', 'lastName', 'phone', 'profession']
            }
        ]
        });

        res.status(201).json({
        success: true,
        message: "Candidature envoyée avec succès",
        data: createdCandidature
        });

    } catch (error) {
        console.error("Postuler error:", error);

        if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
            success: false,
            message: error.errors[0].message
        });
        }

        res.status(500).json({
        success: false,
        message: "Erreur lors de l'envoi de la candidature"
        });
    }
    };

    /* ================= RÉCUPÉRER MES CANDIDATURES (Demandeur) ================= */
    export const getMyCandidatures = async (req, res) => {
    try {
        const candidatId = req.user.id;

        const candidatures = await Candidature.findAll({
        where: { candidatId },
        include: [
            {
            model: Offre,
            as: 'offre',
            attributes: ['id', 'title', 'contractType', 'city', 'status'],
            include: [
                {
                model: Profile,
                as: 'profile',
                attributes: ['firstName', 'lastName', 'companyName']
                }
            ]
            }
        ],
        order: [['createdAt', 'DESC']]
        });

        res.json({
        success: true,
        count: candidatures.length,
        data: candidatures
        });

    } catch (error) {
        console.error("Get my candidatures error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des candidatures"
        });
    }
    };

    /* ================= RÉCUPÉRER LES CANDIDATURES D'UNE OFFRE (Recruteur) ================= */
    export const getCandidaturesByOffre = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: offreId } = req.params;

        // Vérifier que l'offre appartient au recruteur
        const offre = await Offre.findByPk(offreId);
        if (!offre) {
        return res.status(404).json({
            success: false,
            message: "Offre non trouvée"
        });
        }

        if (offre.userId !== userId) {
        return res.status(403).json({
            success: false,
            message: "Vous n'êtes pas autorisé à voir ces candidatures"
        });
        }

        const candidatures = await Candidature.findAll({
        where: { offreId },
        include: [
            {
            model: Users,
            as: 'candidat',
            attributes: ['id', 'email']
            },
            {
            model: Profile,
            as: 'candidatProfile',
            attributes: ['firstName', 'lastName', 'phone', 'profession', 'city', 'skills', 'experience']
            }
        ],
        order: [['createdAt', 'DESC']]
        });

        res.json({
        success: true,
        count: candidatures.length,
        data: candidatures
        });

    } catch (error) {
        console.error("Get candidatures by offre error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des candidatures"
        });
    }
    };

    /* ================= METTRE À JOUR LE STATUT D'UNE CANDIDATURE (Recruteur) ================= */
    export const updateCandidatureStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { candidatureId } = req.params;
        const { status, recruiterNotes } = req.body;

        // Récupérer la candidature avec l'offre
        const candidature = await Candidature.findByPk(candidatureId, {
        include: [
            {
            model: Offre,
            as: 'offre'
            }
        ]
        });

        if (!candidature) {
        return res.status(404).json({
            success: false,
            message: "Candidature non trouvée"
        });
        }

        // Vérifier que l'offre appartient au recruteur
        if (candidature.offre.userId !== userId) {
        return res.status(403).json({
            success: false,
            message: "Vous n'êtes pas autorisé à modifier cette candidature"
        });
        }

        // Mettre à jour le statut
        await candidature.update({
        status,
        recruiterNotes,
        respondedAt: new Date()
        });

        // Recharger avec les relations
        const updatedCandidature = await Candidature.findByPk(candidatureId, {
        include: [
            {
            model: Users,
            as: 'candidat',
            attributes: ['id', 'email']
            },
            {
            model: Profile,
            as: 'candidatProfile',
            attributes: ['firstName', 'lastName', 'phone']
            }
        ]
        });

        res.json({
        success: true,
        message: "Candidature mise à jour avec succès",
        data: updatedCandidature
        });

    } catch (error) {
        console.error("Update candidature status error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour de la candidature"
        });
    }
    };

    /* ================= RÉCUPÉRER LES SECTEURS DISPONIBLES ================= */
    export const getSectors = async (req, res) => {
    try {
        const sectors = [
        { value: 'administration', label: '🏛️ Administration' },
        { value: 'agriculture', label: '🌾 Agriculture' },
        { value: 'artisanat', label: '🎨 Artisanat' },
        { value: 'commerce', label: '🛒 Commerce' },
        { value: 'construction', label: '🏗️ Construction / BTP' },
        { value: 'education', label: '📚 Éducation / Formation' },
        { value: 'hotellerie_restauration', label: '🍽️ Hôtellerie / Restauration' },
        { value: 'immobilier', label: '🏢 Immobilier' },
        { value: 'industrie', label: '🏭 Industrie' },
        { value: 'informatique', label: '💻 Informatique / Tech' },
        { value: 'sante', label: '⚕️ Santé' },
        { value: 'services', label: '🔧 Services' },
        { value: 'tourisme', label: '✈️ Tourisme' },
        { value: 'transport', label: '🚚 Transport / Logistique' },
        { value: 'autre', label: '➕ Autre' }
        ];

        res.json({
        success: true,
        data: sectors
        });

    } catch (error) {
        console.error("Get sectors error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des secteurs"
        });
    }
    };