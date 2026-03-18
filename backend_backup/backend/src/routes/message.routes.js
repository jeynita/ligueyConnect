    import express from "express";
    import {
    sendMessage,
    getConversations,
    getMessages,
    getUnreadCount,
    markConversationAsRead
    } from "../controllers/message.controller.js";
    import { verifyToken } from "../middlewares/auth.middleware.js";
    import { body } from "express-validator";
    import { validateRequest } from "../middlewares/validation.middleware.js";

    const router = express.Router();

    /* ================= VALIDATION RULES ================= */

    const sendMessageValidation = [
    body("receiverId")
        .notEmpty().withMessage("Le destinataire est requis")
        .isInt().withMessage("ID destinataire invalide"),
    
    body("content")
        .trim()
        .notEmpty().withMessage("Le message ne peut pas être vide")
        .isLength({ min: 1, max: 2000 }).withMessage("Le message doit contenir entre 1 et 2000 caractères"),
    
    body("subject")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage("Le sujet ne peut pas dépasser 200 caractères"),
    
    body("messageType")
        .optional()
        .isIn(['general', 'service', 'offre', 'candidature']).withMessage("Type de message invalide")
    ];

    /* ================= ROUTES ================= */

    // POST /api/messages - Envoyer un message (authentifié)
    router.post(
    "/",
    verifyToken,
    sendMessageValidation,
    validateRequest,
    sendMessage
    );

    // GET /api/messages/conversations - Liste des conversations (authentifié)
    router.get(
    "/conversations",
    verifyToken,
    getConversations
    );

    // GET /api/messages/unread-count - Nombre de messages non lus (authentifié)
    router.get(
    "/unread-count",
    verifyToken,
    getUnreadCount
    );

    // GET /api/messages/:otherUserId - Messages avec un utilisateur (authentifié)
    router.get(
    "/:otherUserId",
    verifyToken,
    getMessages
    );

    // PUT /api/messages/:otherUserId/mark-read - Marquer comme lu (authentifié)
    router.put(
    "/:otherUserId/mark-read",
    verifyToken,
    markConversationAsRead
    );

    export default router;