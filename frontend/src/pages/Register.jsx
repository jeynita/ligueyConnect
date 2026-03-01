import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "client"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const roles = [
    { value: "client", label: "🏠 Client", description: "Je cherche des prestataires" },
    { value: "prestataire", label: "🔧 Prestataire", description: "Je propose des services" },
    { value: "demandeur", label: "🔍 Demandeur d'emploi", description: "Je cherche un emploi" },
    { value: "recruteur", label: "💼 Recruteur", description: "Je publie des offres d'emploi" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setLoading(true);

    try {
      const data = await register(formData.email, formData.password, formData.role);
      if (data && data.token) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
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
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "500px"
      }}>

        {/* Logo / Titre */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{
            margin: "0 0 5px 0",
            color: "#671E30",
            fontSize: "32px",
            fontWeight: "bold"
          }}>
            🇸🇳 Liguey Connect
          </h1>
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
            Créez votre compte gratuitement
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

          {/* Choix du rôle */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "10px",
              color: "#333",
              fontWeight: "500",
              fontSize: "14px"
            }}>
              Je suis...
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {roles.map(role => (
                <div
                  key={role.value}
                  onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                  style={{
                    padding: "12px",
                    border: `2px solid ${formData.role === role.value ? "#671E30" : "#ddd"}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: formData.role === role.value ? "#FFF5F5" : "white",
                    transition: "all 0.2s"
                  }}
                >
                  <p style={{
                    margin: "0 0 3px 0",
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: formData.role === role.value ? "#671E30" : "#333"
                  }}>
                    {role.label}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: "11px",
                    color: "#666"
                  }}>
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

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

          {/* Mot de passe */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "500",
              fontSize: "14px"
            }}>
              Mot de passe
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
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
                onClick={() => setShowPassword(!showPassword)}
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
                title={showPassword ? "Cacher le mot de passe" : "Voir le mot de passe"}
              >
                {showPassword ? "🙈" : "👁️"}
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
                placeholder="Retapez votre mot de passe"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  paddingRight: "50px",
                  border: `1px solid ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "#c33"
                      : formData.confirmPassword && formData.password === formData.confirmPassword
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
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#c33" }}>
                ❌ Les mots de passe ne correspondent pas
              </p>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#3c3" }}>
                ✅ Les mots de passe correspondent
              </p>
            )}
          </div>

          {/* Bouton inscription */}
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
              marginBottom: "15px",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => { if (!loading) e.target.style.background = "#8B2940" }}
            onMouseLeave={(e) => { if (!loading) e.target.style.background = "#671E30" }}
          >
            {loading ? "⏳ Création du compte..." : "Créer mon compte"}
          </button>
        </form>

        {/* Lien connexion */}
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
            Déjà un compte ?{" "}
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: "#671E30",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
                textDecoration: "underline",
                padding: "0"
              }}
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
