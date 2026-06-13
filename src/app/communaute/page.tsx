"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getHiddenPages } from "@/utils/storage";
import { PageHiddenFallback } from "@/components/layout/PageHiddenFallback";

gsap.registerPlugin(ScrollTrigger);
import { 
  Sparkle, 
  ArrowRight, 
  Lightbulb, 
  RocketLaunch, 
  PaintBrush, 
  Handshake, 
  Heart, 
  FileText, 
  Users,
  FacebookLogo,
  TwitterLogo,
  LinkedinLogo,
  InstagramLogo,
  YoutubeLogo
} from "@phosphor-icons/react";

// Community Member Card Data
const members = [
  {
    name: "Amina Soglo",
    role: "Design Textile",
    tag: "Mode & Artisanat",
    region: "Bénin / Mode",
    image: "/images/journey/Image co.png",
    cardClass: "bg-[#eabe07] text-[#060D03] border-[#d0a905]",
    rotationDeg: -6,
    pos: { left: "150px", top: "230px" }
  },
  {
    name: "Darios Toko",
    role: "Tech Founder",
    tag: "Services & Tech",
    region: "Cotonou / Tech",
    image: "/images/entrepreneur-1.png",
    cardClass: "bg-[#00B140] text-white border-[#009b37]",
    rotationDeg: 5,
    pos: { left: "380px", top: "450px" }
  },
  {
    name: "Cédric Hodonou",
    role: "Agro-preneur",
    tag: "Agro-transformation",
    region: "Parakou / Agri",
    image: "/images/journey/Image col.png",
    cardClass: "bg-[#060D03] text-white border-[#13260A]",
    rotationDeg: -3,
    pos: { left: "680px", top: "200px" }
  },
  {
    name: "Espoir Agbo",
    role: "Éco-bâtisseur",
    tag: "Énergie durable",
    region: "Bénin / Construction",
    image: "/images/entrepreneur-2.png",
    cardClass: "bg-[#c61827] text-white border-[#ad1320]",
    rotationDeg: 6,
    pos: { left: "980px", top: "120px" }
  },
  {
    name: "Falonne Kpadé",
    role: "Artisane Chocolat",
    tag: "Gastronomie locale",
    region: "Cotonou / Artisane",
    image: "/images/journey/Image collée.png",
    cardClass: "bg-[#FAF9F6] text-[#060D03] border-[#00B140]",
    rotationDeg: -4,
    pos: { left: "1120px", top: "400px" }
  }
];

// Connection accents overlayed on the dashed paths
const pathAccents = [
  {
    type: "pill",
    label: "Partage",
    icon: <Heart size={10} weight="fill" className="text-[#FF5252]" />,
    pos: { left: "290px", top: "360px" }
  },
  {
    type: "pill",
    label: "Synergies",
    icon: <Users size={10} weight="fill" className="text-cyan-400" />,
    pos: { left: "550px", top: "400px" }
  },
  {
    type: "pill",
    label: "Co-création",
    icon: <FileText size={10} weight="fill" className="text-yellow-400" />,
    pos: { left: "860px", top: "190px" }
  },
  {
    type: "pill",
    label: "Accompagnement",
    icon: <Sparkle size={10} weight="fill" className="text-purple-400" />,
    pos: { left: "1100px", top: "310px" }
  },
  // Circular pink icons
  {
    type: "circle",
    icon: <PaintBrush size={14} weight="bold" />,
    pos: { left: "190px", top: "580px" }
  },
  {
    type: "circle",
    icon: <RocketLaunch size={14} weight="bold" />,
    pos: { left: "580px", top: "120px" }
  },
  {
    type: "circle",
    icon: <Lightbulb size={14} weight="bold" />,
    pos: { left: "860px", top: "450px" }
  },
  {
    type: "circle",
    icon: <Handshake size={14} weight="bold" />,
    pos: { left: "1260px", top: "250px" }
  }
];

