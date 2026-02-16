    import { useState, useEffect, useRef } from "react";
    import { useNavigate, useParams } from "react-router-dom";
    import api from "../services/api";

    export default function MessageChat() {
    const [messages, setMessages] = useState([]);
    const [otherUser, setOtherUser] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { otherUserId } = useParams();

    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
        navigate("/login");
        return;
        }

        loadMessages();
        
        // Recharger les messages toutes les 5 secondes
        const interval = setInterval(() => {
        loadMessages(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [otherUserId, navigate]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async (silent = false) => {
        try {
        if (!silent) setLoading(true);
        
        const response = await api.get(`/messages/${otherUserId}`);
        setMessages(response.data.data);
        
        // Récupérer les infos de l'autre utilisateur depuis le premier message
        if (response.data.data.length > 0) {
            const firstMessage = response.data.data[0];
            const otherUserInfo = firstMessage.senderId === currentUser.id 
            ? { 
                id: firstMessage.receiverId,
                email: firstMessage.receiver?.email,
                role: firstMessage.receiver?.role,
                firstName: firstMessage.receiverProfile?.firstName,
                lastName: firstMessage.receiverProfile?.lastName
                }
            : {
                id: firstMessage.senderId,
                email: firstMessage.sender?.email,
                role: firstMessage.sender?.role,
                firstName: firstMessage.senderProfile?.firstName,
                lastName: firstMessage.senderProfile?.lastName
                };
            setOtherUser(otherUserInfo);
        }
        } catch (err) {
        console.error("Erreur chargement messages:", err);
        if (!silent) setError("Impossible de charger les messages");
        } finally {
        if (!silent) setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim()) return;

        setSending(true);
        setError("");

        try {
        await api.post("/messages", {
            receiverId: parseInt(otherUserId),
            content: newMessage.trim()
        });

        setNewMessage("");
        await loadMessages(true);
        } catch (err) {
        console.error("Erreur envoi message:", err);
        setError("Erreur lors de l'envoi du message");
        } finally {
        setSending(false);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
        });
    };

    const getDisplayName = (user) => {
        if (user?.firstName && user?.lastName) {
        return `${user.firstName} ${user.lastName}`;
        }
        return user?.email || "Utilisateur";
    };

    if (loading) {
        return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            Chargement de la conversation...
        </div>
        );
    }

    return (
        <div style={{ 
        height: "100vh", 
        display: "flex", 
        flexDirection: "column",
        background: "#F0F0E8"
        }}>
        
        {/* En-tête */}
        <div style={{
            background: "white",
            padding: "15px 20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
                onClick={() => navigate("/messages")}
                style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                padding: "5px"
                }}
            >
                ←
            </button>
            <div>
                <h2 style={{ margin: 0, color: "#671E30", fontSize: "18px" }}>
                {getDisplayName(otherUser)}
                </h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#666" }}>
                {otherUser?.role}
                </p>
            </div>
            </div>
        </div>

        {/* Zone de messages */}
        <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        }}>
            {messages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                Aucun message. Commencez la conversation !
            </div>
            ) : (
            messages.map((message) => {
                const isMine = message.senderId === currentUser.id;
                
                return (
                <div
                    key={message.id}
                    style={{
                    display: "flex",
                    justifyContent: isMine ? "flex-end" : "flex-start",
                    marginBottom: "5px"
                    }}
                >
                    <div style={{
                    maxWidth: "70%",
                    padding: "10px 15px",
                    borderRadius: "12px",
                    background: isMine ? "#671E30" : "white",
                    color: isMine ? "white" : "#333",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                    }}>
                    <p style={{ margin: "0 0 5px 0", lineHeight: "1.4" }}>
                        {message.content}
                    </p>
                    <p style={{ 
                        margin: 0, 
                        fontSize: "11px", 
                        opacity: 0.7,
                        textAlign: "right"
                    }}>
                        {formatTime(message.createdAt)}
                    </p>
                    </div>
                </div>
                );
            })
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Formulaire d'envoi */}
        <div style={{
            background: "white",
            padding: "15px 20px",
            boxShadow: "0 -2px 4px rgba(0,0,0,0.1)"
        }}>
            {error && (
            <div style={{
                background: "#fee",
                border: "1px solid #fcc",
                padding: "10px",
                borderRadius: "4px",
                marginBottom: "10px",
                color: "#c33",
                fontSize: "14px"
            }}>
                {error}
            </div>
            )}
            
            <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "10px" }}>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                disabled={sending}
                style={{
                flex: 1,
                padding: "12px 15px",
                border: "1px solid #ccc",
                borderRadius: "24px",
                fontSize: "14px",
                outline: "none"
                }}
            />
            <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                style={{
                padding: "12px 24px",
                background: "#671E30",
                color: "white",
                border: "none",
                borderRadius: "24px",
                cursor: sending || !newMessage.trim() ? "not-allowed" : "pointer",
                fontWeight: "bold",
                opacity: sending || !newMessage.trim() ? 0.5 : 1
                }}
            >
                {sending ? "..." : "Envoyer"}
            </button>
            </form>
        </div>
        </div>
    );
    }