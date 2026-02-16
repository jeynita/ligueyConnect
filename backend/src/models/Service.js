    import { DataTypes } from "sequelize";
    import sequelize from "../config/db.js";
    import Users from "./Users.js";
    import Profile from "./Profile.js";

    const Service = sequelize.define("Service", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'users',
        key: 'id'
        },
        onDelete: 'CASCADE',
        field: 'user_id'
    },
    
    // Informations du service
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
        notEmpty: {
            msg: "Le titre est requis"
        },
        len: {
            args: [5, 200],
            msg: "Le titre doit contenir entre 5 et 200 caractères"
        }
        }
    },
    
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
        notEmpty: {
            msg: "La description est requise"
        },
        len: {
            args: [20, 2000],
            msg: "La description doit contenir entre 20 et 2000 caractères"
        }
        }
    },
    
    category: {
        type: DataTypes.ENUM(
        'plomberie',
        'electricite',
        'menuiserie',
        'maconnerie',
        'peinture',
        'immobilier',
        'mecanique',
        'informatique',
        'nettoyage',
        'restauration',
        'couture',
        'coiffure',
        'cours_particuliers',
        'demenagement',
        'autre'
        ),
        allowNull: false,
        validate: {
        notEmpty: {
            msg: "La catégorie est requise"
        }
        }
    },
    
    // Tarification
    priceType: {
        type: DataTypes.ENUM('heure', 'jour', 'forfait', 'devis'),
        allowNull: false,
        defaultValue: 'heure',
        field: 'price_type'
    },
    
    priceMin: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'price_min',
        validate: {
        min: 0
        }
    },
    
    priceMax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'price_max',
        validate: {
        min: 0
        }
    },
    
    // Localisation
    city: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
        notEmpty: {
            msg: "La ville est requise"
        }
        }
    },
    
    region: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    
    zones: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: "Zones de déplacement (array de quartiers/communes)"
    },
    
    // Disponibilité
    availability: {
        type: DataTypes.ENUM('disponible', 'occupe', 'indisponible'),
        defaultValue: 'disponible'
    },
    
    availableDays: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        field: 'available_days',
        comment: "Jours de disponibilité"
    },
    
    responseTime: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'response_time',
        comment: "Délai de réponse (ex: 24h, 48h, immédiat)"
    },
    
    // Médias
    images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: "URLs des images du service"
    },
    
    // Statut
    status: {
        type: DataTypes.ENUM('actif', 'inactif', 'suspendu'),
        defaultValue: 'actif',
        validate: {
        isIn: {
            args: [['actif', 'inactif', 'suspendu']],
            msg: "Le statut doit être : actif, inactif ou suspendu"
        }
        }
    },
    
    // Statistiques
    viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'view_count'
    },
    
    contactCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'contact_count'
    },
    
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00,
        validate: {
        min: 0,
        max: 5
        }
    },
    
    reviewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'review_count'
    }
    }, {
    tableName: "services",
    timestamps: true,
    underscored: true,
    indexes: [
        {
        fields: ['category']
        },
        {
        fields: ['city']
        },
        {
        fields: ['status']
        },
        {
        fields: ['user_id']
        }
    ]
    });

    // Relations
    Users.hasMany(Service, {
    foreignKey: 'userId',
    as: 'services'
    });

    Service.belongsTo(Users, {
    foreignKey: 'userId',
    as: 'user'
    });

    Service.belongsTo(Profile, {
    foreignKey: 'userId',
    targetKey: 'userId',
    as: 'profile'
    });

    export default Service;