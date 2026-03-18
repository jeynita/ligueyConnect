import { createClient } from "@supabase/supabase-js";

// Hardcodé (comme demandé)
const HARDCODED_SUPABASE_URL = "https://jpxwjtulpmeymyzobrah.supabase.co";
const HARDCODED_SUPABASE_PUBLISHABLE_DEFAULT_KEY =
  "sb_publishable_2ONk0IMVw6lkv7fvIwyLZw_9gGuPv0x";

// Fallback env (utile si tu veux re-basculer plus tard)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || HARDCODED_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  HARDCODED_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
