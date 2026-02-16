    import { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import api from "../services/api";

    export default function CandidatureList() {
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
        navigate("/login");
        return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== "demandeur") {
        navigate("/dashboard");
        return;
        }

        loadCandidatures();
    }, [navigate]);

    const loadCandidatures = async () => {
        try {
        setLoading(true);
        const response = await api.get("/offres/candidatures");
        setCandidatures(response.data.data);
        } catch (err) {
        console.error("Erreur chargement candidatures:", err);
        setError("Impossible de charger vos candidatures");
        } finally {
        setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
        en_attente: { bg: "#ffe", color: "#cc6", text: "⏳ En attente" },
        vue: { bg: "#eef", color: "#66c", text: "👁️ Vue" },
        retenue: { bg: "#efe", color: "#3c3", text: "✅ Retenue" },
        rejetee: { bg: "#fee", color: "#c33", text: "❌ Rejetée" }
        };
        const style = styles[status] || styles.en_attente;
        return (
        <span style={{
            background: style.bg,
            color: style.color,
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold"
        }}>
            {style.text}
        </span>
        );
    };

    if (loading) {
        return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            Chargement de vos candidatures...
        </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#F0F0E8", padding: "20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            
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
                Mes candidatures
                </h1>
                <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
                {candidatures.length} candidature{candidatures.length > 1 ? 's' : ''} envoyée{candidatures.length > 1 ? 's' : ''}
                </p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
                <button
                onClick={() => navigate("/dashboard")}
                style={{
                    padding: "10px 20px",
                    background: "#E8C17F",
                    color: "#1A1A1A",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
                >
                Retour
                </button>
                <button
                onClick={() => navigate("/offres/search")}
                style={{
                    padding: "10px 20px",
                    background: "#671E30",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
                >
                🔍 Chercher des offres
                </button>
            </div>
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

            {/* Liste des candidatures */}
            {candidatures.length === 0 ? (
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <p style={{ fontSize: "48px", margin: "0 0 20px 0" }}>📨</p>
                <h3 style={{ margin: "0 0 10px 0", color: "#671E30" }}>
                Aucune candidature envoyée
                </h3>
                <p style={{ margin: "0 0 20px 0", color: "#666" }}>
                Commencez par rechercher des offres d'emploi
                </p>
                <button
                onClick={() => navigate("/offres/search")}
                style={{
                    padding: "12px 24px",
                    background: "#671E30",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px"
                }}
                >
                🔍 Rechercher des offres
                </button>
            </div>
            ) : (
            <div style={{ display: "grid", gap: "20px" }}>
                {candidatures.map(candidature => (
                <div key={candidature.id} style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0, color: "#671E30", fontSize: "20px" }}>
                            {candidature.offre?.title || "Offre non disponible"}
                        </h3>
                        {getStatusBadge(candidature.status)}
                        </div>
                        {candidature.offre && (
                        <>
                            <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "14px" }}>
                            📍 {candidature.offre.city}
                            </p>
                            {candidature.offre.profile?.companyName && (
                            <p style={{ margin: 0, color: "#CFA65B", fontSize: "14px", fontWeight: "bold" }}>
                                🏢 {candidature.offre.profile.companyName}
                            </p>
                            )}
                        </>
                        )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: "#666" }}>
                        Candidature envoyée le
                        </p>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>
                        {new Date(candidature.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                    </div>
                    </div>

                    {candidature.coverLetter && (
                    <div style={{ 
                        padding: "15px",
                        background: "#F0F0E8",
                        borderRadius: "4px",
                        marginBottom: "15px"
                    }}>
                        <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#666", fontWeight: "bold" }}>
                        💌 Votre lettre de motivation :
                        </p>
                        <p style={{ margin: 0, color: "#333", fontSize: "14px", lineHeight: "1.5" }}>
                        {candidature.coverLetter.length > 200 
                            ? candidature.coverLetter.substring(0, 200) + "..." 
                            : candidature.coverLetter}
                        </p>
                    </div>
                    )}

                    {candidature.status === "retenue" && (
                    <div style={{
                        background: "#efe",
                        border: "1px solid #cfc",
                        padding: "15px",
                        borderRadius: "4px",
                        marginTop: "15px"
                    }}>
                        <p style={{ margin: 0, color: "#3c3", fontWeight: "bold" }}>
                        🎉 Félicitations ! Votre candidature a été retenue.
                        </p>
                        <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#3c3" }}>
                        Le recruteur devrait vous contacter prochainement.
                        </p>
                    </div>
                    )}

                    {candidature.status === "rejetee" && (
                    <div style={{
                        background: "#fee",
                        border: "1px solid #fcc",
                        padding: "15px",
                        borderRadius: "4px",
                        marginTop: "15px"
                    }}>
                        <p style={{ margin: 0, color: "#c33" }}>
                        Malheureusement, votre candidature n'a pas été retenue pour ce poste.
                        </p>
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