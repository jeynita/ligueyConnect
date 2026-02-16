// // // import { useState } from "react";

// // // export default function Register() {
// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");

// // //   const handleRegister = async (e) => {
// // //     e.preventDefault();

// // //     const res = await fetch("http://localhost:5000/api/auth/register", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({ email, password })
// // //     });

// // //     const data = await res.json();
// // //     console.log(data);
// // //   };

// // //   return (
// // //     <form onSubmit={handleRegister}>
// // //       <input
// // //         placeholder="Email"
// // //         value={email}
// // //         onChange={(e) => setEmail(e.target.value)}
// // //       />
// // //       <input
// // //         type="password"
// // //         placeholder="Password"
// // //         value={password}
// // //         onChange={(e) => setPassword(e.target.value)}
// // //       />
// // //       <button type="submit">Register</button>
// // //     </form>
// // //   );
// // // }


// // import { useState } from "react";
// // import { register } from "../services/api";
// // import { useNavigate } from "react-router-dom";

// // export default function Register() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [role, setRole] = useState("demandeur"); // ⬅️ IMPORTANT: Champ manquant
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate();

// //   const handleRegister = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setLoading(true);

// //     try {
// //       // Utilise la fonction register de api.js
// //       const res = await register(email, password, role);
// //       console.log("✅ Inscription réussie:", res);
      
// //       // Rediriger vers le dashboard
// //       navigate("/dashboard");
// //     } catch (err) {
// //       console.error("❌ Erreur inscription:", err);
// //       setError(err.error || err.errors?.[0]?.msg || "Erreur d'inscription");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
// //       <form onSubmit={handleRegister}>
// //         <h1>Inscription</h1>

// //         {/* Afficher les erreurs */}
// //         {error && (
// //           <div style={{ 
// //             background: "#fee", 
// //             border: "1px solid #fcc", 
// //             padding: "10px", 
// //             marginBottom: "10px",
// //             borderRadius: "4px",
// //             color: "#c33"
// //           }}>
// //             {error}
// //           </div>
// //         )}

// //         {/* Email */}
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           required
// //           style={{ 
// //             width: "100%", 
// //             padding: "10px", 
// //             marginBottom: "10px",
// //             border: "1px solid #ccc",
// //             borderRadius: "4px"
// //           }}
// //         />

// //         {/* Mot de passe */}
// //         <input
// //           type="password"
// //           placeholder="Mot de passe (min 8 caractères)"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //           required
// //           minLength={8}
// //           style={{ 
// //             width: "100%", 
// //             padding: "10px", 
// //             marginBottom: "10px",
// //             border: "1px solid #ccc",
// //             borderRadius: "4px"
// //           }}
// //         />

// //         {/* Rôle - CHAMP IMPORTANT */}
// //         <select
// //           value={role}
// //           onChange={(e) => setRole(e.target.value)}
// //           style={{ 
// //             width: "100%", 
// //             padding: "10px", 
// //             marginBottom: "10px",
// //             border: "1px solid #ccc",
// //             borderRadius: "4px"
// //           }}
// //         >
// //           <option value="demandeur">Demandeur d'emploi</option>
// //           <option value="prestataire">Prestataire de services</option>
// //           <option value="recruteur">Recruteur / Employeur</option>
// //         </select>

// //         {/* Bouton submit */}
// //         <button 
// //           type="submit" 
// //           disabled={loading}
// //           style={{ 
// //             width: "100%", 
// //             padding: "10px", 
// //             background: "#671E30",
// //             color: "white",
// //             border: "none",
// //             borderRadius: "4px",
// //             cursor: loading ? "not-allowed" : "pointer",
// //             opacity: loading ? 0.6 : 1
// //           }}
// //         >
// //           {loading ? "Inscription..." : "S'inscrire"}
// //         </button>

