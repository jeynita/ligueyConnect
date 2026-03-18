import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Briefcase, Building2, Calendar, Clock, Mail, MapPinned, MessageSquare, RotateCcw, Search, Send, Users } from "lucide-react";
import { Icon } from "../components/Icon";

// Normalise skills quelle que soit la forme renvoyée
const parseSkills = (skills) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.filter(Boolean);
  if (typeof skills === "string" && skills.trim()) {
    return skills.split(",").map(s => s.trim()).filter(Boolean);
  }
  return [];
};

// Formate une date en toute sécurité
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

// Formate le salaire en toute sécurité
const formatSalary = (offre) => {
  const period = offre.salary_period;
  if (period === "a_negocier") return { text: "À négocier", sub: null };
  const min = offre.salary_min;
  const max = offre.salary_max;
  if (!min && !max) return null;
  const range = min && max
    ? `${Number(min).toLocaleString("fr-FR")} – ${Number(max).toLocaleString("fr-FR")} FCFA`
    : min
      ? `À partir de ${Number(min).toLocaleString("fr-FR")} FCFA`
      : `Jusqu'à ${Number(max).toLocaleString("fr-FR")} FCFA`;
  return { text: range, sub: period ? `/ ${period}` : null };
};

const CONTRACT_COLORS = {
  CDI:        { bg: "#E8F5E9", color: "#2E7D32" },
  CDD:        { bg: "#E3F2FD", color: "#1565C0" },
  stage:      { bg: "#FFF3E0", color: "#E65100" },
  freelance:  { bg: "#F3E5F5", color: "#6A1B9A" },
  temporaire: { bg: "#FCE4EC", color: "#880E4F" },
};

