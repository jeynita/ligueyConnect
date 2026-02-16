// // import axios from "axios";

// // const api = axios.create({
// //   baseURL: "http://localhost:5000/api",
// // });

// // api.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("token");
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }
// //   return config;
// // });

// // export default api;


// // // const API_URL = "http://localhost:3000/api";

// // // export async function login(email, password) {
// // //   const res = await fetch(`${API_URL}/auth/login`, {
// // //     method: "POST",
// // //     headers: { "Content-Type": "application/json" },
// // //     body: JSON.stringify({ email, password }),
// // //   });

// // //   return res.json();
// // // }

// import axios from "axios";

// const API_URL = "http://localhost:5000/api"; // ⚠️ IMPORTANT: Port 5000 (ton backend)

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Intercepteur pour ajouter le token JWT automatiquement
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ==================== FONCTION LOGIN ====================
// export const login = async (email, password) => {
//   try {
//     const response = await api.post("/auth/login", { email, password });
    
//     // Sauvegarder le token
//     if (response.data.token) {
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("user", JSON.stringify(response.data.user));
//     }
    
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// // ==================== FONCTION REGISTER ====================
// export const register = async (email, password, role) => {
//   try {
//     const response = await api.post("/auth/register", { email, password, role });
    
//     // Sauvegarder le token
//     if (response.data.token) {
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("user", JSON.stringify(response.data.user));
//     }
    
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// // ==================== FONCTION LOGOUT ====================
// export const logout = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
// };

// // Export par défaut
// export default api;

import axios from "axios";

const API_URL = "http://localhost:3000/api"; // ⬅️ PORT 3000 (ton backend)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token JWT automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== FONCTION LOGIN ====================
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    
    // ⬅️ IMPORTANT: Ton backend retourne data.data.token (pas data.token)
    if (response.data.success && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    
    return response.data.data; // Retourne { user, token }
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ==================== FONCTION REGISTER ====================
export const register = async (email, password, role) => {
  try {
    const response = await api.post("/auth/register", { email, password, role });
    
    // Sauvegarder le token
    if (response.data.success && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    
    return response.data.data; // Retourne { user, token }
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ==================== FONCTION LOGOUT ====================
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Export par défaut
export default api;