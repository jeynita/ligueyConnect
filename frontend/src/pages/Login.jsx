// // import { useState } from "react";
// // import api from "../services/api";
// // import { useNavigate } from "react-router-dom";

// // export default function Login() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const navigate = useNavigate();

// //   const handleLogin = async () => {
// //     try {
// //       const res = await api.post("/auth/login", { email, password });
// //       localStorage.setItem("token", res.data.token);
// //       navigate("/dashboard");
// //     } catch (err) {
// //       alert("Login failed");
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Login</h2>
// //       <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
// //       <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
// //       <button onClick={handleLogin}>Login</button>
// //     </div>
// //   );
// // }


// // import { useState } from "react";
// // import { login } from "../services/api";

// // export default function Login() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   const handleSubmit = async () => {
// //     const res = await login(email, password);
// //     console.log(res);
// //   };

// //   return (
// //     <div>
// //       <h1>Login</h1>

// //       <input
// //         placeholder="Email"
// //         value={email}
// //         onChange={(e) => setEmail(e.target.value)}
// //       />

// //       <input
// //         type="password"
// //         placeholder="Password"
// //         value={password}
// //         onChange={(e) => setPassword(e.target.value)}
// //       />

// //       <button onClick={handleSubmit}>Login</button>
// //     </div>
// //   );
// // }


// import { useState } from "react";
// import { login } from "../services/api";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await login(email, password);
//       console.log("✅ Connexion réussie:", res);
      
//       // Rediriger vers le dashboard
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("❌ Erreur login:", err);
//       setError(err.error || "Email ou mot de passe incorrect");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
//       <form onSubmit={handleSubmit}>
//         <h1>Connexion</h1>

//         {error && (
//           <div style={{ 
//             background: "#fee", 
//             border: "1px solid #fcc", 
//             padding: "10px", 
//             marginBottom: "10px",
//             borderRadius: "4px"
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
//           placeholder="Mot de passe"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
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
//           {loading ? "Connexion..." : "Se connecter"}
//         </button>

//         <p style={{ marginTop: "10px", textAlign: "center" }}>
//           Pas de compte ?{" "}
//           <a href="/register" style={{ color: "#671E30" }}>
//             S'inscrire
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      console.log("✅ Connexion réussie:", res);
      
      // Rediriger vers le dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Erreur login:", err);
      setError(err.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <form onSubmit={handleSubmit}>
        <h1>Connexion</h1>

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

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ 
            width: "100%", 
            padding: "10px", 
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />

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
            marginBottom: "15px"
          }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          style={{
            background: "none",
            border: "none",
            color: "#CFA65B",
            cursor: "pointer",
            fontSize: "14px",
            textDecoration: "underline"
          }}
        >
          Mot de passe oublié ?
        </button>
      </div>

        <p style={{ marginTop: "10px", textAlign: "center", fontSize: "14px" }}>
          Pas de compte ?{" "}
          <a href="/register" style={{ color: "#671E30", textDecoration: "none" }}>
            S'inscrire
          </a>
        </p>
      </form>
    </div>
  );
}