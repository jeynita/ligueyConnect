    import { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import api from "../services/api";

    export default function ServiceList() {
    const [services, setServices] = useState([]);
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
        if (parsedUser.role !== "prestataire") {
        navigate("/dashboard");
        return;
        }

        loadServices();
    }, [navigate]);

    const loadServices = async () => {
        try {
        setLoading(true);
        const response = await api.get("/services/me");
        setServices(response.data.data);
        } catch (err) {
        console.error("Erreur chargement services:", err);
        setError("Impossible de charger vos services");
        } finally {
        setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
        return;
        }

        try {
        await api.delete(`/services/${id}`);
        setServices(services.filter(s => s.id !== id));
        alert("Service supprimé avec succès");
        } catch (err) {
        console.error("Erreur suppression:", err);
        alert("Erreur lors de la suppression");
        }
    };

    const getCategoryLabel = (category) => {
        const categories = {
        plomberie: "🔧 Plomberie",
        electricite: "⚡ Électricité",
        menuiserie: "🪚 Menuiserie",
        maconnerie: "🧱 Maçonnerie",
        peinture: "🎨 Peinture",
        immobilier: "🏡 Immobilier",
        mecanique: "🚗 Mécanique",
        informatique: "💻 Informatique",
        nettoyage: "🧹 Nettoyage",
        restauration: "🍳 Restauration",
        couture: "👗 Couture",
        coiffure: "💇 Coiffure",
        cours_particuliers: "📚 Cours particuliers",
        demenagement: "🚚 Déménagement",
        autre: "➕ Autre"
        };
        return categories[category] || category;
    };

    const getStatusBadge = (status) => {
        const styles = {
        actif: { bg: "#efe", color: "#3c3", text: "✅ Actif" },
        inactif: { bg: "#fee", color: "#c33", text: "❌ Inactif" },
        suspendu: { bg: "#ffe", color: "#cc6", text: "⏸️ Suspendu" }
        };
        const style = styles[status] || styles.actif;
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

    const getAvailabilityBadge = (availability) => {
        const styles = {
        disponible: { bg: "#efe", color: "#3c3", text: "✅ Disponible" },
        occupe: { bg: "#ffe", color: "#cc6", text: "⏳ Occupé" },
        indisponible: { bg: "#fee", color: "#c33", text: "❌ Indisponible" }
        };
        const style = styles[availability] || styles.disponible;
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
            Chargement de vos services...
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
                Mes services
                </h1>
                <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
                {services.length} service{services.length > 1 ? 's' : ''} publié{services.length > 1 ? 's' : ''}
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
                onClick={() => navigate("/services/create")}
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
                ➕ Nouveau service
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

            {/* Liste des services */}
            {services.length === 0 ? (
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <p style={{ fontSize: "48px", margin: "0 0 20px 0" }}>📋</p>
                <h3 style={{ margin: "0 0 10px 0", color: "#671E30" }}>
                Aucun service publié
                </h3>
                <p style={{ margin: "0 0 20px 0", color: "#666" }}>
                Commencez par créer votre premier service pour être visible par les clients
                </p>
                <button
                onClick={() => navigate("/services/create")}
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
                ➕ Créer mon premier service
                </button>
            </div>
            ) : (
            <div style={{ display: "grid", gap: "20px" }}>
                {services.map(service => (
                <div key={service.id} style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0, color: "#671E30", fontSize: "20px" }}>
                            {service.title}
                        </h3>
                        {getStatusBadge(service.status)}
                        {getAvailabilityBadge(service.availability)}
                        </div>
                        <p style={{ margin: "0 0 5px 0", color: "#CFA65B", fontSize: "14px", fontWeight: "bold" }}>
                        {getCategoryLabel(service.category)}
                        </p>
                        <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                        📍 {service.city}{service.region && `, ${service.region}`}
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                        onClick={() => navigate(`/services/edit/${service.id}`)}
                        style={{
                            padding: "8px 16px",
                            background: "#CFA65B",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                        >
                        ✏️ Modifier
                        </button>
                        <button
                        onClick={() => handleDelete(service.id)}
                        style={{
                            padding: "8px 16px",
                            background: "#c33",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                        >
                        🗑️ Supprimer
                        </button>
                    </div>
                    </div>

                    <p style={{ margin: "0 0 15px 0", color: "#333", lineHeight: "1.5" }}>
                    {service.description.length > 200 
                        ? service.description.substring(0, 200) + "..." 
                        : service.description}
                    </p>

                    <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                    gap: "15px",
                    padding: "15px",
                    background: "#F0F0E8",
                    borderRadius: "4px"
                    }}>
                    <div>
                        <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: "#666", fontWeight: "bold" }}>
                        💰 Tarif
                        </p>
                        <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
                        {service.priceType === "devis" 
                            ? "Sur devis"
                            : `${service.priceMin || 0} - ${service.priceMax || 0} FCFA / ${service.priceType}`}
                        </p>
                    </div>

                    <div>
                        <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: "#666", fontWeight: "bold" }}>
                        👁️ Vues
                        </p>
                        <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
                        {service.viewCount} vue{service.viewCount > 1 ? 's' : ''}
                        </p>
                    </div>

                    <div>
                        <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: "#666", fontWeight: "bold" }}>
                        📧 Contacts
                        </p>
                        <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
                        {service.contactCount} contact{service.contactCount > 1 ? 's' : ''}
                        </p>
                    </div>

                    <div>
                        <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: "#666", fontWeight: "bold" }}>
                        ⭐ Note
                        </p>
                        <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
                        {service.rating}/5 ({service.reviewCount} avis)
                        </p>
                    </div>
                    </div>

                    {service.zones && service.zones.length > 0 && (
                    <div style={{ marginTop: "15px" }}>
                        <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#666", fontWeight: "bold" }}>
                        🗺️ Zones de déplacement :
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {service.zones.map((zone, index) => (
                            <span key={index} style={{
                            background: "#E8C17F",
                            color: "#1A1A1A",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px"
                            }}>
                            {zone}
                            </span>
                        ))}
                        </div>
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