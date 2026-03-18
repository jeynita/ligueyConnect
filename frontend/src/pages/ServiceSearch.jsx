    import { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import { BadgeCheck, Briefcase, MapPinned, MessageSquare, Search, Star, User } from "lucide-react";
    import { supabase } from "../lib/supabase";
    import { Icon } from "../components/Icon";

    const CATEGORIES = [
      { value: "plomberie", label: "Plomberie" },
      { value: "electricite", label: "Électricité" },
      { value: "menuiserie", label: "Menuiserie" },
      { value: "maconnerie", label: "Maçonnerie" },
      { value: "peinture", label: "Peinture" },
      { value: "immobilier", label: "Immobilier" },
      { value: "mecanique", label: "Mécanique" },
      { value: "informatique", label: "Informatique" },
      { value: "nettoyage", label: "Nettoyage" },
      { value: "restauration", label: "Restauration" },
      { value: "couture", label: "Couture" },
      { value: "coiffure", label: "Coiffure" },
      { value: "cours_particuliers", label: "Cours particuliers" },
      { value: "demenagement", label: "Déménagement" },
      { value: "autre", label: "Autre" },
    ];

    export default function ServiceSearch() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        category: "",
        city: "",
        search: "",
        availability: ""
    });

    useEffect(() => {
        searchServices();
    }, []);

    const searchServices = async () => {
        try {
        setLoading(true);
        setError("");

        let query = supabase
          .from("services")
          .select("*, profiles(*)")
          .eq("status", "actif");

        if (filters.category) {
          query = query.eq("category", filters.category);
        }
        if (filters.city) {
          query = query.eq("city", filters.city);
        }
        if (filters.availability) {
          query = query.eq("availability", filters.availability);
        }
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        query = query.order("created_at", { ascending: false });

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setServices(data || []);
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
        searchServices();
    };

    const handleReset = () => {
        setFilters({
        category: "",
        city: "",
        search: "",
        availability: ""
        });
        setTimeout(() => searchServices(), 100);
    };

    const getCategoryLabel = (category) => {
        const cat = CATEGORIES.find(c => c.value === category);
        return cat ? cat.label : category;
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
                Rechercher un service
                </h1>
                <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
                Trouvez le prestataire idéal près de chez vous
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
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <Icon as={Search} size={18} color="#671E30" />
                  Filtres de recherche
                </span>
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginBottom: "15px" }}>
                <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Catégorie
                </label>
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "white"
                    }}
                >
                    <option value="">Toutes les catégories</option>
                    {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                        {cat.label}
                    </option>
                    ))}
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
                    Disponibilité
                </label>
                <select
                    name="availability"
                    value={filters.availability}
                    onChange={handleFilterChange}
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "white"
                    }}
                >
                    <option value="">Tous</option>
                    <option value="disponible">Disponible</option>
                    <option value="occupe">Occupé</option>
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
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <Icon as={Search} size={18} color="white" />
                  Rechercher
                </span>
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
                Réinitialiser
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
            ) : services.length === 0 ? (
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
                  <Icon as={Search} size={46} color="#671E30" />
                </div>
                <h3 style={{ margin: "0 0 10px 0", color: "#671E30" }}>
                Aucun service trouvé
                </h3>
                <p style={{ margin: 0, color: "#666" }}>
                Essayez de modifier vos critères de recherche
                </p>
            </div>
            ) : (
            <div>
                <p style={{ marginBottom: "15px", color: "#666", fontSize: "14px" }}>
                {services.length} service{services.length > 1 ? 's' : ''} trouvé{services.length > 1 ? 's' : ''}
                </p>
                <div style={{ display: "grid", gap: "20px" }}>
                {services.map(service => (
                    <div key={service.id} style={{
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
                        <h3 style={{ margin: "0 0 8px 0", color: "#671E30", fontSize: "20px" }}>
                            {service.title}
                        </h3>
                        <p style={{ margin: "0 0 5px 0", color: "#CFA65B", fontSize: "14px", fontWeight: "bold" }}>
                            {getCategoryLabel(service.category)}
                        </p>
                        <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <Icon as={MapPinned} size={14} color="#666" />
                              {service.city}{service.region && `, ${service.region}`}
                            </span>
                        </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0 0 5px 0", fontSize: "18px", fontWeight: "bold", color: "#671E30" }}>
                            {service.price_type === "devis"
                            ? "Sur devis"
                            : `${service.price_min || 0} - ${service.price_max || 0} FCFA`}
                        </p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                            / {service.price_type}
                        </p>
                        </div>
                    </div>

                    <p style={{ margin: "0 0 15px 0", color: "#333", lineHeight: "1.5" }}>
                        {service.description.length > 150
                        ? service.description.substring(0, 150) + "..."
                        : service.description}
                    </p>

                    {/* Info prestataire */}
                    {service.profiles && (
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
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <Icon as={User} size={16} color="#333" />
                                {service.profiles.first_name} {service.profiles.last_name}
                              </span>
                            </p>
                            <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <Icon as={Star} size={14} color="#666" />
                                {service.profiles.rating}/5 ({service.profiles.review_count} avis)
                              </span>
                            </p>
                        </div>
                        <div>
                            <span style={{
                            background: service.availability === "disponible" ? "#efe" : "#ffe",
                            color: service.availability === "disponible" ? "#3c3" : "#cc6",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "bold"
                            }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <Icon
                                as={service.availability === "disponible" ? BadgeCheck : Briefcase}
                                size={14}
                                color={service.availability === "disponible" ? "#2E7D32" : "#9E7C00"}
                              />
                              {service.availability === "disponible" ? "Disponible" : "Occupé"}
                            </span>
                            </span>
                        </div>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            const userData = localStorage.getItem("user");
                            if (!userData) {
                              alert("Vous devez être connecté pour contacter un prestataire");
                              navigate("/login");
                              return;
                            }
                            navigate(`/messages/${service.user_id}`);
                        }
                        }
                        style={{
                        width: "100%",
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
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          <Icon as={MessageSquare} size={18} color="white" />
                          Contacter
                        </span>
                    </button>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>
        </div>
    );
    }
