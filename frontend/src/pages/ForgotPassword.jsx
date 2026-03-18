import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Veuillez entrer votre adresse email");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess("Un email de reinitialisation a ete envoye a votre adresse. Verifiez votre boite mail.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Une erreur est survenue. Veuillez reessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #671E30 0%, #CFA65B 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        maxWidth: "450px",
        width: "100%",
        padding: "40px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{
            color: "#671E30",
            fontSize: "28px",
            fontWeight: "bold",
            margin: "0 0 10px 0"
          }}>
            Mot de passe oublie ?
          </h1>
          <p style={{
            color: "#666",
            fontSize: "14px",
            margin: 0
          }}>
            Entrez votre email pour recevoir un lien de reinitialisation
          </p>
        </div>

        {error && (
          <div style={{
            background: "#fee",
            border: "1px solid #fcc",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            color: "#c33",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: "#efe",
            border: "1px solid #cfc",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            color: "#3c3",
            fontSize: "14px"
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#333",
              fontSize: "14px"
            }}>
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@exemple.com"
              disabled={loading || success}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
                boxSizing: "border-box",
                outline: "none"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            style={{
              width: "100%",
              padding: "14px",
              background: loading || success ? "#ccc" : "#671E30",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading || success ? "not-allowed" : "pointer",
              marginBottom: "15px"
            }}
          >
            {loading ? "Envoi en cours..." : success ? "Email envoye" : "Envoyer le lien"}
          </button>

          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: "#671E30",
                fontSize: "14px",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Retour a la connexion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
