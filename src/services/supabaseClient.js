import { createClient } from "@supabase/supabase-js";

// use distinct env var names to avoid collisions and make secrets explicit
const SUPABASE_URL = process.env.REACT_APP_PP_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.REACT_APP_PP_SUPABASE_KEY || "";

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
}

if (!supabase) {
  // helpful hint during development when env vars are missing
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase not configured — set REACT_APP_PP_SUPABASE_URL and REACT_APP_PP_SUPABASE_KEY in .env.local"
  );
}

export const isSupabaseConfigured = !!supabase;

export default supabase;
