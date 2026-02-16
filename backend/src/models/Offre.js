    import { DataTypes } from "sequelize";
    import sequelize from "../config/db.js";
    import Users from "./Users.js";
    import Profile from "./Profile.js";

    const Offre = sequelize.define("Offre", {
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
        field: 'user_id',
        comment: "ID du recruteur qui a créé l'offre"
    },
    
    // Informations de l'offre
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
            args: [50, 5000],
            msg: "La description doit contenir entre 50 et 5000 caractères"
        }
        }
    },
    
    // Type de contrat
    contractType: {
        type: DataTypes.ENUM('CDD', 'CDI', 'stage', 'freelance', 'temporaire'),
        allowNull: false,
        field: 'contract_type',
        validate: {
        notEmpty: {
            msg: "Le type de contrat est requis"
        }
        }
    },
    
    // Secteur d'activité
    sector: {
        type: DataTypes.ENUM(
        'administration',
        'agriculture',
        'artisanat',
        'commerce',
        'construction',
        'education',
        'hotellerie_restauration',
        'immobilier',
        'industrie',
        'informatique',
        'sante',
        'services',
        'tourisme',
        'transport',
        'autre'
        ),
        allowNull: true
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
    
    address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    
    // Rémunération
    salaryMin: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'salary_min',
        validate: {
        min: 0
        }
    },
    
    salaryMax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'salary_max',
        validate: {
        min: 0
        }
    },
    
    salaryPeriod: {
        type: DataTypes.ENUM('heure', 'jour', 'mois', 'annuel', 'a_negocier'),
        defaultValue: 'mois',
        field: 'salary_period'
    },
    
    // Exigences
    experienceRequired: {
        type: DataTypes.ENUM('aucune', '0-1_ans', '1-3_ans', '3-5_ans', '5_ans_plus'),
        defaultValue: 'aucune',
        field: 'experience_required'
    },
    
    educationLevel: {
        type: DataTypes.ENUM(
        'aucun',
        'primaire',
        'secondaire',
        'bac',
        'bac_plus_2',
        'bac_plus_3',
        'bac_plus_5',
        'doctorat'
        ),
        defaultValue: 'aucun',
        field: 'education_level'
    },
    
    skills: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: "Compétences requises (array)"
    },
    
    languages: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: "Langues requises (array)"
    },
    
    // Détails du poste
    numberOfPositions: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        field: 'number_of_positions',
        validate: {
        min: 1
        }
    },
    
    workSchedule: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'work_schedule',
        comment: "Ex: Temps plein, Temps partiel, Flexible"
    },
    
    startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'start_date',
        comment: "Date de début souhaitée"
    },
    
    applicationDeadline: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'application_deadline',
        comment: "Date limite de candidature"
    },
    
    // Informations de l'entreprise (optionnel si déjà dans le profil)
    companyName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'company_name'
    },
    
    // Statut de l'offre
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'pourvue', 'expiree'),
        defaultValue: 'active',
        validate: {
        isIn: {
            args: [['active', 'inactive', 'pourvue', 'expiree']],
            msg: "Le statut doit être : active, inactive, pourvue ou expiree"
        }
        }
    },
    
    // Statistiques
    viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'view_count'
    },
    
    applicationCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'application_count'
    }
    }, {
    tableName: "offres",
    timestamps: true,
    underscored: true,
    indexes: [
        {
        fields: ['contract_type']
        },
        {
        fields: ['city']
        },
        {
        fields: ['sector']
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
    Users.hasMany(Offre, {
    foreignKey: 'userId',
    as: 'offres'
    });

    Offre.belongsTo(Users, {
    foreignKey: 'userId',
    as: 'user'
    });

    Offre.belongsTo(Profile, {
    foreignKey: 'userId',
    targetKey: 'userId',
    as: 'profile'
    });

    export default Offre;