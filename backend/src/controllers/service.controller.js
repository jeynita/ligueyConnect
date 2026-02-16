    import Service from "../models/Service.js";
    import Users from "../models/Users.js";
    import Profile from "../models/Profile.js";
    import { Op } from "sequelize";

    /* ================= CRÉER UN SERVICE (Prestataires uniquement) ================= */
    export const createService = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        // Vérifier que l'utilisateur est un prestataire
        if (userRole !== 'prestataire') {
        return res.status(403).json({
            success: false,
            message: "Seuls les prestataires peuvent créer des services"
        });
        }

        const {
        title,
        description,
        category,
        priceType,
        priceMin,
        priceMax,
        city,
        region,
        zones,
        availability,
        availableDays,
        responseTime
        } = req.body;

        // Créer le service
        const service = await Service.create({
        userId,
        title,
        description,
        category,
        priceType,
        priceMin,
        priceMax,
        city,
        region,
        zones,
        availability,
        availableDays,
        responseTime,
        status: 'actif'
        });

        // Recharger avec les relations
        const createdService = await Service.findByPk(service.id, {
        include: [
            {
            model: Users,
            as: 'user',
            attributes: ['id', 'email', 'role']
            },
            {
            model: Profile,
            as: 'profile',
            attributes: ['firstName', 'lastName', 'phone', 'avatar', 'rating', 'reviewCount']
            }
        ]
        });

        res.status(201).json({
        success: true,
        message: "Service créé avec succès",
        data: createdService
        });

    } catch (error) {
        console.error("Create service error:", error);

        if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
            success: false,
            message: error.errors[0].message
        });
        }

        res.status(500).json({
        success: false,
        message: "Erreur lors de la création du service"
        });
    }
    };

    /* ================= RÉCUPÉRER MES SERVICES ================= */
    export const getMyServices = async (req, res) => {
    try {
        const userId = req.user.id;

        const services = await Service.findAll({
        where: { userId },
        include: [
            {
            model: Profile,
            as: 'profile',
            attributes: ['firstName', 'lastName', 'phone', 'rating']
            }
        ],
        order: [['createdAt', 'DESC']]
        });

        res.json({
        success: true,
        count: services.length,
        data: services
        });

    } catch (error) {
        console.error("Get my services error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des services"
        });
    }
    };

    /* ================= RÉCUPÉRER UN SERVICE PAR ID ================= */
    export const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByPk(id, {
        include: [
            {
            model: Users,
            as: 'user',
            attributes: ['id', 'email', 'role']
            },
            {
            model: Profile,
            as: 'profile',
            attributes: ['firstName', 'lastName', 'phone', 'bio', 'avatar', 'city', 'rating', 'reviewCount']
            }
        ]
        });

        if (!service) {
        return res.status(404).json({
            success: false,
            message: "Service non trouvé"
        });
        }

        // Incrémenter le compteur de vues
        await service.increment('viewCount');

        res.json({
        success: true,
        data: service
        });

    } catch (error) {
        console.error("Get service error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du service"
        });
    }
    };

    /* ================= METTRE À JOUR UN SERVICE ================= */
    export const updateService = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Trouver le service
        const service = await Service.findByPk(id);

        if (!service) {
        return res.status(404).json({
            success: false,
            message: "Service non trouvé"
        });
        }

        // Vérifier que c'est bien le propriétaire
        if (service.userId !== userId) {
        return res.status(403).json({
            success: false,
            message: "Vous n'êtes pas autorisé à modifier ce service"
        });
        }

        // Mettre à jour
        const {
        title,
        description,
        category,
        priceType,
        priceMin,
        priceMax,
        city,
        region,
        zones,
        availability,
        availableDays,
        responseTime,
        status
        } = req.body;

        await service.update({
        title,
        description,
        category,
        priceType,
        priceMin,
        priceMax,
        city,
        region,
        zones,
        availability,
        availableDays,
        responseTime,
        status
        });

        // Recharger avec les relations
        const updatedService = await Service.findByPk(id, {
        include: [
            {
            model: Users,
            as: 'user',
            attributes: ['id', 'email', 'role']
            },
            {
            model: Profile,
            as: 'profile',
            attributes: ['firstName', 'lastName', 'phone', 'avatar', 'rating']
            }
        ]
        });

        res.json({
        success: true,
        message: "Service mis à jour avec succès",
        data: updatedService
        });

    } catch (error) {
        console.error("Update service error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour du service"
        });
    }
    };

    /* ================= SUPPRIMER UN SERVICE ================= */
    export const deleteService = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const service = await Service.findByPk(id);

        if (!service) {
        return res.status(404).json({
            success: false,
            message: "Service non trouvé"
        });
        }

        // Vérifier que c'est bien le propriétaire
        if (service.userId !== userId) {
        return res.status(403).json({
            success: false,
            message: "Vous n'êtes pas autorisé à supprimer ce service"
        });
        }

        await service.destroy();

        res.json({
        success: true,
        message: "Service supprimé avec succès"
        });

    } catch (error) {
        console.error("Delete service error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression du service"
        });
    }
    };

    /* ================= RECHERCHER DES SERVICES (Public) ================= */
    export const searchServices = async (req, res) => {
    try {
        const {
        category,
        city,
        region,
        priceMin,
        priceMax,
        availability,
        search
        } = req.query;

        // Construire les filtres
        const where = {
        status: 'actif' // Seulement les services actifs
        };

        if (category) where.category = category;
        if (city) where.city = city;
        if (region) where.region = region;
        if (availability) where.availability = availability;

        // Recherche textuelle dans titre et description
        if (search) {
        where[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
        }

        // Filtre de prix
        if (priceMin) {
        where.priceMin = { [Op.gte]: priceMin };
        }
        if (priceMax) {
        where.priceMax = { [Op.lte]: priceMax };
        }

        const services = await Service.findAll({
        where,
        include: [
            {
            model: Users,
            as: 'user',
            attributes: ['id', 'email', 'role'],
            where: { isActive: true } // Seulement les comptes actifs
            },
            {
            model: Profile,
            as: 'profile',
            attributes: ['firstName', 'lastName', 'phone', 'avatar', 'city', 'rating', 'reviewCount']
            }
        ],
        order: [
            ['rating', 'DESC'],
            ['createdAt', 'DESC']
        ],
        limit: 50
        });

        res.json({
        success: true,
        count: services.length,
        data: services
        });

    } catch (error) {
        console.error("Search services error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la recherche"
        });
    }
    };

    /* ================= RÉCUPÉRER LES CATÉGORIES DISPONIBLES ================= */
    export const getCategories = async (req, res) => {
    try {
        const categories = [
        { value: 'plomberie', label: '🔧 Plomberie', icon: '🔧' },
        { value: 'electricite', label: '⚡ Électricité', icon: '⚡' },
        { value: 'menuiserie', label: '🪚 Menuiserie', icon: '🪚' },
        { value: 'maconnerie', label: '🧱 Maçonnerie', icon: '🧱' },
        { value: 'peinture', label: '🎨 Peinture', icon: '🎨' },
        { value: 'immobilier', label: '🏡 Services immobiliers', icon: '🏡' },
        { value: 'mecanique', label: '🚗 Mécanique automobile', icon: '🚗' },
        { value: 'informatique', label: '💻 Informatique', icon: '💻' },
        { value: 'nettoyage', label: '🧹 Nettoyage / Ménage', icon: '🧹' },
        { value: 'restauration', label: '🍳 Restauration / Traiteur', icon: '🍳' },
        { value: 'couture', label: '👗 Couture / Retouche', icon: '👗' },
        { value: 'coiffure', label: '💇 Coiffure / Beauté', icon: '💇' },
        { value: 'cours_particuliers', label: '📚 Cours particuliers', icon: '📚' },
        { value: 'demenagement', label: '🚚 Déménagement / Transport', icon: '🚚' },
        { value: 'autre', label: '➕ Autre', icon: '➕' }
        ];

        res.json({
        success: true,
        data: categories
        });

    } catch (error) {
        console.error("Get categories error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des catégories"
        });
    }
    };