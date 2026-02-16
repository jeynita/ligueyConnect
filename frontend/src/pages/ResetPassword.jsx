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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Pré-remplir l'email s'il vient de la page précédente
        if (location.state?.email) {
        setFormData(prev => ({ ...prev, email: location.state.email }));
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
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
        
        setTimeout(() => {
            navigate("/login");
        }, 3000);

        } catch (err) {
        console.error("Reset password error:", err);
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
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
            maxWidth: "450px"
            }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>✅</div>
            <h2 style={{ margin: "0 0 10px 0", color: "#671E30" }}>
                Mot de passe réinitialisé !
            </h2>
            <p style={{ margin: "0 0 20px 0", color: "#666" }}>
                Votre mot de passe a été modifié avec succès.
            </p>
            <p style={{ margin: 0, color: "#999", fontSize: "14px" }}>
                Redirection vers la connexion...
            </p>
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
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "450px"
        }}>
            <h1 style={{ 
            margin: "0 0 10px 0", 
            color: "#671E30",
            fontSize: "28px",
            textAlign: "center"
            }}>
            Nouveau mot de passe
            </h1>
            
            <p style={{ 
            margin: "0 0 30px 0", 
            color: "#666",
            textAlign: "center",
            fontSize: "14px"
            }}>
            Entrez le code reçu et votre nouveau mot de passe
            </p>

            {error && (
            <div style={{
                background: "#fee",
                border: "1px solid #fcc",
                padding: "12px",
                borderRadius: "4px",
                marginBottom: "20px",
                color: "#c33",
                fontSize: "14px"
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
                fontWeight: "500"
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
                    fontSize: "14px"
                }}
                />
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label style={{ 
                display: "block", 
                marginBottom: "8px",
                color: "#333",
                fontWeight: "500"
                }}>
                Code de réinitialisation (6 chiffres)
                </label>
                <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="123456"
                required
                maxLength="6"
                pattern="[0-9]{6}"
                style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "18px",
                    letterSpacing: "3px",
                    textAlign: "center",
                    fontWeight: "bold"
                }}
                />
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label style={{ 
                display: "block", 
                marginBottom: "8px",
                color: "#333",
                fontWeight: "500"
                }}>
                Nouveau mot de passe
                </label>
                <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Minimum 8 caractères"
                required
                style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px"
                }}
                />
            </div>

            <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                display: "block", 
                marginBottom: "8px",
                color: "#333",
                fontWeight: "500"
                }}>
                Confirmer le mot de passe
                </label>
                <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Retapez le mot de passe"
                required
                style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px"
                }}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                width: "100%",
                padding: "14px",
                background: "#671E30",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1
                }}
            >
                {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
            </button>
            </form>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
                onClick={() => navigate("/login")}
                style={{
                background: "none",
                border: "none",
                color: "#671E30",
                cursor: "pointer",
                fontSize: "14px",
                textDecoration: "underline"
                }}
            >
                Retour à la connexion
            </button>
            </div>
        </div>
        </div>
    );
    }