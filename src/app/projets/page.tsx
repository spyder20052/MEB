"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Sparkle, FileText, ChartBar, PaperPlaneRight } from "@phosphor-icons/react";
import { getProjects, getHiddenPages, ProjectItem } from "@/utils/storage";
import { PageHiddenFallback } from "@/components/layout/PageHiddenFallback";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProjetsPage() {
  const [isPageHidden, setIsPageHidden] = useState(false);
  const [fannedProjects, setFannedProjects] = useState<ProjectItem[]>([]);
  const [originalCount, setOriginalCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(2);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hidden = getHiddenPages();
    if (hidden.includes("/projets")) {
      setIsPageHidden(true);
    }

    const active = getProjects().filter((p) => !p.isHidden);
    setOriginalCount(active.length);
    
    if (active.length > 0) {
      // Pad to at least 5 items to keep carousel slots filled
      let padded = [...active];
      while (padded.length < 5) {
        padded = [...padded, ...active];
      }
      setFannedProjects(padded);
    } else {
      setFannedProjects([]);
    }
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;

    const lines = headerRef.current.querySelectorAll(".reveal-line");

    gsap.set(lines, { y: "105%", opacity: 0 });

    const animation = gsap.to(lines, {
      y: "0%",
      opacity: 1,
      duration: 1.2,
      stagger: 0.15,
      ease: "power4.out",
      scrollTrigger: {
        trigger: headerRef.current,
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
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getSlotStyle = (slotIndex: number) => {
    const offset = slotIndex - 2; // relative to center slot

    if (isMobile) {
      // Mobile slot layout matching the user's mobile screenshot
      if (slotIndex === 2) {
        return {
          x: 35,
          y: -10,
          scale: 1.02,
          rotate: 8,
          opacity: 1,
          zIndex: 30,
          border: "border-cyan-300 border-2",
        };
      } else if (slotIndex === 1) {
        return {
          x: -90,
          y: 10,
          scale: 0.82,
          rotate: -8,
          opacity: 0.85,
          zIndex: 20,
          border: "border-transparent",
        };
      } else if (slotIndex === 3) {
        return {
          x: 160,
          y: 15,
          scale: 0.82,
          rotate: 15,
          opacity: 0.5,
          zIndex: 20,
          border: "border-transparent",
        };
      } else if (slotIndex === 0) {
        return {
          x: -190,
          y: 15,
          scale: 0.75,
          rotate: -15,
          opacity: 0.5,
          zIndex: 10,
          border: "border-transparent",
        };
      } else { // slotIndex === 4
        return {
          x: 250,
          y: 20,
          scale: 0.75,
          rotate: 20,
          opacity: 0,
          zIndex: 10,
          border: "border-transparent",
        };
      }
    } else {
      // Desktop fanned layout
      const xOffset = 240;
      const yOffset = 12;
      const x = offset * xOffset;
      const y = Math.abs(offset) * yOffset - (slotIndex === 2 ? 15 : 0);
      const scale = slotIndex === 2 ? 1.02 : 0.8 - Math.abs(offset) * 0.08;
      const rotate = offset * 8;
      const opacity = slotIndex === 2 ? 1 : (Math.abs(offset) === 1 ? 0.85 : 0.5);
      const zIndex = 30 - Math.abs(offset) * 10;
      const border = slotIndex === 2 ? "border-cyan-300 border-2" : "border-transparent";

      return { x, y, scale, rotate, opacity, zIndex, border };
    }
  };

  if (isPageHidden) {
    return <PageHiddenFallback pageName="Projets" />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#060D03] pt-48 relative overflow-hidden">
      
      {/* ── HERO SECTION: SCHEMA DIAGRAM FLOW & FEATURED CARD ── */}
      <section className="max-w-[1240px] mx-auto px-5 sm:px-8 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* FLOWCHART AREA (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Flowchart Schematic Wrapper */}
            <div className="relative w-full min-h-[300px] flex flex-col justify-between">
              
              {/* Row 1: Input & Generate */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-8 relative w-full">
                
                {/* 1. Input Block */}
                <motion.div 
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ y: -12, scale: 1.05, rotate: -1, boxShadow: "0 20px 30px rgba(234,186,7,0.3)" }}
                  whileTap={{ scale: 0.94, rotate: 0, y: -2 }}
                  className="bg-[#eabe07] border border-[#d0a905] rounded-2xl p-4 w-full sm:w-[220px] shadow-sm relative z-10 flex-shrink-0 cursor-pointer"
                >
                  <div className="mb-2 text-[#060D03] font-mono text-xs font-bold uppercase tracking-wider">
                    <span>IDÉE / PROJET</span>
                  </div>
                  <p className="font-heading font-medium text-sm text-[#060D03]/85">
                    Diagnostique ton idée
                  </p>
                </motion.div>

                {/* SVG Connecting Line (Input to Generate) */}
                <div className="hidden sm:block flex-1 self-stretch relative min-h-[110px]">
                  <svg className="w-full h-full pointer-events-none absolute inset-0" viewBox="0 0 100 120" preserveAspectRatio="none" fill="none">
                    <defs>
                      <marker
                        id="arrow-head"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                      >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#060D03" />
                      </marker>
                    </defs>
                    <path 
                      d="M 0 40 Q 50 40 100 80" 
                      stroke="#060D03" 
                      strokeWidth="1.5" 
                      vectorEffect="non-scaling-stroke"
                      strokeDasharray="4 4" 
                      strokeLinecap="round" 
                      markerEnd="url(#arrow-head)"
                    />
                  </svg>
                </div>

                {/* 2. Generate Block */}
                <motion.div 
                  initial={{ opacity: 0, y: -25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ y: -12, scale: 1.05, rotate: 1, boxShadow: "0 20px 30px rgba(0,177,64,0.3)" }}
                  whileTap={{ scale: 0.94, rotate: 0, y: -2 }}
                  className="bg-[#00B140] border border-[#009b37] rounded-2xl p-4 w-full sm:w-[220px] shadow-sm relative z-10 sm:mt-10 flex-shrink-0 cursor-pointer"
                >
                  <div className="mb-2 text-white font-mono text-xs font-bold uppercase tracking-wider">
                    <span>ACCOMPAGNEMENT</span>
                  </div>
                  <p className="font-heading font-medium text-xs text-white/90 leading-relaxed">
                    Bâtis ton business plan & structure ton offre
                  </p>
                </motion.div>

              </div>

              {/* Row 2: Output (connected vertically from Generate) */}
              <div className="flex justify-center sm:justify-end pr-0 sm:pr-8 mt-6 relative">
                
                {/* SVG Connecting Line (Generate to Output) */}
                <svg className="hidden sm:block absolute top-[-35px] right-[120px] w-[30px] h-[55px] pointer-events-none" fill="none">
                  <path 
                    d="M15 0 L15 45" 
                    stroke="#060D03" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                  />
                  <polygon points="15,45 10,38 20,38" fill="#060D03" />
                </svg>

                {/* 3. Output Block */}
                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ y: -12, scale: 1.05, rotate: -1, boxShadow: "0 20px 30px rgba(198,24,39,0.3)" }}
                  whileTap={{ scale: 0.94, rotate: 0, y: -2 }}
                  className="bg-[#c61827] border border-[#ad1320] rounded-2xl p-4 w-full sm:w-[220px] shadow-sm relative z-10 cursor-pointer"
                >
                  <div className="mb-2 text-white font-mono text-xs font-bold uppercase tracking-wider">
                    <span>FINANCEMENT</span>
                  </div>
                  <p className="font-heading font-medium text-xs text-white/90 leading-relaxed">
                    Connecte-toi aux PTF et obtiens ton crédit
                  </p>
                </motion.div>

              </div>

              {/* Bottom Input Search Pill */}
              <div className="mt-8 flex justify-start">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ y: -6, scale: 1.04, boxShadow: "0 15px 35px rgba(0,0,0,0.12)", borderColor: "#00B140" }}
                  whileTap={{ scale: 0.95, y: -1 }}
                  className="bg-white border-2 border-[#060D03]/10 rounded-full px-5 py-2.5 flex items-center justify-between w-full sm:w-[350px] shadow-md cursor-pointer"
                >
                  <span className="font-heading text-xs font-medium text-[#060D03]/60 truncate">
                    Un projet qui révolutionne l&apos;artisanat...
                  </span>
                  <button className="w-8 h-8 rounded-full bg-[#060D03] hover:bg-[#00B140] text-white flex items-center justify-center transition-colors">
                    <PaperPlaneRight size={14} weight="fill" />
                  </button>
                </motion.div>
              </div>

            </div>

          </div>

          {/* FEATURED CARD AREA (col-span-5) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ y: -14, scale: 1.03, boxShadow: "0 30px 60px rgba(0,177,64,0.15)" }}
              whileTap={{ scale: 0.95, y: -4 }}
              className="bg-[#0A1405] border border-[#13260A] rounded-[2.5rem] p-6 max-w-[310px] w-full flex flex-col justify-between min-h-[440px] shadow-lg relative group overflow-hidden cursor-pointer"
            >
              {/* Card Image */}
              <div className="relative w-full h-[180px] rounded-[1.6rem] overflow-hidden border border-white/[0.05] bg-white/5 mb-5 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                <Image 
                  src="/images/journey/Image co.png" 
                  alt="Rapports de tendances" 
                  fill 
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>

              {/* Card Wording */}
              <div>
                <span className="inline-block font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-3 bg-white/10 text-white">
                  RAPPORTS SECTORIELS
                </span>
                <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-white mb-2 leading-none">
                  RAPPORTS DE TENDANCES
                </h3>
                <p className="font-body text-xs text-white/70 leading-relaxed mb-6">
                  Découvre les tendances de ton marché pour propulser ton projet au bon moment.
                </p>
              </div>

              {/* Action Button - Brand yellow with premium white sliding hover effect */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="self-start"
              >
                <Link
                  href="/prendre-rdv"
                  className="group relative overflow-hidden inline-flex items-center justify-center bg-[#eabe07] px-6 py-3.5 rounded-full font-heading font-bold text-xs uppercase tracking-widest self-start shadow-sm"
                >
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                  <span className="relative z-10 text-meb-dark transition-colors duration-500 flex items-center gap-2">
                    LANCER
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

        </div>

        {/* HERO HEADER & BUTTON */}
        <div className="text-center pt-16 pb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tighter leading-[1.05] text-[#060D03] max-w-4xl mx-auto mb-8"
          >
            Bâtir, structurer et propulser <br />
            <span className="text-[#00B140]">ton projet d&apos;entreprise.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link 
              href="/prendre-rdv" 
              className="inline-flex items-center gap-2 bg-[#060D03] hover:bg-[#00B140] text-white py-3.5 px-7 rounded-full font-heading font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:-translate-y-0.5"
            >
              Prendre RDV
              <ArrowRight size={14} weight="bold" />
            </Link>
          </motion.div>
        </div>

      </section>

      {/* ── SECTION 2: GALLERY WITH FANNED TILTED CARDS (WHITE BG, ROUNDED TOP & BOTTOM) ── */}
      <section className="bg-white rounded-[2rem] lg:rounded-[4.5rem] pt-10 pb-12 lg:pt-24 lg:pb-28 border-2 border-[#00B140] relative z-20 shadow-inner mx-4 sm:mx-8 mb-16 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          
          {/* Header */}
          <div ref={headerRef} className="text-center mb-6 lg:mb-20 max-w-2xl mx-auto overflow-hidden">
            <h2 className="font-heading font-black text-xl sm:text-3xl lg:text-4xl uppercase tracking-tighter leading-[1.1] text-[#060D03]">
              <span className="block overflow-hidden mb-1">
                <span className="reveal-line inline-block">
                  Découvre les projets de nos membres
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="reveal-line inline-block text-[#00B140]">
                  pour trouver l&apos;inspiration
                </span>
              </span>
            </h2>
          </div>

          {/* Carousel Layout Container */}
          <div 
            className="relative w-full max-w-[1240px] mx-auto min-h-[340px] lg:min-h-[500px] flex items-center justify-center py-4 lg:py-10"
          >
            {fannedProjects.map((project, i) => {
              const slotIndex = (i - activeIndex + 2 + 5) % 5;
              const style = getSlotStyle(slotIndex);

              return (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    zIndex: style.zIndex,
                  }}
                  animate={{
                    x: style.x,
                    y: style.y,
                    scale: style.scale,
                    rotate: style.rotate,
                    opacity: style.opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 110,
                    damping: 18,
                  }}
                  onClick={() => setActiveIndex(i)}
                  className={`w-[220px] sm:w-[270px] lg:w-[230px] xl:w-[250px] rounded-[1.25rem] lg:rounded-3xl p-3.5 lg:p-5 border flex flex-col justify-between min-h-[280px] lg:min-h-[380px] cursor-pointer shadow-md transition-shadow duration-300 ${project.bgColor} ${style.border}`}
                >
                  {/* Image Area */}
                  <div className="relative w-full h-[85px] lg:h-[140px] rounded-xl lg:rounded-2xl overflow-hidden border border-[#060D03]/5 mb-2.5 lg:mb-4 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image 
                      src={project.image} 
                      alt={project.title} 
                      fill 
                      className="object-cover"
                    />
                  </div>

                  {/* Card Wording */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Sector Badge */}
                      <span className={`inline-block font-mono text-[8px] lg:text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2 lg:mb-3 ${project.tagColor}`}>
                        {project.sector}
                      </span>
                      <h3 className="font-heading font-black text-sm lg:text-lg uppercase tracking-tight mb-1.5 lg:mb-2 leading-tight">
                        {project.title}
                      </h3>
                      <p className="font-body text-[10px] lg:text-[11px] leading-relaxed opacity-80 mb-3 lg:mb-4 line-clamp-2 lg:line-clamp-3">
                        {project.desc}
                      </p>
                    </div>

                    {/* Arrow Action Row */}
                    <div className="flex items-center justify-between pt-2.5 lg:pt-3 border-t border-current/10">
                      <span className="font-mono text-[8px] lg:text-[9px] font-bold opacity-60">PROJET MEB</span>
                      <Link 
                        href="/prendre-rdv"
                        className="w-5.5 h-5.5 lg:w-7 lg:h-7 rounded-full bg-[#060D03] hover:bg-[#00B140] text-white flex items-center justify-center transition-colors"
                      >
                        <ArrowUpRight size={isMobile ? 10 : 12} weight="bold" />
                      </Link>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8 relative z-30">
            {originalCount > 0 && Array.from({ length: originalCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex % originalCount === i ? "bg-[#00B140] w-6" : "bg-[#060D03]/20 hover:bg-[#060D03]/40"
                }`}
                aria-label={`Projet ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
