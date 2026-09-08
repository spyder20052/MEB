// Modèle « événement » partagé par le serveur et le navigateur.
//
// Ce module ne dépend pas de supabase-js : la page /evenements est rendue côté
// serveur à partir de la base, et le navigateur ne recharge la liste que sur
// notification temps réel, via la même lecture REST légère. Le client Supabase
// complet (~240 Ko) reste réservé au dashboard et au canal Realtime.

import { resolvePhotoUrl, resolvePhotoUrls } from "@/lib/photos";

export interface EventItem {
  num: string; // "01" (JPO), "02" (Petits-Dej), "03" (Mastermind), "04" (Afterwork) ou identifiant dynamique
  title: string;
  dateStr: string; // ex. "Jeudi 2 Juillet 2026"
  recurringStr: string; // ex. "Chaque 1er Jeudi du Mois"
  time: string;
  venue: string;
  desc: string;
  tag: string;
  seats: number;
  dateRaw: string; // ISO de la prochaine occurrence
  isHidden?: boolean;
  templateStyle?: "01" | "02" | "03" | "04" | "05"; // gabarit de carte (Rouge, Blanc, Vert, Jaune, Photo)
  cardPhoto?: string; // photo de la carte (gabarit 05)

  // --- Bloc « après-événement » (récapitulatif) ---
  recapPublished?: boolean;
  recapText?: string;
  recapPhotos?: string[];
  recapAttendees?: number;
  recapDateStr?: string;
}

// Événement enrichi de son statut, calculé une seule fois (côté serveur au
// premier rendu, puis à chaque rafraîchissement temps réel) pour que le HTML
// servi et l'hydratation racontent la même chose.
export type EventView = EventItem & { isPast: boolean };

// ------------------------------------------------------------------
// Mapping lignes Postgres (snake_case) <-> objets frontend (camelCase)
// ------------------------------------------------------------------

export type EventRow = {
  num: string;
  title: string;
  tag: string;
  date_str: string;
  recurring_str: string;
  time: string;
  venue: string;
  desc: string;
  seats: number;
  date_raw: string;
  is_hidden: boolean;
  template_style: string;
  card_photo: string | null;
  recap_published: boolean;
  recap_text: string | null;
  recap_photos: string[] | null;
  recap_attendees: number | null;
  recap_date_str: string | null;
};

export const eventFromRow = (row: EventRow): EventItem => ({
  num: row.num,
  title: row.title,
  tag: row.tag,
  dateStr: row.date_str,
  recurringStr: row.recurring_str,
  time: row.time,
  venue: row.venue,
  desc: row.desc,
  seats: row.seats,
  dateRaw: row.date_raw,
  isHidden: row.is_hidden,
  templateStyle: (row.template_style as EventItem["templateStyle"]) ?? "01",
  // Les URLs Storage sont recollées sur l'hôte Supabase courant (cf. lib/photos).
  cardPhoto: row.card_photo ? resolvePhotoUrl(row.card_photo) : undefined,
  recapPublished: row.recap_published,
  recapText: row.recap_text ?? undefined,
  recapPhotos: resolvePhotoUrls(row.recap_photos),
  recapAttendees: row.recap_attendees ?? undefined,
  recapDateStr: row.recap_date_str ?? undefined,
});

export const eventToRow = (event: EventItem) => ({
  num: event.num,
  title: event.title,
  tag: event.tag,
  date_str: event.dateStr,
  recurring_str: event.recurringStr,
  time: event.time,
  venue: event.venue,
  desc: event.desc,
  seats: event.seats,
  date_raw: event.dateRaw,
  is_hidden: event.isHidden ?? false,
  template_style:
    event.templateStyle ?? (["01", "02", "03", "04"].includes(event.num) ? event.num : "01"),
  card_photo: event.cardPhoto ?? null,
  recap_published: event.recapPublished ?? false,
  recap_text: event.recapText ?? null,
  recap_photos: event.recapPhotos ?? [],
  recap_attendees: event.recapAttendees ?? null,
  recap_date_str: event.recapDateStr ?? null,
});

// ------------------------------------------------------------------
// Statut « édition passée »
// ------------------------------------------------------------------

// Même règle que la fonction SQL register_for_event (migration
// 20260907000000) : l'événement est terminé dès que son récapitulatif est
// publié OU que sa date est dépassée, en comparant les dates civiles pour
// qu'un événement du jour reste ouvert jusqu'à minuit. Si la règle change,
// elle change aux deux endroits.
export const isPastEvent = (event: EventItem, now: Date = new Date()): boolean => {
  if (event.recapPublished) return true;
  if (!event.dateRaw) return false;
  const date = new Date(event.dateRaw);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const toEventViews = (events: EventItem[], now: Date = new Date()): EventView[] =>
  events.map((event) => ({ ...event, isPast: isPastEvent(event, now) }));

// ------------------------------------------------------------------
// Lecture REST (serveur et navigateur), sans supabase-js
// ------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lit tous les événements, triés par numéro, tels que la politique RLS
// « events_public_read » les expose à la clé anon. Lève une erreur si la base
// ne répond pas : c'est à l'appelant de décider quoi afficher, jamais à cette
// couche d'inventer un contenu de remplacement.
export async function fetchEventsRest(): Promise<EventItem[]> {
  if (!SUPABASE_URL || !ANON_KEY) {
    throw new Error("Supabase non configuré (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).");
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/events?select=*&order=num.asc`, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      Accept: "application/json",
    },
    // Toujours frais : la page est rendue à la demande et les places
    // restantes changent à chaque inscription.
    cache: "no-store",
    // Une base qui ne répond pas ne doit pas bloquer le rendu indéfiniment.
    signal: AbortSignal.timeout(6_000),
  });
  if (!res.ok) throw new Error(`Lecture des événements : HTTP ${res.status}`);
  const rows = (await res.json()) as EventRow[];
  return rows.map(eventFromRow);
}
