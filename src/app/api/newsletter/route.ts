import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/schemas";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/mailer";
import { newsletterWelcomeEmail } from "@/lib/emails";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

// POST /api/newsletter — inscription depuis le pied de page (BACKEND.md §6.3)
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(`newsletter:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessaie dans quelques minutes." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Adresse e-mail invalide." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    // upsert : se réinscrire ne crée pas de doublon (email unique).
    const { data: subscriber, error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email: parsed.data.email.toLowerCase(), source: parsed.data.source },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    if (error || !subscriber) {
      console.error("[api/newsletter] insertion:", error?.message);
      return NextResponse.json(
        { error: "L'inscription a échoué. Réessaie plus tard." },
        { status: 500 }
      );
    }

    try {
      const mail = newsletterWelcomeEmail(subscriber.id);
      await sendMail({ to: parsed.data.email, subject: mail.subject, html: mail.html });
    } catch (mailError) {
      console.error("[api/newsletter] envoi e-mail:", mailError);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/newsletter] échec:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessaie plus tard." },
      { status: 500 }
    );
  }
}
