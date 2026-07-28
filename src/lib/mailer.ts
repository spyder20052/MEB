import nodemailer, { type Transporter } from "nodemailer";

// Transport SMTP unique pour tout le site.
// Dev : MailHog (localhost:1025, http://localhost:8025 pour consulter).
// Prod : n'importe quel SMTP (Resend, Sendgrid...) via les variables d'env.
let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "127.0.0.1",
      port: Number(process.env.SMTP_PORT ?? 1025),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
    });
  }
  return transporter;
}

export const CONTACT_EMAIL_TO =
  process.env.CONTACT_EMAIL_TO ?? "contact@entrepreneurbenin.pro";

const CONTACT_EMAIL_FROM =
  process.env.CONTACT_EMAIL_FROM ??
  "Maison de l'Entrepreneur du Bénin <no-reply@entrepreneurbenin.pro>";

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  await getTransporter().sendMail({
    from: CONTACT_EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  });
}
