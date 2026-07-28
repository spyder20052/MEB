import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";
import { sendMail } from "@/lib/mailer";
import { adminInviteEmail } from "@/lib/emails";

// Gestion des comptes administrateurs (Supabase Auth).
// Toutes les opérations exigent une session admin valide.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const inviteSchema = z.object({
  email: z.string().email("Adresse e-mail invalide."),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères.").optional(),
});

// GET /api/admin/admins — liste des administrateurs
export async function GET() {
  const me = await getAuthenticatedAdmin();
  if (!me) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 200 });
  if (error) {
    console.error("[api/admin/admins] listUsers:", error.message);
    return NextResponse.json({ error: "Impossible de charger la liste." }, { status: 500 });
  }

  const admins = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    name: (u.user_metadata?.name as string) ?? null,
    createdAt: u.created_at,
    lastSignInAt: u.last_sign_in_at ?? null,
    // Tant que l'invité n'a pas défini son mot de passe, le compte est "en attente".
    pending: !u.last_sign_in_at,
    isMe: u.id === me.id,
  }));

  return NextResponse.json({ admins });
}

// POST /api/admin/admins — invite un nouvel administrateur par e-mail.
// L'invité reçoit un lien pour définir lui-même son mot de passe.
export async function POST(req: NextRequest) {
  const me = await getAuthenticatedAdmin();
  if (!me) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Requête invalide." },
      { status: 400 }
    );
  }
  const email = parsed.data.email.toLowerCase();
  const supabase = createSupabaseAdminClient();

  // Si un compte invité n'a jamais été activé, on le supprime pour
  // pouvoir régénérer une invitation fraîche ("Renvoyer l'invitation").
  const { data: existing } = await supabase.auth.admin.listUsers({ perPage: 200 });
  const existingUser = existing?.users.find((u) => u.email?.toLowerCase() === email);
  if (existingUser) {
    if (existingUser.last_sign_in_at) {
      return NextResponse.json(
        { error: "Un administrateur actif utilise déjà cette adresse." },
        { status: 409 }
      );
    }
    await supabase.auth.admin.deleteUser(existingUser.id);
  }

  // Crée le compte et génère le lien d'invitation SANS que Supabase
  // n'envoie d'e-mail : l'envoi passe par notre SMTP (MailHog en dev).
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: "invite",
    email,
    options: {
      data: parsed.data.name ? { name: parsed.data.name } : undefined,
      redirectTo: `${SITE_URL}/dashboard/definir-mot-de-passe`,
    },
  });

  if (linkError || !linkData) {
    console.error("[api/admin/admins] generateLink:", linkError?.message);
    return NextResponse.json({ error: "L'invitation a échoué. Réessaie." }, { status: 500 });
  }

  // Lien maîtrisé de bout en bout : vérification du jeton sur notre page dédiée.
  const inviteLink = `${SITE_URL}/dashboard/definir-mot-de-passe?token_hash=${linkData.properties.hashed_token}&type=invite`;

  try {
    const mail = adminInviteEmail({
      inviteLink,
      invitedBy: (me.user_metadata?.name as string) ?? me.email ?? undefined,
    });
    await sendMail({ to: email, subject: mail.subject, html: mail.html });
  } catch (mailError) {
    console.error("[api/admin/admins] envoi e-mail:", mailError);
    // Sans e-mail, l'invitation est inutilisable : on nettoie le compte créé.
    if (linkData.user) await supabase.auth.admin.deleteUser(linkData.user.id);
    return NextResponse.json(
      { error: "L'e-mail d'invitation n'a pas pu être envoyé. Vérifie le serveur SMTP." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/admins — révoque un administrateur.
export async function DELETE(req: NextRequest) {
  const me = await getAuthenticatedAdmin();
  if (!me) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : null;
  if (!id) {
    return NextResponse.json({ error: "Identifiant manquant." }, { status: 400 });
  }
  if (id === me.id) {
    return NextResponse.json(
      { error: "Tu ne peux pas supprimer ton propre compte." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) {
    console.error("[api/admin/admins] deleteUser:", error.message);
    return NextResponse.json({ error: "La suppression a échoué." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
