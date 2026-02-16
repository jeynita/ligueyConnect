    import { DataTypes } from "sequelize";
    import sequelize from "../config/db.js";
    import Users from "./Users.js";
    import Offre from "./Offre.js";
    import Profile from "./Profile.js";

    const Candidature = sequelize.define("Candidature", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    offreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'offres',
        key: 'id'
        },
        onDelete: 'CASCADE',
        field: 'offre_id'
    },
    
    candidatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'users',
        key: 'id'
        },
        onDelete: 'CASCADE',
        field: 'candidat_id'
    },
    
    // Message de motivation
    coverLetter: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'cover_letter',
        validate: {
        len: {
            args: [0, 2000],
            msg: "La lettre de motivation ne peut pas dépasser 2000 caractères"
        }
        }
    },
    
    // CV (lien ou texte)
    cvText: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'cv_text',
        comment: "CV au format texte"
    },
    
    cvUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'cv_url',
        comment: "URL du CV uploadé"
    },
    
    // Statut de la candidature
    status: {
        type: DataTypes.ENUM('en_attente', 'vue', 'retenue', 'rejetee'),
        defaultValue: 'en_attente',
        validate: {
        isIn: {
            args: [['en_attente', 'vue', 'retenue', 'rejetee']],
            msg: "Le statut doit être : en_attente, vue, retenue ou rejetee"
        }
        }
    },
    
    // Note du recruteur
    recruiterNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'recruiter_notes',
        comment: "Notes privées du recruteur"
    },
    
    // Date de réponse du recruteur
    respondedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'responded_at'
    }
    }, {
    tableName: "candidatures",
    timestamps: true,
    underscored: true,
    indexes: [
        {
        fields: ['offre_id']
        },
        {
        fields: ['candidat_id']
        },
        {
        fields: ['status']
        },
        {
        // Empêcher les candidatures multiples à la même offre
        unique: true,
        fields: ['offre_id', 'candidat_id']
        }
    ]
    });

    // Relations
    Offre.hasMany(Candidature, {
    foreignKey: 'offreId',
    as: 'candidatures'
    });

    Candidature.belongsTo(Offre, {
    foreignKey: 'offreId',
    as: 'offre'
    });

    Users.hasMany(Candidature, {
    foreignKey: 'candidatId',
    as: 'candidatures'
    });

    Candidature.belongsTo(Users, {
    foreignKey: 'candidatId',
    as: 'candidat'
    });

    Candidature.belongsTo(Profile, {
    foreignKey: 'candidatId',
    targetKey: 'userId',
    as: 'candidatProfile'
    });

    export default Candidature;