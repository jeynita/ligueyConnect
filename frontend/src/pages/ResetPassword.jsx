import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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
      setError("Le mot de passe doit contenir au moins 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(formData.newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Erreur lors de la reinitialisation");
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
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>OK</div>
          <h2 style={{ margin: "0 0 10px 0", color: "#671E30" }}>
            Mot de passe reinitialise !
          </h2>
          <p style={{ margin: "0 0 20px 0", color: "#666" }}>
            Votre mot de passe a ete modifie avec succes.
          </p>
          <p style={{ margin: 0, color: "#999", fontSize: "14px" }}>
            Redirection vers la connexion dans 3 secondes...
          </p>
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

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{
            margin: "0 0 5px 0",
            color: "#671E30",
            fontSize: "28px",
            fontWeight: "bold"
          }}>
            Nouveau mot de passe
          </h1>
          <p style={{
            margin: 0,
            color: "#666",
            fontSize: "14px"
          }}>
            Choisissez votre nouveau mot de passe
          </p>
        </div>

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
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

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
                placeholder="Minimum 8 caracteres"
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
              >
                {showNewPassword ? "x" : "o"}
              </button>
            </div>
          </div>

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
              >
                {showConfirmPassword ? "x" : "o"}
              </button>
            </div>
          </div>

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
              marginBottom: "15px"
            }}
          >
            {loading ? "Reinitialisation..." : "Reinitialiser le mot de passe"}
          </button>
        </form>

        <div style={{ textAlign: "center" }}>
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
            Retour a la connexion
          </button>
        </div>
      </div>
    </div>
  );
}
