    import { useState, useEffect } from "react";
    import { useNavigate, useParams } from "react-router-dom";
    import api from "../services/api";

    export default function OffrePostuler() {
    const [offre, setOffre] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        coverLetter: "",
        cvText: ""
    });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
        navigate("/login");
        return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== "demandeur") {
        setError("Seuls les demandeurs d'emploi peuvent postuler");
        setTimeout(() => navigate("/dashboard"), 2000);
        return;
        }

        loadOffre();
        loadProfile();
    }, [id, navigate]);

    const loadOffre = async () => {
        try {
        const response = await api.get(`/offres/${id}`);
        setOffre(response.data.data);
        } catch (err) {
        console.error("Erreur chargement offre:", err);
        setError("Impossible de charger l'offre");
        }
    };

    const loadProfile = async () => {
        try {
        const response = await api.get("/profiles/me");
        setProfile(response.data.data);
        
        // Pré-remplir le CV avec l'expérience du profil
        if (response.data.data.experience) {
            setFormData(prev => ({
            ...prev,
            cvText: response.data.data.experience
            }));
        }
        } catch (err) {
        console.error("Erreur chargement profil:", err);
        } finally {
        setLoading(false);
        }
    };

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
        setSuccess("");
        setSubmitting(true);

        try {
        const response = await api.post(`/offres/${id}/postuler`, formData);
        console.log("✅ Candidature envoyée:", response.data);
        
        setSuccess("Votre candidature a été envoyée avec succès !");
        
        setTimeout(() => {
            navigate("/offres/candidatures");
        }, 2000);

        } catch (err) {
        console.error("❌ Erreur candidature:", err);
        setError(err.response?.data?.message || "Erreur lors de l'envoi de la candidature");
        } finally {
        setSubmitting(false);
        }
    };

    if (loading) {
        return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            Chargement...
        </div>
        );
    }

    if (!offre) {
        return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            Offre non trouvée
        </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#F0F0E8", padding: "20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            
            {/* En-tête */}
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
                Postuler à cette offre
                </h1>
                <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
                Complétez votre candidature
                </p>
            </div>
            <button
                onClick={() => navigate("/offres/search")}
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

            {/* Messages */}
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

            {success && (
            <div style={{
                background: "#efe",
                border: "1px solid #cfc",
                padding: "15px",
                borderRadius: "4px",
                marginBottom: "20px",
                color: "#3c3"
            }}>
                {success}
            </div>
            )}

            {/* Détails de l'offre */}
            <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>
                📋 Détails de l'offre
            </h3>

            <h2 style={{ margin: "0 0 10px 0", color: "#671E30", fontSize: "22px" }}>
                {offre.title}
            </h2>

            <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" }}>
                <span style={{
                background: "#E8C17F",
                color: "#1A1A1A",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "bold"
                }}>
                {offre.contractType}
                </span>
                <span style={{
                background: "#F0F0E8",
                color: "#1A1A1A",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px"
                }}>
                📍 {offre.city}
                </span>
                {offre.companyName && (
                <span style={{
                    background: "#F0F0E8",
                    color: "#1A1A1A",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px"
                }}>
                    🏢 {offre.companyName}
                </span>
                )}
            </div>

            <p style={{ margin: "0 0 15px 0", color: "#333", lineHeight: "1.6" }}>
                {offre.description}
            </p>

            {offre.salaryPeriod !== "a_negocier" && (
                <p style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: "bold", color: "#671E30" }}>
                💰 {offre.salaryMin} - {offre.salaryMax} FCFA / {offre.salaryPeriod}
                </p>
            )}

            {offre.skills && offre.skills.length > 0 && (
                <div style={{ marginTop: "15px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666", fontWeight: "bold" }}>
                    Compétences requises :
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {offre.skills.map((skill, index) => (
                    <span key={index} style={{
                        background: "#E8C17F",
                        color: "#1A1A1A",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px"
                    }}>
                        {skill}
                    </span>
                    ))}
                </div>
                </div>
            )}
            </div>

            {/* Informations du profil */}
            {profile && (
            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>
                👤 Vos informations
                </h3>

                <div style={{ 
                padding: "15px",
                background: "#F0F0E8",
                borderRadius: "4px"
                }}>
                <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
                    {profile.firstName} {profile.lastName}
                </p>
                {profile.phone && (
                    <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}>
                    📞 {profile.phone}
                    </p>
                )}
                {profile.city && (
                    <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}>
                    📍 {profile.city}
                    </p>
                )}
                {profile.profession && (
                    <p style={{ margin: 0, fontSize: "14px" }}>
                    💼 {profile.profession}
                    </p>
                )}
                </div>

                <p style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
                💡 Complétez votre profil pour augmenter vos chances d'être retenu
                </p>
            </div>
            )}

            {/* Formulaire de candidature */}
            <form onSubmit={handleSubmit}>
            
            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h3 style={{ margin: "0 0 20px 0", color: "#671E30" }}>
                ✉️ Votre candidature
                </h3>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Lettre de motivation
                </label>
                <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    rows="8"
                    placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontFamily: "inherit"
                    }}
                />
                <small style={{ color: "#666", fontSize: "12px" }}>
                    Maximum 2000 caractères (optionnel)
                </small>
                </div>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    CV / Expérience professionnelle
                </label>
                <textarea
                    name="cvText"
                    value={formData.cvText}
                    onChange={handleChange}
                    rows="10"
                    placeholder="Décrivez votre parcours professionnel, vos expériences, vos formations..."
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontFamily: "inherit"
                    }}
                />
                <small style={{ color: "#666", fontSize: "12px" }}>
                    Maximum 5000 caractères (optionnel)
                </small>
                </div>
            </div>

            {/* Boutons */}
            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                display: "flex",
                gap: "10px"
            }}>
                <button
                type="button"
                onClick={() => navigate("/offres/search")}
                style={{
                    flex: 1,
                    padding: "12px",
                    background: "#E8C17F",
                    color: "#1A1A1A",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
                >
                Annuler
                </button>

                <button
                type="submit"
                disabled={submitting}
                style={{
                    flex: 1,
                    padding: "12px",
                    background: "#671E30",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    opacity: submitting ? 0.6 : 1
                }}
                >
                {submitting ? "Envoi en cours..." : "📨 Envoyer ma candidature"}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    }