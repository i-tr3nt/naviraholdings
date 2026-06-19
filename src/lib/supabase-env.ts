/** Normalize Vite env values (handles accidental quotes in .env). */
export function readEnv(key: string): string {
  const raw = import.meta.env[key];
  if (typeof raw !== "string") return "";
  return raw.trim().replace(/^["']|["']$/g, "");
}

export function getSupabaseConfig() {
  const url = readEnv("VITE_SUPABASE_URL");
  const key = readEnv("VITE_SUPABASE_PUBLISHABLE_KEY");
  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export function formatAuthError(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message;
    if (msg === "Failed to fetch" || msg.includes("fetch failed") || msg.includes("NetworkError")) {
      return (
        "Cannot reach Supabase. Check your internet connection and that VITE_SUPABASE_URL in .env " +
        "matches an active project (Settings → API in the Supabase dashboard). Restart the dev server after changing .env."
      );
    }
    return msg;
  }
  return "Something went wrong";
}
