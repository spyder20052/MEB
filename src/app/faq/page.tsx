"use client";

import { useState, useEffect } from "react";
import { getHiddenPages } from "@/utils/storage";
import { PageHiddenFallback } from "@/components/layout/PageHiddenFallback";
import { motion, AnimatePresence } from "framer-motion";

interface FStyle {
  textHover: string;
  bulletHover: string;
  btnBg: string;
  btnText: string;
}

const colorStyles: Record<"green" | "yellow" | "red", FStyle> = {
  green: {
    textHover: "group-hover:text-[#00B140]",
    bulletHover: "group-hover:text-[#00B140]",
    btnBg: "bg-[#00B140] hover:bg-[#00D94F]",
    btnText: "text-white"
  },
  yellow: {
    textHover: "group-hover:text-[#eabe07]",
    bulletHover: "group-hover:text-[#eabe07]",
    btnBg: "bg-[#eabe07] hover:bg-[#ffd025]",
    btnText: "text-[#060D03]"
  },
  red: {
    textHover: "group-hover:text-[#E63946]",
    bulletHover: "group-hover:text-[#E63946]",
    btnBg: "bg-[#E63946] hover:bg-[#ff5260]",
    btnText: "text-white"
  }
};

const FAQ_ITEMS = [
  {
    q: "Qu'est-ce que la Maison de l'Entrepreneur du Bénin (MEB) ?",
    a: "La MEB est le premier hub d'accompagnement entrepreneurial à Cotonou, conçu pour aider les créateurs de projets, artisans, TPE et PME à structurer, financer et propulser leurs activités.",
    color: "green" as const
  },
  {
    q: "Comment puis-je rejoindre le réseau en tant que membre ?",
    a: "Vous pouvez postuler en ligne directement via notre page de contact ou en prenant rendez-vous avec un conseiller. Nous proposons différentes formules adaptées à votre niveau de maturité (Membre Actif, Membre Actif Installé, Contributeur/Mentor, Sponsor).",
    color: "yellow" as const
  },
  {
    q: "Les sessions d'accompagnement sont-elles payantes ?",
    a: "L'adhésion de base en tant que Membre Actif est gratuite pour les porteurs de projets en phase de diagnostic. Pour les structures formalisées visant la croissance, des abonnements adaptés sont proposés pour couvrir les frais de suivi et d'accès aux experts.",
    color: "red" as const
  },
  {
    q: "Quels types d'événements proposez-vous ?",
    a: "Nous organisons régulièrement quatre formats d'événements : des Journées Portes Ouvertes (JPO) pour les diagnostics d'idées, des Petits-Déjeuners thématiques avec des experts praticiens, des Masterminds stratégiques en comité restreint, et des Afterworks trimestriels pour le réseautage.",
    color: "green" as const
  },
  {
    q: "Comment fonctionne la mise en relation avec les partenaires financiers (PTF) ?",
    a: "Une fois votre business plan structuré et votre offre validée avec nos équipes, nous facilitons votre mise en relation directe avec nos banques et microfinances partenaires pour soumettre vos dossiers de demande de crédit.",
    color: "yellow" as const
  }
];

export default function FaqPage() {
  const [isPageHidden, setIsPageHidden] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const hidden = getHiddenPages();
    if (hidden.includes("/faq")) {
      setIsPageHidden(true);
    }
  }, []);

  if (isPageHidden) {
    return <PageHiddenFallback pageName="FAQ" />;
  }

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-[#060D03] pt-52 pb-32 px-5">
      <div className="max-w-[760px] mx-auto">
        
        {/* Header Section */}
        <div className="flex items-baseline justify-between pb-8 mb-6 border-b border-[#060D03]/10">
          <h1 className="font-heading font-black text-[12vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] text-[#00B140] leading-none tracking-tight select-none">
            FAQ
          </h1>
          <span className="font-mono text-xs sm:text-sm text-[#060D03]/50 lowercase tracking-wide select-none">
            (questions populaires)
          </span>
        </div>

        {/* FAQ Accordion List */}
        <div className="divide-y divide-[#060D03]/10">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            const style = colorStyles[item.color];

            return (
              <div 
                key={idx} 
                className="py-6 transition-all duration-300 cursor-pointer group"
                onClick={() => toggleItem(idx)}
              >
                {/* Question Header */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Diamond bullet point */}
                    <span className={`font-heading text-xs text-[#060D03]/70 select-none transition-colors ${style.bulletHover}`}>
                      ✦
                    </span>
                    <h3 className={`font-heading font-bold text-sm sm:text-base text-[#060D03] leading-snug transition-colors ${style.textHover}`}>
                      {item.q}
                    </h3>
                  </div>

                  {/* Circular Button */}
                  <motion.div
                    animate={{ rotate: isOpen ? 135 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-8 h-8 sm:w-10 h-10 rounded-full flex items-center justify-center text-base sm:text-lg font-bold shrink-0 shadow-md transition-colors duration-300 ${
                      isOpen 
                        ? "bg-[#060D03] text-white" 
                        : `${style.btnBg} ${style.btnText}`
                    }`}
                  >
                    +
                  </motion.div>
                </div>

                {/* Answer Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="font-body text-xs sm:text-sm text-[#060D03]/75 leading-relaxed pt-4 pl-7 pr-4 max-w-2xl">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