// //         {/* Lien vers login */}
// //         <p style={{ marginTop: "10px", textAlign: "center", fontSize: "14px" }}>
// //           Déjà un compte ?{" "}
// //           <a href="/login" style={{ color: "#671E30", textDecoration: "none" }}>
// //             Se connecter
// //           </a>
// //         </p>
// //       </form>
// //     </div>
// //   );
// // }

// import { useState } from "react";
// import { register } from "../services/api";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await register(email, password);
//       console.log("✅ Inscription réussie:", res);
      
//       // Rediriger vers le dashboard
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("❌ Erreur:", err);
      
//       // Afficher le message d'erreur du backend
//       if (err.errors && err.errors.length > 0) {
//         setError(err.errors[0].message);
//       } else {
//         setError(err.message || "Erreur lors de l'inscription");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
//       <form onSubmit={handleRegister}>
//         <h2>Inscription</h2>

//         {error && (
//           <div style={{ 
//             background: "#fee", 
//             border: "1px solid #fcc",
//             padding: "10px",
//             marginBottom: "10px",
//             borderRadius: "4px",
//             color: "#c33"
//           }}>
//             {error}
//           </div>
//         )}

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ 
//             width: "100%", 
//             padding: "10px", 
//             marginBottom: "10px",
//             border: "1px solid #ccc",
//             borderRadius: "4px"
//           }}
//         />

//         <input
//           type="password"
//           placeholder="Mot de passe (min 8 caractères, 1 maj, 1 min, 1 chiffre)"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           minLength={8}
//           style={{ 
//             width: "100%", 
//             padding: "10px", 
//             marginBottom: "10px",
//             border: "1px solid #ccc",
//             borderRadius: "4px"
//           }}
//         />

//         <button 
//           type="submit" 
//           disabled={loading}
//           style={{ 
//             width: "100%", 
//             padding: "10px", 
//             background: "#671E30",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: loading ? "not-allowed" : "pointer",
//             opacity: loading ? 0.6 : 1
//           }}
//         >
//           {loading ? "Inscription..." : "S'inscrire"}
//         </button>

//         <p style={{ marginTop: "10px", textAlign: "center", fontSize: "14px" }}>
//           Déjà un compte ?{" "}
//           <a href="/login" style={{ color: "#671E30", textDecoration: "none" }}>
//             Se connecter
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { register } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("demandeur"); // ⬅️ NOUVEAU : Champ role
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await register(email, password, role); // ⬅️ Passer le role
      console.log("✅ Inscription réussie:", res);
      
      // Rediriger vers le dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Erreur:", err);
      
      // Afficher le message d'erreur du backend
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || "Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <form onSubmit={handleRegister}>
        <h2>Inscription - Liguey Connect</h2>

        {error && (
          <div style={{ 
            background: "#fee", 
            border: "1px solid #fcc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "4px",
            color: "#c33"
          }}>
            {error}
          </div>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ 
            width: "100%", 
            padding: "10px", 
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />

        {/* Mot de passe */}
        <input
          type="password"
          placeholder="Mot de passe (min 8 car, 1 maj, 1 min, 1 chiffre)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          style={{ 
            width: "100%", 
            padding: "10px", 
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />

        {/* ⬇️ NOUVEAU : Sélection du rôle */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "10px", 
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "white"
          }}
        >
          <option value="demandeur">🏠 Client (cherche un service)</option>
          <option value="demandeur">🔍 Demandeur d'emploi</option>
          <option value="prestataire">🔧 Prestataire de services</option>
          <option value="recruteur">💼 Recruteur / Employeur</option>
        </select>

        {/* Bouton submit */}
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "10px", 
            background: "#671E30",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            fontWeight: "bold"
          }}
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>

        <p style={{ marginTop: "10px", textAlign: "center", fontSize: "14px" }}>
          Déjà un compte ?{" "}
          <a href="/login" style={{ color: "#671E30", textDecoration: "none", fontWeight: "bold" }}>
            Se connecter
          </a>
        </p>
      </form>
    </div>
  );
}
