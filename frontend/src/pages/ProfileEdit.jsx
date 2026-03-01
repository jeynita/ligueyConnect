// ProfileEdit.jsx — Fichier unique complet
// Contient : styles, validation, hook, sous-composants, composant principal

import React, { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const VILLES = [
  "Dakar", "Pikine", "Guédiawaye", "Rufisque", "Thiès", "Kaolack",
  "Mbour", "Saint-Louis", "Ziguinchor", "Louga", "Matam", "Tambacounda",
  "Kolda", "Kaffrine", "Kédougou", "Sédhiou", "Diourbel", "Fatick",
];

const REGIONS = [
  "Dakar", "Thiès", "Diourbel", "Fatick", "Kaolack", "Kaffrine",
  "Kolda", "Louga", "Matam", "Saint-Louis", "Sédhiou", "Tambacounda",
  "Kédougou", "Ziguinchor",
];

const INITIAL_FORM = {
  firstName: "", lastName: "", phone: "", bio: "",
  address: "", city: "", region: "",
  profession: "", skills: [], experience: "",
  hourlyRate: "", availability: "disponible", transportMode: "", workZones: "",
  contractType: "", expectedSalary: "", availabilityDelay: "",
  educationLevel: "", references: "", hasWorkPermit: false,
  companyName: "", companySize: "", companySector: "", companyNinea: "",
  servicePreferences: "", budgetRange: "", clientType: "",
  avatar: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. STYLES CENTRALISÉS
// ─────────────────────────────────────────────────────────────────────────────

const t = {
  primary:    "#671E30",
  secondary:  "#CFA65B",
  accent:     "#E8C17F",
  bg:         "#F0F0E8",
  white:      "#FFFFFF",
  muted:      "#666666",
  border:     "#D1D1C7",
  errBg:      "#FEF2F2",
  errBorder:  "#FECACA",
  errText:    "#DC2626",
  okBg:       "#F0FDF4",
  okBorder:   "#BBF7D0",
  okText:     "#16A34A",
  radius:     "8px",
  radiusSm:   "4px",
  shadow:     "0 2px 8px rgba(0,0,0,0.08)",
};

const S = {
  page: {
    minHeight: "100vh",
    background: t.bg,
    padding: "24px 16px 48px",
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
  },
  container: { maxWidth: "820px", margin: "0 auto" },

  card: {
    background: t.white,
    padding: "24px",
    borderRadius: t.radius,
    marginBottom: "20px",
    boxShadow: t.shadow,
    border: `1px solid ${t.border}`,
  },
  cardTitle: {
    margin: "0 0 20px 0",
    color: t.primary,
    fontSize: "17px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingBottom: "12px",
    borderBottom: `2px solid ${t.bg}`,
  },

  header: {
    background: t.white,
    padding: "20px 24px",
    borderRadius: t.radius,
    marginBottom: "20px",
    boxShadow: t.shadow,
    border: `1px solid ${t.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { margin: 0, color: t.primary, fontSize: "22px", fontWeight: "800" },

  progressWrap: { height: "6px", borderRadius: "3px", background: t.bg, marginTop: "6px", overflow: "hidden", width: "200px" },
  progressFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: `linear-gradient(90deg, ${t.secondary}, ${t.primary})`,
    borderRadius: "3px",
    transition: "width 0.4s ease",
  }),

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" },
  field: { marginBottom: "16px" },

  label: { display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px", color: "#333" },
  req:   { color: t.primary, marginLeft: "3px" },

  input: (err) => ({
    width: "100%", padding: "10px 12px", boxSizing: "border-box",
    border: `1.5px solid ${err ? t.errText : t.border}`,
    borderRadius: t.radiusSm, fontSize: "14px", color: "#222",
    background: err ? t.errBg : t.white, outline: "none",
  }),
  textarea: (err) => ({
    width: "100%", padding: "10px 12px", boxSizing: "border-box",
    border: `1.5px solid ${err ? t.errText : t.border}`,
    borderRadius: t.radiusSm, fontSize: "14px", fontFamily: "inherit",
    color: "#222", background: err ? t.errBg : t.white,
    outline: "none", resize: "vertical",
  }),
  select: (err) => ({
    width: "100%", padding: "10px 12px",
    border: `1.5px solid ${err ? t.errText : t.border}`,
    borderRadius: t.radiusSm, fontSize: "14px", color: "#222",
    background: err ? t.errBg : t.white, outline: "none",
  }),

  fieldErr: { marginTop: "5px", fontSize: "12px", color: t.errText, display: "flex", alignItems: "center", gap: "4px" },
  hint:     { marginTop: "5px", fontSize: "12px", color: t.muted },

  alertErr: {
    background: t.errBg, border: `1px solid ${t.errBorder}`,
    padding: "14px 16px", borderRadius: t.radiusSm, marginBottom: "20px",
    color: t.errText, display: "flex", alignItems: "center", gap: "8px", fontSize: "14px",
  },
  alertOk: {
    background: t.okBg, border: `1px solid ${t.okBorder}`,
    padding: "14px 16px", borderRadius: t.radiusSm, marginBottom: "20px",
    color: t.okText, display: "flex", alignItems: "center", gap: "8px",
    fontSize: "14px", fontWeight: "600",
  },

  btnPrimary: (disabled) => ({
    flex: 2, padding: "13px 20px",
    background: disabled ? "#ccc" : `linear-gradient(135deg, ${t.primary}, #8B2840)`,
    color: t.white, border: "none", borderRadius: t.radiusSm,
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: "700", fontSize: "15px",
    boxShadow: disabled ? "none" : "0 2px 8px rgba(103,30,48,0.35)",
    transition: "opacity 0.2s",
  }),
  btnSecondary: {
    flex: 1, padding: "13px 20px",
    background: t.accent, color: "#1A1A1A", border: "none",
    borderRadius: t.radiusSm, cursor: "pointer", fontWeight: "600", fontSize: "14px",
  },
  btnBack: {
    padding: "9px 18px", background: t.accent, color: "#1A1A1A",
    border: "none", borderRadius: t.radiusSm, cursor: "pointer",
    fontWeight: "600", fontSize: "13px",
  },

  avatarWrap: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" },
  avatarImg: {
    width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover",
    border: `3px solid ${t.secondary}`, boxShadow: t.shadow,
  },
  avatarPlaceholder: {
    width: "80px", height: "80px", borderRadius: "50%",
    background: t.bg, border: `2px dashed ${t.border}`,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px",
  },
  fileLabel: {
    display: "inline-block", padding: "8px 16px",
    background: t.bg, border: `1.5px solid ${t.border}`,
    borderRadius: t.radiusSm, cursor: "pointer",
    fontSize: "13px", fontWeight: "600", color: "#333",
  },

  loadingPage: {
    minHeight: "100vh", background: t.bg,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: "16px",
  },
  spinner: {
    width: "40px", height: "40px",
    border: `4px solid ${t.border}`, borderTopColor: t.primary,
    borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },

  checkboxLabel: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", userSelect: "none" },
  checkbox:      { width: "17px", height: "17px", accentColor: t.primary, cursor: "pointer" },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

const PHONE_RE = /^(\+221|00221)?(7[067890]\d{7})$/;

function validateForm(data, role) {
  const errors = {};
  if (!data.firstName.trim()) errors.firstName = "Le prénom est requis.";
  if (!data.lastName.trim())  errors.lastName  = "Le nom est requis.";

  if (data.phone) {
    if (!PHONE_RE.test(data.phone.replace(/\s/g, "")))
      errors.phone = "Numéro invalide. Format : 77XXXXXXX ou +22177XXXXXXX";
  }

  if (role === "prestataire") {
    if (!data.profession.trim()) errors.profession = "La profession est requise.";
    if (!data.hourlyRate)        errors.hourlyRate  = "Le tarif est requis.";
  }
  if (role === "demandeur_emploi") {
    if (!data.profession.trim()) errors.profession  = "La profession est requise.";
    if (!data.contractType)      errors.contractType = "Le type de contrat est requis.";
  }
  if (role === "recruteur") {
    if (!data.companyName.trim()) errors.companyName = "Le nom de l'entreprise est requis.";
  }
  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FORMDATA BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildFormData(data) {
  const fd = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === "avatar" && value instanceof File) { fd.append("avatar", value, value.name); return; }
    if (Array.isArray(value)) { const f = value.filter(Boolean); if (f.length) fd.append(key, f.join(",")); return; }
    if (typeof value === "boolean") { fd.append(key, value ? "true" : "false"); return; }
    if (String(value).trim()) fd.append(key, String(value).trim());
  });
  return fd;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseSkills(skills) {
  if (Array.isArray(skills)) return skills.filter(Boolean);
  if (typeof skills === "string" && skills) return skills.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CUSTOM HOOK
// ─────────────────────────────────────────────────────────────────────────────

function useProfileForm() {
  const [user,         setUser]         = useState(null);
  const [profile,      setProfile]      = useState(null);
  const [formData,     setFormData]     = useState(INITIAL_FORM);
  const [avatarPreview,setAvatarPreview]= useState(null);
  const [fieldErrors,  setFieldErrors]  = useState({});
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [apiError,     setApiError]     = useState("");
  const [success,      setSuccess]      = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) { navigate("/login"); return; }
        setUser(JSON.parse(raw));

        const { data } = await api.get("/profiles/me");
        const p = data.data;
        setProfile(p);

        setFormData({
          ...INITIAL_FORM,
          firstName: p.firstName || "", lastName: p.lastName || "",
          phone: p.phone || "", bio: p.bio || "",
          address: p.address || "", city: p.city || "", region: p.region || "",
          profession: p.profession || "", skills: parseSkills(p.skills),
          experience: p.experience || "", hourlyRate: p.hourlyRate || "",
          availability: p.availability || "disponible",
          transportMode: p.transportMode || "", workZones: p.workZones || "",
          contractType: p.contractType || "", expectedSalary: p.expectedSalary || "",
          availabilityDelay: p.availabilityDelay || "",
          educationLevel: p.educationLevel || "", references: p.references || "",
          hasWorkPermit: p.hasWorkPermit || false,
          companyName: p.companyName || "", companySize: p.companySize || "",
          companySector: p.companySector || "", companyNinea: p.companyNinea || "",
          servicePreferences: p.servicePreferences || "",
          budgetRange: p.budgetRange || "", clientType: p.clientType || "",
          avatar: null,
        });

        if (p.avatarUrl) setAvatarPreview(p.avatarUrl);
      } catch (err) {
        console.error(err);
        setApiError("Impossible de charger le profil.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSkillsChange = useCallback((e) => {
    const arr = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, skills: arr }));
  }, []);

  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFieldErrors((prev) => ({ ...prev, avatar: "Format accepté : JPG, PNG, WebP" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, avatar: "L'image ne doit pas dépasser 5 Mo" }));
      return;
    }
    setFormData((prev) => ({ ...prev, avatar: file }));
    setAvatarPreview(URL.createObjectURL(file));
    setFieldErrors((prev) => ({ ...prev, avatar: undefined }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setApiError(""); setSuccess("");

    const errors = validateForm(formData, user?.role);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

    setSaving(true);
    try {
      const fd = buildFormData(formData);
      const { data } = await api.put("/profiles/me", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Profil mis à jour avec succès !");
      setProfile(data.data);
      setTimeout(() => navigate("/dashboard"), 1600);
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.message || "Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  }, [formData, user, navigate]);

  const needsProfessionalInfo = user?.role === "prestataire" || user?.role === "demandeur_emploi";

  return {
    user, profile, formData, avatarPreview,
    fieldErrors, loading, saving, apiError, success,
    needsProfessionalInfo,
    handleChange, handleSkillsChange, handleAvatarChange, handleSubmit,
    navigate,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PETITS COMPOSANTS PARTAGÉS
// ─────────────────────────────────────────────────────────────────────────────

const FieldError = ({ msg }) =>
  msg ? <p style={S.fieldErr}>⚠ {msg}</p> : null;

const Label = ({ children, required }) => (
  <label style={S.label}>
    {children}
    {required && <span style={S.req}>*</span>}
  </label>
);

const Alert = ({ type, message }) => {
  if (!message) return null;
  return (
    <div style={type === "error" ? S.alertErr : S.alertOk}>
      <span>{type === "error" ? "❌" : "✅"}</span> {message}
    </div>
  );
};

function LoadingPage() {
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={S.loadingPage}>
        <div style={S.spinner} />
        <p style={{ color: t.primary, fontWeight: "600" }}>Chargement du profil…</p>
      </div>
    </>
  );
}

function ProfileProgress({ pct }) {
  return (
    <div>
      <p style={{ margin: "4px 0 2px", color: t.muted, fontSize: "13px" }}>
        Profil complété à <strong>{pct}%</strong>
      </p>
      <div style={S.progressWrap}>
        <div style={S.progressFill(pct)} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. SECTIONS DU FORMULAIRE (mémoïsées)
// ─────────────────────────────────────────────────────────────────────────────

const PersonalInfoSection = memo(({ formData, onChange, onAvatarChange, avatarPreview, errors }) => (
  <div style={S.card}>
    <h3 style={S.cardTitle}>👤 Informations personnelles</h3>

    {/* Avatar */}
    <div style={S.avatarWrap}>
      {avatarPreview
        ? <img src={avatarPreview} alt="Avatar" style={S.avatarImg} />
        : <div style={S.avatarPlaceholder}>🧑</div>
      }
      <div>
        <label style={S.fileLabel} htmlFor="avatarInput">📷 Changer la photo</label>
        <input id="avatarInput" type="file" accept="image/jpeg,image/png,image/webp"
          onChange={onAvatarChange} style={{ display: "none" }} />
        <p style={S.hint}>JPG, PNG ou WebP · max 5 Mo</p>
        <FieldError msg={errors.avatar} />
      </div>
    </div>

    {/* Prénom + Nom */}
    <div style={S.grid2}>
      <div>
        <Label required>Prénom</Label>
        <input type="text" name="firstName" value={formData.firstName} onChange={onChange}
          placeholder="Votre prénom" style={S.input(!!errors.firstName)} />
        <FieldError msg={errors.firstName} />
      </div>
      <div>
        <Label required>Nom</Label>
        <input type="text" name="lastName" value={formData.lastName} onChange={onChange}
          placeholder="Votre nom" style={S.input(!!errors.lastName)} />
        <FieldError msg={errors.lastName} />
      </div>
    </div>

    {/* Téléphone */}
    <div style={S.field}>
      <Label>Téléphone</Label>
      <input type="tel" name="phone" value={formData.phone} onChange={onChange}
        placeholder="77 XXX XX XX ou +221 77 XXX XX XX" style={S.input(!!errors.phone)} />
      <FieldError msg={errors.phone} />
    </div>

    {/* Bio */}
    <div>
      <Label>Bio / Présentation</Label>
      <textarea name="bio" value={formData.bio} onChange={onChange} rows={4}
        placeholder="Parlez de vous en quelques mots..." style={S.textarea(false)} />
    </div>
  </div>
));

// ──────────────────────────────────────────────────────

const LocationSection = memo(({ formData, onChange }) => (
  <div style={S.card}>
    <h3 style={S.cardTitle}>📍 Localisation</h3>

    <div style={S.field}>
      <Label>Adresse</Label>
      <input type="text" name="address" value={formData.address} onChange={onChange}
        placeholder="Ex: Parcelles Assainies, Unité 25" style={S.input(false)} />
    </div>

    <div style={S.grid2}>
      <div>
        <Label>Ville</Label>
        <select name="city" value={formData.city} onChange={onChange} style={S.select(false)}>
          <option value="">Sélectionnez une ville</option>
          {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div>
        <Label>Région</Label>
        <select name="region" value={formData.region} onChange={onChange} style={S.select(false)}>
          <option value="">Sélectionnez une région</option>
          {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
    </div>
  </div>
));

// ──────────────────────────────────────────────────────

const ProfessionalInfoSection = memo(({ formData, onChange, onSkillsChange, errors }) => (
  <div style={S.card}>
    <h3 style={S.cardTitle}>💼 Informations professionnelles</h3>

    <div style={S.field}>
      <Label required>Profession / Métier</Label>
      <input type="text" name="profession" value={formData.profession} onChange={onChange}
        placeholder="Ex: Plombier, Électricien, Gardien, Chauffeur..." style={S.input(!!errors.profession)} />
      <FieldError msg={errors.profession} />
    </div>

    <div style={S.field}>
      <Label>Compétences</Label>
      <input type="text" name="skills"
        value={Array.isArray(formData.skills) ? formData.skills.join(", ") : formData.skills || ""}
        onChange={onSkillsChange}
        placeholder="Ex: Installation électrique, Dépannage, Câblage..."
        style={S.input(false)} />
      <p style={S.hint}>Séparez vos compétences par des virgules</p>
    </div>

    <div>
      <Label>Expérience professionnelle</Label>
      <textarea name="experience" value={formData.experience} onChange={onChange} rows={4}
        placeholder="Décrivez votre parcours professionnel..." style={S.textarea(false)} />
    </div>
  </div>
));

// ──────────────────────────────────────────────────────

const PrestataireSection = memo(({ formData, onChange, errors }) => (
  <div style={S.card}>
    <h3 style={S.cardTitle}>🔧 Informations prestataire</h3>

    <div style={S.field}>
      <Label required>Tarif (FCFA / heure ou par tâche)</Label>
      <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={onChange}
        placeholder="Ex: 5000" min="0" style={S.input(!!errors.hourlyRate)} />
      <FieldError msg={errors.hourlyRate} />
    </div>

    <div style={S.field}>
      <Label>Disponibilité</Label>
      <select name="availability" value={formData.availability} onChange={onChange} style={S.select(false)}>
        <option value="disponible">✅ Disponible maintenant</option>
        <option value="occupe">⏳ Occupé (disponible bientôt)</option>
        <option value="indisponible">❌ Pas disponible</option>
      </select>
    </div>

    <div style={S.field}>
      <Label>Moyen de transport</Label>
      <select name="transportMode" value={formData.transportMode} onChange={onChange} style={S.select(false)}>
        <option value="">Sélectionnez un moyen</option>
        <option value="moto">🏍️ Moto</option>
        <option value="voiture">🚗 Voiture</option>
        <option value="velo">🚲 Vélo</option>
        <option value="pieds">🚶 À pieds</option>
        <option value="transport_commun">🚌 Transport en commun</option>
      </select>
    </div>

    <div>
      <Label>Zones d'intervention</Label>
      <input type="text" name="workZones" value={formData.workZones} onChange={onChange}
        placeholder="Ex: Dakar, Pikine, Guédiawaye" style={S.input(false)} />
      <p style={S.hint}>Indiquez les villes où vous pouvez travailler</p>
    </div>
  </div>
));

// ──────────────────────────────────────────────────────

const DemandeurEmploiSection = memo(({ formData, onChange, errors }) => (
  <div style={S.card}>
    <h3 style={S.cardTitle}>📋 Recherche d'emploi</h3>

    <div style={S.field}>
      <Label required>Type de contrat recherché</Label>
      <select name="contractType" value={formData.contractType} onChange={onChange} style={S.select(!!errors.contractType)}>
        <option value="">Sélectionnez le type</option>
        <option value="cdi">CDI (Contrat à durée indéterminée)</option>
        <option value="cdd">CDD (Contrat temporaire)</option>
        <option value="journalier">Travail à la journée</option>
        <option value="saisonnier">Travail saisonnier</option>
      </select>
      <FieldError msg={errors.contractType} />
    </div>

    <div style={S.field}>
      <Label>Salaire minimum souhaité (FCFA/mois)</Label>
      <input type="number" name="expectedSalary" value={formData.expectedSalary} onChange={onChange}
        placeholder="Ex: 150000" min="0" style={S.input(false)} />
    </div>

    <div style={S.field}>
      <Label>Disponibilité</Label>
      <select name="availabilityDelay" value={formData.availabilityDelay} onChange={onChange} style={S.select(false)}>
        <option value="">Quand pouvez-vous commencer ?</option>
        <option value="immediat">🟢 Immédiatement</option>
        <option value="1semaine">🟡 Dans 1 semaine</option>
        <option value="1mois">🟠 Dans 1 mois</option>
      </select>
    </div>

    <div style={S.field}>
      <Label>Niveau d'études</Label>
      <select name="educationLevel" value={formData.educationLevel} onChange={onChange} style={S.select(false)}>
        <option value="">Sélectionnez votre niveau</option>
        <option value="aucun">Pas de diplôme (expérience pratique)</option>
        <option value="primaire">École primaire</option>
        <option value="college">Collège</option>
        <option value="lycee">Lycée / Bac</option>
        <option value="formation">Formation professionnelle</option>
        <option value="superieur">Études supérieures</option>
      </select>
    </div>

    <div style={S.field}>
      <Label>Références</Label>
      <textarea name="references" value={formData.references} onChange={onChange} rows={3}
        placeholder="Anciens employeurs, numéros de contact..." style={S.textarea(false)} />
    </div>

    <div>
      <label style={S.checkboxLabel}>
        <input type="checkbox" name="hasWorkPermit" checked={formData.hasWorkPermit}
          onChange={onChange} style={S.checkbox} />
        J'ai mes papiers en règle (CNI, certificat de résidence…)
      </label>
    </div>
  </div>
));

// ──────────────────────────────────────────────────────

const RecruteurSection = memo(({ formData, onChange, errors }) => (
  <div style={S.card}>
    <h3 style={S.cardTitle}>🏢 Informations entreprise</h3>

    <div style={S.field}>
      <Label required>Nom de l'entreprise</Label>
      <input type="text" name="companyName" value={formData.companyName} onChange={onChange}
        placeholder="Ex: SONATEL, Entreprise ABC..." style={S.input(!!errors.companyName)} />
      <FieldError msg={errors.companyName} />
    </div>

    <div style={S.field}>
      <Label>Secteur d'activité</Label>
      <select name="companySector" value={formData.companySector} onChange={onChange} style={S.select(false)}>
        <option value="">Sélectionnez le secteur</option>
        <option value="construction">🏗️ Construction / BTP</option>
        <option value="restauration">🍽️ Restauration / Hôtellerie</option>
        <option value="commerce">🛒 Commerce / Vente</option>
        <option value="transport">🚚 Transport / Logistique</option>
        <option value="agriculture">🌾 Agriculture / Pêche</option>
        <option value="services">🔧 Services / Artisanat</option>
        <option value="sante">🏥 Santé</option>
        <option value="education">📚 Éducation / Formation</option>
        <option value="autre">Autre</option>
      </select>
    </div>

    <div style={S.field}>
      <Label>Taille de l'entreprise</Label>
      <select name="companySize" value={formData.companySize} onChange={onChange} style={S.select(false)}>
        <option value="">Sélectionnez la taille</option>
        <option value="1-5">1–5 employés</option>
        <option value="6-20">6–20 employés</option>
        <option value="21-50">21–50 employés</option>
        <option value="50+">Plus de 50 employés</option>
      </select>
    </div>

    <div>
      <Label>Numéro NINEA (facultatif)</Label>
      <input type="text" name="companyNinea" value={formData.companyNinea} onChange={onChange}
        placeholder="Ex: 123456789" style={S.input(false)} />
    </div>
  </div>
));

// ──────────────────────────────────────────────────────

const ClientSection = memo(({ formData, onChange }) => (
  <div style={S.card}>
    <h3 style={S.cardTitle}>🛍️ Préférences client</h3>

    <div style={S.field}>
      <Label>Services recherchés</Label>
      <input type="text" name="servicePreferences" value={formData.servicePreferences} onChange={onChange}
        placeholder="Ex: Plomberie, Jardinage, Électricité..." style={S.input(false)} />
      <p style={S.hint}>Séparez les services par des virgules</p>
    </div>

    <div style={S.field}>
      <Label>Budget habituel</Label>
      <select name="budgetRange" value={formData.budgetRange} onChange={onChange} style={S.select(false)}>
        <option value="">Sélectionnez votre budget</option>
        <option value="0-5000">Moins de 5 000 FCFA</option>
        <option value="5000-15000">5 000 – 15 000 FCFA</option>
        <option value="15000-50000">15 000 – 50 000 FCFA</option>
        <option value="50000+">Plus de 50 000 FCFA</option>
      </select>
    </div>

    <div>
      <Label>Type de client</Label>
      <select name="clientType" value={formData.clientType} onChange={onChange} style={S.select(false)}>
        <option value="">Sélectionnez le type</option>
        <option value="particulier">👤 Particulier (maison / famille)</option>
        <option value="petite_entreprise">🏪 Petite entreprise</option>
      </select>
    </div>
  </div>
));

// ─────────────────────────────────────────────────────────────────────────────
// 9. COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export default function ProfileEdit() {
  const {
    user, profile, formData, avatarPreview,
    fieldErrors, loading, saving, apiError, success,
    needsProfessionalInfo,
    handleChange, handleSkillsChange, handleAvatarChange, handleSubmit,
    navigate,
  } = useProfileForm();

  if (loading) return <LoadingPage />;

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={S.page}>
        <div style={S.container}>

          {/* Header */}
          <div style={S.header}>
            <div>
              <h1 style={S.headerTitle}>Modifier mon profil</h1>
              {profile && <ProfileProgress pct={profile.profileCompleteness} />}
            </div>
            <button style={S.btnBack} onClick={() => navigate("/dashboard")}>← Retour</button>
          </div>

          {/* Alertes */}
          <Alert type="error"   message={apiError} />
          <Alert type="success" message={success}  />

          {/* Formulaire */}
          <form onSubmit={handleSubmit} noValidate>

            <PersonalInfoSection
              formData={formData} onChange={handleChange}
              onAvatarChange={handleAvatarChange}
              avatarPreview={avatarPreview} errors={fieldErrors}
            />

            <LocationSection
              formData={formData} onChange={handleChange} errors={fieldErrors}
            />

            {needsProfessionalInfo && (
              <ProfessionalInfoSection
                formData={formData} onChange={handleChange}
                onSkillsChange={handleSkillsChange} errors={fieldErrors}
              />
            )}

            {user?.role === "prestataire" && (
              <PrestataireSection formData={formData} onChange={handleChange} errors={fieldErrors} />
            )}

            {user?.role === "demandeur_emploi" && (
              <DemandeurEmploiSection formData={formData} onChange={handleChange} errors={fieldErrors} />
            )}

            {user?.role === "recruteur" && (
              <RecruteurSection formData={formData} onChange={handleChange} errors={fieldErrors} />
            )}

            {user?.role === "client" && (
              <ClientSection formData={formData} onChange={handleChange} errors={fieldErrors} />
            )}

            {/* Boutons d'action */}
            <div style={{ ...S.card, display: "flex", gap: "12px", marginBottom: 0 }}>
              <button type="button" style={S.btnSecondary} onClick={() => navigate("/dashboard")}>
                Annuler
              </button>
              <button type="submit" disabled={saving} style={S.btnPrimary(saving)}>
                {saving ? "⏳ Enregistrement…" : "💾 Enregistrer les modifications"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
