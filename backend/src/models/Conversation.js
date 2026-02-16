    import { DataTypes } from "sequelize";
    import sequelize from "../config/db.js";
    import Users from "./Users.js";
    import Profile from "./Profile.js";

    const Conversation = sequelize.define("Conversation", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    user1Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'users',
        key: 'id'
        },
        onDelete: 'CASCADE',
        field: 'user1_id'
    },
    
    user2Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'users',
        key: 'id'
        },
        onDelete: 'CASCADE',
        field: 'user2_id'
    },
    
    // Dernier message (pour affichage rapide)
    lastMessageContent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'last_message_content'
    },
    
    lastMessageAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_message_at'
    },
    
    lastMessageSenderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'last_message_sender_id'
    },
    
    // Compteur de messages non lus par utilisateur
    unreadCountUser1: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'unread_count_user1'
    },
    
    unreadCountUser2: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'unread_count_user2'
    }
    }, {
    tableName: "conversations",
    timestamps: true,
    underscored: true,
    indexes: [
        {
        // Index unique pour éviter les doublons de conversations
        unique: true,
        fields: ['user1_id', 'user2_id']
        },
        {
        fields: ['last_message_at']
        }
    ]
    });

    // Relations
    Users.hasMany(Conversation, {
    foreignKey: 'user1Id',
    as: 'conversationsAsUser1'
    });

    Users.hasMany(Conversation, {
    foreignKey: 'user2Id',
    as: 'conversationsAsUser2'
    });

    Conversation.belongsTo(Users, {
    foreignKey: 'user1Id',
    as: 'user1'
    });

    Conversation.belongsTo(Users, {
    foreignKey: 'user2Id',
    as: 'user2'
    });

    Conversation.belongsTo(Profile, {
    foreignKey: 'user1Id',
    targetKey: 'userId',
    as: 'user1Profile'
    });

    Conversation.belongsTo(Profile, {
    foreignKey: 'user2Id',
    targetKey: 'userId',
    as: 'user2Profile'
    });

    export default Conversation;