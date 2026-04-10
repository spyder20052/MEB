"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  ChartLineUpIcon,
  UsersThreeIcon,
  HandshakeIcon,
  MagnifyingGlassIcon,
  CalendarCheckIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";

const services = [
  {
    number: "01",
    icon: <MagnifyingGlassIcon size={28} weight="bold" />,
    title: "Positionnement Stratégique",
    tagline: "Clarifiez votre marché",
    desc: "Analyse approfondie de votre positionnement concurrentiel, identification de votre segment cible, et formalisation de votre proposition de valeur unique.",
    highlights: ["Audit de positionnement", "Étude de marché sectorielle", "Validation de segment"],
    theme: "dark",
    size: "large",
  },
  {
    number: "02",
    icon: <ArrowRightIcon size={28} weight="bold" />,
    title: "Orientation & Conseil",
    tagline: "Un cap clair",
    desc: "Des sessions stratégiques individuelles avec nos experts pour définir vos priorités et franchir les étapes critiques de votre développement.",
    highlights: ["Sessions 1-to-1", "Plan d'action trimestriel", "Suivi mensuel"],
    theme: "green",
    size: "small",
  },
  {
    number: "03",
    icon: <CalendarCheckIcon size={28} weight="bold" />,
    title: "Assistance RDV",
    tagline: "Des portes ouvertes",
    desc: "Notre réseau vous ouvre les bonnes portes. Accédez directement aux décideurs, banques, investisseurs et partenaires institutionnels.",
    highlights: ["Mise en relation directe", "Préparation aux entretiens", "Suivi post-RDV"],
    theme: "white",
    size: "small",
  },
  {
    number: "04",
    icon: <ChartLineUpIcon size={28} weight="bold" />,
    title: "Analyse Sectorielle",
    tagline: "La data au service de vos décisions",
    desc: "Rapports sectoriels, veille concurrentielle et intelligence économique pour vous donner une longueur d'avance sur votre marché.",
    highlights: ["Rapports mensuels", "Benchmarking sectoriel", "Alertes tendances"],
    theme: "dark",
    size: "large",
  },
  {
    number: "05",
    icon: <UsersThreeIcon size={28} weight="bold" />,
    title: "Communauté & Réseau",
    tagline: "Ne travaillez plus seul",
    desc: "Rejoignez une communauté active d'entrepreneurs, participez aux masterminds mensuels et créez des synergies durables.",
    highlights: ["Accès communauté privée", "Mastermind mensuel", "Events exclusifs"],
    theme: "green",
    size: "small",
  },
  {
    number: "06",
    icon: <HandshakeIcon size={28} weight="bold" />,
    title: "Accompagnement RH & Structuration",
    tagline: "Scalez votre organisation",
    desc: "Recrutement, structuration d'équipe, politique RH et outils de gestion adaptés aux PME en croissance rapide.",
    highlights: ["Audit organisationnel", "Fiches de poste & process", "Plan de formation"],
    theme: "white",
    size: "small",
  },
];

