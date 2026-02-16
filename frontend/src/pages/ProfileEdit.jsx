        import { useState, useEffect } from "react";
        import { useNavigate } from "react-router-dom";
        import api from "../services/api";

        export default function ProfileEdit() {
        const [user, setUser] = useState(null);
        const [profile, setProfile] = useState(null);
        const [loading, setLoading] = useState(true);
        const [saving, setSaving] = useState(false);
        const [error, setError] = useState("");
        const [success, setSuccess] = useState("");
        const navigate = useNavigate();

        const [formData, setFormData] = useState({
            firstName: "",
            lastName: "",
            phone: "",
            bio: "",
            address: "",
            city: "",
            region: "",
            profession: "",
            skills: [],
            experience: "",
            hourlyRate: "",
            availability: "disponible",
            companyName: "",
            companySize: ""
        });

        // Charger le profil au montage du composant
        useEffect(() => {
            loadProfile();
        }, []);

        const loadProfile = async () => {
            try {
            const userData = localStorage.getItem("user");
            if (!userData) {
                navigate("/login");
                return;
            }
            setUser(JSON.parse(userData));

            const response = await api.get("/profiles/me");
            const profileData = response.data.data;
            setProfile(profileData);

            // Remplir le formulaire avec les données existantes
            setFormData({
                firstName: profileData.firstName || "",
                lastName: profileData.lastName || "",
                phone: profileData.phone || "",
                bio: profileData.bio || "",
                address: profileData.address || "",
                city: profileData.city || "",
                region: profileData.region || "",
                profession: profileData.profession || "",
                skills: profileData.skills || [],
                experience: profileData.experience || "",
                hourlyRate: profileData.hourlyRate || "",
                availability: profileData.availability || "disponible",
                companyName: profileData.companyName || "",
                companySize: profileData.companySize || ""
            });

            } catch (err) {
            console.error("Erreur chargement profil:", err);
            setError("Impossible de charger le profil");
            } finally {
            setLoading(false);
            }
        };

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({
            ...prev,
            [name]: value
            }));
        };

        const handleSkillsChange = (e) => {
            const skillsText = e.target.value;
            const skillsArray = skillsText.split(',').map(s => s.trim()).filter(s => s);
            setFormData(prev => ({
            ...prev,
            skills: skillsArray
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError("");
            setSuccess("");
            setSaving(true);

            try {
            const response = await api.put("/profiles/me", formData);
            setSuccess("Profil mis à jour avec succès !");
            setProfile(response.data.data);
            
            // Rediriger vers le dashboard après 1,5 secondes
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);

            } catch (err) {
            console.error("Erreur mise à jour:", err);
            setError(err.response?.data?.message || "Erreur lors de la mise à jour");
            } finally {
            setSaving(false);
            }
        };

        if (loading) {
            return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                Chargement du profil...
            </div>
            );
        }

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

        return (
            <div style={{ minHeight: "100vh", background: "#F0F0E8", padding: "20px" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                
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
                    Modifier mon profil
                    </h1>
                    {profile && (
                    <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
                        Profil complété à {profile.profileCompleteness}%
                    </p>
                    )}
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
                
                {/* Informations personnelles */}
                <div style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                    <h3 style={{ margin: "0 0 20px 0", color: "#671E30" }}>
                    👤 Informations personnelles
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                        Prénom
                        </label>
                        <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
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
                        Nom
                        </label>
                        <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
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

                    <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                        Téléphone
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="771234567 ou +221771234567"
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
                        Bio / Présentation
                    </label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Parlez de vous en quelques mots..."
                        style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontFamily: "inherit"
                        }}
                    />
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

                    <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                        Adresse
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Ex: Parcelles Assainies, Unité 25"
                        style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px"
                        }}
                    />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                        Ville
                        </label>
                        <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
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
                </div>

                {/* Informations professionnelles (suite dans le prochain message) */}
    {/* Informations professionnelles */}
            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h3 style={{ margin: "0 0 20px 0", color: "#671E30" }}>
                💼 Informations professionnelles
                </h3>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Profession / Métier
                </label>
                <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder="Ex: Plombier, Électricien, Développeur Web..."
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
                    Compétences (séparées par des virgules)
                </label>
                <input
                    type="text"
                    name="skills"
                    value={formData.skills.join(', ')}
                    onChange={handleSkillsChange}
                    placeholder="Ex: Installation électrique, Dépannage, Câblage..."
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px"
                    }}
                />
                <small style={{ color: "#666", fontSize: "12px" }}>
                    Entrez vos compétences séparées par des virgules
                </small>
                </div>

                <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Expérience professionnelle
                </label>
                <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Décrivez votre parcours professionnel..."
                    style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontFamily: "inherit"
                    }}
                />
                </div>
            </div>

            {/* Champs spécifiques aux prestataires */}
            {user && user.role === "prestataire" && (
                <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                <h3 style={{ margin: "0 0 20px 0", color: "#671E30" }}>
                    🔧 Informations prestataire
                </h3>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Tarif horaire (FCFA)
                    </label>
                    <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    placeholder="Ex: 5000"
                    min="0"
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
                    Disponibilité
                    </label>
                    <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        background: "white"
                    }}
                    >
                    <option value="disponible">✅ Disponible</option>
                    <option value="occupe">⏳ Occupé</option>
                    <option value="indisponible">❌ Indisponible</option>
                    </select>
                </div>
                </div>
            )}

            {/* Champs spécifiques aux recruteurs */}
            {user && user.role === "recruteur" && (
                <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                <h3 style={{ margin: "0 0 20px 0", color: "#671E30" }}>
                    🏢 Informations entreprise
                </h3>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>
                    Nom de l'entreprise
                    </label>
                    <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Ex: SONATEL, Entreprise ABC..."
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
                    Taille de l'entreprise
                    </label>
                    <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        background: "white"
                    }}
                    >
                    <option value="">Sélectionnez la taille</option>
                    <option value="1-10">1-10 employés</option>
                    <option value="11-50">11-50 employés</option>
                    <option value="51-200">51-200 employés</option>
                    <option value="201-500">201-500 employés</option>
                    <option value="500+">Plus de 500 employés</option>
                    </select>
                </div>
                </div>
            )}

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
                disabled={saving}
                style={{
                    flex: 1,
                    padding: "12px",
                    background: "#671E30",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    opacity: saving ? 0.6 : 1
                }}
                >
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    }