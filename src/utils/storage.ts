// Storage utilities for managing Events, Projects, and Page settings in localStorage.
// SSR safe checks are included since this runs inside Next.js components.

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
  templateStyle?: "01" | "02" | "03" | "04"; // Card style preset (Red, White, Green, Yellow)
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
  },
];

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "1",
    title: "Cacao du Bénin",
    sector: "Agro-transformation",
    desc: "Chocolaterie artisanale valorisant le cacao local.",
    image: "/images/entrepreneur-1.png",
    bgColor: "bg-red-50 border-red-200 text-red-950",
    tagColor: "bg-red-100 text-red-700",
    isHidden: false,
  },
  {
    id: "2",
    title: "Karité Naturel",
    sector: "Cosmétique",
    desc: "Soins naturels équitables par des coopératives de femmes.",
    image: "/images/journey/Image co.png",
    bgColor: "bg-yellow-50 border-yellow-200 text-yellow-950",
    tagColor: "bg-yellow-100 text-yellow-700",
    isHidden: false,
  },
  {
    id: "3",
    title: "Menuiserie Moderne",
    sector: "Artisanat",
    desc: "Mobilier durable éco-conçu en bois local.",
    image: "/images/entrepreneur-1.png",
    bgColor: "bg-cyan-50 border-cyan-200 text-cyan-950",
    tagColor: "bg-cyan-100 text-cyan-700",
    isHidden: false,
  },
  {
    id: "4",
    title: "Agri-Tech Bénin",
    sector: "Technologie",
    desc: "Plateforme de vente directe connectant producteurs et marchés.",
    image: "/images/journey/Image co.png",
    bgColor: "bg-green-50 border-green-200 text-green-950",
    tagColor: "bg-green-100 text-green-700",
    isHidden: false,
  },
  {
    id: "5",
    title: "Énergie Verte",
    sector: "Énergie",
    desc: "Kits solaires abordables pour l'électrification rurale.",
    image: "/images/entrepreneur-1.png",
    bgColor: "bg-stone-50 border-stone-200 text-stone-950",
    tagColor: "bg-stone-100 text-stone-700",
    isHidden: false,
  },
];

const KEYS = {
  events: "meb_events",
  projects: "meb_projects",
  hiddenPages: "meb_hidden_pages",
  adminCode: "meb_admin_code",
};

// Safe localStorage checks
const isBrowser = () => typeof window !== "undefined";

export const getEvents = (): EventItem[] => {
  if (!isBrowser()) return DEFAULT_EVENTS;
  const stored = localStorage.getItem(KEYS.events);
  if (!stored) {
    localStorage.setItem(KEYS.events, JSON.stringify(DEFAULT_EVENTS));
    return DEFAULT_EVENTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_EVENTS;
  }
};

export const saveEvents = (events: EventItem[]) => {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.events, JSON.stringify(events));
};

export const resetEvents = (): EventItem[] => {
  saveEvents(DEFAULT_EVENTS);
  return DEFAULT_EVENTS;
};

export const getProjects = (): ProjectItem[] => {
  if (!isBrowser()) return DEFAULT_PROJECTS;
  const stored = localStorage.getItem(KEYS.projects);
  if (!stored) {
    localStorage.setItem(KEYS.projects, JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_PROJECTS;
  }
};

export const saveProjects = (projects: ProjectItem[]) => {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.projects, JSON.stringify(projects));
};

export const resetProjects = (): ProjectItem[] => {
  saveProjects(DEFAULT_PROJECTS);
  return DEFAULT_PROJECTS;
};

export const getHiddenPages = (): string[] => {
  if (!isBrowser()) return [];
  const stored = localStorage.getItem(KEYS.hiddenPages);
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

export const saveHiddenPages = (paths: string[]) => {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.hiddenPages, JSON.stringify(paths));
  // Dispatch a custom event to notify components (like Navbar) of page settings updates instantly
  window.dispatchEvent(new Event("meb_settings_updated"));
};

export const getAdminCode = (): string => {
  if (!isBrowser()) return "1234";
  const stored = localStorage.getItem(KEYS.adminCode);
  return stored || "1234";
};

export const saveAdminCode = (code: string) => {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.adminCode, code);
};
