// Templates HTML des e-mails transactionnels.
// Charte MEB : Vert #00B140, Navy #0D1B2A, Jaune #F5C518, Vert pâle #E8F5EE.
// Contraintes e-mail : tables + styles inline uniquement (pas de CSS externe),
// polices système en secours de Poppins/Inter.
// Ligne éditoriale : tutoiement pour les entrepreneurs, vouvoiement institutionnel.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const FONT_HEADING = "'Poppins','Segoe UI',Helvetica,Arial,sans-serif";
const FONT_BODY = "'Inter','Segoe UI',Helvetica,Arial,sans-serif";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ------------------------------------------------------------------
// Gabarit commun : bandeau navy + liseré vert, icône illustrative,
// badge, titre, contenu, pied de page contact.
// Les icônes sont des PNG servis par le site (public/images/email/) :
// seule méthode fiable en e-mail — jamais d'emoji ni de SVG inline.
// ------------------------------------------------------------------
function layout(options: {
  eyebrow: string;
  title: string;
  body: string;
  icon?: "bell" | "check" | "users" | "calendar-check" | "house" | "key";
  preheader?: string;
  footerNote?: string;
}): string {
  const { eyebrow, title, body, icon, preheader, footerNote } = options;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#EEF1EF;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEF1EF;">
    <tr><td align="center" style="padding:40px 16px;">

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

        <!-- Carte principale -->
        <tr><td style="background-color:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(13,27,42,0.12);">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

            <!-- Liseré vert -->
            <tr><td style="height:6px;background-color:#00B140;font-size:0;line-height:0;">&nbsp;</td></tr>

            <!-- En-tête navy -->
            <tr><td style="background-color:#0D1B2A;padding:36px 44px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-family:${FONT_HEADING};font-size:30px;font-weight:800;letter-spacing:-1px;color:#FFFFFF;">MEB<span style="color:#00D94F;">.</span></span>
                    <div style="font-family:${FONT_BODY};font-size:10px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#8FA3B8;padding-top:6px;">
                      Maison de l&#39;Entrepreneur du B&eacute;nin
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <span style="display:inline-block;font-family:${FONT_BODY};font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#F5C518;border:1px solid rgba(245,197,24,0.45);border-radius:999px;padding:7px 14px;">
                      Cotonou&nbsp;2030
                    </span>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Corps -->
            <tr><td style="padding:40px 44px 12px;">
              ${icon ? `<img src="${SITE_URL}/images/email/${icon}.png" width="56" height="56" alt="" style="display:block;border:0;margin:0 0 20px;">` : ""}
              <span style="display:inline-block;font-family:${FONT_BODY};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#00B140;background-color:#E8F5EE;border-radius:999px;padding:8px 16px;margin-bottom:20px;">
                ${eyebrow}
              </span>
              <h1 style="font-family:${FONT_HEADING};font-size:24px;line-height:1.3;font-weight:700;color:#0D1B2A;margin:20px 0 8px;">
                ${title}
              </h1>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 22px;"><tr>
                <td style="width:52px;height:4px;background-color:#00B140;border-radius:999px;font-size:0;line-height:0;">&nbsp;</td>
              </tr></table>
              ${body}
            </td></tr>

            <!-- Pied de carte -->
            <tr><td style="padding:28px 44px 34px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="border-top:1px solid #E7EBE8;padding-top:24px;">
                  <span style="font-family:${FONT_HEADING};font-size:15px;font-weight:800;letter-spacing:-0.5px;color:#0D1B2A;">MEB<span style="color:#00B140;">.</span></span>
                  <p style="font-family:${FONT_BODY};font-size:12px;color:#748076;line-height:1.8;margin:8px 0 0;">
                    Ta maison. Ton r&eacute;seau. &mdash; Akpakpa, Cotonou, B&eacute;nin<br>
                    <a href="mailto:contact@entrepreneurbenin.pro" style="color:#00B140;text-decoration:none;font-weight:600;">contact@entrepreneurbenin.pro</a>
                    &nbsp;&middot;&nbsp; <a href="tel:+2290160007007" style="color:#0D1B2A;text-decoration:none;">+229 01 60 00 70 07</a>
                  </p>
                </td></tr>
              </table>
            </td></tr>

          </table>
        </td></tr>

        <!-- Note sous la carte -->
        <tr><td align="center" style="padding:22px 24px 0;">
          <p style="font-family:${FONT_BODY};font-size:11px;color:#9AA69C;line-height:1.7;margin:0;">
            ${footerNote ?? `Cet e-mail a &eacute;t&eacute; envoy&eacute; automatiquement par le site de la MEB &mdash; <a href="${SITE_URL}" style="color:#748076;">entrepreneurbenin.pro</a>`}
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function paragraph(text: string): string {
  return `<p style="font-family:${FONT_BODY};font-size:15px;color:#3D4643;line-height:1.75;margin:0 0 18px;">${text}</p>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="background-color:#00B140;border-radius:12px;box-shadow:0 6px 18px rgba(0,177,64,0.35);">
          <a href="${href}" style="display:inline-block;padding:16px 40px;font-family:${FONT_HEADING};font-size:14px;font-weight:700;letter-spacing:0.5px;color:#FFFFFF;text-decoration:none;">${label}&nbsp;&nbsp;&rarr;</a>
        </td>
      </tr></table>
    </td></tr>
  </table>`;
}

function infoRow(label: string, value: string, highlight = false): string {
  return `<tr>
    <td style="padding:11px 0;border-bottom:1px solid rgba(13,27,42,0.07);vertical-align:top;width:150px;">
      <span style="font-family:${FONT_BODY};font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6B8577;">${label}</span>
    </td>
    <td style="padding:11px 0 11px 14px;border-bottom:1px solid rgba(13,27,42,0.07);">
      <span style="font-family:${FONT_BODY};font-size:14px;font-weight:600;color:${highlight ? "#00B140" : "#0D1B2A"};">${value}</span>
    </td>
  </tr>`;
}

function infoCard(rows: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#E8F5EE;border-radius:14px;margin:6px 0 24px;">
    <tr><td style="padding:20px 24px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
    </td></tr>
  </table>`;
}

// Encadré WhatsApp : l'information la plus importante des e-mails internes MEB.
function whatsappCard(whatsapp: string, caption: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D1B2A;border-radius:14px;margin:6px 0 24px;">
    <tr>
      <td style="width:6px;background-color:#00D94F;border-radius:14px 0 0 14px;font-size:0;">&nbsp;</td>
      <td style="padding:20px 24px;">
        <span style="font-family:${FONT_BODY};font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8FA3B8;">${caption}</span><br>
        <a href="https://wa.me/${digits}" style="font-family:${FONT_HEADING};font-size:22px;font-weight:800;color:#00D94F;text-decoration:none;letter-spacing:0.5px;line-height:1.9;">${escapeHtml(whatsapp)}</a><br>
        <a href="https://wa.me/${digits}" style="font-family:${FONT_BODY};font-size:12px;font-weight:600;color:#FFFFFF;text-decoration:underline;">Ouvrir la conversation WhatsApp &rarr;</a>
      </td>
    </tr>
  </table>`;
}

const firstName = (fullName: string) => escapeHtml(fullName.trim().split(/\s+/)[0]);

// ------------------------------------------------------------------
// 1. Prise de RDV
// ------------------------------------------------------------------

export function rdvToMebEmail(data: {
  fullName: string;
  whatsapp: string;
  email?: string;
  service: string;
  projectDescription?: string;
  newsletter: boolean;
}): { subject: string; html: string } {
  const rows =
    infoRow("Nom complet", escapeHtml(data.fullName)) +
    infoRow("Service", escapeHtml(data.service), true) +
    infoRow("E-mail", data.email ? escapeHtml(data.email) : "&mdash;") +
    infoRow("Newsletter", data.newsletter ? "Oui" : "Non") +
    (data.projectDescription ? infoRow("Projet", escapeHtml(data.projectDescription)) : "");

  return {
    subject: `[RDV] Nouvelle demande — ${data.fullName}`,
    html: layout({
      icon: "bell",
      eyebrow: "Nouvelle demande de RDV",
      preheader: `${data.fullName} attend un rappel WhatsApp sous 24h — ${data.service}`,
      title: `${escapeHtml(data.fullName)} souhaite prendre rendez-vous`,
      body:
        paragraph(
          "Une nouvelle demande vient d&#39;arriver depuis la page <strong>Prendre RDV</strong>. L&#39;utilisateur attend un rappel <strong>sous 24h</strong>."
        ) +
        whatsappCard(data.whatsapp, "Num&eacute;ro &agrave; rappeler") +
        infoCard(rows),
    }),
  };
}

export function rdvToUserEmail(data: {
  fullName: string;
  service: string;
  whatsapp: string;
}): { subject: string; html: string } {
  return {
    subject: "Ta demande de RDV est bien reçue — MEB",
    html: layout({
      icon: "check",
      eyebrow: "Demande re&ccedil;ue",
      preheader: "On te rappelle sous 24h par WhatsApp pour fixer ton créneau.",
      title: `C&#39;est not&eacute;, ${firstName(data.fullName)}&nbsp;!`,
      body:
        paragraph(
          `Ta demande de rendez-vous pour <strong style="color:#00B140;">${escapeHtml(data.service)}</strong> est bien enregistr&eacute;e.`
        ) +
        infoCard(
          infoRow("Prochaine &eacute;tape", "On te rappelle sous 24h", true) +
            infoRow("Sur WhatsApp", escapeHtml(data.whatsapp)) +
            infoRow("Horaires", "Lun&ndash;Ven 8h&ndash;19h &middot; Sam 9h&ndash;13h")
        ) +
        paragraph("En attendant, pr&eacute;pare tes questions&nbsp;: plus tu es pr&eacute;cis, plus on t&#39;aide vite.") +
        paragraph(`<strong style="color:#0D1B2A;">Ta maison. Ton r&eacute;seau. On avance ensemble.</strong>`),
    }),
  };
}

// ------------------------------------------------------------------
// 2. Inscription à un événement
// ------------------------------------------------------------------

export interface EventSummary {
  title: string;
  dateStr: string;
  time: string;
  venue: string;
  seats: number;
}

export function registrationToMebEmail(data: {
  name: string;
  whatsapp: string;
  email?: string;
  event: EventSummary;
}): { subject: string; html: string } {
  const rows =
    infoRow("&Eacute;v&eacute;nement", escapeHtml(data.event.title), true) +
    infoRow("Date", `${escapeHtml(data.event.dateStr)} (${escapeHtml(data.event.time)})`) +
    infoRow("Lieu", escapeHtml(data.event.venue)) +
    infoRow("Places restantes", String(data.event.seats)) +
    infoRow("Inscrit(e)", escapeHtml(data.name)) +
    infoRow("E-mail", data.email ? escapeHtml(data.email) : "&mdash;");

  return {
    subject: `[Événement] Nouvelle inscription — ${data.event.title}`,
    html: layout({
      icon: "users",
      eyebrow: "Nouvelle inscription",
      preheader: `${data.name} s'est inscrit(e) à ${data.event.title} — confirmation WhatsApp attendue sous 24h`,
      title: `${escapeHtml(data.name)} s&#39;est inscrit(e) &agrave; un &eacute;v&eacute;nement`,
      body:
        paragraph(
          "Une nouvelle inscription vient d&#39;arriver. L&#39;inscrit(e) attend une <strong>confirmation WhatsApp sous 24h</strong>."
        ) +
        whatsappCard(data.whatsapp, "Num&eacute;ro &agrave; confirmer") +
        infoCard(rows),
    }),
  };
}

export function registrationToUserEmail(data: {
  name: string;
  event: EventSummary;
}): { subject: string; html: string } {
  const rows =
    infoRow("&Eacute;v&eacute;nement", escapeHtml(data.event.title), true) +
    infoRow("Date", escapeHtml(data.event.dateStr)) +
    infoRow("Horaires", escapeHtml(data.event.time)) +
    infoRow("Lieu", escapeHtml(data.event.venue)) +
    infoRow("Prix", "Gratuit");

  return {
    subject: `Ta place est réservée — ${data.event.title}`,
    html: layout({
      icon: "calendar-check",
      eyebrow: "Place r&eacute;serv&eacute;e",
      preheader: `${data.event.title} — ${data.event.dateStr}, ${data.event.venue}`,
      title: `Ta place est r&eacute;serv&eacute;e, ${firstName(data.name)}&nbsp;!`,
      body:
        paragraph(
          `Ton inscription &agrave; <strong style="color:#00B140;">${escapeHtml(data.event.title)}</strong> est confirm&eacute;e. Voici ton r&eacute;cap&nbsp;:`
        ) +
        infoCard(rows) +
        paragraph(
          "On te recontacte <strong>sous 24h par WhatsApp</strong> pour la confirmation finale. &Agrave; tr&egrave;s vite&nbsp;!"
        ),
    }),
  };
}

// ------------------------------------------------------------------
// 3. Newsletter
// ------------------------------------------------------------------

export function newsletterWelcomeEmail(subscriberId: string): {
  subject: string;
  html: string;
} {
  const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?id=${subscriberId}`;
  return {
    subject: "Bienvenue dans la communauté MEB !",
    html: layout({
      icon: "house",
      eyebrow: "Bienvenue &agrave; la maison",
      preheader: "Événements, financements et conseils concrets, chaque mois.",
      title: "Tu fais maintenant partie de la communaut&eacute;",
      body:
        paragraph(
          "Ton inscription &agrave; la newsletter de la <strong>Maison de l&#39;Entrepreneur du B&eacute;nin</strong> est confirm&eacute;e."
        ) +
        infoCard(
          infoRow("Chaque mois", "Les prochains &eacute;v&eacute;nements MEB", true) +
            infoRow("En bonus", "Opportunit&eacute;s de financement") +
            infoRow("Et aussi", "Conseils concrets pour ton projet")
        ) +
        paragraph(
          `<strong style="color:#0D1B2A;">Tu as ta place ici.</strong> L&#39;informel, c&#39;est notre c&oelig;ur de cible.`
        ) +
        button(`${SITE_URL}/evenements`, "D&eacute;couvrir les prochains &eacute;v&eacute;nements"),
      footerNote: `Tu ne veux plus recevoir nos e-mails&nbsp;? <a href="${unsubscribeUrl}" style="color:#748076;">Se d&eacute;sinscrire en un clic</a>`,
    }),
  };
}

