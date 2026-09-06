// Couche de données du site — anciennement localStorage, désormais Supabase.
// Les signatures d'origine sont conservées (passées en async) pour limiter
// la réécriture des composants, cf. BACKEND.md §4 et §10.

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { resolvePhotoUrl, resolvePhotoUrls } from "@/lib/photos";

export interface EventItem {
  num: string; // "01" (JPO), "02" (Petits-Dej), "03" (Mastermind), "04" (Afterwork) or dynamic ID
  title: string;
  dateStr: string; // e.g. "Jeudi 2 Juillet 2026"
  recurringStr: string; // e.g. "Chaque 1er Jeudi du Mois"
  time: string;
  venue: string;
  desc: string;
  tag: string;
  seats: number;
  dateRaw: string; // ISO string representing the next instance date
  isHidden?: boolean;
  templateStyle?: "01" | "02" | "03" | "04" | "05"; // Card style preset (Red, White, Green, Yellow, Photo)
  cardPhoto?: string; // Photo de la carte (template 05), choisie dès la création de l'événement

  // --- Bloc "Après-événement" (récapitulatif) ---
  recapPublished?: boolean;
  recapText?: string;
  recapPhotos?: string[];
  recapAttendees?: number;
  recapDateStr?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  sector: string;
  desc: string;
  image: string;
  bgColor: string;
  tagColor: string;
  isHidden?: boolean;
}

export const DEFAULT_EVENTS: EventItem[] = [
  {
    num: "01",
    title: "Journées Portes Ouvertes",
    tag: "Événement Public",
    recurringStr: "Chaque 1er Jeudi du Mois",
    dateStr: "Jeudi 2 Juillet 2026",
    time: "09:00 - 13:00",
    venue: "Ciné Concorde, Cotonou",
    desc: "Découvrez nos programmes d'accompagnement, visitez notre hub physique et rencontrez nos conseillers pour diagnostiquer ton projet.",
    seats: 15,
    dateRaw: "2026-07-02T09:00:00+01:00",
    isHidden: false,
    templateStyle: "01",
  },
  {
    num: "02",
    title: "Petits-Déj' MEB",
    tag: "Membres & Invités",
    recurringStr: "Un Mardi sur deux",
    dateStr: "Mardi 30 Juin 2026",
    time: "08:30 - 10:30",
    venue: "Ciné Concorde, Cotonou",
    desc: "Un moment convivial d'échanges autour d'une thématique clé (fiscalité, digital, droit) animé par un expert praticien invité.",
    seats: 8,
    dateRaw: "2026-06-30T08:30:00+01:00",
    isHidden: false,
    templateStyle: "02",
  },
  {
    num: "03",
    title: "Mastermind Stratégique",
    tag: "Membres Élite",
    recurringStr: "Dernier Samedi du mois",
    dateStr: "Samedi 27 Juin 2026",
    time: "15:00 - 18:00",
    venue: "Ciné Concorde, Cotonou",
    desc: "Atelier fermé de co-développement pour entrepreneurs avancés. Résolvez collectivement tes défis de structuration et de croissance.",
    seats: 5,
    dateRaw: "2026-06-27T15:00:00+01:00",
    isHidden: false,
    templateStyle: "03",
  },
  {
    num: "04",
    title: "Afterworks Réseautage",
    tag: "Public & Partenaires",
    recurringStr: "Une fois par trimestre",
    dateStr: "Mercredi 15 Juillet 2026",
    time: "18:30 - 21:30",
    venue: "Ciné Concorde, Cotonou",
    desc: "Rencontrez la communauté MEB, nos mentors, sponsors et investisseurs lors de nos grandes soirées informelles de connexion.",
    seats: 30,
    dateRaw: "2026-07-15T18:30:00+01:00",
    isHidden: false,
    templateStyle: "04",
  },
];

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "1",
    title: "Cacao du Bénin",
    sector: "Agro-transformation",
    desc: "Chocolaterie artisanale valorisant le cacao local.",
    image: "/images/entrepreneur-1.jpg",
    bgColor: "bg-red-50 border-red-200 text-red-950",
    tagColor: "bg-red-100 text-red-700",
    isHidden: false,
  },
  {
    id: "2",
    title: "Karité Naturel",
    sector: "Cosmétique",
    desc: "Soins naturels équitables par des coopératives de femmes.",
    image: "/images/journey/Image co.jpg",
    bgColor: "bg-yellow-50 border-yellow-200 text-yellow-950",
    tagColor: "bg-yellow-100 text-yellow-700",
    isHidden: false,
  },
  {
    id: "3",
    title: "Menuiserie Moderne",
    sector: "Artisanat",
    desc: "Mobilier durable éco-conçu en bois local.",
    image: "/images/entrepreneur-1.jpg",
    bgColor: "bg-cyan-50 border-cyan-200 text-cyan-950",
    tagColor: "bg-cyan-100 text-cyan-700",
    isHidden: false,
  },
  {
    id: "4",
    title: "Agri-Tech Bénin",
    sector: "Technologie",
    desc: "Plateforme de vente directe connectant producteurs et marchés.",
    image: "/images/journey/Image co.jpg",
    bgColor: "bg-green-50 border-green-200 text-green-950",
    tagColor: "bg-green-100 text-green-700",
    isHidden: false,
  },
  {
    id: "5",
    title: "Énergie Verte",
    sector: "Énergie",
    desc: "Kits solaires abordables pour l'électrification rurale.",
    image: "/images/entrepreneur-1.jpg",
    bgColor: "bg-stone-50 border-stone-200 text-stone-950",
    tagColor: "bg-stone-100 text-stone-700",
    isHidden: false,
  },
];

