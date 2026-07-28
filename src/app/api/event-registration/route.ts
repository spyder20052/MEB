import { NextRequest, NextResponse } from "next/server";
import { eventRegistrationSchema } from "@/lib/schemas";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendMail, CONTACT_EMAIL_TO } from "@/lib/mailer";
import {
  registrationToMebEmail,
  registrationToUserEmail,
  type EventSummary,
} from "@/lib/emails";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

// POST /api/event-registration — inscription à un événement (BACKEND.md §6.2).
// Le décompte des places est atomique côté base (RPC register_for_event) :
// deux inscriptions simultanées sur la dernière place sont départagées par Postgres.
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(`event-reg:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Trop d'inscriptions envoyées. Réessaie dans quelques minutes." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    // Honeypot anti-bot.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const parsed = eventRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const supabase = createSupabaseAdminClient();
    const { data: result, error: rpcError } = await supabase.rpc("register_for_event", {
      p_event_num: data.eventNum,
      p_name: data.name,
      p_whatsapp: data.whatsapp,
      p_email: data.email || null,
    });

    if (rpcError) {
      console.error("[api/event-registration] rpc:", rpcError.message);
      return NextResponse.json(
        { error: "L'inscription a échoué. Réessaie ou écris-nous sur WhatsApp." },
        { status: 500 }
      );
    }

    if (!result?.ok) {
      if (result?.code === "complet") {
        return NextResponse.json(
          { error: "Cet événement est complet. Inscris-toi à la prochaine édition !" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Cet événement n'est plus disponible." },
        { status: 404 }
      );
    }

    const event = result.event as EventSummary;

    try {
      const mebMail = registrationToMebEmail({
        name: data.name,
        whatsapp: data.whatsapp,
        email: data.email || undefined,
        event,
      });
      await sendMail({
        to: CONTACT_EMAIL_TO,
        subject: mebMail.subject,
        html: mebMail.html,
        replyTo: data.email || undefined,
      });

      if (data.email) {
        const userMail = registrationToUserEmail({ name: data.name, event });
        await sendMail({ to: data.email, subject: userMail.subject, html: userMail.html });
      }
    } catch (mailError) {
      console.error("[api/event-registration] envoi e-mail:", mailError);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/event-registration] échec:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessaie ou écris-nous sur WhatsApp." },
      { status: 500 }
    );
  }
}
