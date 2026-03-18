import { supabase } from "../lib/supabase";

// ── Auth ──────────────────────────────────────────────────────────────────────

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  // Charger le profil pour avoir le rôle
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  const user = {
    id: data.user.id,
    email: data.user.email,
    role: profile?.role || "client",
  };

  localStorage.setItem("user", JSON.stringify(user));
  return { user, session: data.session };
};

export const register = async (email, password, role) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role },
      emailRedirectTo: `${window.location.origin}/login`,
    },
  });
  if (error) throw new Error(error.message);

  const user = {
    id: data.user.id,
    email: data.user.email,
    role: role || "client",
  };

  localStorage.setItem("user", JSON.stringify(user));
  return { user, session: data.session };
};

export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("user");
};

export const forgotPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw new Error(error.message);
};

export const resetPassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
};

// ── Helpers ───────────────────────────────────────────────────────────────────

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// ── Export par défaut (compatibilité) ─────────────────────────────────────────
// On n'utilise plus axios, on exporte supabase directement
export default supabase;
