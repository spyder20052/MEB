import { NextRequest, NextResponse } from "next/server";
import { rdvSchema, SERVICE_LABELS } from "@/lib/schemas";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendMail, CONTACT_EMAIL_TO } from "@/lib/mailer";
import { rdvToMebEmail, rdvToUserEmail } from "@/lib/emails";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

// POST /api/rdv — formulaire de prise de rendez-vous (BACKEND.md §6.1)
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(`rdv:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Trop de demandes envoyées. Réessaie dans quelques minutes." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    // Honeypot : le champ "website" est invisible pour un humain.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    // Revalidation serveur avec le même schéma Zod que le client.
    const parsed = rdvSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const supabase = createSupabaseAdminClient();
    const { error: insertError } = await supabase.from("rdv_requests").insert({
      full_name: data.fullName,
      whatsapp: data.whatsapp,
      email: data.email || null,
      service: data.service,
      project_description: data.projectDescription || null,
      newsletter: data.newsletter,
    });
    if (insertError) {
      console.error("[api/rdv] insertion:", insertError.message);
      return NextResponse.json(
        { error: "L'enregistrement a échoué. Réessaie ou écris-nous sur WhatsApp." },
        { status: 500 }
      );
    }

    // Inscription newsletter si consentement donné.
    if (data.newsletter && data.email) {
      await supabase
        .from("newsletter_subscribers")
        .upsert({ email: data.email, source: "rdv" }, { onConflict: "email" });
    }

    const serviceLabel = SERVICE_LABELS[data.service] ?? data.service;

    // E-mails : la demande est déjà enregistrée, un échec d'envoi ne doit
    // pas faire échouer la requête — il est loggé pour suivi.
    try {
      const mebMail = rdvToMebEmail({ ...data, service: serviceLabel });
      await sendMail({
        to: CONTACT_EMAIL_TO,
        subject: mebMail.subject,
        html: mebMail.html,
        replyTo: data.email || undefined,
      });

      if (data.email) {
        const userMail = rdvToUserEmail({
          fullName: data.fullName,
          service: serviceLabel,
          whatsapp: data.whatsapp,
        });
        await sendMail({ to: data.email, subject: userMail.subject, html: userMail.html });
      }
    } catch (mailError) {
      console.error("[api/rdv] envoi e-mail:", mailError);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/rdv] échec:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessaie ou écris-nous sur WhatsApp." },
      { status: 500 }
    );
  }
}
