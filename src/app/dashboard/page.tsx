"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { EventPhoto } from "@/components/ui/EventPhoto";
import {
  Gear,
  Calendar,
  Briefcase,
  Plus,
  Trash,
  ArrowLeft,
  Check,
  Eye,
  EyeSlash,
  ArrowsClockwise,
  ArrowDownLeft,
  Lock,
  Camera,
  UploadSimple,
  Bell,
  UsersThree,
  EnvelopeSimple,
  UserGear
} from "@phosphor-icons/react";
import {
  getEvents,
  saveEvents,
  resetEvents,
  getProjects,
  saveProjects,
  resetProjects,
  getHiddenPages,
  saveHiddenPages,
  EventItem,
  ProjectItem
} from "@/utils/storage";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { RequestsTab } from "@/components/dashboard/RequestsTab";
import { RegistrationsTab } from "@/components/dashboard/RegistrationsTab";
import { NewsletterTab } from "@/components/dashboard/NewsletterTab";
import { AdminsTab } from "@/components/dashboard/AdminsTab";
import { SecurityTab } from "@/components/dashboard/SecurityTab";

type TabId =
  | "pages"
  | "events"
  | "projects"
  | "rdv"
  | "registrations"
  | "newsletter"
  | "admins"
  | "security";

// ------------------------------------------------------------------
// Helpers date/heure : l'admin manipule de vrais sélecteurs, le libellé
// français affiché sur les cartes ("Jeudi 2 Juillet 2026") est généré.
// ------------------------------------------------------------------