export default function CommunautePage() {
  const [isPageHidden, setIsPageHidden] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hidden = getHiddenPages();
    if (hidden.includes("/communaute")) {
      setIsPageHidden(true);
    }
  }, []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionHeaderRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const heroMetaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroTitleRef.current || !heroMetaRef.current) return;

    const titleLines = heroTitleRef.current.querySelectorAll(".hero-reveal");
    const metaElements = heroMetaRef.current.querySelectorAll(".hero-meta-reveal");

    gsap.set(titleLines, { y: "105%", opacity: 0 });
    gsap.set(metaElements, { y: 20, opacity: 0 });

    const tl = gsap.timeline();

    tl.to(titleLines, {
      y: "0%",
      opacity: 1,
      duration: 1.2,
      stagger: 0.2,
      ease: "power4.out",
    })
    .to(metaElements, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    }, "-=0.6");

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!sectionHeaderRef.current) return;

    const lines = sectionHeaderRef.current.querySelectorAll(".reveal-line");

    gsap.set(lines, { y: "105%", opacity: 0 });

    const animation = gsap.to(lines, {
      y: "0%",
      opacity: 1,
      duration: 1.2,
      stagger: 0.15,
      ease: "power4.out",
      scrollTrigger: {
        trigger: sectionHeaderRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const parentWidth = window.innerWidth;
      
      if (parentWidth >= 1400) {
        setScale(1);
      } else if (parentWidth >= 768) {
        // Scale down smoothly between 768px and 1400px
        setScale(parentWidth / 1400);
      } else {
        // Lock scale on mobile to keep text and cards readable, and enable horizontal scroll
        setScale(0.72);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Center scroll position on mobile on mount or scale change
  useEffect(() => {
    if (scrollRef.current) {
      const parentWidth = window.innerWidth;
      if (parentWidth < 768) {
        const canvasWidth = 1400 * 0.72;
        scrollRef.current.scrollLeft = (canvasWidth - parentWidth) / 2;
      }
    }
  }, [scale]);

  if (isPageHidden) {
    return <PageHiddenFallback pageName="Communauté" />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#060D03] flex flex-col">
      
      {/* ── HERO SECTION: GSAP-INSPIRED BRUTALIST HEADER ── */}
      <section className="bg-[#060D03] text-[#F9F9F0] pt-48 pb-20 px-5 sm:px-8 relative overflow-hidden flex flex-col justify-between min-h-[500px] border-b border-white/[0.05]">
        
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-meb-green/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#eabe07]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1240px] w-full mx-auto flex-1 flex flex-col justify-between relative z-10">
          
          {/* Huge indented text title */}
          <div ref={heroTitleRef} className="flex flex-col mb-16 sm:mb-24">
            
            {/* Row 1: "Entreprendre" */}
            <div className="relative self-start pl-8 sm:pl-16 overflow-hidden">
              <h1 className="font-heading font-black text-[11vw] sm:text-[8vw] leading-[0.9] tracking-tighter text-[#F9F9F0] uppercase">
                <span className="hero-reveal inline-block">Entreprendre</span>
              </h1>
            </div>

            {/* Row 2: "ensemble" */}
            <div className="relative self-end pr-8 sm:pr-16 mt-2 overflow-hidden">
              <h1 className="font-heading font-black text-[11vw] sm:text-[8vw] leading-[0.9] tracking-tighter text-[#F9F9F0] uppercase italic">
                <span className="hero-reveal inline-block">ensemble.</span>
              </h1>
            </div>

          </div>

          {/* Bottom Row metadata & button */}
          <div ref={heroMetaRef} className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pt-8 border-t border-white/10">
            
            {/* Left side: description */}
            <div className="hero-meta-reveal font-mono text-[10px] sm:text-xs tracking-widest text-white/60 max-w-sm uppercase leading-relaxed">
              <p>
                MEB HUB — Le réseau collaboratif des leaders, innovateurs et créateurs de value du Bénin.
              </p>
            </div>

            {/* Right side: Border button */}
            <div className="hero-meta-reveal">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/prendre-rdv"
                  className="group inline-flex items-center justify-center gap-3 bg-transparent border border-white/20 hover:border-meb-green text-white hover:bg-meb-green/10 py-3.5 px-6 rounded-full font-heading font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-sm"
                >
                  Rejoindre le réseau
                  <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-white/60 group-hover:text-white group-hover:border-white transition-colors">
                    <ArrowRight size={10} weight="bold" />
                  </span>
                </Link>
              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* ── MEMBER NETWORK SECTION: SKY GRAPH DIAGRAM ── */}
      <section className="bg-white py-16 sm:py-24 border-y border-[#00B140]/10 flex flex-col items-center">
        
        {/* Header Title */}
        <div ref={sectionHeaderRef} className="max-w-[1240px] w-full mx-auto px-5 sm:px-8 text-center mb-10 overflow-hidden">
          {/* Scroll instruction helper - visible only on mobile */}
          <div className="md:hidden mb-6 inline-flex items-center gap-2 px-4 py-2 bg-[#00B140]/10 border border-[#00B140]/25 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-[#00B140] animate-pulse">
            <span>← Faites défiler la carte vers la gauche ou la droite →</span>
          </div>

          <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tighter text-[#060D03]">
            <span className="block overflow-hidden mb-1">
              <span className="reveal-line inline-block">
                Connectés pour grandir
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="reveal-line inline-block text-[#00B140]">
                au sein d&apos;un écosystème uni
              </span>
            </span>
          </h2>
        </div>

        {/* Scaled network container wrapper */}
        <div 
          ref={scrollRef}
          className="w-full overflow-x-auto py-6 px-4 scrollbar-none flex justify-start md:justify-center cursor-grab active:cursor-grabbing select-none"
        >
          <div 
            style={{ 
              width: `${1400 * scale}px`, 
              height: `${750 * scale}px` 
            }}
            className="relative overflow-hidden transition-all duration-300 flex-shrink-0"
          >
            <div
              ref={containerRef}
              style={{
                width: "1400px",
                height: "750px",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                position: "absolute",
                left: 0,
                top: 0,
              }}
              className="select-none overflow-hidden rounded-[2rem] border border-black/5 shadow-inner"
            >
              
              {/* Cloud Sky Background */}
              <Image 
                src="/images/community_sky.png" 
                alt="Sky Background" 
                fill 
                className="object-cover"
                priority
              />

              {/* Connecting paths (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" fill="none">
                {/* Dashed connecting loop path */}
                <path 
                  d="M 235 325 Q 285 515 465 545 Q 675 515 765 295 Q 865 155 1065 215 Q 1145 325 1205 495" 
                  stroke="#060D03" 
                  strokeWidth="2" 
                  strokeDasharray="5 5" 
                  opacity="0.3"
                  strokeLinecap="round"
                />
                <path 
                  d="M 235 325 Q 500 240 765 295" 
                  stroke="#060D03" 
                  strokeWidth="1.5" 
                  strokeDasharray="5 5" 
                  opacity="0.2"
                  strokeLinecap="round"
                />
                <path 
                  d="M 465 545 Q 835 600 1205 495" 
                  stroke="#060D03" 
                  strokeWidth="1.5" 
                  strokeDasharray="5 5" 
                  opacity="0.2"
                  strokeLinecap="round"
                />
              </svg>

              {/* Accent elements floating on the network */}
              {pathAccents.map((acc, index) => {
                if (acc.type === "pill") {
                  return (
                    <div 
                      key={index}
                      style={{ 
                        position: "absolute", 
                        left: acc.pos.left, 
                        top: acc.pos.top,
                      }}
                      className="absolute bg-[#060D03] border border-white/10 rounded-full px-3.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-white shadow-md flex items-center gap-1.5 z-20"
                    >
                      {acc.icon}
                      <span>{acc.label}</span>
                    </div>
                  );
                } else {
                  return (
                    <div 
                      key={index}
                      style={{ 
                        position: "absolute", 
                        left: acc.pos.left, 
                        top: acc.pos.top,
                        animationDuration: `${3 + index}s`
                      }}
                      className="absolute w-8 h-8 rounded-full bg-[#FF7BB3] border-2 border-white flex items-center justify-center text-white shadow-md z-20 animate-bounce"
                    >
                      {acc.icon}
                    </div>
                  );
                }
              })}

              {/* Member cards */}
              {members.map((m, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: m.rotationDeg, y: 0, scale: 1 }}
                  whileHover={{ 
                    rotate: 0, 
                    y: -15, 
                    scale: 1.06, 
                    zIndex: 50, 
                    boxShadow: "0 25px 45px rgba(0,0,0,0.18)" 
                  }}
                  whileTap={{ 
                    scale: 0.94, 
                    rotate: 0, 
                    y: -4,
                    zIndex: 50
                  }}
                  style={{
                    position: "absolute",
                    left: m.pos.left,
                    top: m.pos.top,
                  }}
                  className={`w-[170px] rounded-[1.5rem] p-3 border shadow-lg cursor-pointer z-30 ${m.cardClass}`}
                >
                  {/* Portrait photo */}
                  <div className="relative w-full h-[140px] rounded-[1.1rem] overflow-hidden mb-2.5 bg-white/10 border border-black/5">
                    <Image 
                      src={m.image} 
                      alt={m.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>

                  {/* Banner block details */}
                  <div className="bg-white rounded-xl py-2 px-2.5 flex flex-col border border-black/[0.03]">
                    <span className="font-heading font-black text-xs text-[#060D03] leading-none mb-0.5 truncate">
                      {m.name}
                    </span>
                    <span className="font-mono text-[8px] font-bold text-[#060D03]/60 tracking-wider uppercase truncate">
                      {m.role}
                    </span>
                  </div>
                </motion.div>
              ))}

            </div>
          </div>
        </div>

      </section>

      {/* ── SECTION 3: MEMBERSHIP TYPES & ADVANTAGES ── */}
      <section className="bg-white py-24 border-b border-[#060D03]/5">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          
          <div className="text-center mb-16">
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#00B140] uppercase mb-3 block">
              REJOINDRE LE HUB
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tighter text-[#060D03] mb-6">
              Nos Formules de Membership
            </h2>
            <p className="font-body text-sm sm:text-base text-[#060D03]/60 max-w-2xl mx-auto leading-relaxed">
              Que tu sois un jeune porteur d'idée, un entrepreneur établi, une grande entreprise ou un partenaire institutionnel, il y a une place pour toi à la MEB.
            </p>
          </div>

          {/* Membership grid - Brutalist packed layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#060D03] border border-[#060D03] rounded-3xl overflow-hidden mb-16 shadow-2xl">
            {[
              {
                type: "active",
                title: "Membre Actif",
                subtitle: "Idéal pour débuter",
                desc: "Pour les porteurs d'idées et entrepreneurs en phase de structuration (informel ou début de projet).",
                badge: "Accompagnement",
                bgColor: "bg-[#00B140]", // MEB Green
                price: "Gratuit"
              },
              {
                type: "installed",
                title: "Membre Actif Installé",
                subtitle: "Pour accélérer",
                desc: "Pour les entrepreneurs formalisés avec un établissement stable recherchant de la croissance et du réseau.",
                badge: "Établi",
                bgColor: "bg-[#F5C518]", // MEB Or/Yellow
                price: "Accès Privilégié"
              },
              {
                type: "contributor",
                title: "Contributeur",
                subtitle: "Partager l'expertise",
                desc: "Pour les experts sectoriels, mentors et SAEI souhaitant apporter de la valeur et de la data à la communauté.",
                badge: "Expertise",
                bgColor: "bg-[#E8F5EE]", // MEB Light Green
                price: "Échange de Valeur"
              },
              {
                type: "sponsor",
                title: "Sponsor",
                subtitle: "Soutenir l'impact",
                desc: "Pour les grandes entreprises (GSM, banques, assurances) cherchant de la visibilité premium et à financer l'écosystème.",
                badge: "Partenaire",
                bgColor: "bg-[#E63946]", // MEB Red
                price: "Financement"
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: "easeOut" }}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`p-8 flex flex-col justify-between min-h-[440px] text-[#060D03] transition-shadow duration-300 relative ${card.bgColor}`}
              >
                {/* ── CARD TOP DECORATIONS ── */}
                {card.type === "active" && (
                  <div className="absolute top-8 right-8 text-5xl font-heading font-black select-none pointer-events-none opacity-80">
                    *
                  </div>
                )}

                {card.type === "installed" && (
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest opacity-60">
                      Accélération & Croissance*
                    </span>
                    <span className="font-heading font-black text-6xl leading-none tracking-tighter">
                      10X
                    </span>
                  </div>
                )}

                {card.type === "contributor" && (
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest opacity-60">
                      Communauté de Pratiques*
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-black text-6xl leading-none tracking-tighter">
                        50+
                      </span>
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider opacity-60">
                        Mentors
                      </span>
                    </div>
                  </div>
                )}

                {card.type === "sponsor" && (
                  <div className="flex justify-between items-start w-full">
                    <span className="text-4xl font-light opacity-30 select-none">
                      /
                    </span>
                  </div>
                )}

                {/* ── CARD CORE CONTENT ── */}
                <div className={`mt-8 ${card.type === "active" ? "pt-2" : "pt-4"}`}>
                  <h3 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-tighter leading-none mb-1 text-[#060D03]">
                    {card.title}
                  </h3>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-wider opacity-70 mb-4">
                    {card.subtitle}
                  </p>
                  <p className="font-body text-xs text-[#060D03]/90 leading-relaxed max-w-[250px]">
                    {card.desc}
                  </p>
                  
                  {card.type === "sponsor" && (
                    <div className="mt-4">
                      <span className="inline-block bg-[#060D03] text-[#E63946] font-mono text-[8px] font-bold tracking-widest uppercase px-2 py-1 rounded">
                        #Financement_Impact
                      </span>
                    </div>
                  )}
                </div>

                {/* ── CARD FOOTER ── */}
                <div className="pt-5 border-t border-[#060D03]/10 mt-8 flex justify-between items-center font-mono text-[9px] font-bold uppercase tracking-wider">
                  <span>Modèle : {card.price}</span>
                  <span className="opacity-60">({card.badge})</span>
                </div>
              </motion.div>
            ))}
          </div>



        </div>
      </section>



      {/* ── SECTION 5: REDESIGNED PARTNER CONTACT FORM & DETAILS ── */}
      <section className="bg-white py-24 border-t border-[#060D03]/5">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-x-16 lg:gap-y-6 items-start">
            
            {/* 1. Header (Title & Description) */}
            <div className="lg:col-span-7 lg:order-1">
              {/* Tag Prefix */}
              <div className="flex items-center gap-2 mb-4 text-[#00B140]">
                <span className="w-8 h-[2px] bg-[#00B140] rounded" />
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em]">
                  REJOINDRE LA MEB
                </span>
              </div>

              {/* Title */}
              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-[2.75rem] uppercase tracking-tighter text-[#060D03] leading-none mb-6">
                Fais le premier pas
              </h2>

              {/* Description */}
              <p className="font-body text-sm text-[#060D03]/60 leading-relaxed mb-8 lg:mb-4 max-w-xl">
                Que tu souhaites rejoindre la Communauté en tant que membre actif pour propulser ton projet, ou devenir sponsor/partenaire institutionnel pour financer l'écosystème, contacte-nous dès aujourd'hui.
              </p>
            </div>

            {/* 2. Premium Green Contact Card (appears 2nd on mobile, 3rd on desktop) */}
            <div className="lg:col-span-5 lg:row-span-2 order-2 lg:order-3 relative mt-2 lg:mt-0">
              {/* The MEB Green Card */}
              <div className="bg-[#00B140] rounded-[2.5rem] p-8 sm:p-12 text-white min-h-[480px] shadow-lg flex flex-col justify-center">
                <div className="space-y-8">
                  <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-white mb-2">
                    En quoi postuler ?
                  </h3>

                  {/* Profile 1 */}
                  <div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      Membre Actif (Gratuit)
                    </h4>
                    <p className="font-body text-[11px] leading-relaxed text-white/85">
                      Pour les porteurs d&apos;idées et entrepreneurs en phase de structuration de projet.
                    </p>
                  </div>

                  {/* Profile 2 */}
                  <div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      Membre Actif Installé
                    </h4>
                    <p className="font-body text-[11px] leading-relaxed text-white/85">
                      Pour les entrepreneurs formalisés avec un établissement stable visant la croissance.
                    </p>
                  </div>

                  {/* Profile 3 */}
                  <div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      Contributeur / Mentor
                    </h4>
                    <p className="font-body text-[11px] leading-relaxed text-white/85">
                      Pour les experts sectoriels et mentors désireux d&apos;apporter de la valeur au réseau.
                    </p>
                  </div>

                  {/* Profile 4 */}
                  <div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      Sponsor / Partenaire
                    </h4>
                    <p className="font-body text-[11px] leading-relaxed text-white/85">
                      Pour les grandes entreprises (banques, GSM, assurances) soutenant l&apos;impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Contact Form (appears 3rd on mobile, 2nd on desktop) */}
            <div className="lg:col-span-7 order-3 lg:order-2">
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Nom de la Structure *"
                    className="w-full h-14 px-6 rounded-2xl bg-[#F5F5F5] text-xs text-[#060D03] placeholder-[#060D03]/40 focus:outline-none focus:ring-2 focus:ring-[#00B140] transition-all"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nom complet du contact *"
                    className="w-full h-14 px-6 rounded-2xl bg-[#F5F5F5] text-xs text-[#060D03] placeholder-[#060D03]/40 focus:outline-none focus:ring-2 focus:ring-[#00B140] transition-all"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Poste occupé *"
                    className="w-full h-14 px-6 rounded-2xl bg-[#F5F5F5] text-xs text-[#060D03] placeholder-[#060D03]/40 focus:outline-none focus:ring-2 focus:ring-[#00B140] transition-all"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Adresse email *"
                    className="w-full h-14 px-6 rounded-2xl bg-[#F5F5F5] text-xs text-[#060D03] placeholder-[#060D03]/40 focus:outline-none focus:ring-2 focus:ring-[#00B140] transition-all"
                  />
                </div>

                <div>
                  <textarea
                    required
                    rows={5}
                    placeholder="Objet du partenariat / Message *"
                    className="w-full px-6 py-5 rounded-2xl bg-[#F5F5F5] text-xs text-[#060D03] placeholder-[#060D03]/40 focus:outline-none focus:ring-2 focus:ring-[#00B140] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Message envoyé ! Notre équipe institutionnelle vous recontactera sous 48h.");
                  }}
                  className="flex items-center gap-3 group focus:outline-none mt-6"
                >
                  <div className="bg-[#00B140] text-white font-heading font-bold px-8 h-14 rounded-full text-xs uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center group-hover:bg-[#009b37] group-hover:scale-[1.02]">
                    Envoyer ma demande
                  </div>
                  <div className="w-14 h-14 rounded-full bg-[#060D03] text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-md shrink-0">
                    <ArrowRight size={18} weight="bold" />
                  </div>
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
