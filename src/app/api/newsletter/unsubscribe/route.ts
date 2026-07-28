import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// GET /api/newsletter/unsubscribe?id=<uuid> — lien de désinscription
// présent dans chaque e-mail de la newsletter.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  const page = (title: string, message: string) => `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} — MEB</title></head>
<body style="margin:0;font-family:Arial,sans-serif;background:#F5F5F5;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="background:#FFFFFF;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.07);padding:40px;max-width:420px;text-align:center;margin:16px;">
    <div style="width:64px;height:64px;border-radius:50%;background:#E8F5EE;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#00B140" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="4" y="8" width="24" height="18" rx="3"/>
        <polyline points="5,10 16,19 27,10"/>
      </svg>
    </div>
    <h1 style="font-size:20px;color:#1A1A2E;margin:0 0 12px;">${title}</h1>
    <p style="font-size:14px;color:#555555;line-height:1.7;margin:0 0 24px;">${message}</p>
    <a href="/" style="display:inline-block;background:#00B140;color:#FFFFFF;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:13px;">Retour au site</a>
  </div>
</body>
</html>`;

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!id || !uuidPattern.test(id)) {
    return new NextResponse(page("Lien invalide", "Ce lien de désinscription n'est pas valide."), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);

  if (error) {
    console.error("[api/newsletter/unsubscribe]:", error.message);
    return new NextResponse(
      page("Une erreur est survenue", "La désinscription a échoué. Réessaie plus tard ou écris-nous."),
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  return new NextResponse(
    page("Désinscription confirmée", "Tu ne recevras plus la newsletter de la MEB. Tu peux te réinscrire à tout moment depuis le site."),
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
