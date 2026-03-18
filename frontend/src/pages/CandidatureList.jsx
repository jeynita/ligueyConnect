import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Building2, FileText, MapPinned, Search, Eye, BadgeCheck, BadgeX, Clock, PartyPopper } from "lucide-react";
import { Icon } from "../components/Icon";

// Formate une date en toute securite
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric"
  });
};

// Normalise le statut : gere majuscules, tirets, espaces
const normalizeStatus = (status) => {
  if (!status) return "en_attente";
  return status.toLowerCase().replace(/[\s-]/g, "_");
};

const STATUS_STYLES = {
  en_attente: { bg: "#FFF8E1", color: "#9E7C00", text: "En attente",  border: "#FFE082", icon: Clock },
  vue:        { bg: "#EDE7F6", color: "#4527A0", text: "Vue",         border: "#B39DDB", icon: Eye },
  retenue:    { bg: "#EDFAED", color: "#2E7D32", text: "Retenue",      border: "#A5D6A7", icon: BadgeCheck },
  rejetee:    { bg: "#FDECEA", color: "#C62828", text: "Rejetée",      border: "#EF9A9A", icon: BadgeX },
};

// --------------------------------------------------------------------------

export default function CandidatureList() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const navigate = useNavigate();

  // -- Auth ----------------------------------------------------------------
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setError("Session introuvable. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(userData);
    } catch (e) {
      setError("Données de session corrompues. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    const role = parsedUser?.role ?? parsedUser?.user?.role;

    if (!role) {
      setError(`Rôle utilisateur introuvable. Structure reçue : ${JSON.stringify(parsedUser)}`);
      setLoading(false);
      return;
    }

    loadCandidatures(parsedUser.id ?? parsedUser.user?.id);
  }, [navigate]);

  // -- Chargement ----------------------------------------------------------
  const loadCandidatures = async (userId) => {
    try {
      setLoading(true);
      setError("");

      const { data, error: sbError } = await supabase
        .from("candidatures")
        .select("*, offres(*, profiles(*))")
        .eq("candidat_id", userId)
        .order("created_at", { ascending: false });

      if (sbError) {
        setError(`Erreur Supabase : ${sbError.message}`);
        return;
      }

      setCandidatures(data || []);
    } catch (err) {
      setError(`Erreur réseau : ${err.message ?? "Impossible de charger vos candidatures."}`);
    } finally {
      setLoading(false);
    }
  };

  // -- Helpers -------------------------------------------------------------
  const getStatusBadge = (rawStatus) => {
    const key   = normalizeStatus(rawStatus);
    const style = STATUS_STYLES[key] || STATUS_STYLES.en_attente;
    return (
      <span style={{
        background: style.bg, color: style.color,
        padding: "4px 10px", borderRadius: "20px",
        fontSize: "12px", fontWeight: "700",
        border: `1px solid ${style.border}`,
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}>
        <Icon as={style.icon} size={14} color={style.color} />
        {style.text}
      </span>
    );
  };

  const getCompanyName = (offre) => {
    if (!offre) return null;
    return offre.company_name
      ?? offre.profiles?.company_name
      ?? null;
  };

  // -- Rendu ---------------------------------------------------------------
  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#671E30", fontSize: "16px" }}>
        Chargement de vos candidatures...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F0E8", padding: "20px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* En-tete */}
        <div style={{
          background: "white", padding: "20px", borderRadius: "8px",
          marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "10px",
        }}>
          <div>
            <h1 style={{ margin: 0, color: "#671E30", fontSize: "24px" }}>Mes candidatures</h1>
            <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
              {candidatures.length} candidature{candidatures.length > 1 ? "s" : ""} envoyée{candidatures.length > 1 ? "s" : ""}
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
              onClick={() => navigate("/offres/search")}
              style={{ padding: "10px 20px", background: "#671E30", color: "white",
                border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <Icon as={Search} size={18} color="white" />
                Chercher des offres
              </span>
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

        {/* Etat vide */}
        {candidatures.length === 0 ? (
          <div style={{ background: "white", padding: "60px 40px", borderRadius: "8px",
            textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
              <Icon as={FileText} size={52} color="#671E30" />
            </div>
            <h3 style={{ margin: "0 0 10px 0", color: "#671E30", fontSize: "20px" }}>
              Aucune candidature envoyée
            </h3>
            <p style={{ margin: "0 0 8px 0", color: "#666", maxWidth: "400px",
              marginLeft: "auto", marginRight: "auto", lineHeight: "1.6" }}>
              Vous n'avez pas encore postulé à des offres. Parcourez les opportunités disponibles
              et envoyez votre première candidature.
            </p>
            <button
              onClick={() => navigate("/offres/search")}
              style={{ marginTop: "20px", padding: "12px 28px", background: "#671E30",
                color: "white", border: "none", borderRadius: "4px",
                cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <Icon as={Search} size={18} color="white" />
                Trouver une offre
              </span>
            </button>
          </div>

        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {candidatures.map(candidature => {
              const offre       = candidature.offres ?? null;
              const companyName = getCompanyName(offre);
              const statusKey   = normalizeStatus(candidature.status);
              const statusStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.en_attente;

              return (
                <div key={candidature.id} style={{
                  background: "white", borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}>
                  {/* Barre de couleur selon le statut */}
                  <div style={{ height: "4px", background: statusStyle.color }} />

                  <div style={{ padding: "20px" }}>
                    {/* Titre + badges + date */}
                    <div style={{ display: "flex", justifyContent: "space-between",
                      alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>

                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center",
                          flexWrap: "wrap", marginBottom: "8px" }}>
                          <h3 style={{ margin: 0, color: "#671E30", fontSize: "18px" }}>
                            {offre?.title ?? "Offre non disponible"}
                          </h3>
                          {getStatusBadge(candidature.status)}
                        </div>

                        {offre && (
                          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap",
                            fontSize: "13px", color: "#666" }}>
                            {offre.city && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <Icon as={MapPinned} size={14} color="#666" />
                                {offre.city}
                              </span>
                            )}
                            {offre.contract_type && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <Icon as={FileText} size={14} color="#666" />
                                {offre.contract_type}
                              </span>
                            )}
                            {companyName && (
                              <span style={{ color: "#CFA65B", fontWeight: "600" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                  <Icon as={Building2} size={14} color="#CFA65B" />
                                  {companyName}
                                </span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Date de candidature */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ margin: "0 0 3px 0", fontSize: "11px", color: "#999",
                          textTransform: "uppercase", fontWeight: "bold" }}>
                          Envoyée le
                        </p>
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#333" }}>
                          {formatDate(candidature.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Lettre de motivation tronquee */}
                    {candidature.cover_letter && (
                      <div style={{ padding: "12px 14px", background: "#F0F0E8",
                        borderRadius: "4px", marginBottom: "12px" }}>
                        <p style={{ margin: "0 0 6px 0", fontSize: "12px",
                          color: "#888", fontWeight: "bold", textTransform: "uppercase" }}>
                          Lettre de motivation
                        </p>
                        <p style={{ margin: 0, color: "#333", fontSize: "14px", lineHeight: "1.6" }}>
                          {candidature.cover_letter.length > 220
                            ? candidature.cover_letter.substring(0, 220).trimEnd() + "…"
                            : candidature.cover_letter}
                        </p>
                      </div>
                    )}

                    {/* Message selon le statut */}
                    {statusKey === "retenue" && (
                      <div style={{ background: "#EDFAED", border: "1px solid #A5D6A7",
                        padding: "14px", borderRadius: "4px" }}>
                        <p style={{ margin: 0, color: "#2E7D32", fontWeight: "bold" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                            <Icon as={PartyPopper} size={16} color="#2E7D32" />
                            Félicitations ! Votre candidature a été retenue.
                          </span>
                        </p>
                        <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#388E3C" }}>
                          Le recruteur devrait vous contacter prochainement.
                        </p>
                      </div>
                    )}

                    {statusKey === "rejetee" && (
                      <div style={{ background: "#FDECEA", border: "1px solid #EF9A9A",
                        padding: "14px", borderRadius: "4px" }}>
                        <p style={{ margin: 0, color: "#C62828" }}>
                          Malheureusement, votre candidature n'a pas été retenue pour ce poste.
                        </p>
                        <p style={{ margin: "5px 0 0 0", fontSize: "13px", color: "#E57373" }}>
                          Ne vous découragez pas — continuez à postuler !
                        </p>
                      </div>
                    )}

                    {statusKey === "vue" && (
                      <div style={{ background: "#EDE7F6", border: "1px solid #B39DDB",
                        padding: "14px", borderRadius: "4px" }}>
                        <p style={{ margin: 0, color: "#4527A0", fontSize: "14px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                            <Icon as={Eye} size={16} color="#4527A0" />
                            Le recruteur a consulté votre candidature. En attente de retour.
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
