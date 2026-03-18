    import Message from "../models/Message.js";
    import Conversation from "../models/Conversation.js";
    import Users from "../models/Users.js";
    import Profile from "../models/Profile.js";
    import { Op } from "sequelize";
    import sequelize from "../config/db.js";

    /* ================= ENVOYER UN MESSAGE ================= */
    export const sendMessage = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const senderId = req.user.id;
        const { receiverId, content, subject, messageType, referenceId } = req.body;

        // Vérifier que le destinataire existe
        const receiver = await Users.findByPk(receiverId);
        if (!receiver) {
        await transaction.rollback();
        return res.status(404).json({
            success: false,
            message: "Destinataire non trouvé"
        });
        }

        // Vérifier qu'on n'envoie pas à soi-même
        if (senderId === parseInt(receiverId)) {
        await transaction.rollback();
        return res.status(400).json({
            success: false,
            message: "Vous ne pouvez pas vous envoyer un message à vous-même"
        });
        }

        // Créer le message
        const message = await Message.create({
        senderId,
        receiverId,
        content,
        subject,
        messageType: messageType || 'general',
        referenceId
        }, { transaction });

        // Créer ou mettre à jour la conversation
        const [user1Id, user2Id] = senderId < receiverId 
        ? [senderId, receiverId] 
        : [receiverId, senderId];

        const [conversation, created] = await Conversation.findOrCreate({
        where: { user1Id, user2Id },
        defaults: {
            user1Id,
            user2Id,
            lastMessageContent: content.substring(0, 100),
            lastMessageAt: new Date(),
            lastMessageSenderId: senderId,
            unreadCountUser1: senderId === user1Id ? 0 : 1,
            unreadCountUser2: senderId === user2Id ? 0 : 1
        },
        transaction
        });

        if (!created) {
        // Mettre à jour la conversation existante
        const updates = {
            lastMessageContent: content.substring(0, 100),
            lastMessageAt: new Date(),
            lastMessageSenderId: senderId
        };

        // Incrémenter le compteur de non-lus pour le destinataire
        if (senderId === user1Id) {
            updates.unreadCountUser2 = sequelize.literal('unread_count_user2 + 1');
        } else {
            updates.unreadCountUser1 = sequelize.literal('unread_count_user1 + 1');
        }

        await conversation.update(updates, { transaction });
        }

        await transaction.commit();

        // Recharger avec les relations
        const createdMessage = await Message.findByPk(message.id, {
        include: [
            {
            model: Users,
            as: 'sender',
            attributes: ['id', 'email', 'role']
            },
            {
            model: Profile,
            as: 'senderProfile',
            attributes: ['firstName', 'lastName', 'avatar']
            },
            {
            model: Users,
            as: 'receiver',
            attributes: ['id', 'email', 'role']
            },
            {
            model: Profile,
            as: 'receiverProfile',
            attributes: ['firstName', 'lastName', 'avatar']
            }
        ]
        });

        res.status(201).json({
        success: true,
        message: "Message envoyé avec succès",
        data: createdMessage
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Send message error:", error);

        if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
            success: false,
            message: error.errors[0].message
        });
        }

        res.status(500).json({
        success: false,
        message: "Erreur lors de l'envoi du message"
        });
    }
    };

    /* ================= RÉCUPÉRER LES CONVERSATIONS ================= */
    export const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        const conversations = await Conversation.findAll({
        where: {
            [Op.or]: [
            { user1Id: userId },
            { user2Id: userId }
            ]
        },
        include: [
            {
            model: Users,
            as: 'user1',
            attributes: ['id', 'email', 'role']
            },
            {
            model: Profile,
            as: 'user1Profile',
            attributes: ['firstName', 'lastName', 'avatar']
            },
            {
            model: Users,
            as: 'user2',
            attributes: ['id', 'email', 'role']
            },
            {
            model: Profile,
            as: 'user2Profile',
            attributes: ['firstName', 'lastName', 'avatar']
            }
        ],
        order: [['lastMessageAt', 'DESC']]
        });

        // Formatter les conversations pour l'affichage
        const formattedConversations = conversations.map(conv => {
        const isUser1 = conv.user1Id === userId;
        const otherUser = isUser1 ? conv.user2 : conv.user1;
        const otherProfile = isUser1 ? conv.user2Profile : conv.user1Profile;
        const unreadCount = isUser1 ? conv.unreadCountUser1 : conv.unreadCountUser2;

        return {
            id: conv.id,
            otherUser: {
            id: otherUser.id,
            email: otherUser.email,
            role: otherUser.role,
            firstName: otherProfile?.firstName,
            lastName: otherProfile?.lastName,
            avatar: otherProfile?.avatar
            },
            lastMessage: {
            content: conv.lastMessageContent,
            sentAt: conv.lastMessageAt,
            sentByMe: conv.lastMessageSenderId === userId
            },
            unreadCount,
            updatedAt: conv.updatedAt
        };
        });

        res.json({
        success: true,
        count: formattedConversations.length,
        data: formattedConversations
        });

    } catch (error) {
        console.error("Get conversations error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des conversations"
        });
    }
    };

    /* ================= RÉCUPÉRER LES MESSAGES D'UNE CONVERSATION ================= */
    export const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { otherUserId } = req.params;

        // Vérifier que l'autre utilisateur existe
        const otherUser = await Users.findByPk(otherUserId);
        if (!otherUser) {
        return res.status(404).json({
            success: false,
            message: "Utilisateur non trouvé"
        });
        }

        // Récupérer tous les messages entre les deux utilisateurs
        const messages = await Message.findAll({
        where: {
            [Op.or]: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId }
            ]
        },
        include: [
            {
            model: Users,
            as: 'sender',
            attributes: ['id', 'email', 'role']
            },
            {
            model: Profile,
            as: 'senderProfile',
            attributes: ['firstName', 'lastName', 'avatar']
            }
        ],
        order: [['createdAt', 'ASC']]
        });

        // Marquer les messages reçus comme lus
        await Message.update(
        { 
            isRead: true,
            readAt: new Date()
        },
        {
            where: {
            senderId: otherUserId,
            receiverId: userId,
            isRead: false
            }
        }
        );

        // Réinitialiser le compteur de non-lus dans la conversation
        const [user1Id, user2Id] = userId < otherUserId 
        ? [userId, otherUserId] 
        : [otherUserId, userId];

        await Conversation.update(
        userId === user1Id 
            ? { unreadCountUser1: 0 }
            : { unreadCountUser2: 0 },
        {
            where: { user1Id, user2Id }
        }
        );

        res.json({
        success: true,
        count: messages.length,
        data: messages
        });

    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des messages"
        });
    }
    };

    /* ================= COMPTER LES MESSAGES NON LUS ================= */
    export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const unreadCount = await Message.count({
        where: {
            receiverId: userId,
            isRead: false
        }
        });

        res.json({
        success: true,
        data: { unreadCount }
        });

    } catch (error) {
        console.error("Get unread count error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors du comptage des messages non lus"
        });
    }
    };

    /* ================= MARQUER UNE CONVERSATION COMME LUE ================= */
    export const markConversationAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { otherUserId } = req.params;

        await Message.update(
        { 
            isRead: true,
            readAt: new Date()
        },
        {
            where: {
            senderId: otherUserId,
            receiverId: userId,
            isRead: false
            }
        }
        );

        // Réinitialiser le compteur dans la conversation
        const [user1Id, user2Id] = userId < otherUserId 
        ? [userId, otherUserId] 
        : [otherUserId, userId];

        await Conversation.update(
        userId === user1Id 
            ? { unreadCountUser1: 0 }
            : { unreadCountUser2: 0 },
        {
            where: { user1Id, user2Id }
        }
        );

        res.json({
        success: true,
        message: "Conversation marquée comme lue"
        });

    } catch (error) {
        console.error("Mark as read error:", error);
        res.status(500).json({
        success: false,
        message: "Erreur lors du marquage"
        });
    }
    };