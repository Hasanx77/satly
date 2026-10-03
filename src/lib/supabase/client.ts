import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Tarayıcı tarafı Supabase istemcisi.
 * Ortam değişkenleri yoksa null döner; uygulama yerel modda (localStorage) çalışmaya devam eder.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!cached) {
    cached = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    );
  }
  return cached;
}
