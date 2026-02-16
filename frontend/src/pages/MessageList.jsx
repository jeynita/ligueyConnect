    import { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import api from "../services/api";

    export default function MessageList() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
        navigate("/login");
        return;
        }

        loadConversations();
    }, [navigate]);

    const loadConversations = async () => {
        try {
        setLoading(true);
        const response = await api.get("/messages/conversations");
        setConversations(response.data.data);
        } catch (err) {
        console.error("Erreur chargement conversations:", err);
        setError("Impossible de charger les conversations");
        } finally {
        setLoading(false);
        }
    };

    const getDisplayName = (otherUser) => {
        if (otherUser.firstName && otherUser.lastName) {
        return `${otherUser.firstName} ${otherUser.lastName}`;
        }
        return otherUser.email;
    };

    const getRoleEmoji = (role) => {
        const emojis = {
        client: "🏠",
        demandeur: "🔍",
        prestataire: "🔧",
        recruteur: "💼",
        admin: "👑"
        };
        return emojis[role] || "👤";
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now - d);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
        return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
        return "Hier";
        } else if (diffDays < 7) {
        return d.toLocaleDateString('fr-FR', { weekday: 'short' });
        } else {
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        }
    };

    if (loading) {
        return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            Chargement des conversations...
        </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#F0F0E8", padding: "20px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            
            {/* En-tête */}
            <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
            }}>
            <div>
                <h1 style={{ margin: 0, color: "#671E30", fontSize: "24px" }}>
                💬 Messages
                </h1>
                <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
                {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
                </p>
            </div>
            <button
                onClick={() => navigate("/dashboard")}
                style={{
                padding: "10px 20px",
                background: "#CFA65B",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold"
                }}
            >
                Retour
            </button>
            </div>

            {/* Message d'erreur */}
            {error && (
            <div style={{
                background: "#fee",
                border: "1px solid #fcc",
                padding: "15px",
                borderRadius: "4px",
                marginBottom: "20px",
                color: "#c33"
            }}>
                {error}
            </div>
            )}

            {/* Liste des conversations */}
            {conversations.length === 0 ? (
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <p style={{ fontSize: "48px", margin: "0 0 20px 0" }}>💬</p>
                <h3 style={{ margin: "0 0 10px 0", color: "#671E30" }}>
                Aucune conversation
                </h3>
                <p style={{ margin: 0, color: "#666" }}>
                Vos conversations apparaîtront ici
                </p>
            </div>
            ) : (
            <div style={{
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                overflow: "hidden"
            }}>
                {conversations.map((conv, index) => (
                <div
                    key={conv.id}
                    onClick={() => navigate(`/messages/${conv.otherUser.id}`)}
                    style={{
                    padding: "15px 20px",
                    borderBottom: index < conversations.length - 1 ? "1px solid #eee" : "none",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#F0F0E8"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                >
                    {/* Avatar */}
                    <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "#671E30",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    flexShrink: 0
                    }}>
                    {getRoleEmoji(conv.otherUser.role)}
                    </div>

                    {/* Contenu */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                        <h3 style={{ 
                        margin: 0, 
                        color: "#671E30", 
                        fontSize: "16px",
                        fontWeight: conv.unreadCount > 0 ? "bold" : "normal"
                        }}>
                        {getDisplayName(conv.otherUser)}
                        </h3>
                        <span style={{ fontSize: "12px", color: "#999" }}>
                        {formatDate(conv.lastMessage.sentAt)}
                        </span>
                    </div>
                    
                    <p style={{ 
                        margin: 0, 
                        color: "#666", 
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: conv.unreadCount > 0 ? "bold" : "normal"
                    }}>
                        {conv.lastMessage.sentByMe && "Vous : "}
                        {conv.lastMessage.content}
                    </p>
                    </div>

                    {/* Badge non lus */}
                    {conv.unreadCount > 0 && (
                    <div style={{
                        background: "#671E30",
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        flexShrink: 0
                    }}>
                        {conv.unreadCount}
                    </div>
                    )}
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    );
    }