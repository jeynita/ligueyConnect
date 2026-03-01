import axios from "axios";

// ✅ Dev  → .env.local : VITE_API_URL=http://localhost:5000/api
// ✅ Prod → Vercel env : VITE_API_URL=https://xxx.onrender.com/api
// ⚠️  Ton server.js utilise /api (sans /v1) — on aligne ici
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // false avec JWT Bearer, true seulement avec cookies
});

// ── Intercepteur de requête ───────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Logs uniquement en développement
    if (import.meta.env.DEV) {
      console.log("📡 Appel API vers :", config.url);
      console.log("🔑 TOKEN :", token ? "présent" : "ABSENT");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Intercepteur de réponse ───────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    if (import.meta.env.DEV) {
      console.error(`🚨 Erreur API ${status ?? "réseau"} :`, {
        url:     error.config?.url,
        message: error.response?.data?.message,
        data:    error.response?.data,
      });
    }

    // ✅ À réactiver après stabilisation complète :
    // if (status === 401) {
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("user");
    //   window.location.href = "/login";
    // }

    return Promise.reject(error);
  }
);

// ── Helpers extraction token ──────────────────────────────────────────────────

const extractAuthPayload = (responseData) => {
  if (responseData?.data?.token) return { token: responseData.data.token, user: responseData.data.user ?? null };
  if (responseData?.token)       return { token: responseData.token,      user: responseData.user      ?? null };
  if (responseData?.data?.data?.token) return { token: responseData.data.data.token, user: responseData.data.data.user ?? null };
  console.warn("⚠️ Structure auth inattendue :", responseData);
  return null;
};

const saveAuthToStorage = ({ token, user }) => {
  localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (import.meta.env.DEV) console.log("🔍 [login] response.data :", response.data);
  const payload = extractAuthPayload(response.data);
  if (!payload) throw new Error("Token introuvable dans la réponse du serveur.");
  saveAuthToStorage(payload);
  return payload;
};

export const register = async (email, password, role) => {
  const response = await api.post("/auth/register", { email, password, role });
  if (import.meta.env.DEV) console.log("🔍 [register] response.data :", response.data);
  const payload = extractAuthPayload(response.data);
  if (!payload) throw new Error("Token introuvable dans la réponse du serveur.");
  saveAuthToStorage(payload);
  return payload;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default api;
