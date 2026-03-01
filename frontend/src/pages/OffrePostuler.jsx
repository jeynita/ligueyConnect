import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

// ─── Fonctions utilitaires (mêmes que OffreSearch.jsx) ───────────────────────

// ✅ Normalise skills quelle que soit la forme renvoyée par le backend
const parseSkills = (skills) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.filter(Boolean);
  if (typeof skills === "string" && skills.trim()) {
    return skills.split(",").map(s => s.trim()).filter(Boolean);
  }
  return [];
};

// ✅ Formate le salaire en toute sécurité
const formatSalary = (offre) => {
  const period = offre.salaryPeriod ?? offre.salary_period;
  if (period === "a_negocier") return { text: "À négocier", sub: null };
  const min = offre.salaryMin ?? offre.salary_min;
  const max = offre.salaryMax ?? offre.salary_max;
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

// ─────────────────────────────────────────────────────────────────────────────

export default function OffrePostuler() {
  const [offre, setOffre]         = useState(null);
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const navigate = useNavigate();

  // ✅ Correspond à /offres/:offreId/postuler dans App.jsx
  const { offreId } = useParams();

  const [formData, setFormData] = useState({
    coverLetter: "",
    cvText:      "",
  });

  // ── Auth + chargement ────────────────────────────────────────────────────
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token    = localStorage.getItem("token");

    if (!userData || !token) { navigate("/login"); return; }

    let parsedUser;
    try { parsedUser = JSON.parse(userData); }
    catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    if (parsedUser.role !== "demandeur") {
      setError("Seuls les demandeurs d'emploi peuvent postuler.");
      setTimeout(() => navigate("/dashboard"), 2000);
      return;
    }

    loadOffre();
    loadProfile();
  }, [offreId, navigate]);

  const loadOffre = async () => {
    try {
      const response = await api.get(`/offres/${offreId}`);
      setOffre(response.data.data ?? response.data ?? null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      console.error("Erreur chargement offre:", err);
      setError("Impossible de charger l'offre. Vérifiez que le lien est correct.");
    }
  };

  const loadProfile = async () => {
    try {
      const response = await api.get("/profiles/me");
      const data = response.data.data ?? response.data ?? null;
      setProfile(data);
      // Pré-remplir cvText si le profil contient une expérience
      if (data?.experience) {
        setFormData(prev => ({ ...prev, cvText: data.experience }));
      }
    } catch (err) {
      console.error("Erreur chargement profil:", err);
      // Non bloquant — le formulaire reste utilisable sans profil
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ Validation : candidature totalement vide
    const isEmpty = !formData.coverLetter.trim() && !formData.cvText.trim();
    if (isEmpty) {
      setError("Votre candidature est vide. Ajoutez une lettre de motivation ou décrivez votre expérience avant d'envoyer.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post(`/offres/${offreId}/postuler`, formData);
      console.log("✅ Candidature envoyée:", response.data);

      setSuccess("Votre candidature a été envoyée avec succès !");
      setTimeout(() => navigate("/candidatures"), 2000);

    } catch (err) {
      console.error("❌ Erreur candidature:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (err.response?.status === 409) {
        setError("Vous avez déjà postulé à cette offre.");
        return;
      }

      setError(err.response?.data?.message || "Erreur lors de l'envoi de la candidature. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Gardes de rendu ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#671E30", fontSize: "16px" }}>
        Chargement...
      </div>
    );
  }

  if (!offre) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p style={{ fontSize: "48px", margin: "0 0 16px 0" }}>🔍</p>
        <h3 style={{ color: "#671E30" }}>Offre introuvable</h3>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Cette offre n'existe plus ou le lien est incorrect.
        </p>
        <button
          onClick={() => navigate("/offres/search")}
          style={{ padding: "10px 24px", background: "#671E30", color: "white",
            border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          Retour à la recherche
        </button>
      </div>
    );
  }

  // ── Données normalisées ──────────────────────────────────────────────────
  const skills      = parseSkills(offre.skills);
  const salary      = formatSalary(offre);
  const contractKey = offre.contractType ?? offre.contract_type;
  const contractStyle = CONTRACT_COLORS[contractKey] || { bg: "#F0F0E8", color: "#333" };
  const companyName = offre.companyName ?? offre.company_name ?? null;

  return (
    <div style={{ minHeight: "100vh", background: "#F0F0E8", padding: "20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* En-tête */}
        <div style={{
          background: "white", padding: "20px", borderRadius: "8px",
          marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "10px",
        }}>
          <div>
            <h1 style={{ margin: 0, color: "#671E30", fontSize: "24px" }}>
              Postuler à cette offre
            </h1>
            <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
              Complétez votre candidature
            </p>
          </div>
          <button
            onClick={() => navigate("/offres/search")}
            style={{ padding: "10px 20px", background: "#CFA65B", color: "white",
              border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
          >
            Retour
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div style={{ background: "#FDECEA", border: "1px solid #FFCDD2",
            padding: "15px", borderRadius: "4px", marginBottom: "20px", color: "#C62828" }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#EDFAED", border: "1px solid #C8E6C9",
            padding: "15px", borderRadius: "4px", marginBottom: "20px", color: "#2E7D32" }}>
            {success}
          </div>
        )}

        {/* Détails de l'offre */}
        <div style={{ background: "white", padding: "20px", borderRadius: "8px",
          marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          borderTop: "4px solid #671E30" }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>📋 Détails de l'offre</h3>

          <h2 style={{ margin: "0 0 12px 0", color: "#671E30", fontSize: "21px" }}>
            {offre.title}
          </h2>

          {/* Badges */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
            <span style={{
              background: contractStyle.bg, color: contractStyle.color,
              padding: "4px 10px", borderRadius: "20px",
              fontSize: "12px", fontWeight: "700",
              border: `1px solid ${contractStyle.color}33`,
            }}>
              {contractKey || "—"}
            </span>
            <span style={{ background: "#F0F0E8", color: "#555",
              padding: "4px 10px", borderRadius: "20px", fontSize: "12px" }}>
              📍 {offre.city ?? "—"}{offre.region ? `, ${offre.region}` : ""}
            </span>
            {companyName && (
              <span style={{ background: "#FFF8EC", color: "#CFA65B",
                padding: "4px 10px", borderRadius: "20px",
                fontSize: "12px", fontWeight: "600",
                border: "1px solid #CFA65B44" }}>
                🏢 {companyName}
              </span>
            )}
          </div>

          {/* Description */}
          <p style={{ margin: "0 0 14px 0", color: "#333", lineHeight: "1.7",
            borderTop: "1px solid #F0F0E8", paddingTop: "12px" }}>
            {offre.description}
          </p>

          {/* Salaire */}
          {salary && (
            <p style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "bold", color: "#671E30" }}>
              💰 {salary.text}
              {salary.sub && (
                <span style={{ fontSize: "13px", color: "#888", fontWeight: "normal" }}>
                  {" "}{salary.sub}
                </span>
              )}
            </p>
          )}

          {/* Skills normalisés */}
          {skills.length > 0 && (
            <div style={{ marginTop: "14px" }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#666", fontWeight: "bold" }}>
                🎯 Compétences requises :
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {skills.map((skill, i) => (
                  <span key={i} style={{
                    background: "#E8C17F", color: "#1A1A1A",
                    padding: "3px 9px", borderRadius: "4px", fontSize: "12px",
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Informations du profil */}
        {profile && (
          <div style={{ background: "white", padding: "20px", borderRadius: "8px",
            marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>👤 Vos informations</h3>
            <div style={{ padding: "14px", background: "#F0F0E8", borderRadius: "4px" }}>
              <p style={{ margin: "0 0 5px 0", fontWeight: "bold", color: "#333" }}>
                {[profile.firstName, profile.lastName].filter(Boolean).join(" ") || "—"}
              </p>
              {profile.phone && (
                <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#555" }}>
                  📞 {profile.phone}
                </p>
              )}
              {(profile.city ?? profile.ville) && (
                <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#555" }}>
                  📍 {profile.city ?? profile.ville}
                </p>
              )}
              {profile.profession && (
                <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                  💼 {profile.profession}
                </p>
              )}
            </div>
            <p style={{ marginTop: "10px", fontSize: "12px", color: "#888" }}>
              💡 Complétez votre profil pour augmenter vos chances d'être retenu.
            </p>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px",
            marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#671E30" }}>✉️ Votre candidature</h3>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px",
                fontWeight: "bold", fontSize: "14px" }}>
                Lettre de motivation
              </label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                rows="8"
                placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc",
                  borderRadius: "4px", fontFamily: "inherit", resize: "vertical" }}
              />
              <small style={{ color: "#888", fontSize: "12px" }}>
                Maximum 2000 caractères (optionnel)
              </small>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px",
                fontWeight: "bold", fontSize: "14px" }}>
                CV / Expérience professionnelle
              </label>
              <textarea
                name="cvText"
                value={formData.cvText}
                onChange={handleChange}
                rows="10"
                placeholder="Décrivez votre parcours professionnel, vos expériences, vos formations..."
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc",
                  borderRadius: "4px", fontFamily: "inherit", resize: "vertical" }}
              />
              <small style={{ color: "#888", fontSize: "12px" }}>
                Maximum 5000 caractères (optionnel)
              </small>
            </div>
          </div>

          {/* Boutons */}
          <div style={{ background: "white", padding: "20px", borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)", display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={() => navigate("/offres/search")}
              style={{ flex: 1, padding: "12px", background: "#E8C17F", color: "#1A1A1A",
                border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{ flex: 1, padding: "12px", background: "#671E30", color: "white",
                border: "none", borderRadius: "4px", fontWeight: "bold",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? "Envoi en cours..." : "📨 Envoyer ma candidature"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