// "2026-07-02" -> "Jeudi 2 Juillet 2026"
const toFrenchDate = (ymd: string): string => {
  if (!ymd) return "";
  const formatted = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${ymd}T12:00:00`));
  return formatted.replace(/(^|\s)(\p{L})/gu, (m) => m.toUpperCase());
};

// ISO ("2026-07-02T09:00:00+01:00") -> "2026-07-02" pour <input type="date">
const isoToYmd = (iso?: string): string => (iso && iso.length >= 10 ? iso.slice(0, 10) : "");

// "Jeudi 5 Mars 2026" -> "2026-03-05" (pré-remplissage du sélecteur de récap)
const FRENCH_MONTHS: Record<string, string> = {
  janvier: "01", février: "02", fevrier: "02", mars: "03", avril: "04",
  mai: "05", juin: "06", juillet: "07", août: "08", aout: "08",
  septembre: "09", octobre: "10", novembre: "11", décembre: "12", decembre: "12",
};
const frenchDateToYmd = (value?: string): string => {
  if (!value) return "";
  const match = value.toLowerCase().match(/(\d{1,2})(?:er)?\s+([\p{L}]+)\s+(\d{4})/u);
  if (!match) return "";
  const month = FRENCH_MONTHS[match[2]];
  if (!month) return "";
  return `${match[3]}-${month}-${match[1].padStart(2, "0")}`;
};

// "09:00 - 13:00" -> ["09:00", "13:00"] pour les <input type="time">
const parseTimes = (time?: string): [string, string] => {
  const match = (time ?? "").match(/(\d{1,2})[:hH](\d{2})\s*[-–à]\s*(\d{1,2})[:hH](\d{2})/);
  if (!match) return ["", ""];
  return [
    `${match[1].padStart(2, "0")}:${match[2]}`,
    `${match[3].padStart(2, "0")}:${match[4]}`,
  ];
};
const composeTime = (start: string, end: string): string =>
  start && end ? `${start} - ${end}` : start || end || "";

const PAGE_LIST = [
  { label: "Services", href: "/services" },
  { label: "Événements", href: "/evenements" },
  { label: "Partenaires", href: "/collaborateurs" },
  { label: "Communauté", href: "/communaute" },
  { label: "Projets", href: "/projets" },
  { label: "FAQ", href: "/faq" },
  { label: "Prendre RDV", href: "/prendre-rdv" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("pages");

  // Authentification Supabase (e-mail + mot de passe)
  const [authStatus, setAuthStatus] = useState<"loading" | "login" | "authed">("loading");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Local States loaded from storage
  const [hiddenPages, setHiddenPages] = useState<string[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  // Project Add Form State
  const [newProject, setNewProject] = useState({
    title: "",
    sector: "",
    desc: "",
    colorTheme: "green", // green, yellow, red, cyan, stone
    image: "", // Image de la carte, choisie dès la création (optionnelle)
  });

  // Event Add Form State
  const [newEvent, setNewEvent] = useState({
    title: "",
    tag: "",
    templateStyle: "01" as "01" | "02" | "03" | "04" | "05",
    date: "", // "2026-07-02" — le libellé français est généré automatiquement
    timeStart: "09:00",
    timeEnd: "13:00",
    seats: 15,
    venue: "Ciné Concorde, Cotonou",
    desc: "",
    photos: [] as string[], // Photos choisies dès la création (template 05)
  });

  // Feedback Notification state
  const [notification, setNotification] = useState<string | null>(null);

  // Upload de photos récap : num de l'événement en cours d'envoi / survolé en glisser-déposer
  const [uploadingEvent, setUploadingEvent] = useState<string | null>(null);
  const [dragOverEvent, setDragOverEvent] = useState<string | null>(null);

  // Session Supabase : vérifiée côté serveur, plus de booléen falsifiable
  // dans sessionStorage (BACKEND.md §3).
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email ?? null);
        setAuthStatus("authed");
      } else {
        setAuthStatus("login");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email ?? null);
        setAuthStatus("authed");
      } else {
        setAuthStatus("login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Charge le contenu une fois la session confirmée.
  useEffect(() => {
    if (authStatus !== "authed") return;
    getHiddenPages().then(setHiddenPages);
    getEvents().then(setEvents);
    getProjects().then(setProjects);
  }, [authStatus]);

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // ------------------------------------------------------------------
  // Persistance debouncée : l'état local suit chaque frappe, la base
  // n'est écrite qu'après une courte pause (ou immédiatement pour les
  // actions structurantes : ajout, suppression, masquage).
  // ------------------------------------------------------------------
  const eventsSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistEvents = (updated: EventItem[], immediate = false) => {
    setEvents(updated);
    if (eventsSaveTimer.current) clearTimeout(eventsSaveTimer.current);
    const run = () =>
      saveEvents(updated).catch(() => triggerNotification("Échec de l'enregistrement"));
    if (immediate) {
      run();
    } else {
      eventsSaveTimer.current = setTimeout(run, 600);
    }
  };

  const projectsSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistProjects = (updated: ProjectItem[], immediate = false) => {
    setProjects(updated);
    if (projectsSaveTimer.current) clearTimeout(projectsSaveTimer.current);
    const run = () =>
      saveProjects(updated).catch(() => triggerNotification("Échec de l'enregistrement"));
    if (immediate) {
      run();
    } else {
      projectsSaveTimer.current = setTimeout(run, 600);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError(null);

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });
    setLoggingIn(false);

    if (error) {
      setAuthError("Identifiants incorrects. Vérifie ton e-mail et ton mot de passe.");
      setLoginPassword("");
      return;
    }
    triggerNotification("Connexion réussie");
  };

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setLoginEmail("");
    setLoginPassword("");
    triggerNotification("Déconnexion réussie");
  };

  // --- PAGE VISIBILITY HANDLERS ---
  const togglePageVisibility = (path: string) => {
    let updated: string[];
    if (hiddenPages.includes(path)) {
      updated = hiddenPages.filter((p) => p !== path);
      triggerNotification(`La page "${PAGE_LIST.find(p => p.href === path)?.label}" est visible.`);
    } else {
      updated = [...hiddenPages, path];
      triggerNotification(`La page "${PAGE_LIST.find(p => p.href === path)?.label}" est masquée.`);
    }
    setHiddenPages(updated);
    saveHiddenPages(updated);
  };

  // --- EVENT HANDLERS ---
  const handleEventChange = <K extends keyof EventItem>(index: number, field: K, value: EventItem[K]) => {
    const updated = [...events];
    updated[index] = { ...updated[index], [field]: value };
    persistEvents(updated);
  };

  // Sélecteur de date : met à jour la vraie date (tri, popup) ET le libellé affiché.
  const handleEventDateChange = (index: number, ymd: string) => {
    if (!ymd) return;
    const updated = [...events];
    const [start] = parseTimes(updated[index].time);
    updated[index] = {
      ...updated[index],
      dateStr: toFrenchDate(ymd),
      dateRaw: `${ymd}T${start || "09:00"}:00`,
    };
    persistEvents(updated);
  };

  // Sélecteurs d'heures : recompose "HH:MM - HH:MM" et synchronise dateRaw.
  const handleEventTimeChange = (index: number, which: "start" | "end", value: string) => {
    const updated = [...events];
    const [start, end] = parseTimes(updated[index].time);
    const nextStart = which === "start" ? value : start;
    const nextEnd = which === "end" ? value : end;
    updated[index] = {
      ...updated[index],
      time: composeTime(nextStart, nextEnd),
      dateRaw: `${isoToYmd(updated[index].dateRaw) || new Date().toISOString().slice(0, 10)}T${nextStart || "09:00"}:00`,
    };
    persistEvents(updated);
  };

  const handleRecapDateChange = (index: number, ymd: string) => {
    if (!ymd) return;
    handleEventChange(index, "recapDateStr", toFrenchDate(ymd));
  };

  // Envoie les photos vers /api/upload puis rattache les chemins retournés à l'événement.
  const handleUploadPhotos = async (index: number, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const targetNum = events[index].num;
    setUploadingEvent(targetNum);

    try {
      const body = new FormData();
      Array.from(fileList).forEach((file) => body.append("files", file));

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "L'envoi des photos a échoué.");
        return;
      }

      // On relit l'index courant : la liste a pu changer pendant l'envoi.
      const current = events.findIndex((e) => e.num === targetNum);
      if (current === -1) return;

      const existing = events[current].recapPhotos || [];
      handleEventChange(current, "recapPhotos", [...existing, ...data.paths]);

      if (data.errors?.length) {
        alert(`Certaines photos ont été refusées :\n${data.errors.join("\n")}`);
      }
      triggerNotification(`${data.paths.length} photo(s) ajoutée(s)`);
    } catch {
      alert("L'envoi des photos a échoué. Vérifie ta connexion.");
    } finally {
      setUploadingEvent(null);
    }
  };

  // Upload des photos du formulaire de création (l'événement n'existe pas encore).
  const handleUploadNewEventPhotos = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadingEvent("__new__");

    try {
      const body = new FormData();
      Array.from(fileList).forEach((file) => body.append("files", file));

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "L'envoi des photos a échoué.");
        return;
      }

      setNewEvent((prev) => ({ ...prev, photos: [...prev.photos, ...data.paths] }));

      if (data.errors?.length) {
        alert(`Certaines photos ont été refusées :\n${data.errors.join("\n")}`);
      }
      triggerNotification(`${data.paths.length} photo(s) ajoutée(s)`);
    } catch {
      alert("L'envoi des photos a échoué. Vérifie ta connexion.");
    } finally {
      setUploadingEvent(null);
    }
  };

  // Remplace la photo de carte (template 05) d'un événement déjà créé.
  const handleUploadCardPhoto = async (index: number, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const targetNum = events[index].num;
    setUploadingEvent(`card-${targetNum}`);

    try {
      const body = new FormData();
      body.append("files", fileList[0]);

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "L'envoi de la photo a échoué.");
        return;
      }

      const current = events.findIndex((e) => e.num === targetNum);
      if (current === -1) return;

      handleEventChange(current, "cardPhoto", data.paths[0]);
      triggerNotification("Photo de la carte mise à jour");
    } catch {
      alert("L'envoi de la photo a échoué. Vérifie ta connexion.");
    } finally {
      setUploadingEvent(null);
    }
  };

  const handleRemovePhoto = (index: number, photoIndex: number) => {
    const photos = [...(events[index].recapPhotos || [])];
    photos.splice(photoIndex, 1);
    handleEventChange(index, "recapPhotos", photos);
    triggerNotification("Photo retirée");
  };

  const handleToggleEventHidden = (index: number) => {
    const updated = [...events];
    const isHidden = !updated[index].isHidden;
    updated[index] = { ...updated[index], isHidden };
    persistEvents(updated, true);
    triggerNotification(`L'événement "${updated[index].title}" a été ${isHidden ? "masqué" : "affiché"}.`);
  };

  const handleResetEvents = async () => {
    if (window.confirm("Voulez-vous restaurer les événements par défaut ?")) {
      const defaults = await resetEvents();
      setEvents(defaults);
      triggerNotification("Événements réinitialisés aux valeurs par défaut.");
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.date || !newEvent.timeStart || !newEvent.timeEnd || !newEvent.desc.trim()) {
      alert("Veuillez remplir tous les champs obligatoires de l'événement.");
      return;
    }
    if (newEvent.templateStyle === "05" && newEvent.photos.length === 0) {
      alert("Le Template 05 affiche une photo plein cadre : choisis au moins une image.");
      return;
    }

    const created: EventItem = {
      num: Date.now().toString(),
      title: newEvent.title,
      tag: newEvent.tag || "Événement Spécial",
      templateStyle: newEvent.templateStyle,
      dateStr: toFrenchDate(newEvent.date),
      recurringStr: "Événement Spécial",
      time: composeTime(newEvent.timeStart, newEvent.timeEnd),
      seats: newEvent.seats,
      venue: newEvent.venue,
      desc: newEvent.desc,
      // Vraie date de l'événement : sert au tri et au popup d'accueil.
      dateRaw: `${newEvent.date}T${newEvent.timeStart}:00`,
      isHidden: false,
      cardPhoto: newEvent.photos[0],
    };

    const updated = [...events, created];
    persistEvents(updated, true);

    setNewEvent({
      title: "",
      tag: "",
      templateStyle: "01",
      date: "",
      timeStart: "09:00",
      timeEnd: "13:00",
      seats: 15,
      venue: "Ciné Concorde, Cotonou",
      desc: "",
      photos: [],
    });

    triggerNotification(`L'événement "${created.title}" a été ajouté.`);
  };

  const handleDeleteEvent = (num: string) => {
    if (window.confirm("Voulez-vous supprimer cet événement ? Les inscriptions associées seront aussi supprimées.")) {
      const updated = events.filter((e) => e.num !== num);
      persistEvents(updated, true);
      triggerNotification("Événement supprimé.");
    }
  };

  // --- PROJECT HANDLERS ---
  const handleProjectChange = <K extends keyof ProjectItem>(index: number, field: K, value: ProjectItem[K]) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    persistProjects(updated);
  };

  // Upload de l'image du formulaire de création (le projet n'existe pas encore).
  const handleUploadNewProjectImage = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadingEvent("__new_project__");

    try {
      const body = new FormData();
      body.append("files", fileList[0]);

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "L'envoi de l'image a échoué.");
        return;
      }

      setNewProject((prev) => ({ ...prev, image: data.paths[0] }));
      triggerNotification("Image du projet ajoutée");
    } catch {
      alert("L'envoi de l'image a échoué. Vérifie ta connexion.");
    } finally {
      setUploadingEvent(null);
    }
  };

  // Remplace l'image d'un projet déjà créé.
  const handleUploadProjectImage = async (index: number, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const targetId = projects[index].id;
    setUploadingEvent(`project-${targetId}`);

    try {
      const body = new FormData();
      body.append("files", fileList[0]);

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "L'envoi de l'image a échoué.");
        return;
      }

      // On relit l'index courant : la liste a pu changer pendant l'envoi.
      const current = projects.findIndex((p) => p.id === targetId);
      if (current === -1) return;

      handleProjectChange(current, "image", data.paths[0]);
      triggerNotification("Image du projet mise à jour");
    } catch {
      alert("L'envoi de l'image a échoué. Vérifie ta connexion.");
    } finally {
      setUploadingEvent(null);
    }
  };

  const handleToggleProjectHidden = (index: number) => {
    const updated = [...projects];
    const isHidden = !updated[index].isHidden;
    updated[index] = { ...updated[index], isHidden };
    persistProjects(updated, true);
    triggerNotification(`Le projet "${updated[index].title}" a été ${isHidden ? "masqué" : "affiché"}.`);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Voulez-vous supprimer ce projet ?")) {
      const updated = projects.filter((p) => p.id !== id);
      persistProjects(updated, true);
      triggerNotification("Projet supprimé.");
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.sector.trim() || !newProject.desc.trim()) {
      alert("Veuillez remplir tous les champs du projet.");
      return;
    }

    let bgColor = "bg-green-50 border-green-200 text-green-950";
    let tagColor = "bg-green-100 text-green-700";

    if (newProject.colorTheme === "yellow") {
      bgColor = "bg-yellow-50 border-yellow-200 text-yellow-950";
      tagColor = "bg-yellow-100 text-yellow-700";
    } else if (newProject.colorTheme === "red") {
      bgColor = "bg-red-50 border-red-200 text-red-950";
      tagColor = "bg-red-100 text-red-700";
    } else if (newProject.colorTheme === "cyan") {
      bgColor = "bg-cyan-50 border-cyan-200 text-cyan-950";
      tagColor = "bg-cyan-100 text-cyan-700";
    } else if (newProject.colorTheme === "stone") {
      bgColor = "bg-stone-50 border-stone-200 text-stone-950";
      tagColor = "bg-stone-100 text-stone-700";
    }

    const created: ProjectItem = {
      id: Date.now().toString(),
      title: newProject.title,
      sector: newProject.sector,
      desc: newProject.desc,
      image: newProject.image || "/images/entrepreneur-1.jpg",
      bgColor,
      tagColor,
      isHidden: false,
    };

    const updated = [...projects, created];
    setProjects(updated);
    saveProjects(updated);

    setNewProject({
      title: "",
      sector: "",
      desc: "",
      colorTheme: "green",
      image: "",
    });

    triggerNotification(`Le projet "${created.title}" a été ajouté.`);
  };

  const handleResetProjects = async () => {
    if (window.confirm("Voulez-vous restaurer les projets par défaut ?")) {
      const defaults = await resetProjects();
      setProjects(defaults);
      triggerNotification("Projets réinitialisés aux valeurs par défaut.");
    }
  };

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <ArrowsClockwise size={28} weight="bold" className="text-[#00B140] animate-spin" />
      </div>
    );
  }

  if (authStatus === "login") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] text-[#060D03] flex items-center justify-center pt-24 pb-20 relative px-4">
        <div className="max-w-[420px] w-full bg-white border border-[#060D03]/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl relative z-10 text-center">

          <div className="mb-8 flex justify-center">
            <div className="relative w-24 h-24 drop-shadow-[0_0_12px_rgba(0,240,64,0.2)]">
              <Image
                src="/images/logo.png"
                alt="MEB Logo"
                width={96}
                height={96}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>

          <h2 className="font-heading font-black text-2xl uppercase tracking-tighter leading-none text-[#060D03] mb-2">
            CONNEXION <span className="text-[#00B140]">ADMIN</span>
          </h2>
          <p className="font-body text-xs text-[#060D03]/60 mb-8 leading-relaxed">
            Connectez-vous avec votre compte administrateur pour gérer le site.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-5 text-left">
            <div>
              <label htmlFor="adminEmail" className="block font-heading font-bold text-[10px] uppercase tracking-widest text-[#060D03]/50 mb-2">
                Adresse e-mail
              </label>
              <input
                id="adminEmail"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@entrepreneurbenin.pro"
                autoComplete="email"
                className="w-full h-12 px-4 rounded-xl border border-[#060D03]/15 focus:border-[#00B140] focus:ring-2 focus:ring-[#00B140]/10 bg-transparent text-sm focus:outline-none transition-all"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="adminPassword" className="block font-heading font-bold text-[10px] uppercase tracking-widest text-[#060D03]/50 mb-2">
                Mot de passe
              </label>
              <input
                id="adminPassword"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full h-12 px-4 rounded-xl border bg-transparent text-sm focus:outline-none transition-all ${
                  authError
                    ? "border-[#E63946] focus:border-[#E63946]"
                    : "border-[#060D03]/15 focus:border-[#00B140] focus:ring-2 focus:ring-[#00B140]/10"
                }`}
              />
              {authError && (
                <p className="text-[#E63946] text-[10px] mt-2 font-mono text-center uppercase tracking-wider">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-[#00B140] hover:bg-[#00D94F] text-white font-heading font-bold py-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-60"
            >
              {loggingIn ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Se connecter</span>
              )}
            </button>

            <Link
              href="/"
              className="block text-center text-[#060D03]/40 hover:text-[#060D03] transition-colors text-[10px] font-mono uppercase tracking-widest pt-2"
            >
              Retour au site
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#060D03] pt-12 pb-20 relative">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#060D03]/10 pb-8 mb-10">
          <div>
            <Link href="/" className="inline-block group mb-2" aria-label="Retour à l'accueil MEB">
              <Image
                src="/images/logo.png"
                alt="MEB — Maison de l'Entrepreneur du Bénin"
                width={144}
                height={144}
                className="w-20 h-20 transform group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-[#060D03]/40 hover:text-[#060D03] transition-colors text-xs font-mono uppercase tracking-widest mb-3"
            >
              <ArrowLeft size={12} weight="bold" />
              <span>Retour au site</span>
            </Link>
            <h1 className="font-heading font-black text-4xl uppercase tracking-tighter leading-none text-[#060D03]">
              TABLEAU DE BORD <span className="text-[#00B140]">ADMIN</span>
            </h1>
            <p className="font-body text-xs text-[#060D03]/60 mt-2 leading-relaxed max-w-xl">
              Configuration de la visibilité des pages et gestion en temps réel des formulaires d&apos;événements et de projets.
            </p>
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            {userEmail && (
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#060D03]/50 bg-white border border-[#060D03]/10 px-3 py-2 rounded-xl">
                {userEmail}
              </span>
            )}
            <button
              onClick={handleResetEvents}
              className="px-4 py-2 bg-[#060D03]/5 hover:bg-[#060D03] hover:text-white border border-[#060D03]/10 rounded-xl font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 cursor-pointer shadow-sm text-[#060D03]"
            >
              <ArrowsClockwise size={12} weight="bold" />
              <span>Reset Events</span>
            </button>
            <button
              onClick={handleResetProjects}
              className="px-4 py-2 bg-[#060D03]/5 hover:bg-[#060D03] hover:text-white border border-[#060D03]/10 rounded-xl font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 cursor-pointer shadow-sm text-[#060D03]"
            >
              <ArrowsClockwise size={12} weight="bold" />
              <span>Reset Projects</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#E63946]/10 hover:bg-[#E63946] hover:text-white border border-[#E63946]/20 rounded-xl font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 cursor-pointer shadow-sm text-[#E63946]"
            >
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>

        {/* Floating Notification PopUp */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-50 bg-white text-[#060D03] px-5 py-3.5 rounded-xl flex items-center gap-2.5 shadow-2xl border border-[#060D03]/10"
            >
              <Check size={16} weight="bold" className="text-[#00B140]" />
              <span className="font-heading text-xs font-bold uppercase tracking-wider">{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-[#060D03]/10 pb-px mb-8 overflow-x-auto whitespace-nowrap">
          {[
            { id: "pages", label: "Pages du site", icon: <Gear size={16} /> },
            { id: "events", label: "Événements MEB", icon: <Calendar size={16} /> },
            { id: "projects", label: "Projets membres", icon: <Briefcase size={16} /> },
            { id: "rdv", label: "Demandes RDV", icon: <Bell size={16} /> },
            { id: "registrations", label: "Inscriptions", icon: <UsersThree size={16} /> },
            { id: "newsletter", label: "Newsletter", icon: <EnvelopeSimple size={16} /> },
            { id: "admins", label: "Administrateurs", icon: <UserGear size={16} /> },
            { id: "security", label: "Sécurité", icon: <Lock size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-heading font-bold text-xs uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#00B140] text-[#00B140]"
                  : "border-transparent text-[#060D03]/40 hover:text-[#060D03]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Render */}
        <div className="min-h-[400px]">
          
          {/* TAB 1: GESTION DES PAGES */}
          {activeTab === "pages" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white border border-[#060D03]/10 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                <h3 className="font-heading font-black text-xl uppercase tracking-tight mb-2 text-[#060D03]">
                  Masquer/Afficher les Pages
                </h3>
                <p className="font-body text-xs text-[#060D03]/60 mb-8 max-w-xl">
                  Sélectionnez les pages à afficher dans les menus du site. Les pages désactivées seront masquées de l&apos;en-tête, du pied de page et renverront vers l&apos;écran d&apos;attente en accès direct.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PAGE_LIST.map((page) => {
                    const isHidden = hiddenPages.includes(page.href);
                    return (
                      <div
                        key={page.href}
                        onClick={() => togglePageVisibility(page.href)}
                        className={`border-2 p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-300 ${
                          isHidden
                            ? "bg-black/5 border-[#060D03]/10 text-[#060D03]/40"
                            : "bg-white border-[#00B140] text-[#060D03] hover:bg-[#00B140]/5 shadow-sm"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-heading font-bold text-sm tracking-tight">{page.label}</span>
                          <span className="font-mono text-[9px] uppercase tracking-wider opacity-55">{page.href}</span>
                        </div>

                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isHidden ? "bg-black/5 text-[#060D03]/30" : "bg-[#00B140]/10 text-[#00B140]"
                        }`}>
                          {isHidden ? <EyeSlash size={16} weight="bold" /> : <Eye size={16} weight="bold" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: GESTION DES EVENEMENTS */}
          {activeTab === "events" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Form to Add Event */}
              <div className="bg-white border border-[#060D03]/10 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                <h3 className="font-heading font-black text-xl uppercase tracking-tight mb-2 text-[#060D03]">
                  Ajouter un Nouvel Événement
                </h3>
                <p className="font-body text-xs text-[#060D03]/60 mb-6 max-w-xl">
                  Créez un nouvel événement. Vous pouvez choisir un modèle de style visuel (Rouge, Blanc, Vert ou Jaune) pour personnaliser l&apos;apparence de sa carte.
                </p>

                <form onSubmit={handleAddEvent} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 space-y-4">
                    <div>
                      <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                        Titre de l&apos;Événement *
                      </label>
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="ex: Semaines de l'Investissement"
                        className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                      />
                    </div>

                    <div>
                      <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                        Tag / Catégorie (ex: Membres & Invités)
                      </label>
                      <input
                        type="text"
                        value={newEvent.tag}
                        onChange={(e) => setNewEvent({ ...newEvent, tag: e.target.value })}
                        placeholder="ex: Public & Partenaires"
                        className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                      />
                    </div>

                    <div>
                      <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                        Modèle de Style (Template Card)
                      </label>
                      <select
                        value={newEvent.templateStyle}
                        onChange={(e) => setNewEvent({ ...newEvent, templateStyle: e.target.value as "01" | "02" | "03" | "04" | "05" })}
                        className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                      >
                        <option value="01">Template 01 (Rouge JPO)</option>
                        <option value="02">Template 02 (Blanc Biseauté Petits-Déj)</option>
                        <option value="03">Template 03 (Vert Mastermind)</option>
                        <option value="04">Template 04 (Jaune Afterwork)</option>
                        <option value="05">Template 05 (Photo plein cadre)</option>
                      </select>
                    </div>
                  </div>

                  <div className="lg:col-span-8 flex flex-col justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                          Date de l&apos;événement *
                        </label>
                        <input
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                          className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                        />
                        {newEvent.date && (
                          <p className="font-mono text-[9px] text-[#00B140] mt-1">
                            Affiché : {toFrenchDate(newEvent.date)}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                          Horaires (début — fin) *
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={newEvent.timeStart}
                            onChange={(e) => setNewEvent({ ...newEvent, timeStart: e.target.value })}
                            className="w-full h-10 px-2 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                          />
                          <span className="text-[#060D03]/40 text-xs">—</span>
                          <input
                            type="time"
                            value={newEvent.timeEnd}
                            onChange={(e) => setNewEvent({ ...newEvent, timeEnd: e.target.value })}
                            className="w-full h-10 px-2 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                          Nombre de Places
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={newEvent.seats}
                          onChange={(e) => setNewEvent({ ...newEvent, seats: parseInt(e.target.value) || 0 })}
                          className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                          Lieu
                        </label>
                        <input
                          type="text"
                          value={newEvent.venue}
                          onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                          placeholder="Lieu de l'événement"
                          className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                          Description Courte *
                        </label>
                        <textarea
                          value={newEvent.desc}
                          onChange={(e) => setNewEvent({ ...newEvent, desc: e.target.value })}
                          rows={2}
                          placeholder="Description concise de l'événement..."
                          className="w-full px-3 py-2 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none resize-none text-[#060D03]"
                        />
                      </div>

                      {/* Photo de la carte — uniquement pour le Template 05 */}
                      {newEvent.templateStyle === "05" && (
                        <div className="sm:col-span-2">
                          <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                            Photo de la carte *
                          </label>

                          <label
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragOverEvent("__new__");
                            }}
                            onDragLeave={() => setDragOverEvent(null)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragOverEvent(null);
                              handleUploadNewEventPhotos(e.dataTransfer.files);
                            }}
                            className={`flex flex-col items-center justify-center gap-2 w-full py-7 px-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                              dragOverEvent === "__new__"
                                ? "border-[#00B140] bg-[#E8F5EE]"
                                : "border-[#060D03]/15 bg-[#F5F5F5] hover:border-[#00B140] hover:bg-[#E8F5EE]/50"
                            } ${uploadingEvent === "__new__" ? "opacity-60 pointer-events-none" : ""}`}
                          >
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/avif"
                              multiple
                              className="sr-only"
                              onChange={(e) => {
                                handleUploadNewEventPhotos(e.target.files);
                                e.target.value = "";
                              }}
                            />
                            {uploadingEvent === "__new__" ? (
                              <>
                                <ArrowsClockwise size={20} weight="bold" className="text-[#00B140] animate-spin" />
                                <span className="font-heading font-bold text-[10px] uppercase tracking-widest text-[#00B140]">
                                  Envoi en cours...
                                </span>
                              </>
                            ) : (
                              <>
                                <UploadSimple size={20} weight="bold" className="text-[#00B140]" />
                                <span className="font-heading font-bold text-[10px] uppercase tracking-widest text-[#060D03]">
                                  Choisir la photo
                                </span>
                                <span className="font-body text-[10px] text-[#060D03]/50 text-center">
                                  ou glisse-dépose ton image ici — JPG, PNG ou WebP, 5 Mo max
                                </span>
                              </>
                            )}
                          </label>

                          {newEvent.photos.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-3">
                              {newEvent.photos.map((src, i) => (
                                <div
                                  key={`${src}-${i}`}
                                  className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#060D03]/10 bg-[#F5F5F5] group"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={src} alt={`Photo ${i + 1} du nouvel événement`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setNewEvent({
                                        ...newEvent,
                                        photos: newEvent.photos.filter((_, j) => j !== i),
                                      })
                                    }
                                    aria-label={`Retirer la photo ${i + 1}`}
                                    className="absolute top-1 right-1 w-6 h-6 rounded-lg bg-[#E63946] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#00B140] transition-opacity cursor-pointer"
                                  >
                                    <Trash size={12} weight="bold" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="self-end px-5 py-3 bg-[#00B140] hover:bg-[#00D94F] text-white font-heading font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Plus size={14} weight="bold" />
                      <span>Ajouter l&apos;événement</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Events Management List */}
              <div className="bg-white border border-[#060D03]/10 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                <h3 className="font-heading font-black text-xl uppercase tracking-tight mb-2 text-[#060D03]">
                  Événements Publiés
                </h3>
                <p className="font-body text-xs text-[#060D03]/60 mb-8 max-w-xl">
                  Modifiez les données textuelles et de réservations. La carte de gauche affiche l&apos;aspect exact du rendu réel mis à jour en direct.
                </p>

                <div className="space-y-12">
                  {events.map((event, idx) => {
                    const style = event.templateStyle || event.num as "01" | "02" | "03" | "04" || "01";
                    const isCustom = !["01", "02", "03", "04"].includes(event.num);

                    return (
                      <div
                        key={event.num}
                        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-[#060D03]/10 first:border-t-0 first:pt-0 ${
                          event.isHidden ? "opacity-60" : ""
                        }`}
                      >
                        {/* Left Side: Exact Template Render Preview */}
                        <div className="lg:col-span-5 flex flex-col justify-center items-center">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#060D03]/40 mb-3 align-self-start">
                            Rendu en direct (Template {style})
                          </span>

                          <div className="w-full max-w-[340px] relative select-none">
                            {/* CARD 01 - Red JPO */}
                            {style === "01" && (
                              <div className="w-full bg-[#E63946] rounded-[1.5rem] p-6 flex flex-col justify-between min-h-[220px] relative overflow-hidden text-white border border-transparent shadow-lg">
                                <div className="flex justify-between items-start mb-6">
                                  <span className="font-mono text-sm text-white font-bold">{isCustom ? "#" : "01"}</span>
                                  <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-white/95 border border-white/20 px-2.5 py-0.5 rounded-full bg-white/10">
                                    {event.tag}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="font-heading font-bold text-lg uppercase leading-tight text-white mb-2 line-clamp-2">
                                    {event.title}
                                  </h3>
                                  <p className="font-body text-xs text-white/90 leading-relaxed mb-4 line-clamp-3">
                                    {event.desc}
                                  </p>
                                  <div className="border-t border-white/25 pt-3 flex items-center justify-between font-mono text-[9px] text-white/70">
                                    <span className="truncate max-w-[150px]">{event.dateStr}</span>
                                    <span className="text-white font-bold">{event.seats} PLACES RESTANTES</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* CARD 02 - White Petits-Dej */}
                            {style === "02" && (
                              <div className="relative w-full rounded-[1.5rem] shadow-lg flex min-h-[220px]">
                                <div 
                                  className="bg-white text-[#060D03] p-6 rounded-l-[1.5rem] rounded-br-[1.5rem] flex-1 flex flex-col justify-between border border-transparent"
                                  style={{ clipPath: "polygon(0 0, 75% 0, 100% 25%, 100% 100%, 0 100%)" }}
                                >
                                  <div>
                                    <div className="flex justify-between items-start mb-6 pr-6">
                                      <span className="font-mono text-sm text-[#00B140] font-bold">{isCustom ? "#" : "02"}</span>
                                      <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-[#060D03]/50 bg-[#060D03]/5 px-2.5 py-0.5 rounded-full">
                                        {event.tag}
                                      </span>
                                    </div>
                                    <div>
                                      <h3 className="font-heading font-bold text-lg uppercase leading-tight text-[#060D03] mb-2 line-clamp-2">
                                        {event.title}
                                      </h3>
                                      <p className="font-body text-xs text-[#060D03]/70 leading-relaxed mb-4 line-clamp-3">
                                        {event.desc}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="border-t border-[#060D03]/10 pt-3 flex items-center justify-between font-mono text-[9px] text-[#060D03]/60">
                                    <span className="truncate max-w-[150px]">{event.dateStr}</span>
                                    <span className="text-[#00B140] font-bold">{event.seats} PLACES RESTANTES</span>
                                  </div>
                                </div>
                                <div className="absolute top-[-28px] right-[-12px] w-14 h-14 rounded-full border border-white bg-[#060D03] text-white flex items-center justify-center shadow-lg">
                                  <ArrowDownLeft size={20} />
                                </div>
                              </div>
                            )}

                            {/* CARD 03 - Green Mastermind */}
                            {style === "03" && (
                              <div className="w-full bg-[#00B140] rounded-[1.5rem] p-6 flex flex-col justify-between min-h-[220px] relative overflow-hidden text-white border border-transparent shadow-lg">
                                <div className="flex justify-between items-start mb-6">
                                  <span className="font-mono text-sm text-white font-bold">{isCustom ? "#" : "03"}</span>
                                  <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-white/95 border border-white/20 px-2.5 py-0.5 rounded-full bg-white/10">
                                    {event.tag}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="font-heading font-bold text-lg uppercase leading-tight text-white mb-2 line-clamp-2">
                                    {event.title}
                                  </h3>
                                  <p className="font-body text-xs text-white/90 leading-relaxed mb-4 line-clamp-3">
                                    {event.desc}
                                  </p>
                                  <div className="border-t border-white/25 pt-3 flex items-center justify-between font-mono text-[9px] text-white/70">
                                    <span className="truncate max-w-[150px]">{event.dateStr}</span>
                                    <span className="text-white font-bold">{event.seats} PLACES RESTANTES</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* CARD 04 - Yellow Afterworks */}
                            {style === "04" && (
                              <div className="w-full bg-[#F5C518] rounded-[1.5rem] p-6 flex flex-col justify-between min-h-[220px] relative overflow-hidden text-[#060D03] border border-transparent shadow-lg">
                                <div className="flex justify-between items-start mb-6">
                                  <span className="font-mono text-sm text-[#060D03] font-bold">{isCustom ? "#" : "04"}</span>
                                  <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-[#060D03]/75 border border-[#060D03]/15 px-2.5 py-0.5 rounded-full bg-black/5">
                                    {event.tag}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="font-heading font-bold text-lg uppercase leading-tight text-[#060D03] mb-2 line-clamp-2">
                                    {event.title}
                                  </h3>
                                  <p className="font-body text-xs text-[#060D03]/85 leading-relaxed mb-4 line-clamp-3">
                                    {event.desc}
                                  </p>
                                  <div className="border-t border-[#060D03]/15 pt-3 flex items-center justify-between font-mono text-[9px] text-[#060D03]/70">
                                    <span className="truncate max-w-[150px]">{event.dateStr}</span>
                                    <span className="text-[#060D03] font-bold">{event.seats} PLACES RESTANTES</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* CARD 05 - Photo plein cadre */}
                            {style === "05" && (
                              <div className="w-full bg-[#0D1B2A] rounded-[1.5rem] p-6 flex flex-col justify-between min-h-[220px] relative overflow-hidden text-white border border-transparent shadow-lg">
                                {(event.cardPhoto || (event.recapPhotos || [])[0]) ? (
                                  <div className="absolute inset-0 z-0">
                                    <EventPhoto
                                      src={event.cardPhoto || (event.recapPhotos || [])[0]}
                                      alt=""
                                      decorative
                                      fallback="none"
                                      unoptimized
                                      className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35" />
                                  </div>
                                ) : (
                                  <div className="absolute inset-0 z-0 flex items-center justify-center">
                                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 text-center px-6">
                                      Ajoute une photo ci-contre
                                    </span>
                                  </div>
                                )}

                                <div className="relative z-10 flex justify-between items-start mb-6">
                                  <span className="font-mono text-sm text-white font-bold">{isCustom ? "#" : "05"}</span>
                                  <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-white border border-white/30 px-2.5 py-0.5 rounded-full bg-black/40">
                                    {event.tag}
                                  </span>
                                </div>
                                <div className="relative z-10">
                                  <h3 className="font-heading font-bold text-lg uppercase leading-tight text-white mb-2 line-clamp-2">
                                    {event.title}
                                  </h3>
                                  <p className="font-body text-xs text-white/90 leading-relaxed mb-4 line-clamp-3">
                                    {event.desc}
                                  </p>
                                  <div className="border-t border-white/25 pt-3 flex items-center justify-between font-mono text-[9px] text-white/80">
                                    <span className="truncate max-w-[150px]">{event.dateStr}</span>
                                    <span className="text-white font-bold">{event.seats} PLACES RESTANTES</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Side: Form Inputs */}
                        <div className="lg:col-span-7 space-y-4">
                          <div className="flex items-center justify-between gap-3 border-b border-[#060D03]/10 pb-3">
                            <h4 className="font-heading font-bold text-base text-[#060D03] uppercase">
                              Configuration de l&apos;Événement {isCustom && "(Custom)"}
                            </h4>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleEventHidden(idx)}
                                className={`px-3 py-1.5 rounded-lg border font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                                  event.isHidden
                                    ? "bg-[#060D03]/5 border-[#060D03]/15 text-[#060D03] hover:bg-[#060D03]/10"
                                    : "bg-[#00B140]/10 border-[#00B140]/20 text-[#00B140] hover:bg-[#00B140]/20"
                                }`}
                              >
                                {event.isHidden ? <Eye size={12} weight="bold" /> : <EyeSlash size={12} weight="bold" />}
                                <span>{event.isHidden ? "Rendre visible" : "Masquer l'event"}</span>
                              </button>

                              <button
                                onClick={() => handleDeleteEvent(event.num)}
                                className="px-3 py-1.5 rounded-lg bg-[#E63946]/10 border border-[#E63946]/20 text-[#E63946] hover:bg-[#E63946]/20 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Trash size={12} weight="bold" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                                Titre
                              </label>
                              <input
                                type="text"
                                value={event.title}
                                disabled={event.isHidden}
                                onChange={(e) => handleEventChange(idx, "title", e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none transition-all disabled:opacity-40 text-[#060D03]"
                              />
                            </div>

                            <div>
                              <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                                Date de l&apos;événement
                              </label>
                              <input
                                type="date"
                                value={isoToYmd(event.dateRaw)}
                                disabled={event.isHidden}
                                onChange={(e) => handleEventDateChange(idx, e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none transition-all disabled:opacity-40 text-[#060D03]"
                              />
                              {event.dateStr && (
                                <p className="font-mono text-[9px] text-[#00B140] mt-1">
                                  Affiché : {event.dateStr}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                                Horaires (début — fin)
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={parseTimes(event.time)[0]}
                                  disabled={event.isHidden}
                                  onChange={(e) => handleEventTimeChange(idx, "start", e.target.value)}
                                  className="w-full h-10 px-2 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none transition-all disabled:opacity-40 text-[#060D03]"
                                />
                                <span className="text-[#060D03]/40 text-xs">—</span>
                                <input
                                  type="time"
                                  value={parseTimes(event.time)[1]}
                                  disabled={event.isHidden}
                                  onChange={(e) => handleEventTimeChange(idx, "end", e.target.value)}
                                  className="w-full h-10 px-2 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none transition-all disabled:opacity-40 text-[#060D03]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                                Nombre de Places
                              </label>
                              <input
                                type="number"
                                value={event.seats}
                                disabled={event.isHidden}
                                onChange={(e) => handleEventChange(idx, "seats", parseInt(e.target.value) || 0)}
                                className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none transition-all disabled:opacity-40 text-[#060D03]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                                Lieu
                              </label>
                              <input
                                type="text"
                                value={event.venue}
                                disabled={event.isHidden}
                                onChange={(e) => handleEventChange(idx, "venue", e.target.value)}
                                className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none transition-all disabled:opacity-40 text-[#060D03]"
                              />
                            </div>

                            <div>
                              <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                                Modèle de Style
                              </label>
                              <select
                                value={event.templateStyle || (isCustom ? "01" : (event.num as string))}
                                disabled={event.isHidden}
                                onChange={(e) => handleEventChange(idx, "templateStyle", e.target.value as EventItem["templateStyle"])}
                                className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                              >
                                <option value="01">Template 01 (Rouge)</option>
                                <option value="02">Template 02 (Blanc Biseauté)</option>
                                <option value="03">Template 03 (Vert)</option>
                                <option value="04">Template 04 (Jaune)</option>
                                <option value="05">Template 05 (Photo plein cadre)</option>
                              </select>
                            </div>

                            {/* Photo de la carte — visible seulement en Template 05 */}
                            {(event.templateStyle || (isCustom ? "01" : event.num)) === "05" && (
                              <div className="sm:col-span-2">
                                <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                                  Photo de la carte
                                </label>
                                <div className="flex items-center gap-3">
                                  <label
                                    className={`flex-1 flex items-center justify-center gap-2 h-10 px-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                                      uploadingEvent === `card-${event.num}`
                                        ? "opacity-60 pointer-events-none border-[#00B140]"
                                        : "border-[#060D03]/15 bg-[#F5F5F5] hover:border-[#00B140] hover:bg-[#E8F5EE]/50"
                                    }`}
                                  >
                                    <input
                                      type="file"
                                      accept="image/jpeg,image/png,image/webp,image/avif"
                                      className="sr-only"
                                      onChange={(e) => {
                                        handleUploadCardPhoto(idx, e.target.files);
                                        e.target.value = "";
                                      }}
                                    />
                                    {uploadingEvent === `card-${event.num}` ? (
                                      <ArrowsClockwise size={14} weight="bold" className="text-[#00B140] animate-spin" />
                                    ) : (
                                      <UploadSimple size={14} weight="bold" className="text-[#00B140]" />
                                    )}
                                    <span className="font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]">
                                      {event.cardPhoto ? "Remplacer la photo" : "Choisir la photo"}
                                    </span>
                                  </label>

                                  {event.cardPhoto && (
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#060D03]/10 shrink-0">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={event.cardPhoto} alt="" aria-hidden="true" className="w-full h-full object-cover" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                              Description
                            </label>
                            <textarea
                              value={event.desc}
                              disabled={event.isHidden}
                              onChange={(e) => handleEventChange(idx, "desc", e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none transition-all disabled:opacity-40 resize-none text-[#060D03]"
                            />
                          </div>

                          {/* --- BLOC RÉCAP APRÈS-ÉVÉNEMENT --- */}
                          <div className="mt-6 pt-5 border-t border-dashed border-[#060D03]/15 space-y-4">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div>
                                <h5 className="font-heading font-bold text-sm text-[#060D03] uppercase flex items-center gap-2">
                                  <Camera size={14} weight="bold" className="text-[#00B140]" />
                                  Récap de l&apos;édition passée
                                </h5>
                                <p className="font-body text-[10px] text-[#060D03]/50 mt-0.5">
                                  Photos et bilan de l&apos;événement une fois terminé.
                                </p>
                              </div>
                              <button
                                onClick={() => handleEventChange(idx, "recapPublished", !event.recapPublished)}
                                className={`px-3 py-1.5 rounded-lg border font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                                  event.recapPublished
                                    ? "bg-[#00B140]/10 border-[#00B140]/20 text-[#00B140] hover:bg-[#00B140]/20"
                                    : "bg-[#060D03]/5 border-[#060D03]/15 text-[#060D03]/60 hover:bg-[#060D03]/10"
                                }`}
                              >
                                {event.recapPublished ? <Check size={12} weight="bold" /> : <EyeSlash size={12} weight="bold" />}
                                <span>{event.recapPublished ? "Récap publié" : "Récap non publié"}</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                                  Date de l&apos;édition passée
                                </label>
                                <input
                                  type="date"
                                  value={frenchDateToYmd(event.recapDateStr)}
                                  onChange={(e) => handleRecapDateChange(idx, e.target.value)}
                                  className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none transition-all text-[#060D03]"
                                />
                                {event.recapDateStr && (
                                  <p className="font-mono text-[9px] text-[#00B140] mt-1">
                                    Affiché : {event.recapDateStr}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                                  Participants présents
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  value={event.recapAttendees ?? ""}
                                  onChange={(e) =>
                                    handleEventChange(idx, "recapAttendees", parseInt(e.target.value) || 0)
                                  }
                                  placeholder="ex: 42"
                                  className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none transition-all text-[#060D03]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                                Résumé / Rapport d&apos;activité
                              </label>
                              <textarea
                                value={event.recapText || ""}
                                onChange={(e) => handleEventChange(idx, "recapText", e.target.value)}
                                rows={3}
                                placeholder="Ce qui s'est passé, les intervenants, les retombées concrètes pour les participants..."
                                className="w-full px-3 py-2 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none transition-all resize-none text-[#060D03]"
                              />
                            </div>

                            <div>
                              <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                                Galerie photos
                              </label>

                              {/* Zone d'upload : clic ou glisser-déposer */}
                              <label
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setDragOverEvent(event.num);
                                }}
                                onDragLeave={() => setDragOverEvent(null)}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  setDragOverEvent(null);
                                  handleUploadPhotos(idx, e.dataTransfer.files);
                                }}
                                className={`flex flex-col items-center justify-center gap-2 w-full py-7 px-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                                  dragOverEvent === event.num
                                    ? "border-[#00B140] bg-[#E8F5EE]"
                                    : "border-[#060D03]/15 bg-[#F5F5F5] hover:border-[#00B140] hover:bg-[#E8F5EE]/50"
                                } ${uploadingEvent === event.num ? "opacity-60 pointer-events-none" : ""}`}
                              >
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,image/avif"
                                  multiple
                                  className="sr-only"
                                  onChange={(e) => {
                                    handleUploadPhotos(idx, e.target.files);
                                    e.target.value = "";
                                  }}
                                />
                                {uploadingEvent === event.num ? (
                                  <>
                                    <ArrowsClockwise size={20} weight="bold" className="text-[#00B140] animate-spin" />
                                    <span className="font-heading font-bold text-[10px] uppercase tracking-widest text-[#00B140]">
                                      Envoi en cours...
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <UploadSimple size={20} weight="bold" className="text-[#00B140]" />
                                    <span className="font-heading font-bold text-[10px] uppercase tracking-widest text-[#060D03]">
                                      Choisir des photos
                                    </span>
                                    <span className="font-body text-[10px] text-[#060D03]/50 text-center">
                                      ou glisse-dépose tes images ici — JPG, PNG ou WebP, 5 Mo max
                                    </span>
                                  </>
                                )}
                              </label>
                            </div>

                            {(event.recapPhotos || []).length > 0 && (
                              <div className="flex flex-wrap gap-3">
                                {(event.recapPhotos || []).map((src, i) => (
                                  <div
                                    key={`${src}-${i}`}
                                    className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#060D03]/10 bg-[#F5F5F5] group"
                                  >
                                    <EventPhoto
                                      src={src}
                                      alt={`Aperçu photo ${i + 1} de ${event.title}`}
                                      unoptimized
                                      className="object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemovePhoto(idx, i)}
                                      aria-label={`Retirer la photo ${i + 1}`}
                                      className="absolute top-1 right-1 w-6 h-6 rounded-lg bg-[#E63946] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#00B140] transition-opacity cursor-pointer"
                                    >
                                      <Trash size={12} weight="bold" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: GESTION DES PROJETS */}
          {activeTab === "projects" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Add Project Form */}
              <div className="bg-white border border-[#060D03]/10 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                <h3 className="font-heading font-black text-xl uppercase tracking-tight mb-2 text-[#060D03]">
                  Ajouter un Nouveau Projet
                </h3>
                <p className="font-body text-xs text-[#060D03]/60 mb-6 max-w-xl">
                  Remplissez la fiche projet d&apos;un membre pour l&apos;intégrer directement dans le carrousel 3D dynamique de la page Projets.
                </p>

                <form onSubmit={handleAddProject} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 space-y-4">
                    <div>
                      <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                        Nom du Projet *
                      </label>
                      <input
                        type="text"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="ex: Menuiserie Moderne"
                        className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                      />
                    </div>

                    <div>
                      <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                        Secteur d&apos;Activité *
                      </label>
                      <input
                        type="text"
                        value={newProject.sector}
                        onChange={(e) => setNewProject({ ...newProject, sector: e.target.value })}
                        placeholder="ex: Artisanat, Agro-transformation"
                        className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                      />
                    </div>

                    <div>
                      <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                        Thème Couleur de la Carte
                      </label>
                      <select
                        value={newProject.colorTheme}
                        onChange={(e) => setNewProject({ ...newProject, colorTheme: e.target.value })}
                        className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                      >
                        <option value="green">MEB Vert (Vert)</option>
                        <option value="yellow">MEB Or (Jaune)</option>
                        <option value="red">MEB Rouge (Rouge)</option>
                        <option value="cyan">Brutal Bleu (Cyan)</option>
                        <option value="stone">Brutal Gris (Stone)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                        Image de la carte
                      </label>

                      <label
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOverEvent("__new_project__");
                        }}
                        onDragLeave={() => setDragOverEvent(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOverEvent(null);
                          handleUploadNewProjectImage(e.dataTransfer.files);
                        }}
                        className={`flex flex-col items-center justify-center gap-2 w-full py-6 px-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                          dragOverEvent === "__new_project__"
                            ? "border-[#00B140] bg-[#E8F5EE]"
                            : "border-[#060D03]/15 bg-[#F5F5F5] hover:border-[#00B140] hover:bg-[#E8F5EE]/50"
                        } ${uploadingEvent === "__new_project__" ? "opacity-60 pointer-events-none" : ""}`}
                      >
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          className="sr-only"
                          onChange={(e) => {
                            handleUploadNewProjectImage(e.target.files);
                            e.target.value = "";
                          }}
                        />
                        {uploadingEvent === "__new_project__" ? (
                          <>
                            <ArrowsClockwise size={18} weight="bold" className="text-[#00B140] animate-spin" />
                            <span className="font-heading font-bold text-[10px] uppercase tracking-widest text-[#00B140]">
                              Envoi en cours...
                            </span>
                          </>
                        ) : (
                          <>
                            <UploadSimple size={18} weight="bold" className="text-[#00B140]" />
                            <span className="font-heading font-bold text-[10px] uppercase tracking-widest text-[#060D03]">
                              Choisir l&apos;image
                            </span>
                            <span className="font-body text-[10px] text-[#060D03]/50 text-center">
                              ou glisse-dépose ton image ici — JPG, PNG ou WebP, 5 Mo max
                            </span>
                          </>
                        )}
                      </label>

                      {newProject.image && (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#060D03]/10 bg-[#F5F5F5] group mt-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={newProject.image} alt="Aperçu de l'image du nouveau projet" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewProject({ ...newProject, image: "" })}
                            aria-label="Retirer l'image"
                            className="absolute top-1 right-1 w-6 h-6 rounded-lg bg-[#E63946] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#00B140] transition-opacity cursor-pointer"
                          >
                            <Trash size={12} weight="bold" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-8 flex flex-col justify-between gap-4">
                    <div>
                      <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                        Description Courte *
                      </label>
                      <textarea
                        value={newProject.desc}
                        onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                        rows={4}
                        placeholder="Brève description de l'impact ou de l'activité du projet..."
                        className="w-full px-3 py-2 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none resize-none leading-relaxed text-[#060D03]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="self-end px-5 py-3 bg-[#00B140] hover:bg-[#00D94F] text-white font-heading font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Plus size={14} weight="bold" />
                      <span>Ajouter le projet</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Projects List */}
              <div className="bg-white border border-[#060D03]/10 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                <h3 className="font-heading font-black text-xl uppercase tracking-tight mb-2 text-[#060D03]">
                  Projets Actuellement Publiés
                </h3>
                <p className="font-body text-xs text-[#060D03]/60 mb-8">
                  Visualisez les projets. Les modifications sont enregistrées en temps réel et appliquées immédiatement à la page de présentation des projets.
                </p>

                <div className="space-y-6">
                  {projects.map((project, idx) => (
                    <div
                      key={project.id}
                      className={`flex flex-col lg:flex-row items-center justify-between gap-6 p-6 border border-[#060D03]/10 rounded-2xl ${
                        project.isHidden ? "opacity-60 bg-black/5" : "bg-white shadow-sm"
                      }`}
                    >
                      {/* Left: Card Render Preview */}
                      <div className="w-full max-w-[220px] shrink-0 select-none">
                        <div className={`p-4 lg:p-5 border rounded-[1.25rem] lg:rounded-3xl min-h-[280px] flex flex-col justify-between shadow-md ${project.bgColor}`}>
                          <div className="relative w-full h-[85px] rounded-xl overflow-hidden border border-[#060D03]/5 mb-2.5 grayscale">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="object-cover w-full h-full"
                            />
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <span className={`inline-block font-mono text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${project.tagColor}`}>
                                {project.sector || "Secteur"}
                              </span>
                              <h4 className="font-heading font-black text-sm uppercase tracking-tight mb-1 truncate">
                                {project.title || "Titre"}
                              </h4>
                              <p className="font-body text-[10px] leading-relaxed opacity-80 mb-3 line-clamp-2">
                                {project.desc || "Description..."}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2.5 border-t border-current/10">
                              <span className="font-mono text-[8px] font-bold opacity-60">PROJET MEB</span>
                              <div className="w-5.5 h-5.5 rounded-full bg-[#060D03] text-white flex items-center justify-center text-[8px]">
                                ↗
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Inputs */}
                      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                            Titre du Projet
                          </label>
                          <input
                            type="text"
                            value={project.title}
                            disabled={project.isHidden}
                            onChange={(e) => handleProjectChange(idx, "title", e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none disabled:opacity-50 text-[#060D03]"
                          />
                        </div>

                        <div>
                          <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                            Secteur d&apos;Activité
                          </label>
                          <input
                            type="text"
                            value={project.sector}
                            disabled={project.isHidden}
                            onChange={(e) => handleProjectChange(idx, "sector", e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none disabled:opacity-50 text-[#060D03]"
                          />
                        </div>

                        <div>
                          <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={project.desc}
                            disabled={project.isHidden}
                            onChange={(e) => handleProjectChange(idx, "desc", e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none disabled:opacity-50 text-[#060D03]"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                            Image de la carte
                          </label>
                          <div className={`flex items-center gap-3 ${project.isHidden ? "opacity-40 pointer-events-none" : ""}`}>
                            <label
                              className={`flex-1 flex items-center justify-center gap-2 h-10 px-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                                uploadingEvent === `project-${project.id}`
                                  ? "opacity-60 pointer-events-none border-[#00B140]"
                                  : "border-[#060D03]/15 bg-[#F5F5F5] hover:border-[#00B140] hover:bg-[#E8F5EE]/50"
                              }`}
                            >
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                className="sr-only"
                                onChange={(e) => {
                                  handleUploadProjectImage(idx, e.target.files);
                                  e.target.value = "";
                                }}
                              />
                              {uploadingEvent === `project-${project.id}` ? (
                                <ArrowsClockwise size={14} weight="bold" className="text-[#00B140] animate-spin" />
                              ) : (
                                <UploadSimple size={14} weight="bold" className="text-[#00B140]" />
                              )}
                              <span className="font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]">
                                Remplacer l&apos;image
                              </span>
                            </label>

                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#060D03]/10 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={project.image} alt="" aria-hidden="true" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleToggleProjectHidden(idx)}
                          className={`px-3 py-2 rounded-lg border font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                            project.isHidden
                              ? "bg-[#060D03]/5 border-[#060D03]/15 text-[#060D03]"
                              : "bg-[#00B140]/10 border-[#00B140]/20 text-[#00B140] hover:bg-[#00B140]/20"
                          }`}
                        >
                          {project.isHidden ? <Eye size={11} weight="bold" /> : <EyeSlash size={11} weight="bold" />}
                          <span>{project.isHidden ? "Afficher" : "Masquer"}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="w-9 h-9 rounded-lg bg-[#E63946]/10 border border-[#E63946]/20 text-[#E63946] hover:bg-[#E63946]/20 flex items-center justify-center transition-colors cursor-pointer"
                          title="Supprimer le projet"
                        >
                          <Trash size={14} weight="bold" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {projects.length === 0 && (
                    <div className="text-center py-10 text-[#060D03]/40 font-heading text-xs uppercase tracking-widest">
                      Aucun projet publié.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: DEMANDES DE RDV */}
          {activeTab === "rdv" && <RequestsTab notify={triggerNotification} />}

          {/* TAB 5: INSCRIPTIONS AUX ÉVÉNEMENTS */}
          {activeTab === "registrations" && <RegistrationsTab notify={triggerNotification} />}

          {/* TAB 6: ABONNÉS NEWSLETTER */}
          {activeTab === "newsletter" && <NewsletterTab notify={triggerNotification} />}

          {/* TAB 7: GESTION DES ADMINISTRATEURS */}
          {activeTab === "admins" && <AdminsTab notify={triggerNotification} />}

          {/* TAB 8: SÉCURITÉ DU COMPTE */}
          {activeTab === "security" && (
            <SecurityTab email={userEmail} notify={triggerNotification} />
          )}
        </div>
      </div>
    </div>
  );
}
