import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Briefcase, Crown, Hammer, Home, Search, User, MessageSquare } from "lucide-react";
import { Icon } from "../components/Icon";

export default function MessageList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    loadConversations();
  }, [navigate]);

  const loadConversations = async () => {
    try {
      setLoading(true);

      const userData = localStorage.getItem("user");
      if (!userData) return;
      const currentUser = JSON.parse(userData);
      const userId = currentUser.id;

      // Fetch conversations where user is a participant
      const { data: convData, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order("last_message_at", { ascending: false });

      if (convError) {
        setError("Impossible de charger les conversations");
        return;
      }

      if (!convData || convData.length === 0) {
        setConversations([]);
        return;
      }

      // Collect all other user IDs
      const otherUserIds = convData.map((conv) =>
        conv.user1_id === userId ? conv.user2_id : conv.user1_id
      );
      const uniqueIds = [...new Set(otherUserIds)];

      // Batch-fetch profiles for all other users
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", uniqueIds);

      if (profilesError) {
        setError("Impossible de charger les profils");
        return;
      }

      const profileMap = {};
      (profiles || []).forEach((p) => {
        profileMap[p.id] = p;
      });

      // Map conversations to the shape the UI expects
      const mapped = convData.map((conv) => {
        const otherUserId = conv.user1_id === userId ? conv.user2_id : conv.user1_id;
        const profile = profileMap[otherUserId] || {};

        const isUser1 = conv.user1_id === userId;
        const unreadCount = isUser1
          ? conv.unread_count_user1 || 0
          : conv.unread_count_user2 || 0;

        return {
          id: conv.id,
          otherUser: {
            id: otherUserId,
            email: profile.email || "",
            role: profile.role || "",
            firstName: profile.first_name || "",
            lastName: profile.last_name || "",
          },
          lastMessage: {
            content: conv.last_message_content || "",
            sentAt: conv.last_message_at,
            sentByMe: conv.last_message_sender_id === userId,
          },
          unreadCount,
        };
      });

      setConversations(mapped);
    } catch (err) {
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

  const getRoleIcon = (role) => {
    const icons = {
      client: Home,
      demandeur: Search,
      prestataire: Hammer,
      recruteur: Briefcase,
      admin: Crown,
    };
    return icons[role] || User;
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

        {/* En-tete */}
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
              <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                <Icon as={MessageSquare} size={22} color="#671E30" />
                Messages
              </span>
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
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
              <Icon as={MessageSquare} size={46} color="#671E30" />
            </div>
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
                  <Icon as={getRoleIcon(conv.otherUser.role)} size={24} color="white" />
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
