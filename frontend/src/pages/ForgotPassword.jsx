    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import api from "../services/api";

    export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
        const response = await api.post("/auth/forgot-password", { email });
        
        setSuccess(response.data.message);
        
        // Afficher le code en développement (à retirer en production)
        if (response.data.devCode) {
            setCode(response.data.devCode);
        }

        } catch (err) {
        console.error("Forgot password error:", err);
        setError(err.response?.data?.message || "Erreur lors de la demande");
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
            Mot de passe oublié
            </h1>
            
            <p style={{ 
            margin: "0 0 30px 0", 
            color: "#666",
            textAlign: "center",
            fontSize: "14px"
            }}>
            Entrez votre email pour recevoir un code de réinitialisation
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

            {success && (
            <div style={{
                background: "#efe",
                border: "1px solid #cfc",
                padding: "12px",
                borderRadius: "4px",
                marginBottom: "20px",
                color: "#3c3",
                fontSize: "14px"
            }}>
                {success}
                
                {code && (
                <div style={{ 
                    marginTop: "15px", 
                    padding: "15px",
                    background: "#fff",
                    border: "2px dashed #3c3",
                    borderRadius: "4px"
                }}>
                    <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#333" }}>
                    🔐 Code de réinitialisation  :
                    </p>
                    <p style={{ 
                    margin: "0", 
                    fontSize: "24px", 
                    fontWeight: "bold",
                    color: "#671E30",
                    textAlign: "center",
                    letterSpacing: "3px"
                    }}>
                    {code}
                    </p>
                    <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#666" }}>
                    Utilisez ce code sur la page de réinitialisation
                    </p>
                </div>
                )}
            </div>
            )}

            <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                {loading ? "Envoi en cours..." : "Demander un code"}
            </button>
            </form>

            <div style={{ 
            marginTop: "20px", 
            textAlign: "center",
            display: "flex",
            gap: "15px",
            justifyContent: "center"
            }}>
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
            
            {success && (
                <button
                onClick={() => navigate("/reset-password", { state: { email } })}
                style={{
                    background: "none",
                    border: "none",
                    color: "#CFA65B",
                    cursor: "pointer",
                    fontSize: "14px",
                    textDecoration: "underline",
                    fontWeight: "bold"
                }}
                >
                Réinitialiser maintenant →
                </button>
            )}
            </div>
        </div>
        </div>
    );
    }