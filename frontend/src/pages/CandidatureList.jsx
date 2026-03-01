import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// ✅ Extrait le tableau de données quelle que soit la structure de la réponse
const extractData = (responseData) => {
  if (!responseData) return [];
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData.data)) return responseData.data;
  return [];
};

// ✅ Formate une date en toute sécurité
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric"
  });
};

// ✅ Normalise le statut : gère majuscules, tirets, espaces
const normalizeStatus = (status) => {
  if (!status) return "en_attente";
  return status.toLowerCase().replace(/[\s-]/g, "_");
};

const STATUS_STYLES = {
  en_attente: { bg: "#FFF8E1", color: "#9E7C00", text: "⏳ En attente",  border: "#FFE082" },
  vue:        { bg: "#EDE7F6", color: "#4527A0", text: "👁️ Vue",         border: "#B39DDB" },
  retenue:    { bg: "#EDFAED", color: "#2E7D32", text: "✅ Retenue",      border: "#A5D6A7" },
  rejetee:    { bg: "#FDECEA", color: "#C62828", text: "❌ Rejetée",      border: "#EF9A9A" },
};

// ─────────────────────────────────────────────────────────────────────────────

export default function CandidatureList() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const navigate = useNavigate();

  // ── Auth ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token    = localStorage.getItem("token");

    console.log("DEBUG AUTH:", userData);
    console.log("DEBUG TOKEN:", token ? "présent" : "ABSENT");

    // ✅ Ne jamais rediriger — afficher l'erreur sur la page pour diagnostiquer
    if (!userData || !token) {
      console.warn("⚠️ userData ou token manquant");
      setError("Session introuvable. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(userData);
      console.log("✅ parsedUser:", parsedUser);
    } catch (e) {
      console.error("❌ JSON corrompu:", e);
      setError("Données de session corrompues. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    // ✅ Vérification flexible : role à la racine OU dans parsedUser.user
    const role = parsedUser?.role ?? parsedUser?.user?.role;
    console.log("🔍 Rôle détecté:", role);

    if (!role) {
      console.warn("⚠️ Rôle introuvable. Structure parsedUser:", JSON.stringify(parsedUser));
      setError(`Rôle utilisateur introuvable. Structure reçue : ${JSON.stringify(parsedUser)}`);
      setLoading(false);
      return;
    }

    if (role !== "demandeur") {
      console.warn(`⚠️ Rôle "${role}" — chargement quand même pour diagnostiquer`);
      // ✅ On charge quand même pour voir l'erreur API réelle au lieu de rediriger
    }

    loadCandidatures();
  }, [navigate]);

  // ── Chargement ──────────────────────────────────────────────────────────
  const loadCandidatures = async () => {
    try {
      setLoading(true);
      setError("");
      // ✅ Route confirmée fonctionnelle
      const response = await api.get("/offres/candidatures");

      // ✅ Debug — inspecte la structure exacte renvoyée par le backend
      console.log("📦 response.data brut:", response.data);

      // ✅ Guard : réponse vide ou inattendue du serveur
      if (!response.data) {
        console.warn("⚠️ Le serveur a répondu sans données.");
        setError("Le serveur n'a renvoyé aucune donnée. Vérifiez l'endpoint backend.");
        return;
      }

      const data = extractData(response.data);
      console.log(`✅ ${data.length} candidature(s) extraite(s)`);
      setCandidatures(data);

    } catch (err) {
      // ✅ Affichage de l'erreur sur la page — PAS de redirection automatique
      // Cela permet de voir le vrai code d'erreur (401, 403, 404, 500) en prod
      const status  = err.response?.status;
      const message = err.response?.data?.message;

      console.error("❌ Erreur chargement candidatures:", { status, message, data: err.response?.data });

      setError(
        `Erreur ${status ?? "réseau"} : ${message ?? "Impossible de charger vos candidatures."} — Voir la console pour les détails.`
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────
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
      }}>
        {style.text}
      </span>
    );
  };

  // ✅ Cherche le nom d'entreprise dans les deux emplacements possibles
  const getCompanyName = (offre) => {
    if (!offre) return null;
    return offre.companyName
      ?? offre.company_name
      ?? offre.profile?.companyName
      ?? offre.profile?.company_name
      ?? null;
  };

  // ── Rendu ────────────────────────────────────────────────────────────────
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

        {/* En-tête */}
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
              🔍 Chercher des offres
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
        {candidatures.length === 0 ? (
          <div style={{ background: "white", padding: "60px 40px", borderRadius: "8px",
            textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "56px", margin: "0 0 16px 0" }}>📨</p>
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
              🔍 Trouver une offre
            </button>
          </div>

        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {candidatures.map(candidature => {
              const offre       = candidature.offre ?? candidature.Offre ?? null;
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
                            {offre?.title ?? candidature.offreTitle ?? "Offre non disponible"}
                          </h3>
                          {getStatusBadge(candidature.status)}
                        </div>

                        {offre && (
                          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap",
                            fontSize: "13px", color: "#666" }}>
                            {(offre.city ?? offre.ville) && (
                              <span>📍 {offre.city ?? offre.ville}</span>
                            )}
                            {(offre.contractType ?? offre.contract_type) && (
                              <span>📄 {offre.contractType ?? offre.contract_type}</span>
                            )}
                            {companyName && (
                              <span style={{ color: "#CFA65B", fontWeight: "600" }}>
                                🏢 {companyName}
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
                          {formatDate(candidature.createdAt ?? candidature.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Lettre de motivation tronquée */}
                    {candidature.coverLetter && (
                      <div style={{ padding: "12px 14px", background: "#F0F0E8",
                        borderRadius: "4px", marginBottom: "12px" }}>
                        <p style={{ margin: "0 0 6px 0", fontSize: "12px",
                          color: "#888", fontWeight: "bold", textTransform: "uppercase" }}>
                          💌 Lettre de motivation
                        </p>
                        <p style={{ margin: 0, color: "#333", fontSize: "14px", lineHeight: "1.6" }}>
                          {candidature.coverLetter.length > 220
                            ? candidature.coverLetter.substring(0, 220).trimEnd() + "…"
                            : candidature.coverLetter}
                        </p>
                      </div>
                    )}

                    {/* Message selon le statut */}
                    {statusKey === "retenue" && (
                      <div style={{ background: "#EDFAED", border: "1px solid #A5D6A7",
                        padding: "14px", borderRadius: "4px" }}>
                        <p style={{ margin: 0, color: "#2E7D32", fontWeight: "bold" }}>
                          🎉 Félicitations ! Votre candidature a été retenue.
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
                          👁️ Le recruteur a consulté votre candidature. En attente de retour.
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
