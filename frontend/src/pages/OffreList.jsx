import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Building2, Eye, FileText, MapPinned, Pencil, Tag, Trash2, Users, Calendar, Plus, Briefcase, Coins } from "lucide-react";
import { Icon } from "../components/Icon";

const CONTRACT_LABELS = {
  CDI:        { label: "CDI",        bg: "#E8F5E9", color: "#2E7D32" },
  CDD:        { label: "CDD",        bg: "#E3F2FD", color: "#1565C0" },
  stage:      { label: "Stage",      bg: "#FFF3E0", color: "#E65100" },
  freelance:  { label: "Freelance",  bg: "#F3E5F5", color: "#6A1B9A" },
  temporaire: { label: "Temporaire", bg: "#FCE4EC", color: "#880E4F" },
};

const STATUS_STYLES = {
  active:   { bg: "#EDFAED", color: "#2E7D32", text: "✅ Active"   },
  inactive: { bg: "#FDECEA", color: "#C62828", text: "❌ Inactive" },
  expiree:  { bg: "#FFF8E1", color: "#9E7C00", text: "⏰ Expirée"  },
  pourvue:  { bg: "#E3F2FD", color: "#1565C0", text: "✔️ Pourvue"  },
  // Compatibilité (anciens statuts)
  expired:  { bg: "#FFF8E1", color: "#9E7C00", text: "⏰ Expirée"  },
  filled:   { bg: "#E3F2FD", color: "#1565C0", text: "✔️ Pourvue"  },
};

// ─────────────────────────────────────────────────────────────────────────────

