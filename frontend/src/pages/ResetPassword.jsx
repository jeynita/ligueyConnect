import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword
      });

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);

    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          textAlign: "center",
          maxWidth: "450px",
          width: "100%"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>✅</div>
          <h2 style={{ margin: "0 0 10px 0", color: "#671E30" }}>
            Mot de passe réinitialisé !
          </h2>
          <p style={{ margin: "0 0 20px 0", color: "#666" }}>
            Votre mot de passe a été modifié avec succès.
          </p>
          <div style={{
            background: "#F0F0E8",
            padding: "10px",
            borderRadius: "4px"
          }}>
            <p style={{ margin: 0, color: "#999", fontSize: "14px" }}>
              ⏳ Redirection vers la connexion dans 3 secondes...
            </p>
          </div>
          <button
            onClick={() => navigate("/login")}
            style={{
              marginTop: "20px",
              padding: "12px 30px",
              background: "#671E30",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px"
            }}
          >
            Se connecter maintenant
          </button>
        </div>
      </div>
    );
  }

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
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "450px"
      }}>

        {/* Titre */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{
            margin: "0 0 5px 0",
            color: "#671E30",
            fontSize: "28px",
            fontWeight: "bold"
          }}>
            🔐 Nouveau mot de passe
          </h1>
          <p style={{
            margin: 0,
            color: "#666",
            fontSize: "14px"
          }}>
            Entrez le code reçu et votre nouveau mot de passe
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div style={{
            background: "#fee",
            border: "1px solid #fcc",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "20px",
            color: "#c33",
            fontSize: "14px",
            textAlign: "center"
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "500",
              fontSize: "14px"
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votreemail@example.com"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#671E30"}
              onBlur={(e) => e.target.style.borderColor = "#ddd"}
            />
          </div>

          {/* Code de réinitialisation */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "500",
              fontSize: "14px"
            }}>
              Code de réinitialisation (6 chiffres)
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Ex: 123456"
              required
              maxLength="6"
              pattern="[0-9]{6}"
              style={{
                width: "100%",
                padding: "14px",
                border: "2px solid #ddd",
                borderRadius: "4px",
                fontSize: "24px",
                letterSpacing: "8px",
                textAlign: "center",
                fontWeight: "bold",
                boxSizing: "border-box",
                color: "#671E30"
              }}
              onFocus={(e) => e.target.style.borderColor = "#671E30"}
              onBlur={(e) => e.target.style.borderColor = "#ddd"}
            />
            <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#999", textAlign: "center" }}>
              Code valable pendant 1 heure
            </p>
          </div>

          {/* Nouveau mot de passe */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "500",
              fontSize: "14px"
            }}>
              Nouveau mot de passe
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Minimum 8 caractères"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  paddingRight: "50px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#671E30"}
                onBlur={(e) => e.target.style.borderColor = "#ddd"}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#666",
                  padding: "0",
                  lineHeight: "1"
                }}
                title={showNewPassword ? "Cacher le mot de passe" : "Voir le mot de passe"}
              >
                {showNewPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <p style={{ margin: "5px 0 0 0", fontSize: "11px", color: "#999" }}>
              Doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre
            </p>
          </div>

          {/* Confirmer mot de passe */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "500",
              fontSize: "14px"
            }}>
              Confirmer le mot de passe
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Retapez le mot de passe"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  paddingRight: "50px",
                  border: `1px solid ${
                    formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                      ? "#c33"
                      : formData.confirmPassword && formData.newPassword === formData.confirmPassword
                      ? "#3c3"
                      : "#ddd"
                  }`,
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#666",
                  padding: "0",
                  lineHeight: "1"
                }}
                title={showConfirmPassword ? "Cacher le mot de passe" : "Voir le mot de passe"}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#c33" }}>
                ❌ Les mots de passe ne correspondent pas
              </p>
            )}
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
              <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#3c3" }}>
                ✅ Les mots de passe correspondent
              </p>
            )}
          </div>

          {/* Bouton réinitialiser */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#ccc" : "#671E30",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              marginBottom: "15px"
            }}
            onMouseEnter={(e) => { if (!loading) e.target.style.background = "#8B2940" }}
            onMouseLeave={(e) => { if (!loading) e.target.style.background = "#671E30" }}
          >
            {loading ? "⏳ Réinitialisation..." : "🔐 Réinitialiser le mot de passe"}
          </button>
        </form>

        {/* Liens */}
        <div style={{ textAlign: "center", display: "flex", gap: "20px", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/forgot-password")}
            style={{
              background: "none",
              border: "none",
              color: "#CFA65B",
              cursor: "pointer",
              fontSize: "13px",
              textDecoration: "underline",
              padding: "0"
            }}
          >
            ← Nouveau code
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              color: "#671E30",
              cursor: "pointer",
              fontSize: "13px",
              textDecoration: "underline",
              padding: "0"
            }}
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}
