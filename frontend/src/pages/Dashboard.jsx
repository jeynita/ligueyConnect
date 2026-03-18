import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ serviceCount: null });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      if (parsedUser.role === "prestataire") {
        loadServiceStats(parsedUser.id);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const loadServiceStats = async (userId) => {
    try {
      const { count } = await supabase
        .from("services")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      setStats({ serviceCount: count || 0 });
    } catch (err) {
      console.error("Erreur chargement stats services:", err);
      setStats({ serviceCount: 0 });
    }
  };

  const getServiceCountLabel = () => {
    const { serviceCount } = stats;
    if (serviceCount === null) return "Chargement...";
    if (serviceCount === 0) return "Aucun service publie";
    return `${serviceCount} service${serviceCount > 1 ? "s" : ""} en ligne`;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Chargement...
      </div>
    );
  }

  const getRoleDisplay = (role) => {
    const roles = {
      client: { emoji: "", name: "Client particulier" },
      demandeur: { emoji: "", name: "Demandeur d'emploi" },
      prestataire: { emoji: "", name: "Prestataire de services" },
      recruteur: { emoji: "", name: "Recruteur" },
      admin: { emoji: "", name: "Administrateur" }
    };
    return roles[role] || { emoji: "", name: role };
  };

  const roleDisplay = getRoleDisplay(user.role);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F0E8", padding: "20px" }}>
      {/* En-tete */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, color: "#671E30", fontSize: "24px" }}>
              Liguey Connect
            </h1>
            <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
              Tableau de bord
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              background: "#671E30",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Se deconnecter
          </button>
        </div>
      </div>

      {/* Carte de bienvenue */}
      <div style={{
        background: "linear-gradient(135deg, #671E30 0%, #CFA65B 100%)",
        padding: "30px",
        borderRadius: "8px",
        marginBottom: "20px",
        color: "white",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ margin: 0, fontSize: "28px" }}>
          Bienvenue !
        </h2>
        <p style={{ margin: "10px 0 0 0", fontSize: "16px", opacity: 0.9 }}>
          {user.email}
        </p>
        <p style={{
          margin: "10px 0 0 0",
          fontSize: "14px",
          background: "rgba(255,255,255,0.2)",
          padding: "5px 10px",
          borderRadius: "4px",
          display: "inline-block"
        }}>
          {roleDisplay.name}
        </p>
      </div>

      {/* Contenu selon le role */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>

        {/* Carte : Mon profil */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>
            Mon profil
          </h3>
          <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#666" }}>
            Completez votre profil pour etre plus visible
          </p>
          <button
            onClick={() => navigate("/profile/edit")}
            style={{
              padding: "10px 15px",
              background: "#CFA65B",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
              fontWeight: "bold"
            }}
          >
            Completer mon profil
          </button>
        </div>

        {/* CLIENT */}
        {user.role === "client" && (
          <>
            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>
                Trouver un prestataire
              </h3>
              <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#666" }}>
                Recherchez des artisans et services de proximite
              </p>
              <button
                onClick={() => navigate("/services/search")}
                style={{
                  padding: "10px 15px",
                  background: "#671E30",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%",
                  fontWeight: "bold"
                }}
              >
                Rechercher
              </button>
            </div>
          </>
        )}

        {/* DEMANDEUR */}
        {user.role === "demandeur" && (
          <>
            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>
                Offres d'emploi
              </h3>
              <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#666" }}>
                Consultez les offres CDD, CDI et missions
              </p>
              <button
                onClick={() => navigate("/offres/search")}
                style={{
                  padding: "10px 15px",
                  background: "#671E30",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%",
                  fontWeight: "bold"
                }}
              >
                Voir les offres
              </button>
            </div>

            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>
                Mes candidatures
              </h3>
              <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#666" }}>
                Suivez vos candidatures envoyees
              </p>
              <button
                onClick={() => navigate("/candidatures")}
                style={{
                  padding: "10px 15px",
                  background: "#CFA65B",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%",
                  fontWeight: "bold"
                }}
              >
                Voir mes candidatures
              </button>
            </div>
          </>
        )}

        {/* PRESTATAIRE */}
        {user.role === "prestataire" && (
          <>
            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>
                Publier un service
              </h3>
              <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#666" }}>
                Ajoutez vos competences et services proposes
              </p>
              <button
                onClick={() => navigate("/services/create")}
                style={{
                  padding: "10px 15px",
                  background: "#671E30",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%",
                  fontWeight: "bold"
                }}
              >
                Ajouter un service
              </button>
            </div>

            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>
                Mes services
              </h3>
              <p style={{
                margin: "0 0 10px 0",
                fontSize: "14px",
                color: stats.serviceCount > 0 ? "#2E7D32" : "#666",
                fontWeight: stats.serviceCount > 0 ? "600" : "normal",
              }}>
                {getServiceCountLabel()}
              </p>
              <button
                onClick={() => navigate("/services/me")}
                style={{
                  padding: "10px 15px",
                  background: "#CFA65B",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%",
                  fontWeight: "bold"
                }}
              >
                Voir mes services
              </button>
            </div>
          </>
        )}

        {/* RECRUTEUR */}
        {user.role === "recruteur" && (
          <>
            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>
                Publier une offre
              </h3>
              <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#666" }}>
                Creez une offre d'emploi CDD, CDI ou mission
              </p>
              <button
                onClick={() => navigate("/offres/create")}
                style={{
                  padding: "10px 15px",
                  background: "#671E30",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%",
                  fontWeight: "bold"
                }}
              >
                Creer une offre
              </button>
            </div>

            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>
                Mes offres
              </h3>
              <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#666" }}>
                Gerez vos offres publiees
              </p>
              <button
                onClick={() => navigate("/offres/me")}
                style={{
                  padding: "10px 15px",
                  background: "#CFA65B",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%",
                  fontWeight: "bold"
                }}
              >
                Voir mes offres
              </button>
            </div>
          </>
        )}

        {/* Messages (pour tous) */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#671E30" }}>
            Messages
          </h3>
          <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#666" }}>
            Communiquez avec les utilisateurs
          </p>
          <button
            onClick={() => navigate("/messages")}
            style={{
              padding: "10px 15px",
              background: "#CFA65B",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
              fontWeight: "bold"
            }}
          >
            Voir mes messages
          </button>
        </div>
      </div>
    </div>
  );
}