export default function OffreList() {
  const [offres, setOffres]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  // ── Vérification auth ────────────────────────────────────────────────────
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { navigate("/login"); return; }

    let parsedUser;
    try { parsedUser = JSON.parse(userData); }
    catch {
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    if (parsedUser.role !== "recruteur") {
      navigate("/dashboard");
      return;
    }

    loadOffres(parsedUser);
  }, [navigate]);

  // ── Chargement ───────────────────────────────────────────────────────────
  const loadOffres = async (user) => {
    try {
      setLoading(true);
      setError("");

      const userData = user || JSON.parse(localStorage.getItem("user"));

      const { data, error: sbError } = await supabase
        .from("offres")
        .select("*")
        .eq("user_id", userData.id)
        .order("created_at", { ascending: false });

      if (sbError) throw sbError;

      setOffres(data || []);
    } catch (err) {
      console.error("Erreur chargement offres:", err);
      setError("Impossible de charger vos offres. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // ── Suppression ──────────────────────────────────────────────────────────
  const handleDelete = async (id, title) => {
    if (!confirm(`Supprimer l'offre "${title}" ? Cette action est irréversible.`)) return;

    try {
      const { error: sbError } = await supabase
        .from("offres")
        .delete()
        .eq("id", id);

      if (sbError) throw sbError;

      setOffres(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression. Veuillez réessayer.");
      console.error("Erreur suppression offre:", err);
    }
  };

  // ── Helpers d'affichage ──────────────────────────────────────────────────
  const getContractBadge = (type) => {
    const style = CONTRACT_LABELS[type] || { label: type, bg: "#F0F0E8", color: "#333" };
    return (
      <span style={{
        background: style.bg, color: style.color,
        padding: "3px 10px", borderRadius: "20px",
        fontSize: "12px", fontWeight: "700",
        border: `1px solid ${style.color}33`,
        whiteSpace: "nowrap",
      }}>
        {style.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const style = STATUS_STYLES[status] || STATUS_STYLES.active;
    return (
      <span style={{
        background: style.bg, color: style.color,
        padding: "3px 10px", borderRadius: "20px",
        fontSize: "12px", fontWeight: "700",
        border: `1px solid ${style.color}33`,
        whiteSpace: "nowrap",
      }}>
        {style.text}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  // ── Rendu ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#671E30", fontSize: "16px" }}>
        Chargement de vos offres...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F0E8", padding: "20px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* En-tête */}
        <div style={{
          background: "white", padding: "20px", borderRadius: "8px",
          marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "10px",
        }}>
          <div>
            <h1 style={{ margin: 0, color: "#671E30", fontSize: "24px" }}>Mes offres d'emploi</h1>
            <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
              {offres.length} offre{offres.length > 1 ? "s" : ""} publiée{offres.length > 1 ? "s" : ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{ padding: "10px 20px", background: "#E8C17F", color: "#1A1A1A",
                border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
            >
              Retour
            </button>
            <button
              onClick={() => navigate("/offres/create")}
              style={{ padding: "10px 20px", background: "#671E30", color: "white",
                border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
            >
              ➕ Publier une nouvelle offre
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{ background: "#FDECEA", border: "1px solid #FFCDD2",
            padding: "15px", borderRadius: "4px", marginBottom: "20px", color: "#C62828" }}>
            {error}
          </div>
        )}

        {/* État vide */}
        {offres.length === 0 ? (
          <div style={{ background: "white", padding: "50px 40px", borderRadius: "8px",
            textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
              <Icon as={FileText} size={48} color="#671E30" />
            </div>
            <h3 style={{ margin: "0 0 10px 0", color: "#671E30" }}>Aucune offre publiée</h3>
            <p style={{ margin: "0 0 24px 0", color: "#666" }}>
              Publiez votre première offre pour trouver les meilleurs candidats.
            </p>
            <button
              onClick={() => navigate("/offres/create")}
              style={{ padding: "12px 28px", background: "#671E30", color: "white",
                border: "none", borderRadius: "4px", cursor: "pointer",
                fontWeight: "bold", fontSize: "15px" }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <Icon as={Plus} size={18} color="white" />
                Publier une offre
              </span>
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {offres.map(offre => (
              <div key={offre.id} style={{
                background: "white", borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                overflow: "hidden",
              }}>
                {/* Barre colorée selon le statut */}
                <div style={{
                  height: "4px",
                  background: offre.status === "active" ? "#2E7D32"
                    : (offre.status === "pourvue" || offre.status === "filled")  ? "#1565C0"
                    : (offre.status === "expiree" || offre.status === "expired") ? "#9E7C00"
                    : "#C62828",
                }} />

                <div style={{ padding: "20px" }}>
                  {/* Ligne titre + badges + actions */}
                  <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>

                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center",
                        flexWrap: "wrap", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0, color: "#671E30", fontSize: "18px" }}>
                          {offre.title}
                        </h3>
                        {getContractBadge(offre.contract_type)}
                        {getStatusBadge(offre.status)}
                      </div>

                      {/* Infos secondaires */}
                      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "#666" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <Icon as={MapPinned} size={14} color="#666" />
                          {offre.city}{offre.region ? `, ${offre.region}` : ""}
                        </span>
                        {offre.company_name
                          ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <Icon as={Building2} size={14} color="#666" />
                              {offre.company_name}
                            </span>
                          )
                          : null}
                        {offre.sector
                          ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <Icon as={Tag} size={14} color="#666" />
                              {offre.sector}
                            </span>
                          )
                          : null}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap" }}>
                      <button
                        onClick={() => navigate(`/offres/${offre.id}/candidatures`)}
                        style={{ padding: "8px 14px", background: "#671E30", color: "white",
                          border: "none", borderRadius: "4px", cursor: "pointer",
                          fontWeight: "bold", fontSize: "13px" }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          <Icon as={Users} size={16} color="white" />
                          Candidatures
                        </span>
                        {(offre.application_count ?? 0) > 0 && (
                          <span style={{
                            marginLeft: "6px", background: "#CFA65B", color: "#1A1A1A",
                            borderRadius: "10px", padding: "1px 7px", fontSize: "11px",
                          }}>
                            {offre.application_count}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => navigate(`/offres/edit/${offre.id}`)}
                        style={{ padding: "8px 14px", background: "#CFA65B", color: "white",
                          border: "none", borderRadius: "4px", cursor: "pointer",
                          fontWeight: "bold", fontSize: "13px" }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          <Icon as={Pencil} size={16} color="white" />
                          Modifier
                        </span>
                      </button>
                      <button
                        onClick={() => handleDelete(offre.id, offre.title)}
                        style={{ padding: "8px 14px", background: "#C62828", color: "white",
                          border: "none", borderRadius: "4px", cursor: "pointer",
                          fontWeight: "bold", fontSize: "13px" }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          <Icon as={Trash2} size={16} color="white" />
                          Supprimer
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Description tronquée */}
                  {offre.description && (
                    <p style={{ margin: "0 0 14px 0", color: "#444", fontSize: "14px",
                      lineHeight: "1.6", borderTop: "1px solid #F0F0E8", paddingTop: "12px" }}>
                      {offre.description.length > 220
                        ? offre.description.substring(0, 220).trimEnd() + "…"
                        : offre.description}
                    </p>
                  )}

                  {/* Statistiques + dates */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "12px", padding: "12px 14px",
                    background: "#F0F0E8", borderRadius: "4px",
                  }}>
                    <div>
                      <p style={{ margin: "0 0 3px 0", fontSize: "11px", color: "#888", fontWeight: "bold", textTransform: "uppercase" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <Icon as={Users} size={14} color="#888" />
                          Candidatures
                        </span>
                      </p>
                      <p style={{ margin: 0, fontSize: "15px", fontWeight: "700",
                        color: (offre.application_count ?? 0) > 0 ? "#2E7D32" : "#666" }}>
                        {offre.application_count ?? 0}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: "0 0 3px 0", fontSize: "11px", color: "#888", fontWeight: "bold", textTransform: "uppercase" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <Icon as={Eye} size={14} color="#888" />
                          Vues
                        </span>
                      </p>
                      <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#333" }}>
                        {offre.view_count ?? 0}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: "0 0 3px 0", fontSize: "11px", color: "#888", fontWeight: "bold", textTransform: "uppercase" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <Icon as={Calendar} size={14} color="#888" />
                          Publiée le
                        </span>
                      </p>
                      <p style={{ margin: 0, fontSize: "13px", color: "#333" }}>
                        {formatDate(offre.created_at) || "—"}
                      </p>
                    </div>

                    {offre.application_deadline && (
                      <div>
                        <p style={{ margin: "0 0 3px 0", fontSize: "11px", color: "#888", fontWeight: "bold", textTransform: "uppercase" }}>
                          ⏳ Clôture
                        </p>
                        <p style={{ margin: 0, fontSize: "13px", color: "#C62828", fontWeight: "600" }}>
                          {formatDate(offre.application_deadline)}
                        </p>
                      </div>
                    )}

                    {offre.salary_min && (
                      <div>
                        <p style={{ margin: "0 0 3px 0", fontSize: "11px", color: "#888", fontWeight: "bold", textTransform: "uppercase" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <Icon as={Coins} size={14} color="#888" />
                            Salaire
                          </span>
                        </p>
                        <p style={{ margin: 0, fontSize: "13px", color: "#333" }}>
                          {(offre.salary_min ?? 0).toLocaleString("fr-FR")}
                          {offre.salary_max
                            ? ` – ${offre.salary_max.toLocaleString("fr-FR")}`
                            : ""}
                          {" "}FCFA
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
