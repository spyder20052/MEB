"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { House, EyeClosed, Gear } from "@phosphor-icons/react";

interface PageHiddenFallbackProps {
  pageName: string;
}

export const PageHiddenFallback: React.FC<PageHiddenFallbackProps> = ({ pageName }) => {
  return (
    <div className="min-h-screen bg-[#060D03] text-white flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background Tech Line Patterns */}
      <div className="absolute inset-0 tech-lines-light opacity-[0.04] pointer-events-none" />

      {/* Background Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00B140]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#E63946]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative max-w-lg w-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center backdrop-blur-xl shadow-2xl z-10 overflow-hidden"
      >
        {/* Animated Inner Curved Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#00B140] via-[#F5C518] to-[#E63946]" />

        {/* Eye Closed Icon Grid */}
        <div className="mx-auto w-20 h-20 bg-white/[0.04] border border-white/10 text-[#00B140] rounded-full flex items-center justify-center mb-8 shadow-inner">
          <EyeClosed size={36} weight="duotone" className="animate-pulse" />
        </div>

        {/* Text */}
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#00B140] mb-2 block">
          ADMINISTRATION MEB
        </span>
        <h1 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-tighter leading-none mb-4">
          PAGE MASQUÉE
        </h1>
        <p className="font-body text-sm text-white/60 leading-relaxed mb-10 max-w-sm mx-auto">
          L&apos;accès à la page <span className="text-white font-semibold">{pageName}</span> a été temporairement suspendu par l&apos;administrateur dans le tableau de bord.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00B140] hover:bg-[#00D94F] text-white font-heading font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-[#00B140]/10"
          >
            <House size={16} weight="bold" />
            <span>Retour à l&apos;accueil</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 font-heading font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Gear size={16} weight="bold" />
            <span>Tableau de bord</span>
          </Link>
        </div>

        {/* Footer Accent */}
        <div className="mt-12 pt-6 border-t border-white/[0.05] flex justify-between items-center font-mono text-[9px] text-white/30 uppercase tracking-widest">
          <span>MEB PORTAL</span>
          <span>CODE 403</span>
        </div>
      </motion.div>
    </div>
  );
};
