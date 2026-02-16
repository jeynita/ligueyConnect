    import { DataTypes } from "sequelize";
    import sequelize from "../config/db.js";
    import Users from "./Users.js";
    import Profile from "./Profile.js";

    const Message = sequelize.define("Message", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'users',
        key: 'id'
        },
        onDelete: 'CASCADE',
        field: 'sender_id',
        comment: "ID de l'expéditeur"
    },
    
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'users',
        key: 'id'
        },
        onDelete: 'CASCADE',
        field: 'receiver_id',
        comment: "ID du destinataire"
    },
    
    // Contenu du message
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
        notEmpty: {
            msg: "Le message ne peut pas être vide"
        },
        len: {
            args: [1, 2000],
            msg: "Le message doit contenir entre 1 et 2000 caractères"
        }
        }
    },
    
    // Sujet (optionnel, pour le premier message d'une conversation)
    subject: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    
    // Statut du message
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_read'
    },
    
    readAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'read_at'
    },
    
    // Type de message (pour filtrer par contexte)
    messageType: {
        type: DataTypes.ENUM('general', 'service', 'offre', 'candidature'),
        defaultValue: 'general',
        field: 'message_type',
        comment: "Type de contexte du message"
    },
    
    // Référence optionnelle (ID du service/offre concerné)
    referenceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'reference_id',
        comment: "ID de référence (service_id, offre_id, etc.)"
    },
    
    // Pour les réponses (threading)
    replyToId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: 'messages',
        key: 'id'
        },
        onDelete: 'SET NULL',
        field: 'reply_to_id',
        comment: "ID du message auquel on répond"
    }
    }, {
    tableName: "messages",
    timestamps: true,
    underscored: true,
    indexes: [
        {
        fields: ['sender_id']
        },
        {
        fields: ['receiver_id']
        },
        {
        fields: ['is_read']
        },
        {
        fields: ['created_at']
        },
        {
        // Index composite pour les conversations
        fields: ['sender_id', 'receiver_id']
        }
    ]
    });

    // Relations
    Users.hasMany(Message, {
    foreignKey: 'senderId',
    as: 'sentMessages'
    });

    Users.hasMany(Message, {
    foreignKey: 'receiverId',
    as: 'receivedMessages'
    });

    Message.belongsTo(Users, {
    foreignKey: 'senderId',
    as: 'sender'
    });

    Message.belongsTo(Users, {
    foreignKey: 'receiverId',
    as: 'receiver'
    });

    // Relations avec les profils
    Message.belongsTo(Profile, {
    foreignKey: 'senderId',
    targetKey: 'userId',
    as: 'senderProfile'
    });

    Message.belongsTo(Profile, {
    foreignKey: 'receiverId',
    targetKey: 'userId',
    as: 'receiverProfile'
    });

    // Auto-référence pour les réponses
    Message.belongsTo(Message, {
    foreignKey: 'replyToId',
    as: 'replyTo'
    });

    Message.hasMany(Message, {
    foreignKey: 'replyToId',
    as: 'replies'
    });

    export default Message;