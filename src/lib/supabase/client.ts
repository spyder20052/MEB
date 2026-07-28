"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Client Supabase côté navigateur (clé anon + session admin éventuelle).
// Singleton : un seul client pour toute l'application.
let client: SupabaseClient | undefined;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
