import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

// Client Supabase côté serveur (route handlers / server components),
// authentifié via les cookies de session posés par le navigateur.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Appelé depuis un Server Component : les cookies seront
            // rafraîchis par le middleware, on peut ignorer.
          }
        },
      },
    }
  );
}

// Renvoie l'admin connecté, ou null. À appeler dans chaque route API
// d'écriture avant toute opération.
export async function getAuthenticatedAdmin(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}
