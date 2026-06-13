"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
  Lock
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
  getAdminCode,
  saveAdminCode,
  EventItem,
  ProjectItem
} from "@/utils/storage";

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
  const [activeTab, setActiveTab] = useState<"pages" | "events" | "projects" | "settings">("pages");

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [adminCode, setAdminCode] = useState("1234");
  const [codeEditValue, setCodeEditValue] = useState("");
  const [authError, setAuthError] = useState(false);

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
  });

  // Event Add Form State
  const [newEvent, setNewEvent] = useState({
    title: "",
    tag: "",
    templateStyle: "01" as "01" | "02" | "03" | "04",
    dateStr: "",
    time: "",
    seats: 15,
    venue: "Ciné Concorde, Cotonou",
    desc: "",
  });

  // Feedback Notification state
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Load all settings on mount
    setHiddenPages(getHiddenPages());
    setEvents(getEvents());
    setProjects(getProjects());

    const code = getAdminCode();
    setAdminCode(code);
    setCodeEditValue(code);

    const token = sessionStorage.getItem("meb_admin_logged_in");
    if (token === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode === adminCode) {
      setIsAuthenticated(true);
      setAuthError(false);
      sessionStorage.setItem("meb_admin_logged_in", "true");
      triggerNotification("Connexion réussie");
    } else {
      setAuthError(true);
      setInputCode("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("meb_admin_logged_in");
    setInputCode("");
    triggerNotification("Déconnexion réussie");
  };

  const handleSaveNewCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeEditValue.trim()) {
      alert("Le code ne peut pas être vide");
      return;
    }
    setAdminCode(codeEditValue);
    saveAdminCode(codeEditValue);
    triggerNotification("Code d'accès mis à jour");
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
  const handleEventChange = (index: number, field: keyof EventItem, value: any) => {
    const updated = [...events];
    updated[index] = { ...updated[index], [field]: value };
    setEvents(updated);
    saveEvents(updated);
  };

  const handleToggleEventHidden = (index: number) => {
    const updated = [...events];
    const isHidden = !updated[index].isHidden;
    updated[index] = { ...updated[index], isHidden };
    setEvents(updated);
    saveEvents(updated);
    triggerNotification(`L'événement "${updated[index].title}" a été ${isHidden ? "masqué" : "affiché"}.`);
  };

  const handleResetEvents = () => {
    if (window.confirm("Voulez-vous restaurer les événements par défaut ?")) {
      const defaults = resetEvents();
      setEvents(defaults);
      triggerNotification("Événements réinitialisés aux valeurs par défaut.");
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.dateStr.trim() || !newEvent.time.trim() || !newEvent.desc.trim()) {
      alert("Veuillez remplir tous les champs obligatoires de l'événement.");
      return;
    }

    const created: EventItem = {
      num: Date.now().toString(),
      title: newEvent.title,
      tag: newEvent.tag || "Événement Spécial",
      templateStyle: newEvent.templateStyle,
      dateStr: newEvent.dateStr,
      recurringStr: "Événement Spécial",
      time: newEvent.time,
      seats: newEvent.seats,
      venue: newEvent.venue,
      desc: newEvent.desc,
      dateRaw: new Date().toISOString(),
      isHidden: false,
    };

    const updated = [...events, created];
    setEvents(updated);
    saveEvents(updated);

    setNewEvent({
      title: "",
      tag: "",
      templateStyle: "01",
      dateStr: "",
      time: "",
      seats: 15,
      venue: "Ciné Concorde, Cotonou",
      desc: "",
    });

    triggerNotification(`L'événement "${created.title}" a été ajouté.`);
  };

  const handleDeleteEvent = (num: string) => {
    if (window.confirm("Voulez-vous supprimer cet événement ?")) {
      const updated = events.filter((e) => e.num !== num);
      setEvents(updated);
      saveEvents(updated);
      triggerNotification("Événement supprimé.");
    }
  };

  // --- PROJECT HANDLERS ---
  const handleProjectChange = (index: number, field: keyof ProjectItem, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
    saveProjects(updated);
  };

  const handleToggleProjectHidden = (index: number) => {
    const updated = [...projects];
    const isHidden = !updated[index].isHidden;
    updated[index] = { ...updated[index], isHidden };
    setProjects(updated);
    saveProjects(updated);
    triggerNotification(`Le projet "${updated[index].title}" a été ${isHidden ? "masqué" : "affiché"}.`);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Voulez-vous supprimer ce projet ?")) {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      saveProjects(updated);
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
      image: "/images/entrepreneur-1.png",
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
    });

    triggerNotification(`Le projet "${created.title}" a été ajouté.`);
  };

  const handleResetProjects = () => {
    if (window.confirm("Voulez-vous restaurer les projets par défaut ?")) {
      const defaults = resetProjects();
      setProjects(defaults);
      triggerNotification("Projets réinitialisés aux valeurs par défaut.");
    }
  };

  if (!isAuthenticated) {
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
            Saisissez le code d&apos;accès administrateur pour gérer les pages, événements et projets.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-6 text-left">
            <div>
              <label htmlFor="accessCode" className="block font-heading font-bold text-[10px] uppercase tracking-widest text-[#060D03]/50 mb-2">
                Code d&apos;accès
              </label>
              <input
                id="accessCode"
                type="password"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="••••••"
                className={`w-full h-12 px-4 rounded-xl border bg-transparent text-center text-lg tracking-widest font-mono focus:outline-none transition-all ${
                  authError 
                    ? "border-[#E63946] focus:border-[#E63946]" 
                    : "border-[#060D03]/15 focus:border-[#00B140] focus:ring-2 focus:ring-[#00B140]/10"
                }`}
                autoFocus
              />
              {authError && (
                <p className="text-[#E63946] text-[10px] mt-2 font-mono text-center uppercase tracking-wider">Code incorrect. Veuillez réessayer.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#00B140] hover:bg-[#00D94F] text-white font-heading font-bold py-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Se connecter</span>
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
    <div className="min-h-screen bg-[#F5F5F5] text-[#060D03] pt-44 pb-20 relative">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#060D03]/10 pb-8 mb-10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#060D03]/40 hover:text-[#060D03] transition-colors text-xs font-mono uppercase tracking-widest mb-3"
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

          <div className="flex gap-2">
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
            { id: "settings", label: "Configuration", icon: <Lock size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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
                        onChange={(e) => setNewEvent({ ...newEvent, templateStyle: e.target.value as any })}
                        className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                      >
                        <option value="01">Template 01 (Rouge JPO)</option>
                        <option value="02">Template 02 (Blanc Biseauté Petits-Déj)</option>
                        <option value="03">Template 03 (Vert Mastermind)</option>
                        <option value="04">Template 04 (Jaune Afterwork)</option>
                      </select>
                    </div>
                  </div>

                  <div className="lg:col-span-8 flex flex-col justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                          Date Exacte *
                        </label>
                        <input
                          type="text"
                          value={newEvent.dateStr}
                          onChange={(e) => setNewEvent({ ...newEvent, dateStr: e.target.value })}
                          placeholder="ex: Jeudi 2 Juillet 2026"
                          className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                        />
                      </div>
                      <div>
                        <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                          Horaires *
                        </label>
                        <input
                          type="text"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                          placeholder="ex: 18:30 - 21:30"
                          className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                        />
                      </div>
                      <div>
                        <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                          Nombre de Places
                        </label>
                        <input
                          type="number"
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

                              {isCustom && (
                                <button
                                  onClick={() => handleDeleteEvent(event.num)}
                                  className="px-3 py-1.5 rounded-lg bg-[#E63946]/10 border border-[#E63946]/20 text-[#E63946] hover:bg-[#E63946]/20 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                                >
                                  <Trash size={12} weight="bold" />
                                  <span>Supprimer</span>
                                </button>
                              )}
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
                                Date Exacte (Affichée sur la carte)
                              </label>
                              <input
                                type="text"
                                value={event.dateStr}
                                disabled={event.isHidden}
                                onChange={(e) => handleEventChange(idx, "dateStr", e.target.value)}
                                placeholder="ex: Samedi 27 Juin 2026"
                                className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none transition-all disabled:opacity-40 text-[#060D03]"
                              />
                            </div>

                            <div>
                              <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                                Horaires
                              </label>
                              <input
                                type="text"
                                value={event.time}
                                disabled={event.isHidden}
                                onChange={(e) => handleEventChange(idx, "time", e.target.value)}
                                placeholder="15:00 - 18:00"
                                className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none transition-all disabled:opacity-40 text-[#060D03]"
                              />
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

                            {isCustom && (
                              <div>
                                <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
                                  Modèle de Style
                                </label>
                                <select
                                  value={event.templateStyle || "01"}
                                  disabled={event.isHidden}
                                  onChange={(e) => handleEventChange(idx, "templateStyle", e.target.value)}
                                  className="w-full h-10 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
                                >
                                  <option value="01">Template 01 (Rouge)</option>
                                  <option value="02">Template 02 (Blanc Biseauté)</option>
                                  <option value="03">Template 03 (Vert)</option>
                                  <option value="04">Template 04 (Jaune)</option>
                                </select>
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

          {/* TAB 4: CONFIGURATION */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white border border-[#060D03]/10 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                <h3 className="font-heading font-black text-xl uppercase tracking-tight mb-2 text-[#060D03]">
                  Configuration de la Connexion
                </h3>
                <p className="font-body text-xs text-[#060D03]/60 mb-8 max-w-xl">
                  Modifiez le code d&apos;accès administrateur requis pour accéder à ce tableau de bord. Ce code est stocké localement.
                </p>

                <form onSubmit={handleSaveNewCode} className="max-w-md space-y-6">
                  <div>
                    <label className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-2">
                      Nouveau code de connexion
                    </label>
                    <input
                      type="password"
                      value={codeEditValue}
                      onChange={(e) => setCodeEditValue(e.target.value)}
                      placeholder="Saisir le nouveau code"
                      className="w-full h-12 px-4 rounded-xl border border-[#060D03]/15 focus:border-[#00B140] focus:ring-2 focus:ring-[#00B140]/10 bg-white text-sm focus:outline-none text-[#060D03]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-4 bg-[#00B140] hover:bg-[#00D94F] text-white font-heading font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Enregistrer le code</span>
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
