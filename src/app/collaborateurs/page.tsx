"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { usePageHidden } from "@/hooks/usePageHidden";
import { PageHiddenFallback } from "@/components/layout/PageHiddenFallback";

export default function CollaborateursPage() {
  const isPageHidden = usePageHidden("/collaborateurs");
  const trackRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);


  const textContent = "COLLABORER AVEC LES INSTITUTIONS ET ENTREPRISES PARTENAIRES POUR CRÉER DES OPPORTUNITÉS DURABLES ET UN IMPACT CONCRET POUR NOS ENTREPRENEURS.";
  const words = textContent.split(" ");

  const partners = [
    {
      name: "CCI BÉNIN",
      description: "Chambre de Commerce",
      logo: (
        <svg viewBox="0 0 160 40" className="h-7 w-auto text-[#060D03] fill-current">
          <text x="0" y="28" className="font-heading font-black text-xl tracking-[0.1em]">CCI BÉNIN</text>
          <line x1="0" y1="34" x2="115" y2="34" stroke="currentColor" strokeWidth="3" />
        </svg>
      ),
    },
    {
      name: "ADPME",
      description: "Agence de Dév. des PME",
      logo: (
        <svg viewBox="0 0 160 40" className="h-7 w-auto text-[#060D03] fill-current">
          <text x="0" y="28" className="font-heading font-black text-2xl tracking-tighter">AD<tspan className="text-[#00B140]">PME</tspan></text>
          <rect x="110" y="10" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="119" cy="19" r="4" className="text-[#00B140] fill-current" />
        </svg>
      ),
    },
    {
      name: "ANPE",
      description: "Emploi National",
      logo: (
        <svg viewBox="0 0 160 40" className="h-7 w-auto text-[#060D03] fill-current">
          <text x="0" y="28" className="font-heading font-bold text-2xl tracking-wide">anpe</text>
          <circle cx="68" cy="18" r="5" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <path d="M 68 23 L 68 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: "SÈMÈ CITY",
      description: "Cité de l'Innovation",
      logo: (
        <svg viewBox="0 0 160 40" className="h-7 w-auto text-[#060D03] fill-current">
          <text x="0" y="28" className="font-heading font-black text-xl tracking-[0.15em] uppercase">SÈMÈ<tspan className="text-[#00B140]">.</tspan>CITY</text>
        </svg>
      ),
    },
    {
      name: "MTN BÉNIN",
      description: "Partenaire Télécom",
      logo: (
        <svg viewBox="0 0 160 40" className="h-7 w-auto text-[#060D03] fill-current">
          <rect x="0" y="4" width="70" height="32" rx="16" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <text x="14" y="27" className="font-heading font-black text-lg tracking-wider">MTN</text>
          <text x="80" y="25" className="font-heading font-bold text-[10px] tracking-[0.2em] text-[#060D03]/40">BENIN</text>
        </svg>
      ),
    },
    {
      name: "SG BÉNIN",
      description: "Société Générale",
      logo: (
        <svg viewBox="0 0 160 40" className="h-7 w-auto text-[#060D03] fill-current">
          <rect x="0" y="4" width="32" height="32" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <line x1="0" y1="20" x2="32" y2="20" stroke="currentColor" strokeWidth="2.5" />
          <text x="42" y="26" className="font-heading font-bold text-lg tracking-tight">SOCIETE</text>
          <text x="42" y="36" className="font-heading font-light text-[9px] tracking-[0.2em] text-[#060D03]/50">GENERALE</text>
        </svg>
      ),
    },
  ];

  // Le defilement est joue par l'animation CSS .meb-marquee-track : on ne
  // calcule ici que sa duree, pour garder la vitesse d'origine (~55 px/s)
  // quel que soit le nombre de partenaires. La pause au survol et le
  // respect de « mouvement reduit » sont geres en CSS.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const setDuration = () => {
      // La piste contient 3 copies de la liste ; un cycle correspond a un tiers.
      const cycle = track.scrollWidth / 3;
      if (cycle > 0) {
        track.style.setProperty("--duration", `${Math.max(20, cycle / 55)}s`);
      }
    };

    setDuration();

    // Les logos sont des SVG inline : la largeur est deja connue au montage,
    // mais une rotation d'ecran change la mise en page.
    window.addEventListener("resize", setDuration);
    return () => window.removeEventListener("resize", setDuration);
  }, []);

  if (isPageHidden) {
    return <PageHiddenFallback pageName="Partenaires" />;
  }

  return (
    <div className="min-h-screen bg-white text-[#060D03] pt-32 relative overflow-hidden">
      
      {/* ── SECTION 1: HERO CONTAINER (CURVED BOTTOM) ── */}
      <section className="bg-white rounded-b-[4.5rem] pb-28 pt-16 text-center relative z-10 border-b border-[#060D03]/5 shadow-sm">
        
        {/* Soft background glow accents */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="meb-glow absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none" style={{ "--glow": "#00B140", "--glow-opacity": 0.05 } as React.CSSProperties} />
          <div className="meb-glow absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none" style={{ "--glow": "#F5C518", "--glow-opacity": 0.05 } as React.CSSProperties} />
        </div>

        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative z-10">
          {/* Heading Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tighter leading-[1.05] text-[#060D03] max-w-4xl mx-auto mb-8"
          >
            Propulser <br className="sm:hidden" />
            l&apos;entrepreneuriat <br />
            <span className="text-[#00B140]">béninois ensemble.</span>
          </motion.h1>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Link 
              href="/prendre-rdv" 
              className="inline-flex items-center gap-2.5 bg-[#060D03] hover:bg-[#00B140] text-white py-3.5 px-7 rounded-full font-heading font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:-translate-y-0.5"
            >
              Nous Rejoindre
              <ArrowUpRight size={14} weight="bold" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: LOGOS TICKER (WHITE BACKGROUND, ALIGNED SIDE-BY-SIDE) ── */}
      <section className="bg-white py-24 z-0 relative overflow-hidden border-b border-[#060D03]/5">
        <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="w-full overflow-hidden">
            
            {/* GSAP Scrolling Track */}
            <div 
              ref={trackRef} 
              className="meb-marquee-track flex gap-20 w-max items-center py-4"
            >
              {/* Render 3 copies of the array to guarantee loop continuity */}
              {[...partners, ...partners, ...partners].map((partner, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center justify-center min-w-[160px] opacity-75 hover:opacity-100 transition-opacity duration-300 group cursor-pointer select-none"
                >
                  <div className="w-full flex justify-center mb-2 transform group-hover:scale-105 transition-transform duration-300">
                    {partner.logo}
                  </div>
                  <span className="font-mono text-[9px] font-bold tracking-wider text-[#060D03]/40 uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    {partner.description}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 3: BOTTOM CONTENT ── */}
      <section className="bg-white py-28 text-center relative z-10">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <p 
            ref={textRef}
            className="font-body text-sm sm:text-base text-[#060D03]/60 leading-relaxed uppercase tracking-tight font-medium overflow-hidden select-none"
          >
            {words.map((word, wIdx) => (
              <span key={wIdx} className="inline-block whitespace-nowrap mr-2.5 overflow-hidden pb-1">
                {word.split("").map((char, cIdx) => (
                  <span key={cIdx} className="inline-block char transform opacity-0">
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </p>
        </div>
      </section>

    </div>
  );
}
