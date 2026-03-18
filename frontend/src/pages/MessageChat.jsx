import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

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
  const userId = currentUser?.id;

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    loadMessages();
    loadOtherUserProfile();
    markMessagesAsRead();

    // Recharger les messages toutes les 5 secondes
    const interval = setInterval(() => {
      loadMessages(true);
      markMessagesAsRead();
    }, 5000);

    return () => clearInterval(interval);
  }, [otherUserId, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadOtherUserProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", otherUserId)
      .single();

    if (data) {
      setOtherUser({
        id: data.id,
        email: data.email,
        role: data.role,
        firstName: data.first_name,
        lastName: data.last_name,
      });
    }
  };

  const markMessagesAsRead = async () => {
    await supabase
      .from("messages")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("sender_id", otherUserId)
      .eq("receiver_id", userId)
      .eq("is_read", false);
  };

  const loadMessages = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const { data, error: sbError } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
        )
        .order("created_at", { ascending: true });

      if (sbError) {
        if (!silent) setError("Impossible de charger les messages");
        return;
      }

      setMessages(data || []);
    } catch (err) {
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
      // Insert the message
      const { error: insertError } = await supabase
        .from("messages")
        .insert({
          sender_id: userId,
          receiver_id: otherUserId,
          content: newMessage.trim(),
        })
        .select()
        .single();

      if (insertError) {
        setError("Erreur lors de l'envoi du message");
        return;
      }

      // Upsert the conversation
      await upsertConversation(newMessage.trim());

      setNewMessage("");
      await loadMessages(true);
    } catch (err) {
      setError("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  const upsertConversation = async (content) => {
    // Determine consistent user1/user2 ordering (alphabetical by UUID)
    const [u1, u2] = [userId, otherUserId].sort();
    const isUser1 = userId === u1;

    // Try to find existing conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .eq("user1_id", u1)
      .eq("user2_id", u2)
      .single();

    const now = new Date().toISOString();

    if (existing) {
      // Update existing conversation
      const updateData = {
        last_message_content: content,
        last_message_at: now,
        last_message_sender_id: userId,
        updated_at: now,
      };

      // Increment unread count for the other user
      if (isUser1) {
        updateData.unread_count_user2 = (existing.unread_count_user2 || 0) + 1;
      } else {
        updateData.unread_count_user1 = (existing.unread_count_user1 || 0) + 1;
      }

      await supabase
        .from("conversations")
        .update(updateData)
        .eq("id", existing.id);
    } else {
      // Create new conversation
      const insertData = {
        user1_id: u1,
        user2_id: u2,
        last_message_content: content,
        last_message_at: now,
        last_message_sender_id: userId,
        unread_count_user1: isUser1 ? 0 : 1,
        unread_count_user2: isUser1 ? 1 : 0,
      };

      await supabase.from("conversations").insert(insertData);
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

      {/* En-tete */}
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
            const isMine = message.sender_id === userId;

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
                    {formatTime(message.created_at)}
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
