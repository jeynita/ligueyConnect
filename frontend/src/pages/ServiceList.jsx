import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// ✅ Sécurité : transforme n'importe quel type de données en tableau JS
const formatZones = (zones) => {
  if (!zones) return [];
  if (Array.isArray(zones)) return zones;
  if (typeof zones === "string") {
    try {
      const parsed = JSON.parse(zones);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Cas d'une chaîne simple séparée par des virgules
      return zones.split(",").map(z => z.trim()).filter(Boolean);
    }
  }
  return [];
};

// ✅ Sécurité : retourne 0 si la valeur est undefined/null
const safeCount = (value) => (value !== undefined && value !== null ? value : 0);

// ✅ Troncature propre de la description
const truncateDescription = (text, maxLength = 200) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + "…";
};

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
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;

    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s.id !== id));
      alert("Service supprimé avec succès");
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression");
    }
  };

  // ✅ Gestion des variantes de valeurs BDD (ex: "restaurateur" → "Restauration")
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
      restaurateur: "🍳 Restauration",   // ✅ alias BDD
      couture: "👗 Couture",
      coiffure: "💇 Coiffure",
      cours_particuliers: "📚 Cours particuliers",
      demenagement: "🚚 Déménagement",
      autre: "➕ Autre",
    };
    return categories[category] || category;
  };

  const getStatusBadge = (status) => {
    const styles = {
      actif:    { bg: "#EDFAED", color: "#2E7D32", text: "✅ Actif" },
      inactif:  { bg: "#FDECEA", color: "#C62828", text: "❌ Inactif" },
      suspendu: { bg: "#FFFDE7", color: "#9E7C00", text: "⏸️ Suspendu" },
    };
    const style = styles[status] || styles.actif;
    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700",
        border: `1px solid ${style.color}33`,
        whiteSpace: "nowrap",
      }}>
        {style.text}
      </span>
    );
  };

  const getAvailabilityBadge = (availability) => {
    const styles = {
      disponible:   { bg: "#EDFAED", color: "#2E7D32", text: "✅ Disponible" },
      occupe:       { bg: "#FFFDE7", color: "#9E7C00", text: "⏳ Occupé" },
      indisponible: { bg: "#FDECEA", color: "#C62828", text: "❌ Indisponible" },
    };
    const style = styles[availability] || styles.disponible;
    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700",
        border: `1px solid ${style.color}33`,
        whiteSpace: "nowrap",
      }}>
        {style.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#671E30", fontSize: "16px" }}>
        Chargement de vos services…
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
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}>
          <div>
            <h1 style={{ margin: 0, color: "#671E30", fontSize: "24px" }}>Mes services</h1>
            <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
              {services.length} service{services.length > 1 ? "s" : ""} publié{services.length > 1 ? "s" : ""}
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
                fontWeight: "bold",
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
                fontWeight: "bold",
              }}
            >
              ➕ Nouveau service
            </button>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div style={{
            background: "#FDECEA",
            border: "1px solid #FFCDD2",
            padding: "15px",
            borderRadius: "4px",
            marginBottom: "20px",
            color: "#C62828",
          }}>
            {error}
          </div>
        )}

        {/* État vide */}
        {services.length === 0 ? (
          <div style={{
            background: "white",
            padding: "40px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}>
            <p style={{ fontSize: "48px", margin: "0 0 20px 0" }}>📋</p>
            <h3 style={{ margin: "0 0 10px 0", color: "#671E30" }}>Aucun service publié</h3>
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
                fontSize: "16px",
              }}
            >
              ➕ Créer mon premier service
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {services.map(service => {
              // ✅ Normalisation des zones une seule fois par service
              const zones = formatZones(service.zones);

              return (
                <div key={service.id} style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}>
                  {/* Titre + badges + actions */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "15px",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "8px" }}>
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
                        📍 {service.city}{service.region ? `, ${service.region}` : ""}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                      <button
                        onClick={() => navigate(`/services/edit/${service.id}`)}
                        style={{
                          padding: "8px 16px",
                          background: "#CFA65B",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        style={{
                          padding: "8px 16px",
                          background: "#C62828",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>

                  {/* ✅ Description tronquée proprement */}
                  <p style={{ margin: "0 0 15px 0", color: "#333", lineHeight: "1.6" }}>
                    {truncateDescription(service.description)}
                  </p>

                  {/* ✅ Compteurs avec fallback à 0 */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "15px",
                    padding: "15px",
                    background: "#F0F0E8",
                    borderRadius: "4px",
                  }}>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#666", fontWeight: "bold" }}>💰 Tarif</p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
                        {service.priceType === "devis"
                          ? "Sur devis"
                          : `${safeCount(service.priceMin)} – ${safeCount(service.priceMax)} FCFA / ${service.priceType}`}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#666", fontWeight: "bold" }}>👁️ Vues</p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
                        {safeCount(service.viewCount)} vue{safeCount(service.viewCount) > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#666", fontWeight: "bold" }}>📧 Contacts</p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
                        {safeCount(service.contactCount)} contact{safeCount(service.contactCount) > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#666", fontWeight: "bold" }}>⭐ Note</p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
                        {safeCount(service.rating)}/5 ({safeCount(service.reviewCount)} avis)
                      </p>
                    </div>
                  </div>

                  {/* ✅ Zones normalisées via formatZones */}
                  {zones.length > 0 && (
                    <div style={{ marginTop: "15px" }}>
                      <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#666", fontWeight: "bold" }}>
                        🗺️ Zones de déplacement :
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {zones.map((zone, index) => (
                          <span key={index} style={{
                            background: "#E8C17F",
                            color: "#1A1A1A",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}>
                            {zone}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