const isBrowser = () => typeof window !== "undefined";

// Prévient les composants ouverts (Navbar, /evenements...) qu'une donnée a changé.
const notifyUpdate = () => {
  if (isBrowser()) window.dispatchEvent(new Event("meb_settings_updated"));
};

// ------------------------------------------------------------------
// Mapping lignes Postgres (snake_case) <-> objets frontend (camelCase)
// ------------------------------------------------------------------

type EventRow = {
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

const eventFromRow = (row: EventRow): EventItem => ({
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
  // Les URLs Storage sont recollées sur l'hôte Supabase courant (cf. src/lib/photos.ts).
  cardPhoto: row.card_photo ? resolvePhotoUrl(row.card_photo) : undefined,
  recapPublished: row.recap_published,
  recapText: row.recap_text ?? undefined,
  recapPhotos: resolvePhotoUrls(row.recap_photos),
  recapAttendees: row.recap_attendees ?? undefined,
  recapDateStr: row.recap_date_str ?? undefined,
});

const eventToRow = (event: EventItem) => ({
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
  template_style: event.templateStyle ?? (["01", "02", "03", "04"].includes(event.num) ? event.num : "01"),
  card_photo: event.cardPhoto ?? null,
  recap_published: event.recapPublished ?? false,
  recap_text: event.recapText ?? null,
  recap_photos: event.recapPhotos ?? [],
  recap_attendees: event.recapAttendees ?? null,
  recap_date_str: event.recapDateStr ?? null,
});

type ProjectRow = {
  id: string;
  title: string;
  sector: string;
  desc: string;
  image: string;
  bg_color: string;
  tag_color: string;
  is_hidden: boolean;
};

const projectFromRow = (row: ProjectRow): ProjectItem => ({
  id: row.id,
  title: row.title,
  sector: row.sector,
  desc: row.desc,
  image: row.image,
  bgColor: row.bg_color,
  tagColor: row.tag_color,
  isHidden: row.is_hidden,
});

const projectToRow = (project: ProjectItem) => ({
  id: project.id,
  title: project.title,
  sector: project.sector,
  desc: project.desc,
  image: project.image,
  bg_color: project.bgColor,
  tag_color: project.tagColor,
  is_hidden: project.isHidden ?? false,
});

// ------------------------------------------------------------------
// Événements
// ------------------------------------------------------------------

export const getEvents = async (): Promise<EventItem[]> => {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("num", { ascending: true });
  if (error || !data) {
    console.error("[storage] getEvents:", error?.message);
    return DEFAULT_EVENTS;
  }
  return (data as EventRow[]).map(eventFromRow);
};

export const saveEvents = async (events: EventItem[]): Promise<void> => {
  const supabase = getSupabaseBrowserClient();

  const { error: upsertError } = await supabase
    .from("events")
    .upsert(events.map(eventToRow), { onConflict: "num" });
  if (upsertError) {
    console.error("[storage] saveEvents:", upsertError.message);
    throw new Error(upsertError.message);
  }

  // Supprime les événements retirés de la liste (suppression depuis le dashboard).
  const keptNums = events.map((e) => e.num);
  const { data: existing } = await supabase.from("events").select("num");
  const toDelete = (existing ?? [])
    .map((r) => r.num as string)
    .filter((num) => !keptNums.includes(num));
  if (toDelete.length > 0) {
    await supabase.from("events").delete().in("num", toDelete);
  }

  notifyUpdate();
};

export const resetEvents = async (): Promise<EventItem[]> => {
  await saveEvents(DEFAULT_EVENTS);
  return DEFAULT_EVENTS;
};

// ------------------------------------------------------------------
// Projets
// ------------------------------------------------------------------

export const getProjects = async (): Promise<ProjectItem[]> => {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("id", { ascending: true });
  if (error || !data) {
    console.error("[storage] getProjects:", error?.message);
    return DEFAULT_PROJECTS;
  }
  return (data as ProjectRow[]).map(projectFromRow);
};

export const saveProjects = async (projects: ProjectItem[]): Promise<void> => {
  const supabase = getSupabaseBrowserClient();

  const { error: upsertError } = await supabase
    .from("projects")
    .upsert(projects.map(projectToRow), { onConflict: "id" });
  if (upsertError) {
    console.error("[storage] saveProjects:", upsertError.message);
    throw new Error(upsertError.message);
  }

  const keptIds = projects.map((p) => p.id);
  const { data: existing } = await supabase.from("projects").select("id");
  const toDelete = (existing ?? [])
    .map((r) => r.id as string)
    .filter((id) => !keptIds.includes(id));
  if (toDelete.length > 0) {
    await supabase.from("projects").delete().in("id", toDelete);
  }

  notifyUpdate();
};

export const resetProjects = async (): Promise<ProjectItem[]> => {
  await saveProjects(DEFAULT_PROJECTS);
  return DEFAULT_PROJECTS;
};

// ------------------------------------------------------------------
// Visibilité des pages
// ------------------------------------------------------------------

export const getHiddenPages = async (): Promise<string[]> => {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("hidden_pages")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) {
    if (error) console.error("[storage] getHiddenPages:", error.message);
    return [];
  }
  return data.hidden_pages ?? [];
};

export const saveHiddenPages = async (paths: string[]): Promise<void> => {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, hidden_pages: paths, updated_at: new Date().toISOString() });
  if (error) {
    console.error("[storage] saveHiddenPages:", error.message);
    throw new Error(error.message);
  }
  notifyUpdate();
};

// ------------------------------------------------------------------
// Realtime — répercute les changements de contenu (dashboard ou autre
// visiteur) vers tous les onglets ouverts, via l'événement navigateur
// "meb_settings_updated" que les composants écoutent déjà.
// ------------------------------------------------------------------

export const subscribeToContentUpdates = (): (() => void) => {
  if (!isBrowser()) return () => {};
  const supabase = getSupabaseBrowserClient();
  const channel = supabase
    .channel("meb-content")
    .on("postgres_changes", { event: "*", schema: "public", table: "events" }, notifyUpdate)
    .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, notifyUpdate)
    .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, notifyUpdate)
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
};