const process = [
  { step: "01", title: "Diagnostic Initial", desc: "Une session gratuite de 45 minutes pour comprendre vos enjeux." },
  { step: "02", title: "Plan Personnalisé", desc: "Nos experts conçoivent un plan d'action taillé sur mesure." },
  { step: "03", title: "Exécution Accompagnée", desc: "Nous travaillons à vos côtés, pas juste comme consultants." },
  { step: "04", title: "Suivi & Ajustement", desc: "Des points réguliers pour piloter et adapter votre trajectoire." },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#060D03] pt-32">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="max-w-[1240px] mx-auto px-5 sm:px-8 pb-20 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-meb-green mb-6 block">
            Ce que nous faisons
          </span>
          <h1 className="font-heading font-bold text-[52px] sm:text-[72px] md:text-[96px] lg:text-[120px] leading-[0.95] tracking-tight text-white mb-8">
            Nos<br />
            <span className="text-white/20">Services</span>
          </h1>
          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-20">
            <p className="font-body text-lg md:text-xl text-white/60 max-w-lg leading-relaxed border-l-2 border-meb-green pl-6">
              Six piliers d&apos;excellence pour accompagner chaque étape 
              de la croissance de votre entreprise — de la naissance à l&apos;expansion.
            </p>
            <Link
              href="/prendre-rdv"
              className="group inline-flex items-center gap-4 bg-meb-green text-meb-dark px-8 py-4 rounded-full font-heading font-bold uppercase tracking-widest text-[11px] hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(0,177,64,0.2)] self-start md:self-end shrink-0"
            >
              Démarrer maintenant
              <ArrowUpRightIcon size={18} weight="bold" className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── SERVICE GRID ─────────────────────────────── */}
      <section className="max-w-[1240px] mx-auto px-5 sm:px-8 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const isDark = s.theme === "dark";
            const isGreen = s.theme === "green";

            return (
              <motion.div
                key={s.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                className={`group relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 flex flex-col
                  ${s.size === "large" ? "md:col-span-2 min-h-[380px]" : "min-h-[320px]"}
                  ${isDark ? "bg-[#0B1407] border border-white/[0.06] hover:border-meb-green/50" : ""}
                  ${isGreen ? "bg-meb-green" : ""}
                  ${s.theme === "white" ? "bg-white" : ""}
                `}
              >
                {/* Dark sweep on green card */}
                {isGreen && (
                  <div className="absolute inset-0 bg-meb-dark translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out pointer-events-none" />
                )}
                {/* Green glow on dark card */}
                {isDark && (
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-meb-green/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                )}

                <div className="relative z-10 p-8 md:p-10 flex flex-col h-full justify-between">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                      ${isDark ? "bg-white/5 text-meb-green group-hover:bg-meb-green group-hover:text-meb-dark" : ""}
                      ${isGreen ? "bg-meb-dark text-meb-green group-hover:bg-white group-hover:text-meb-dark" : ""}
                      ${s.theme === "white" ? "bg-meb-dark/5 text-meb-dark group-hover:bg-meb-green group-hover:text-meb-dark" : ""}
                    `}>
                      {s.icon}
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1.5 rounded-full
                      ${isDark ? "bg-white/5 text-white/40" : ""}
                      ${isGreen ? "bg-meb-dark/10 text-meb-dark group-hover:text-meb-green" : ""}
                      ${s.theme === "white" ? "bg-meb-dark/5 text-meb-dark/50" : ""}
                    `}>
                      {s.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className={`font-mono text-[10px] tracking-[0.2em] uppercase font-bold mb-3 transition-colors duration-500
                      ${isDark ? "text-meb-green/70" : ""}
                      ${isGreen ? "text-meb-dark/60 group-hover:text-meb-green" : ""}
                      ${s.theme === "white" ? "text-meb-gray-500" : ""}
                    `}>
                      {s.tagline}
                    </p>
                    <h3 className={`font-heading font-bold text-2xl md:text-3xl tracking-tight mb-4 leading-tight transition-colors duration-500
                      ${isDark ? "text-white" : ""}
                      ${isGreen ? "text-meb-dark group-hover:text-white" : ""}
                      ${s.theme === "white" ? "text-meb-dark" : ""}
                    `}>
                      {s.title}
                    </h3>
                    <p className={`font-body text-sm leading-relaxed mb-6 transition-colors duration-500
                      ${isDark ? "text-white/50 group-hover:text-white/70" : ""}
                      ${isGreen ? "text-meb-dark/70 group-hover:text-white/70" : ""}
                      ${s.theme === "white" ? "text-meb-gray-500 group-hover:text-meb-dark/80" : ""}
                    `}>
                      {s.desc}
                    </p>

                    {/* Highlights */}
                    <ul className="flex flex-col gap-2">
                      {s.highlights.map((h) => (
                        <li key={h} className={`flex items-center gap-2.5 text-xs font-mono font-bold tracking-wider transition-colors duration-500
                          ${isDark ? "text-white/30 group-hover:text-white/60" : ""}
                          ${isGreen ? "text-meb-dark/50 group-hover:text-white/60" : ""}
                          ${s.theme === "white" ? "text-meb-gray-400" : ""}
                        `}>
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-500
                            ${isDark ? "bg-meb-green" : ""}
                            ${isGreen ? "bg-meb-dark group-hover:bg-meb-green" : ""}
                            ${s.theme === "white" ? "bg-meb-green" : ""}
                          `} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA arrow */}
                  <div className={`mt-8 pt-6 border-t flex items-center justify-between transition-colors duration-500
                    ${isDark ? "border-white/[0.06]" : ""}
                    ${isGreen ? "border-meb-dark/10 group-hover:border-white/10" : ""}
                    ${s.theme === "white" ? "border-meb-gray-200" : ""}
                  `}>
                    <span className={`font-mono text-[10px] tracking-widest uppercase font-bold transition-colors duration-500
                      ${isDark ? "text-white/30 group-hover:text-white" : ""}
                      ${isGreen ? "text-meb-dark/50 group-hover:text-white" : ""}
                      ${s.theme === "white" ? "text-meb-gray-400 group-hover:text-meb-dark" : ""}
                    `}>
                      En savoir plus
                    </span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110
                      ${isDark ? "bg-white/5 text-white/50 group-hover:bg-meb-green group-hover:text-meb-dark" : ""}
                      ${isGreen ? "bg-meb-dark text-meb-green group-hover:bg-white group-hover:text-meb-dark" : ""}
                      ${s.theme === "white" ? "bg-meb-dark/5 text-meb-dark group-hover:bg-meb-green group-hover:text-meb-dark" : ""}
                    `}>
                      <ArrowUpRightIcon size={18} weight="bold" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────── */}
      <section className="border-t border-white/[0.05] py-24 md:py-32">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16"
          >
            <span className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-meb-green mb-4 block">
              Comment ça marche
            </span>
            <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-[1.05] tracking-tight text-white">
              Notre processus<br />
              <span className="text-white/20">en 4 étapes.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 group hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
              >
                {/* Number watermark */}
                <div className="absolute -right-2 -top-4 font-heading font-black text-[80px] leading-none text-white/[0.04] group-hover:text-white/[0.07] transition-colors duration-500 pointer-events-none select-none">
                  {p.step}
                </div>
                <div className="w-10 h-10 rounded-full bg-meb-green/10 flex items-center justify-center mb-6 group-hover:bg-meb-green transition-colors duration-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-meb-green group-hover:bg-meb-dark transition-colors duration-500" />
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-3">{p.title}</h3>
                <p className="font-body text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-500">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-meb-green rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-10 relative overflow-hidden group"
          >
            {/* Dark sweep */}
            <div className="absolute inset-0 bg-meb-dark translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out pointer-events-none" />
            
            {/* Decorative lines */}
            <div className="absolute top-10 right-10 w-12 h-[1px] bg-meb-dark group-hover:bg-meb-green opacity-30 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute top-10 right-10 w-[1px] h-12 bg-meb-dark group-hover:bg-meb-green opacity-30 group-hover:opacity-100 transition-all duration-500" />

            <div className="relative z-10">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold text-meb-dark group-hover:text-meb-green transition-colors duration-500 mb-4 block">
                Prêt à démarrer ?
              </span>
              <h2 className="font-heading font-bold text-[36px] md:text-[56px] lg:text-[72px] leading-[1.0] tracking-tight text-meb-dark group-hover:text-white transition-colors duration-500">
                Diagnostic gratuit<br />en 45 minutes.
              </h2>
            </div>
            <Link
              href="/prendre-rdv"
              className="relative z-10 flex items-center gap-4 bg-meb-dark text-white px-8 py-5 rounded-full font-heading font-bold uppercase tracking-widest text-[11px] group-hover:bg-white group-hover:text-meb-dark transition-colors duration-500 shrink-0 shadow-xl"
            >
              Réserver ma session
              <ArrowUpRightIcon size={18} weight="bold" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