const SECTORS = [
  { value: "administration", label: "Administration" },
  { value: "agriculture", label: "Agriculture" },
  { value: "artisanat", label: "Artisanat" },
  { value: "commerce", label: "Commerce" },
  { value: "construction", label: "Construction" },
  { value: "education", label: "Education" },
  { value: "hotellerie_restauration", label: "Hotellerie & Restauration" },
  { value: "immobilier", label: "Immobilier" },
  { value: "industrie", label: "Industrie" },
  { value: "informatique", label: "Informatique" },
  { value: "sante", label: "Sante" },
  { value: "services", label: "Services" },
  { value: "tourisme", label: "Tourisme" },
  { value: "transport", label: "Transport" },
  { value: "autre", label: "Autre" },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function OffreSearch() {
  const [offres, setOffres]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    contractType: "",
    city:         "",
    sector:       "",
    search:       "",
  });

  useEffect(() => {
    searchOffres({});   // charge toutes les offres au montage
  }, []);

  const searchOffres = async (overrideFilters) => {
    try {
      setLoading(true);
      setError("");

      const active = overrideFilters ?? filters;

      let query = supabase
        .from("offres")
        .select("*, profiles(*)")
        .eq("status", "active");

      if (active.contractType) {
        query = query.eq("contract_type", active.contractType);
      }
      if (active.city) {
        query = query.eq("city", active.city);
      }
      if (active.sector) {
        query = query.eq("sector", active.sector);
      }
      if (active.search) {
        query = query.or(`title.ilike.%${active.search}%,description.ilike.%${active.search}%`);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error: sbError } = await query;

      if (sbError) throw sbError;

      setOffres(data || []);
    } catch (err) {
      console.error("Erreur recherche:", err);
      setError("Erreur lors de la recherche. Veuillez réessayer.");
      setOffres([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchOffres(filters);
  };

  const handleReset = () => {
    const empty = { contractType: "", city: "", sector: "", search: "" };
    setFilters(empty);
    searchOffres(empty);
  };

  const handlePostuler = (offreId) => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("Vous devez être connecté pour postuler.");
      navigate("/login");
      return;
    }
    try {
      const user = JSON.parse(userData || "{}");
      if (user.role !== "demandeur") {
        alert("Seuls les demandeurs d'emploi peuvent postuler.");
        return;
      }
    } catch {
      navigate("/login");
      return;
    }
    navigate(`/offres/${offreId}/postuler`);
  };

  const handleContact = (userId) => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("Vous devez être connecté pour contacter le recruteur.");
      navigate("/login");
      return;
    }
    if (!userId) {
      alert("Impossible de contacter ce recruteur pour le moment.");
      return;
    }
    navigate(`/messages/${userId}`);
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
          background: "white", padding: "20px", borderRadius: "8px",
          marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "10px",
        }}>
          <div>
            <h1 style={{ margin: 0, color: "#671E30", fontSize: "24px" }}>Rechercher un emploi</h1>
            <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
              Trouvez l'opportunité qui vous correspond
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ padding: "10px 20px", background: "#CFA65B", color: "white",
              border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
          >
            Retour
          </button>
        </div>

        {/* Filtres */}
        <form onSubmit={handleSearch} style={{
          background: "white", padding: "20px", borderRadius: "8px",
          marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <Icon as={Search} size={18} color="#671E30" />
              Filtres de recherche
            </span>
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px", marginBottom: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                Type de contrat
              </label>
              <select name="contractType" value={filters.contractType} onChange={handleFilterChange}
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc",
                  borderRadius: "4px", background: "white" }}>
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
              <select name="city" value={filters.city} onChange={handleFilterChange}
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc",
                  borderRadius: "4px", background: "white" }}>
                <option value="">Toutes les villes</option>
                {villes.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                Secteur
              </label>
              <select name="sector" value={filters.sector} onChange={handleFilterChange}
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc",
                  borderRadius: "4px", background: "white" }}>
                <option value="">Tous les secteurs</option>
                {SECTORS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                Mots-clés
              </label>
              <input type="text" name="search" value={filters.search} onChange={handleFilterChange}
                placeholder="Titre, compétence, entreprise..."
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" style={{ flex: 1, padding: "12px", background: "#671E30",
              color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <Icon as={Search} size={18} color="white" />
                Rechercher
              </span>
            </button>
            <button type="button" onClick={handleReset}
              style={{ padding: "12px 24px", background: "#E8C17F", color: "#1A1A1A",
                border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <Icon as={RotateCcw} size={18} color="#1A1A1A" />
                Réinitialiser
              </span>
            </button>
          </div>
        </form>

        {/* Erreur */}
        {error && (
          <div style={{ background: "#FDECEA", border: "1px solid #FFCDD2",
            padding: "15px", borderRadius: "4px", marginBottom: "20px", color: "#C62828" }}>
            {error}
          </div>
        )}

        {/* Chargement */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#671E30", fontSize: "16px" }}>
            Recherche en cours...
          </div>

        ) : offres.length === 0 ? (
          <div style={{ background: "white", padding: "50px 40px", borderRadius: "8px",
            textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
              <Icon as={Briefcase} size={48} color="#671E30" />
            </div>
            <h3 style={{ margin: "0 0 10px 0", color: "#671E30" }}>Aucune offre trouvée</h3>
            <p style={{ margin: 0, color: "#666" }}>Essayez de modifier vos critères de recherche.</p>
          </div>

        ) : (
          <div>
            <p style={{ marginBottom: "15px", color: "#666", fontSize: "14px" }}>
              {offres.length} offre{offres.length > 1 ? "s" : ""} trouvée{offres.length > 1 ? "s" : ""}
            </p>

            <div style={{ display: "grid", gap: "16px" }}>
              {offres.map(offre => {
                const skills      = parseSkills(offre.skills);
                const salary      = formatSalary(offre);
                const contractKey = offre.contract_type;
                const contractStyle = CONTRACT_COLORS[contractKey] || { bg: "#F0F0E8", color: "#333" };
                const createdDate = formatDate(offre.created_at);
                const deadlineDate = formatDate(offre.application_deadline);
                const profile = offre.profiles;
                const companyName = offre.company_name
                  ?? profile?.company_name
                  ?? (profile ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() : null);

                return (
                  <div key={offre.id} style={{
                    background: "white", borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "transform 0.15s",
                    overflow: "hidden",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    {/* Barre bordeaux en haut */}
                    <div style={{ height: "4px", background: "#671E30" }} />

                    <div style={{ padding: "20px" }}>
                      {/* Titre + badges */}
                      <div style={{ display: "flex", justifyContent: "space-between",
                        alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>

                        <div style={{ flex: 1, minWidth: "200px" }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center",
                            flexWrap: "wrap", marginBottom: "8px" }}>
                            <h3 style={{ margin: 0, color: "#671E30", fontSize: "19px" }}>
                              {offre.title}
                            </h3>
                            <span style={{
                              background: contractStyle.bg, color: contractStyle.color,
                              padding: "3px 10px", borderRadius: "20px",
                              fontSize: "12px", fontWeight: "700",
                              border: `1px solid ${contractStyle.color}33`,
                            }}>
                              {contractKey || "—"}
                            </span>
                          </div>

                          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap",
                            fontSize: "13px", color: "#666" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <Icon as={MapPinned} size={14} color="#666" />
                              {offre.city}{offre.region ? `, ${offre.region}` : ""}
                            </span>
                            {companyName && (
                              <span style={{ color: "#CFA65B", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <Icon as={Building2} size={14} color="#CFA65B" />
                                {companyName}
                              </span>
                            )}
                            {offre.sector && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <Icon as={Mail} size={14} color="#666" />
                                {offre.sector}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Salaire */}
                        {salary && (
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "#671E30" }}>
                              {salary.text}
                            </p>
                            {salary.sub && (
                              <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>{salary.sub}</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Description tronquée */}
                      {offre.description && (
                        <p style={{ margin: "0 0 14px 0", color: "#444", fontSize: "14px",
                          lineHeight: "1.6", borderTop: "1px solid #F0F0E8", paddingTop: "12px" }}>
                          {offre.description.length > 180
                            ? offre.description.substring(0, 180).trimEnd() + "…"
                            : offre.description}
                        </p>
                      )}

                      {/* Dates + infos */}
                      <div style={{ display: "flex", justifyContent: "space-between",
                        flexWrap: "wrap", gap: "8px", fontSize: "12px", color: "#888",
                        padding: "10px 12px", background: "#F0F0E8", borderRadius: "4px",
                        marginBottom: skills.length > 0 ? "14px" : "0" }}>
                        {createdDate && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <Icon as={Calendar} size={14} color="#888" />
                            Publiée le {createdDate}
                          </span>
                        )}
                        {deadlineDate && (
                          <span style={{ color: "#C62828", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <Icon as={Clock} size={14} color="#C62828" />
                            Clôture : {deadlineDate}
                          </span>
                        )}
                        {offre.number_of_positions > 1 && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <Icon as={Users} size={14} color="#888" />
                            {offre.number_of_positions} postes
                          </span>
                        )}
                      </div>

                      {/* Skills */}
                      {skills.length > 0 && (
                        <div style={{ marginBottom: "14px", marginTop: "14px" }}>
                          <p style={{ margin: "0 0 7px 0", fontSize: "12px",
                            color: "#666", fontWeight: "bold" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <Icon as={Search} size={14} color="#666" />
                              Compétences recherchées :
                            </span>
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                            {(Array.isArray(skills) ? skills : []).slice(0, 5).map((skill, i) => (
                              <span key={i} style={{
                                background: "#E8C17F", color: "#1A1A1A",
                                padding: "3px 9px", borderRadius: "4px", fontSize: "12px",
                              }}>
                                {skill}
                              </span>
                            ))}
                            {skills.length > 5 && (
                              <span style={{ fontSize: "12px", color: "#888", alignSelf: "center" }}>
                                +{skills.length - 5} autres
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                        <button
                          onClick={() => handleContact(offre.user_id)}
                          style={{ flex: 1, padding: "11px", background: "#CFA65B", color: "white",
                            border: "none", borderRadius: "4px", cursor: "pointer",
                            fontWeight: "bold", fontSize: "14px" }}
                        >
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                            <Icon as={MessageSquare} size={18} color="white" />
                            Contacter
                          </span>
                        </button>
                        <button
                          onClick={() => handlePostuler(offre.id)}
                          style={{ flex: 1, padding: "11px", background: "#671E30", color: "white",
                            border: "none", borderRadius: "4px", cursor: "pointer",
                            fontWeight: "bold", fontSize: "14px" }}
                        >
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                            <Icon as={Send} size={18} color="white" />
                            Postuler
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
