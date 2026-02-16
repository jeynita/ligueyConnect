    import { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import api from "../services/api";

    export default function OffreSearch() {
    const [offres, setOffres] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        contractType: "",
        city: "",
        sector: "",
        search: ""
    });

    useEffect(() => {
        loadSectors();
        searchOffres();
    }, []);

    const loadSectors = async () => {
        try {
        const response = await api.get("/offres/sectors");
        setSectors(response.data.data);
        } catch (err) {
        console.error("Erreur chargement secteurs:", err);
        }
    };

    const searchOffres = async () => {
        try {
        setLoading(true);
        setError("");
        
        const params = {};
        if (filters.contractType) params.contractType = filters.contractType;
        if (filters.city) params.city = filters.city;
        if (filters.sector) params.sector = filters.sector;
        if (filters.search) params.search = filters.search;

        const response = await api.get("/offres/search", { params });
        setOffres(response.data.data);
        } catch (err) {
        console.error("Erreur recherche:", err);
        setError("Erreur lors de la recherche");
        } finally {
        setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        searchOffres();
    };

    const handleReset = () => {
        setFilters({
        contractType: "",
        city: "",
        sector: "",
        search: ""
        });
        setTimeout(() => searchOffres(), 100);
    };

    const handlePostuler = (offreId) => {
        const token = localStorage.getItem("token");
        if (!token) {
        alert("Vous devez être connecté pour postuler");
        navigate("/login");
        return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (user.role !== "demandeur") {
        alert("Seuls les demandeurs d'emploi peuvent postuler");
        return;
        }

        navigate(`/offres/${offreId}/postuler`);
    };

    const villes = [
        "Dakar", "Pikine", "Guédiawaye", "Rufisque", "Thiès", "Kaolack", 
        "Mbour", "Saint-Louis", "Ziguinchor", "Louga", "Matam", "Tambacounda",
        "Kolda", "Kaffrine", "Kédougou", "Sédhiou", "Diourbel", "Fatick"
    ];

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
                Rechercher un emploi
                </h1>
                <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
                Trouvez l'opportunité qui vous correspond
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

            {/* Filtres de recherche */}
            <form onSubmit={handleSearch} style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>
                🔍 Filtres de recherche
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginBottom: "15px" }}>
                <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Type de contrat
                </label>
                <select
                    name="contractType"
                    value={filters.contractType}
                    onChange={handleFilterChange}
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "white"
                    }}
                >
                    <option value="">Tous les types</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="stage">Stage</option>
                    <option value="freelance">Freelance</option>
                    <option value="temporaire">Temporaire</option>
                </select>
                </div>

                <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Ville
                </label>
                <select
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "white"
                    }}
                >
                    <option value="">Toutes les villes</option>
                    {villes.map(ville => (
                    <option key={ville} value={ville}>{ville}</option>
                    ))}
                </select>
                </div>

                <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Secteur
                </label>
                <select
                    name="sector"
                    value={filters.sector}
                    onChange={handleFilterChange}
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "white"
                    }}
                >
                    <option value="">Tous les secteurs</option>
                    {sectors.map(sector => (
                    <option key={sector.value} value={sector.value}>
                        {sector.label}
                    </option>
                    ))}
                </select>
                </div>

                <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Recherche
                </label>
                <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Mots-clés..."
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px"
                    }}
                />
                </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
                <button
                type="submit"
                style={{
                    flex: 1,
                    padding: "12px",
                    background: "#671E30",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
                >
                🔍 Rechercher
                </button>
                <button
                type="button"
                onClick={handleReset}
                style={{
                    padding: "12px 24px",
                    background: "#E8C17F",
                    color: "#1A1A1A",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
                >
                🔄 Réinitialiser
                </button>
            </div>
            </form>

            {/* Résultats */}
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

            {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
                Recherche en cours...
            </div>
            ) : offres.length === 0 ? (
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <p style={{ fontSize: "48px", margin: "0 0 20px 0" }}>💼</p>
                <h3 style={{ margin: "0 0 10px 0", color: "#671E30" }}>
                Aucune offre trouvée
                </h3>
                <p style={{ margin: 0, color: "#666" }}>
                Essayez de modifier vos critères de recherche
                </p>
            </div>
            ) : (
            <div>
                <p style={{ marginBottom: "15px", color: "#666", fontSize: "14px" }}>
                {offres.length} offre{offres.length > 1 ? 's' : ''} trouvée{offres.length > 1 ? 's' : ''}
                </p>
                <div style={{ display: "grid", gap: "20px" }}>
                {offres.map(offre => (
                    <div key={offre.id} style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s",
                    cursor: "pointer"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                        <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                            <h3 style={{ margin: 0, color: "#671E30", fontSize: "20px" }}>
                            {offre.title}
                            </h3>
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
                        </div>
                        <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "14px" }}>
                            📍 {offre.city}{offre.region && `, ${offre.region}`}
                        </p>
                        {offre.companyName && (
                            <p style={{ margin: 0, color: "#CFA65B", fontSize: "14px", fontWeight: "bold" }}>
                            🏢 {offre.companyName}
                            </p>
                        )}
                        </div>
                        <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0 0 5px 0", fontSize: "18px", fontWeight: "bold", color: "#671E30" }}>
                            {offre.salaryPeriod === "a_negocier" 
                            ? "À négocier"
                            : `${offre.salaryMin || 0} - ${offre.salaryMax || 0} FCFA`}
                        </p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                            / {offre.salaryPeriod}
                        </p>
                        </div>
                    </div>

                    <p style={{ margin: "0 0 15px 0", color: "#333", lineHeight: "1.5" }}>
                        {offre.description.length > 150 
                        ? offre.description.substring(0, 150) + "..." 
                        : offre.description}
                    </p>

                    {/* Info entreprise */}
                    {offre.profile && (
                        <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "15px",
                        background: "#F0F0E8",
                        borderRadius: "4px",
                        marginBottom: "15px"
                        }}>
                        <div>
                            <p style={{ margin: "0 0 5px 0", fontWeight: "bold", color: "#333" }}>
                            🏢 {offre.profile.companyName || `${offre.profile.firstName} ${offre.profile.lastName}`}
                            </p>
                            <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                            📅 Publiée le {new Date(offre.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                        {offre.applicationDeadline && (
                            <div>
                            <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                                ⏰ Date limite : {new Date(offre.applicationDeadline).toLocaleDateString('fr-FR')}
                            </p>
                            </div>
                        )}
                        </div>
                    )}

                    {offre.skills && offre.skills.length > 0 && (
                        <div style={{ marginBottom: "15px" }}>
                        <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#666", fontWeight: "bold" }}>
                            🎯 Compétences recherchées :
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                            {offre.skills.slice(0, 5).map((skill, index) => (
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
                            {offre.skills.length > 5 && (
                            <span style={{ fontSize: "12px", color: "#666" }}>
                                +{offre.skills.length - 5} autres
                            </span>
                            )}
                        </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                        onClick={() => {
                            const token = localStorage.getItem("token");
                            if (!token) {
                            alert("Vous devez être connecté pour contacter le recruteur");
                            navigate("/login");
                            return;
                            }
                            navigate(`/messages/${offre.userId}`);
                        }}
                        style={{
                            flex: 1,
                            padding: "12px",
                            background: "#CFA65B",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "16px"
                        }}
                        >
                        💬 Contacter
                        </button>
                        
                        <button
                        onClick={() => handlePostuler(offre.id)}
                        style={{
                            flex: 1,
                            padding: "12px",
                            background: "#671E30",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "16px"
                        }}
                        >
                        📨 Postuler
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>
        </div>
    );
    }