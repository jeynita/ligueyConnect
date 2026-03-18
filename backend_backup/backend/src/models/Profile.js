    import { DataTypes } from "sequelize";
    import sequelize from "../config/db.js";
    import Users from "./Users.js";

    const Profile = sequelize.define("Profile", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
        model: 'users',
        key: 'id'
        },
        onDelete: 'CASCADE'
    },
    // Informations personnelles
    firstName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'first_name'
    },
    lastName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'last_name'
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
        is: /^(\+221)?[0-9]{9}$/i // Format téléphone Sénégal
        }
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    
    // Localisation
    address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    region: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    
    // Informations professionnelles
    profession: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    skills: {
        type: DataTypes.JSON, // Array de compétences
        allowNull: true,
        defaultValue: []
    },
    experience: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    
    // Pour les prestataires
    hourlyRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'hourly_rate'
    },
    availability: {
        type: DataTypes.ENUM('disponible', 'occupe', 'indisponible'),
        defaultValue: 'disponible'
    },
    
    // Pour les recruteurs
    companyName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'company_name'
    },
    companySize: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'company_size'
    },
    
    // Statistiques
    profileCompleteness: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'profile_completeness',
        validate: {
        min: 0,
        max: 100
        }
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
    tableName: "profiles",
    timestamps: true,
    underscored: true
    });

    // Relation : Un utilisateur a un profil
    Users.hasOne(Profile, {
    foreignKey: 'userId',
    as: 'profile'
    });

    Profile.belongsTo(Users, {
    foreignKey: 'userId',
    as: 'user'
    });

    export default Profile;