// ------------------------------------------------------------------
// 4. Invitation administrateur (vouvoiement : usage interne/institutionnel)
// ------------------------------------------------------------------

export function adminInviteEmail(data: {
  inviteLink: string;
  invitedBy?: string;
}): { subject: string; html: string } {
  return {
    subject: "Invitation — Accès administrateur au site MEB",
    html: layout({
      icon: "key",
      eyebrow: "Acc&egrave;s administrateur",
      preheader: "Choisissez votre mot de passe pour activer votre compte administrateur.",
      title: "Vous &ecirc;tes invit&eacute;(e) &agrave; administrer le site MEB",
      body:
        paragraph(
          `${data.invitedBy ? `<strong style="color:#0D1B2A;">${escapeHtml(data.invitedBy)}</strong> vous invite` : "Vous &ecirc;tes invit&eacute;(e)"} &agrave; rejoindre l&#39;&eacute;quipe d&#39;administration du site de la Maison de l&#39;Entrepreneur du B&eacute;nin.`
        ) +
        infoCard(
          infoRow("&Eacute;tape 1", "Cliquez sur le bouton ci-dessous", true) +
            infoRow("&Eacute;tape 2", "Choisissez votre mot de passe") +
            infoRow("&Eacute;tape 3", "Acc&eacute;dez au tableau de bord")
        ) +
        button(data.inviteLink, "D&eacute;finir mon mot de passe") +
        paragraph(
          `<span style="font-size:12px;color:#9AA69C;">Ce lien est personnel et expire apr&egrave;s utilisation. Si vous n&#39;&ecirc;tes pas &agrave; l&#39;origine de cette demande, ignorez simplement cet e-mail.</span>`
        ),
    }),
  };
}
