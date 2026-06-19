import { isSupabaseConfigured, readEnv } from "@/lib/supabase-env";

/** Run without a live Supabase project (preview / Render before env vars are set). */
export function isDemoMode(): boolean {
  if (readEnv("VITE_DEMO_MODE") === "true") return true;
  if (readEnv("VITE_IGNORE_SUPABASE") === "true") return true;
  return !isSupabaseConfigured();
}
