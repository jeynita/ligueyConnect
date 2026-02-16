    import { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import api from "../services/api";

    export default function ServiceCreate() {
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        priceType: "heure",
        priceMin: "",
        priceMax: "",
        city: "",
        region: "",
        zones: "",
        availability: "disponible",
        availableDays: ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
        responseTime: "24h"
    });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
        navigate("/login");
        return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Vérifier que c'est un prestataire
        if (parsedUser.role !== "prestataire") {
        setError("Seuls les prestataires peuvent créer des services");
        setTimeout(() => navigate("/dashboard"), 2000);
        return;
        }

        loadCategories();
    }, [navigate]);

    const loadCategories = async () => {
        try {
        const response = await api.get("/services/categories");
        setCategories(response.data.data);
        } catch (err) {
        console.error("Erreur chargement catégories:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleDaysChange = (day) => {
        setFormData(prev => {
        const days = prev.availableDays.includes(day)
            ? prev.availableDays.filter(d => d !== day)
            : [...prev.availableDays, day];
        return { ...prev, availableDays: days };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
        // Préparer les données
        const dataToSend = {
            ...formData,
            priceMin: formData.priceMin ? parseFloat(formData.priceMin) : null,
            priceMax: formData.priceMax ? parseFloat(formData.priceMax) : null,
            zones: formData.zones ? formData.zones.split(',').map(z => z.trim()) : []
        };

        const response = await api.post("/services", dataToSend);
        console.log("✅ Service créé:", response.data);
        
        setSuccess("Service créé avec succès !");
        
        setTimeout(() => {
            navigate("/services/me");
        }, 1500);

        } catch (err) {
        console.error("❌ Erreur création service:", err);
        
        if (err.response?.data?.errors) {
            setError(err.response.data.errors[0].message);
        } else {
            setError(err.response?.data?.message || "Erreur lors de la création du service");
        }
        } finally {
        setLoading(false);
        }
    };

    const villes = [
        "Dakar", "Pikine", "Guédiawaye", "Rufisque", "Thiès", "Kaolack", 
        "Mbour", "Saint-Louis", "Ziguinchor", "Louga", "Matam", "Tambacounda",
        "Kolda", "Kaffrine", "Kédougou", "Sédhiou", "Diourbel", "Fatick"
    ];

    const regions = [
        "Dakar", "Thiès", "Diourbel", "Fatick", "Kaolack", "Kaffrine",
        "Kolda", "Louga", "Matam", "Saint-Louis", "Sédhiou", "Tambacounda",
        "Kédougou", "Ziguinchor"
    ];

    const jours = [
        { value: "lundi", label: "Lundi" },
        { value: "mardi", label: "Mardi" },
        { value: "mercredi", label: "Mercredi" },
        { value: "jeudi", label: "Jeudi" },
        { value: "vendredi", label: "Vendredi" },
        { value: "samedi", label: "Samedi" },
        { value: "dimanche", label: "Dimanche" }
    ];

    if (!user) {
        return <div style={{ padding: "20px", textAlign: "center" }}>Chargement...</div>;
    }

    return (
        <div style={{ minHeight: "100vh", background: "#F0F0E8", padding: "20px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            
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
                Publier un service
                </h1>
                <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
                Faites connaître vos compétences
                </p>
            </div>
            <button
                onClick={() => navigate("/dashboard")}
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

            {/* Formulaire */}
            <form onSubmit={handleSubmit}>
            
            {/* Informations générales */}
            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h3 style={{ margin: "0 0 20px 0", color: "#671E30" }}>
                📋 Informations générales
                </h3>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Titre du service *
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Plomberie - Dépannage et installation"
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px"
                    }}
                />
                </div>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Catégorie *
                </label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "white"
                    }}
                >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                        {cat.label}
                    </option>
                    ))}
                </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Description détaillée *
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Décrivez en détail vos services, vos compétences, votre expérience..."
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontFamily: "inherit"
                    }}
                />
                <small style={{ color: "#666", fontSize: "12px" }}>
                    Minimum 20 caractères
                </small>
                </div>
            </div>

            {/* Tarification */}
            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h3 style={{ margin: "0 0 20px 0", color: "#671E30" }}>
                💰 Tarification
                </h3>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Type de tarification
                </label>
                <select
                    name="priceType"
                    value={formData.priceType}
                    onChange={handleChange}
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "white"
                    }}
                >
                    <option value="heure">Par heure</option>
                    <option value="jour">Par jour</option>
                    <option value="forfait">Forfait</option>
                    <option value="devis">Sur devis</option>
                </select>
                </div>

                {formData.priceType !== "devis" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                        Prix minimum (FCFA)
                    </label>
                    <input
                        type="number"
                        name="priceMin"
                        value={formData.priceMin}
                        onChange={handleChange}
                        placeholder="Ex: 5000"
                        min="0"
                        style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px"
                        }}
                    />
                    </div>

                    <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                        Prix maximum (FCFA)
                    </label>
                    <input
                        type="number"
                        name="priceMax"
                        value={formData.priceMax}
                        onChange={handleChange}
                        placeholder="Ex: 10000"
                        min="0"
                        style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px"
                        }}
                    />
                    </div>
                </div>
                )}
            </div>

            {/* Localisation */}
            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h3 style={{ margin: "0 0 20px 0", color: "#671E30" }}>
                📍 Zone d'intervention
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Ville principale *
                    </label>
                    <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        background: "white"
                    }}
                    >
                    <option value="">Sélectionnez une ville</option>
                    {villes.map(ville => (
                        <option key={ville} value={ville}>{ville}</option>
                    ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Région
                    </label>
                    <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        background: "white"
                    }}
                    >
                    <option value="">Sélectionnez une région</option>
                    {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                    ))}
                    </select>
                </div>
                </div>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Zones de déplacement (séparées par des virgules)
                </label>
                <input
                    type="text"
                    name="zones"
                    value={formData.zones}
                    onChange={handleChange}
                    placeholder="Ex: Parcelles Assainies, Guédiawaye, Pikine"
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px"
                    }}
                />
                <small style={{ color: "#666", fontSize: "12px" }}>
                    Indiquez les quartiers ou communes où vous pouvez intervenir
                </small>
                </div>
            </div>

            {/* Disponibilité */}
            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h3 style={{ margin: "0 0 20px 0", color: "#671E30" }}>
                📅 Disponibilité
                </h3>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Statut actuel
                </label>
                <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "white"
                    }}
                >
                    <option value="disponible">✅ Disponible</option>
                    <option value="occupe">⏳ Occupé</option>
                    <option value="indisponible">❌ Indisponible</option>
                </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold", fontSize: "14px" }}>
                    Jours disponibles
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
                    {jours.map(jour => (
                    <label key={jour.value} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <input
                        type="checkbox"
                        checked={formData.availableDays.includes(jour.value)}
                        onChange={() => handleDaysChange(jour.value)}
                        style={{ marginRight: "8px" }}
                        />
                        <span style={{ fontSize: "14px" }}>{jour.label}</span>
                    </label>
                    ))}
                </div>
                </div>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Délai de réponse
                </label>
                <select
                    name="responseTime"
                    value={formData.responseTime}
                    onChange={handleChange}
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "white"
                    }}
                >
                    <option value="immédiat">⚡ Immédiat (moins de 1h)</option>
                    <option value="24h">📱 Sous 24h</option>
                    <option value="48h">📞 Sous 48h</option>
                    <option value="72h">📧 Sous 72h</option>
                </select>
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
                onClick={() => navigate("/dashboard")}
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
                disabled={loading}
                style={{
                    flex: 1,
                    padding: "12px",
                    background: "#671E30",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    opacity: loading ? 0.6 : 1
                }}
                >
                {loading ? "Publication..." : "Publier le service"}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    }