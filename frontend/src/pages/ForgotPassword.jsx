    // import { useState } from "react";
    // import { useNavigate } from "react-router-dom";
    // import api from "../services/api";

    // export default function ForgotPassword() {
    // const [email, setEmail] = useState("");
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState("");
    // const [success, setSuccess] = useState("");
    // const [code, setCode] = useState("");
    // const navigate = useNavigate();

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError("");
    //     setSuccess("");
    //     setLoading(true);

    //     try {
    //     const response = await api.post("/auth/forgot-password", { email });
        
    //     setSuccess(response.data.message);
        
    //     // Afficher le code en développement (à retirer en production)
    //     if (response.data.devCode) {
    //         setCode(response.data.devCode);
    //     }

    //     } catch (err) {
    //     console.error("Forgot password error:", err);
    //     setError(err.response?.data?.message || "Erreur lors de la demande");
    //     } finally {
    //     setLoading(false);
    //     }
    // };

    // return (
    //     <div style={{ 
    //     minHeight: "100vh", 
    //     background: "linear-gradient(135deg, #671E30 0%, #CFA65B 100%)",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     padding: "20px"
    //     }}>
    //     <div style={{
    //         background: "white",
    //         padding: "40px",
    //         borderRadius: "8px",
    //         boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    //         width: "100%",
    //         maxWidth: "450px"
    //     }}>
    //         <h1 style={{ 
    //         margin: "0 0 10px 0", 
    //         color: "#671E30",
    //         fontSize: "28px",
    //         textAlign: "center"
    //         }}>
    //         Mot de passe oublié
    //         </h1>
            
    //         <p style={{ 
    //         margin: "0 0 30px 0", 
    //         color: "#666",
    //         textAlign: "center",
    //         fontSize: "14px"
    //         }}>
    //         Entrez votre email pour recevoir un code de réinitialisation
    //         </p>

    //         {error && (
    //         <div style={{
    //             background: "#fee",
    //             border: "1px solid #fcc",
    //             padding: "12px",
    //             borderRadius: "4px",
    //             marginBottom: "20px",
    //             color: "#c33",
    //             fontSize: "14px"
    //         }}>
    //             {error}
    //         </div>
    //         )}

    //         {success && (
    //         <div style={{
    //             background: "#efe",
    //             border: "1px solid #cfc",
    //             padding: "12px",
    //             borderRadius: "4px",
    //             marginBottom: "20px",
    //             color: "#3c3",
    //             fontSize: "14px"
    //         }}>
    //             {success}
                
    //             {code && (
    //             <div style={{ 
    //                 marginTop: "15px", 
    //                 padding: "15px",
    //                 background: "#fff",
    //                 border: "2px dashed #3c3",
    //                 borderRadius: "4px"
    //             }}>
    //                 <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#333" }}>
    //                 🔐 Code de réinitialisation  :
    //                 </p>
    //                 <p style={{ 
    //                 margin: "0", 
    //                 fontSize: "24px", 
    //                 fontWeight: "bold",
    //                 color: "#671E30",
    //                 textAlign: "center",
    //                 letterSpacing: "3px"
    //                 }}>
    //                 {code}
    //                 </p>
    //                 <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#666" }}>
    //                 Utilisez ce code sur la page de réinitialisation
    //                 </p>
    //             </div>
    //             )}
    //         </div>
    //         )}

    //         <form onSubmit={handleSubmit}>
    //         <div style={{ marginBottom: "20px" }}>
    //             <label style={{ 
    //             display: "block", 
    //             marginBottom: "8px",
    //             color: "#333",
    //             fontWeight: "500"
    //             }}>
    //             Email
    //             </label>
    //             <input
    //             type="email"
    //             value={email}
    //             onChange={(e) => setEmail(e.target.value)}
    //             placeholder="votreemail@example.com"
    //             required
    //             style={{
    //                 width: "100%",
    //                 padding: "12px",
    //                 border: "1px solid #ddd",
    //                 borderRadius: "4px",
    //                 fontSize: "14px"
    //             }}
    //             />
    //         </div>

    //         <button
    //             type="submit"
    //             disabled={loading}
    //             style={{
    //             width: "100%",
    //             padding: "14px",
    //             background: "#671E30",
    //             color: "white",
    //             border: "none",
    //             borderRadius: "4px",
    //             fontSize: "16px",
    //             fontWeight: "bold",
    //             cursor: loading ? "not-allowed" : "pointer",
    //             opacity: loading ? 0.6 : 1
    //             }}
    //         >
    //             {loading ? "Envoi en cours..." : "Demander un code"}
    //         </button>
    //         </form>

    //         <div style={{ 
    //         marginTop: "20px", 
    //         textAlign: "center",
    //         display: "flex",
    //         gap: "15px",
    //         justifyContent: "center"
    //         }}>
    //         <button
    //             onClick={() => navigate("/login")}
    //             style={{
    //             background: "none",
    //             border: "none",
    //             color: "#671E30",
    //             cursor: "pointer",
    //             fontSize: "14px",
    //             textDecoration: "underline"
    //             }}
    //         >
    //             Retour à la connexion
    //         </button>
            
    //         {success && (
    //             <button
    //             onClick={() => navigate("/reset-password", { state: { email } })}
    //             style={{
    //                 background: "none",
    //                 border: "none",
    //                 color: "#CFA65B",
    //                 cursor: "pointer",
    //                 fontSize: "14px",
    //                 textDecoration: "underline",
    //                 fontWeight: "bold"
    //             }}
    //             >
    //             Réinitialiser maintenant →
    //             </button>
    //         )}
    //         </div>
    //     </div>
    //     </div>
    // );
    // }

    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import api from "../services/api";
    
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
    
        // Validation basique
        if (!email) {
          setError("Veuillez entrer votre adresse email");
          return;
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Adresse email invalide");
          return;
        }
    
        setLoading(true);
    
        try {
          const response = await api.post("/auth/forgot-password", { email });
          
          setSuccess(response.data.message || "Un email de réinitialisation a été envoyé à votre adresse.");
          setEmail("");
    
          // Rediriger vers la page de connexion après 3 secondes
          setTimeout(() => {
            navigate("/login");
          }, 3000);
    
        } catch (err) {
          console.error("Erreur mot de passe oublié:", err);
          setError(
            err.response?.data?.message || 
            "Une erreur est survenue. Veuillez réessayer."
          );
        } finally {
          setLoading(false);
        }
      };
    
      return (
        <div style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
            {/* Logo/Titre */}
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h1 style={{
                color: "#671E30",
                fontSize: "28px",
                fontWeight: "bold",
                margin: "0 0 10px 0"
              }}>
                Mot de passe oublié ?
              </h1>
              <p style={{
                color: "#666",
                fontSize: "14px",
                margin: 0
              }}>
                Entrez votre email pour recevoir un lien de réinitialisation
              </p>
            </div>
    
            {/* Messages d'erreur et succès */}
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
                ❌ {error}
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
                ✅ {success}
              </div>
            )}
    
            {/* Formulaire */}
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
                    transition: "border-color 0.3s",
                    outline: "none"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>
    
              {/* Bouton de soumission */}
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
                  transition: "background 0.3s",
                  marginBottom: "15px"
                }}
                onMouseEnter={(e) => {
                  if (!loading && !success) e.target.style.background = "#8B2840";
                }}
                onMouseLeave={(e) => {
                  if (!loading && !success) e.target.style.background = "#671E30";
                }}
              >
                {loading ? "⏳ Envoi en cours..." : success ? "✅ Email envoyé" : "📧 Envoyer le lien"}
              </button>
    
              {/* Lien retour connexion */}
              <div style={{ textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#667eea",
                    fontSize: "14px",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  ← Retour à la connexion
                </button>
              </div>
            </form>
    
            {/* Info supplémentaire */}
            <div style={{
              marginTop: "25px",
              padding: "15px",
              background: "#f8f9fa",
              borderRadius: "8px",
              fontSize: "13px",
              color: "#666"
            }}>
              <p style={{ margin: "0 0 8px 0", fontWeight: "600" }}>
                💡 À savoir :
              </p>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                <li>Le lien est valide pendant 1 heure</li>
                <li>Vérifiez vos spams si vous ne recevez rien</li>
                <li>Contactez le support si le problème persiste</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }
    