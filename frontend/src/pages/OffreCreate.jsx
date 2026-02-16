    import { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import api from "../services/api";

    export default function OffreCreate() {
    const [user, setUser] = useState(null);
    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        contractType: "CDI",
        sector: "",
        city: "",
        region: "",
        address: "",
        salaryMin: "",
        salaryMax: "",
        salaryPeriod: "mois",
        experienceRequired: "aucune",
        educationLevel: "aucun",
        skills: "",
        languages: "",
        numberOfPositions: 1,
        workSchedule: "Temps plein",
        startDate: "",
        applicationDeadline: "",
        companyName: ""
    });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
        navigate("/login");
        return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Vérifier que c'est un recruteur
        if (parsedUser.role !== "recruteur") {
        setError("Seuls les recruteurs peuvent créer des offres d'emploi");
        setTimeout(() => navigate("/dashboard"), 2000);
        return;
        }

        loadSectors();
    }, [navigate]);

    const loadSectors = async () => {
        try {
        const response = await api.get("/offres/sectors");
        setSectors(response.data.data);
        } catch (err) {
        console.error("Erreur chargement secteurs:", err);
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
        setLoading(true);

        try {
        // Préparer les données
        const dataToSend = {
            ...formData,
            salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
            salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
            numberOfPositions: parseInt(formData.numberOfPositions) || 1,
            skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
            languages: formData.languages ? formData.languages.split(',').map(l => l.trim()) : [],
            startDate: formData.startDate || null,
            applicationDeadline: formData.applicationDeadline || null
        };

        const response = await api.post("/offres", dataToSend);
        console.log("✅ Offre créée:", response.data);
        
        setSuccess("Offre créée avec succès !");
        
        setTimeout(() => {
            navigate("/offres/me");
        }, 1500);

        } catch (err) {
        console.error("❌ Erreur création offre:", err);
        
        if (err.response?.data?.errors) {
            setError(err.response.data.errors[0].message);
        } else {
            setError(err.response?.data?.message || "Erreur lors de la création de l'offre");
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

    if (!user) {
        return <div style={{ padding: "20px", textAlign: "center" }}>Chargement...</div>;
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
                Publier une offre d'emploi
                </h1>
                <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
                Trouvez les meilleurs talents
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
                    Titre du poste *
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Développeur Web Full Stack"
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px"
                    }}
                />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Type de contrat *
                    </label>
                    <select
                    name="contractType"
                    value={formData.contractType}
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
                    <option value="CDI">CDI (Contrat à durée indéterminée)</option>
                    <option value="CDD">CDD (Contrat à durée déterminée)</option>
                    <option value="stage">Stage</option>
                    <option value="freelance">Freelance / Prestation</option>
                    <option value="temporaire">Temporaire</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Secteur d'activité
                    </label>
                    <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        background: "white"
                    }}
                    >
                    <option value="">Sélectionnez un secteur</option>
                    {sectors.map(sector => (
                        <option key={sector.value} value={sector.value}>
                        {sector.label}
                        </option>
                    ))}
                    </select>
                </div>
                </div>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Description du poste *
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="8"
                    placeholder="Décrivez le poste, les missions principales, les responsabilités..."
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontFamily: "inherit"
                    }}
                />
                <small style={{ color: "#666", fontSize: "12px" }}>
                    Minimum 50 caractères
                </small>
                </div>
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
                📍 Localisation
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Ville *
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
                    Adresse du lieu de travail
                </label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Ex: Almadies, Route de Ngor"
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
                    Nom de l'entreprise
                </label>
                <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Ex: SONATEL, Orange, etc."
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px"
                    }}
                />
                </div>
            </div>

            {/* Rémunération */}
            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h3 style={{ margin: "0 0 20px 0", color: "#671E30" }}>
                💰 Rémunération
                </h3>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Période
                </label>
                <select
                    name="salaryPeriod"
                    value={formData.salaryPeriod}
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
                    <option value="mois">Par mois</option>
                    <option value="annuel">Annuel</option>
                    <option value="a_negocier">À négocier</option>
                </select>
                </div>

                {formData.salaryPeriod !== "a_negocier" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                        Salaire minimum (FCFA)
                    </label>
                    <input
                        type="number"
                        name="salaryMin"
                        value={formData.salaryMin}
                        onChange={handleChange}
                        placeholder="Ex: 150000"
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
                        Salaire maximum (FCFA)
                    </label>
                    <input
                        type="number"
                        name="salaryMax"
                        value={formData.salaryMax}
                        onChange={handleChange}
                        placeholder="Ex: 250000"
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

            {/* Exigences */}
            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h3 style={{ margin: "0 0 20px 0", color: "#671E30" }}>
                🎓 Exigences du poste
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Expérience requise
                    </label>
                    <select
                    name="experienceRequired"
                    value={formData.experienceRequired}
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        background: "white"
                    }}
                    >
                    <option value="aucune">Aucune expérience</option>
                    <option value="0-1_ans">0 à 1 an</option>
                    <option value="1-3_ans">1 à 3 ans</option>
                    <option value="3-5_ans">3 à 5 ans</option>
                    <option value="5_ans_plus">5 ans et plus</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Niveau d'études
                    </label>
                    <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        background: "white"
                    }}
                    >
                    <option value="aucun">Aucun diplôme requis</option>
                    <option value="primaire">Primaire</option>
                    <option value="secondaire">Secondaire</option>
                    <option value="bac">Baccalauréat</option>
                    <option value="bac_plus_2">Bac +2</option>
                    <option value="bac_plus_3">Bac +3 (Licence)</option>
                    <option value="bac_plus_5">Bac +5 (Master)</option>
                    <option value="doctorat">Doctorat</option>
                    </select>
                </div>
                </div>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Compétences requises (séparées par des virgules)
                </label>
                <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Ex: JavaScript, React, Node.js, SQL"
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
                    Langues requises (séparées par des virgules)
                </label>
                <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    placeholder="Ex: Français, Anglais, Wolof"
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px"
                    }}
                />
                </div>
            </div>

            {/* Détails du poste */}
            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h3 style={{ margin: "0 0 20px 0", color: "#671E30" }}>
                📅 Détails du poste
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Nombre de postes
                    </label>
                    <input
                    type="number"
                    name="numberOfPositions"
                    value={formData.numberOfPositions}
                    onChange={handleChange}
                    min="1"
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
                    Horaire de travail
                    </label>
                    <select
                    name="workSchedule"
                    value={formData.workSchedule}
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        background: "white"
                    }}
                    >
                    <option value="Temps plein">Temps plein</option>
                    <option value="Temps partiel">Temps partiel</option>
                    <option value="Flexible">Flexible</option>
                    <option value="Nuit">Travail de nuit</option>
                    <option value="Weekend">Week-end</option>
                    </select>
                </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Date de début souhaitée
                    </label>
                    <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
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
                    Date limite de candidature
                    </label>
                    <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px"
                    }}
                    />
                </div>
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
                {loading ? "Publication..." : "Publier l'offre"}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    }