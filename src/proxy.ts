import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Proxy d'authentification (convention Next.js 16, ex-middleware) :
// - rafraîchit la session Supabase (cookies) sur chaque requête concernée ;
// - bloque les routes API d'administration sans session valide
//   (défense en profondeur : chaque route revérifie aussi de son côté).
const PROTECTED_API_PREFIXES = ["/api/admin", "/api/upload"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedApi = PROTECTED_API_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );
  if (isProtectedApi && !user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard", "/api/admin/:path*", "/api/upload"],
};
