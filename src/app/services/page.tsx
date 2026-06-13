"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getHiddenPages } from "@/utils/storage";
import { PageHiddenFallback } from "@/components/layout/PageHiddenFallback";
import {
  ArrowUpRightIcon,
  ChartLineUpIcon,
  UsersThreeIcon,
  HandshakeIcon,
  MagnifyingGlassIcon,
  CalendarCheckIcon,
  ArrowRightIcon,
  Check
} from "@phosphor-icons/react";

const services = [
  {
    number: "01",
    icon: <MagnifyingGlassIcon size={28} weight="bold" />,
    title: "Positionnement",
    tagline: "Clarifiez votre marché",
    desc: "Identifiez qui vous êtes en tant qu'entrepreneur, où en est votre projet, et quelle est votre place dans la chaîne de valeur.",
    price: "10 000 FCFA",
    highlights: ["Audit de positionnement", "Diagnostic de projet", "Analyse de chaîne de valeur"],
    theme: "dark",
    size: "large",
  },
  {
    number: "02",
    icon: <ArrowRightIcon size={28} weight="bold" />,
    title: "Orientation",
    tagline: "Un cap clair dans l'écosystème",
    desc: "Identifiez vos alliés naturels dans l'écosystème : la structure d'accompagnement (SAE) adaptée, les acteurs amont et aval, les ressources disponibles.",
    price: "10 000 FCFA",
    highlights: ["Cartographie des acteurs d'appui", "Liste des SAE identifiées", "Recommandation d'orientation"],
    theme: "green",
    size: "small",
  },
  {
    number: "03",
    icon: <CalendarCheckIcon size={28} weight="bold" />,
    title: "Assistance RDV",
    tagline: "Mise en relation directe",
    desc: "La MEB prend en charge la recherche et la prise de contact avec vos interlocuteurs cibles. Vous arrivez au bon endroit, au bon moment.",
    price: "10 000 FCFA",
    highlights: ["Recherche de contacts clés", "Prise de contact officielle", "RDV confirmés sous 48h"],
    theme: "white",
    size: "small",
  },
  {
    number: "04",
    icon: <ChartLineUpIcon size={28} weight="bold" />,
    title: "Informations Sectorielles",
    tagline: "Décryptez votre secteur",
    desc: "Obtenez les informations clés sur un secteur d'activité précis du marché béninois : acteurs, réglementation, opportunités, défis.",
    price: "10 000 FCFA",
    highlights: ["Fiche sectorielle synthétique", "Réglementation et barrières", "Opportunités & défis"],
    theme: "dark",
    size: "large",
  },
  {
    number: "05",
    icon: <UsersThreeIcon size={28} weight="bold" />,
    title: "Analyse Sectorielle",
    tagline: "La data au service de vos décisions",
    desc: "Analyse approfondie d'une chaîne de valeur complète selon une problématique définie. Un outil d'aide à la décision sur mesure.",
    price: "Sur mesure",
    highlights: ["Rapport d'analyse complet", "Présentation et restitution", "Recommandations stratégiques"],
    theme: "green",
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
  const [isPageHidden, setIsPageHidden] = useState(false);

  useEffect(() => {
    const hidden = getHiddenPages();
    if (hidden.includes("/services")) {
      setIsPageHidden(true);
    }
  }, []);

  if (isPageHidden) {
    return <PageHiddenFallback pageName="Services" />;
  }

  return (
    <div className="min-h-screen bg-white text-meb-dark pt-44">

      {/* ── BENTO HERO SECTION (INSPIRED BY USER DESIGN) ───────────────────────── */}
      <section className="max-w-[1240px] mx-auto px-5 sm:px-8 pb-20 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT COLUMN: Texts & Solutions (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-heading font-black text-[10vw] sm:text-[7vw] lg:text-[4.8vw] leading-[1.05] tracking-tighter text-meb-dark uppercase"
              >
                DES IDÉES <br />
                <span className="text-meb-green">AMBITIEUSES</span> <br />
                <span>CONCRÈTES.</span>
              </motion.h1>
            </div>

            {/* Separator and Sub-info */}
            <div className="border-t border-meb-gray-200 pt-8 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="font-mono text-xs font-bold tracking-widest text-meb-dark/40 uppercase mb-2">Nos Solutions</h3>
                <p className="font-body text-sm text-meb-gray-500 leading-relaxed">
                  De l&apos;idée à la réalisation. Un accompagnement de bout en bout pour tous les entrepreneurs et PME du Bénin.
                </p>
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold tracking-widest text-meb-dark/40 uppercase mb-2">Notre Méthodologie</h3>
                <p className="font-body text-sm text-meb-gray-500 leading-relaxed">
                  Une approche immersive sur le terrain, structurée pour valider et scaler vos projets au cœur de l&apos;écosystème.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Soft Green Folder Card (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-stretch">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative pt-6 w-full flex flex-col flex-1 cursor-pointer group/card hover:-translate-y-2 transition-all duration-500"
            >
              {/* Folder Tab */}
              <div className="absolute top-0 right-0 w-36 h-6 bg-[#E8F5EE] rounded-t-2xl flex items-center justify-end px-4">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-meb-dark/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                </div>
              </div>

              {/* Main Card Body */}
              <div className="w-full flex-1 bg-[#E8F5EE] rounded-b-3xl rounded-tl-3xl p-8 flex flex-col justify-between min-h-[350px] md:min-h-[400px]">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-[10px] font-bold tracking-widest text-meb-dark uppercase opacity-70">
                    Votre Boost Entrepreneurial
                  </span>
                </div>

                {/* Entrepreneur Image Container */}
                <div className="relative w-full h-[180px] md:h-[220px] rounded-2xl overflow-hidden mb-6">
                  <Image 
                    src="/images/entrepreneur-2.png" 
                    alt="Entrepreneur MEB" 
                    fill 
                    className="object-cover object-top grayscale group-hover/card:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Call To Action Button (Pill styled like the image) */}
                <Link
                  href="/prendre-rdv"
                  className="w-full bg-transparent border border-meb-dark/20 hover:border-meb-dark rounded-full px-6 py-4 flex items-center justify-between text-meb-dark font-heading font-bold uppercase tracking-wider text-[11px] transition-colors duration-300 group"
                >
                  Réserver ma session gratuite
                  <div className="w-8 h-8 rounded-full bg-meb-dark text-[#E8F5EE] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowRightIcon size={16} weight="bold" />
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>

        </div>

        {/* ── BOTTOM BENTO ROW ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-16 items-start">
          
          {/* BOTTOM LEFT: Pill tags (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-center h-full">
            <h3 className="font-mono text-xs font-bold tracking-widest text-meb-dark/40 uppercase mb-4">
              Domaines d&apos;expertise
            </h3>
            {/* Pill Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-meb-dark border border-meb-dark/20 rounded-full px-4 py-2 bg-transparent hover:border-meb-green hover:text-meb-green transition-colors duration-300">
                Orientation Stratégique
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-meb-dark border border-meb-dark/20 rounded-full px-4 py-2 bg-transparent hover:border-meb-green hover:text-meb-green transition-colors duration-300">
                Accompagnement RH
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-meb-dark border border-meb-dark/20 rounded-full px-4 py-2 bg-transparent hover:border-meb-green hover:text-meb-green transition-colors duration-300">
                Levée de Fonds
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-meb-dark border border-meb-dark/20 rounded-full px-4 py-2 bg-transparent hover:border-meb-green hover:text-meb-green transition-colors duration-300">
                Études de Marché
              </span>
            </div>
          </div>

          {/* BOTTOM RIGHT: Three Folder Cards (col-span-7) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Folder 1: MEB Green */}
            <div className="relative pt-6 w-full flex flex-col min-h-[220px] group cursor-pointer hover:-translate-y-2 transition-all duration-500">
              {/* Tab */}
              <div className="absolute top-0 right-0 w-28 h-6 bg-meb-green rounded-t-xl flex items-center justify-end px-3">
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-black/20" />
                  <div className="w-1 h-1 rounded-full bg-white/40" />
                </div>
              </div>
              {/* Body */}
              <div className="w-full flex-1 bg-meb-green rounded-b-2xl rounded-tl-2xl p-6 flex flex-col justify-between text-meb-dark">
                <div className="font-heading font-extrabold text-[15px] leading-tight uppercase tracking-tight">
                  Solutions <br />Entrepreneurs <br />Uniques
                </div>
                <div className="mt-8 text-meb-dark opacity-85 group-hover:scale-110 transition-transform duration-300">
                  <HandshakeIcon size={32} weight="duotone" />
                </div>
              </div>
            </div>

            {/* Folder 2: Light Gray */}
            <div className="relative pt-6 w-full flex flex-col min-h-[220px] group cursor-pointer hover:-translate-y-2 transition-all duration-500">
              {/* Tab */}
              <div className="absolute top-0 right-0 w-28 h-6 bg-[#F5F5F5] rounded-t-xl flex items-center justify-end px-3">
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-black/20" />
                  <div className="w-1 h-1 rounded-full bg-white/40" />
                </div>
              </div>
              {/* Body */}
              <div className="w-full flex-1 bg-[#F5F5F5] rounded-b-2xl rounded-tl-2xl p-6 flex flex-col justify-between text-meb-dark">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[9px] font-bold tracking-widest uppercase opacity-40">MEB Hub</span>
                  <div className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRightIcon size={20} weight="bold" />
                  </div>
                </div>
                <div className="font-heading font-extrabold text-lg leading-tight uppercase tracking-tight mt-auto pt-6">
                  Nos Études <br />de Cas
                </div>
              </div>
            </div>

            {/* Folder 3: Yellow/Gold */}
            <div className="relative pt-6 w-full flex flex-col min-h-[220px] group cursor-pointer hover:-translate-y-2 transition-all duration-500">
              {/* Tab */}
              <div className="absolute top-0 right-0 w-28 h-6 bg-meb-yellow rounded-t-xl flex items-center justify-end px-3">
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-black/20" />
                  <div className="w-1 h-1 rounded-full bg-white/40" />
                </div>
              </div>
              {/* Body */}
              <div className="w-full flex-1 bg-meb-yellow rounded-b-2xl rounded-tl-2xl p-6 flex flex-col justify-between text-meb-dark">
                <div className="font-heading font-extrabold text-[11px] leading-tight uppercase tracking-widest opacity-60">
                  Projets Accompagnés
                </div>
                <div className="font-heading font-black text-5xl tracking-tighter mt-auto pt-6 group-hover:scale-105 transition-transform duration-300 origin-left">
                  10+
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── SERVICE GRID TITLE ──────────────────────── */}
      <section className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-12">
        <div className="border-t border-meb-gray-200 pt-12">
          <span className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-meb-green mb-4 block">
            Nos Piliers
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-meb-dark">
            Nos Services Fondamentaux
          </h2>
        </div>
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
                className={`group relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden cursor-pointer transition-colors duration-500 flex flex-col
                  ${s.size === "large" ? "md:col-span-2 min-h-[380px]" : "min-h-[320px]"}
                  ${isDark ? "bg-[#0B1407] border border-white/[0.06] hover:border-meb-green/50" : ""}
                  ${isGreen ? "bg-meb-green" : ""}
                  ${s.theme === "white" ? "bg-white border border-meb-gray-200 hover:border-meb-green/50" : ""}
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
                    <h3 className={`font-heading font-bold text-2xl md:text-3xl tracking-tight mb-2 leading-tight transition-colors duration-500
                      ${isDark ? "text-white" : ""}
                      ${isGreen ? "text-meb-dark group-hover:text-white" : ""}
                      ${s.theme === "white" ? "text-meb-dark" : ""}
                    `}>
                      {s.title}
                    </h3>
                    <p className={`font-mono text-xs font-bold uppercase tracking-wider mb-4
                      ${isDark ? "text-[#F5C518]" : ""}
                      ${isGreen ? "text-[#060D03] group-hover:text-[#F5C518]" : ""}
                      ${s.theme === "white" ? "text-[#00B140]" : ""}
                    `}>
                      Tarif : {s.price}
                    </p>
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
      <section className="max-t border-t border-meb-gray-200 py-24 md:py-32">
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
            <h2 className="font-heading font-bold text-[40px] md:text-[64px] leading-[1.05] tracking-tight text-meb-dark">
              Notre processus<br />
              <span className="text-meb-gray-400">en 4 étapes.</span>
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
                className="bg-meb-gray-50 border border-meb-gray-200 rounded-2xl p-8 group hover:bg-meb-gray-100/50 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
              >
                {/* Number watermark */}
                <div className="absolute -right-2 -top-4 font-heading font-black text-[80px] leading-none text-meb-dark/[0.04] group-hover:text-meb-dark/[0.07] transition-colors duration-500 pointer-events-none select-none">
                  {p.step}
                </div>
                <div className="w-10 h-10 rounded-full bg-meb-green/15 flex items-center justify-center mb-6 group-hover:bg-meb-green transition-colors duration-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-meb-green group-hover:bg-meb-dark transition-colors duration-500" />
                </div>
                <h3 className="font-heading font-bold text-xl text-meb-dark mb-3">{p.title}</h3>
                <p className="font-body text-sm text-meb-gray-500 leading-relaxed group-hover:text-meb-dark transition-colors duration-500">{p.desc}</p>
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
