import { z } from "zod";

// Schémas Zod partagés client/serveur : les mêmes règles valident
// le formulaire dans le navigateur ET la requête dans la route API.

export const rdvSchema = z.object({
  fullName: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
  whatsapp: z.string().min(8, "Veuillez entrer un numéro WhatsApp valide (minimum 8 chiffres)"),
  service: z.string().min(1, "Veuillez choisir un service"),
  email: z.string().email("Veuillez entrer une adresse email valide").optional().or(z.literal("")),
  newsletter: z.boolean(),
  projectDescription: z.string().optional(),
});

export type RdvFormData = z.infer<typeof rdvSchema>;

export const eventRegistrationSchema = z.object({
  eventNum: z.string().min(1, "Événement manquant."),
  name: z.string().min(2, "Le nom complet est requis."),
  whatsapp: z.string().min(8, "Le numéro WhatsApp est requis (minimum 8 chiffres)."),
  email: z.string().email("Adresse e-mail invalide.").optional().or(z.literal("")),
});

export type EventRegistrationData = z.infer<typeof eventRegistrationSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Adresse e-mail invalide."),
  source: z.enum(["footer", "rdv"]).default("footer"),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

// Libellés lisibles des services (formulaire /prendre-rdv).
export const SERVICE_LABELS: Record<string, string> = {
  positionnement: "Positionnement (10 000 FCFA)",
  orientation: "Orientation (10 000 FCFA)",
  "assistance-rdv": "Assistance RDV (10 000 FCFA)",
  informations: "Informations sectorielles (10 000 FCFA)",
  "analyse-sectorielle": "Analyse sectorielle (Sur mesure)",
  autre: "Autre demande",
};
