// Fonctions CRUD centralisées pour chaque ressource Supabase
import { supabase } from "../lib/supabase";

// ──────────────── SERVICES ────────────────
export const createService = async (service) => {
  const { data, error } = await supabase.from("services").insert([service]).select().single();
  if (error) throw error;
  return data;
};

export const getServicesByUser = async (userId) => {
  const { data, error } = await supabase.from("services").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const updateService = async (id, updates) => {
  const { data, error } = await supabase.from("services").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
};

export const deleteService = async (id) => {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
};

// ──────────────── OFFRES ────────────────
export const createOffre = async (offre) => {
  const { data, error } = await supabase.from("offres").insert([offre]).select().single();
  if (error) throw error;
  return data;
};

export const getOffresByUser = async (userId) => {
  const { data, error } = await supabase.from("offres").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const updateOffre = async (id, updates) => {
  const { data, error } = await supabase.from("offres").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
};

export const deleteOffre = async (id) => {
  const { error } = await supabase.from("offres").delete().eq("id", id);
  if (error) throw error;
};

// ──────────────── CANDIDATURES ────────────────
export const createCandidature = async (candidature) => {
  const { data, error } = await supabase.from("candidatures").insert([candidature]).select().single();
  if (error) throw error;
  return data;
};

export const getCandidaturesByUser = async (userId) => {
  const { data, error } = await supabase.from("candidatures").select("*, offres(*, profiles(*))").eq("candidat_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const updateCandidature = async (id, updates) => {
  const { data, error } = await supabase.from("candidatures").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
};

export const deleteCandidature = async (id) => {
  const { error } = await supabase.from("candidatures").delete().eq("id", id);
  if (error) throw error;
};

// ──────────────── MESSAGES ────────────────
export const createMessage = async (message) => {
  const { data, error } = await supabase.from("messages").insert([message]).select().single();
  if (error) throw error;
  return data;
};

export const getMessagesBetweenUsers = async (userId1, userId2) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
};

// ──────────────── PROFILS ────────────────
export const getProfile = async (id) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
};

export const updateProfile = async (id, updates) => {
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
};