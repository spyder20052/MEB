"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ArrowDownLeft } from "@phosphor-icons/react";
import { getEvents } from "@/utils/storage";

interface Event {
  num: string;
  title: string;
  dateStr: string;
  time: string;
  date: Date;
  desc: string;
  tag: string;
  seats: number;
  templateStyle?: "01" | "02" | "03" | "04";
}

export function EventPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);

  useEffect(() => {
    // Determine closest upcoming event
    const now = new Date();
    const storedEvents = getEvents();
    const futureEvents = storedEvents
      .filter((e) => !e.isHidden)
      .map((e) => ({
        num: e.num,
        title: e.title,
        dateStr: e.dateStr,
        time: e.time,
        date: new Date(e.dateRaw),
        desc: e.desc,
        tag: e.tag,
        seats: e.seats,
        templateStyle: e.templateStyle || (["01", "02", "03", "04"].includes(e.num) ? e.num as "01" | "02" | "03" | "04" : "01"),
      }))
      .filter((e) => e.date > now);

    if (futureEvents.length === 0) return;

    // Sort ascending
    futureEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
    const closest = futureEvents[0];
    setActiveEvent(closest);

    // Check if popup has already been shown in this browser session
    const hasBeenShown = sessionStorage.getItem("eventPopupShown");
    if (!hasBeenShown) {
      const openTimer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("eventPopupShown", "true");
      }, 1200);

      const closeTimer = setTimeout(() => {
        setIsOpen(false);
      }, 11200);

      return () => {
        clearTimeout(openTimer);
        clearTimeout(closeTimer);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && activeEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px]"
          >
            {/* Floating Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(false);
              }}
              className="absolute -top-12 right-2 flex items-center gap-1.5 text-white/80 hover:text-white font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-50 cursor-pointer"
            >
              <span>Fermer</span>
              <X size={12} weight="bold" />
            </button>

            {/* Clickable Card Link */}
            <Link
              href="/evenements"
              onClick={() => setIsOpen(false)}
              className="block w-full"
            >
              {/* CARD 01 - Journées Portes Ouvertes */}
              {activeEvent.templateStyle === "01" && (
                <motion.div
                  whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 30px rgba(230, 57, 70, 0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#E63946] rounded-[1.5rem] p-6 flex flex-col justify-between min-h-[240px] relative overflow-hidden text-white border border-white/5"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-sm text-white font-bold">
                      {!["01", "02", "03", "04"].includes(activeEvent.num) ? "#" : "01"}
                    </span>
                    <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-white/95 border border-white/20 px-2.5 py-0.5 rounded-full bg-white/10">
                      {activeEvent.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg uppercase leading-tight text-white mb-2">
                      {activeEvent.title}
                    </h3>
                    <p className="font-body text-xs text-white/90 leading-relaxed mb-4 line-clamp-3">
                      {activeEvent.desc}
                    </p>
                    <div className="border-t border-white/25 pt-3 flex items-center justify-between font-mono text-[9px] text-white/70">
                      <span>{activeEvent.dateStr} à {activeEvent.time}</span>
                      <span className="text-white font-bold">{activeEvent.seats} PLACES RESTANTES</span>
                    </div>
                  </div>

                  {/* 10-Second Linear Progress Bar */}
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 10, ease: "linear" }}
                    className="h-1.5 absolute bottom-0 left-0 bg-white/30"
                  />
                </motion.div>
              )}

              {/* CARD 02 - Petits-Déj' MEB */}
              {activeEvent.templateStyle === "02" && (
                <motion.div
                  whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 30px rgba(255, 255, 255, 0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full rounded-[1.5rem]"
                >
                  {/* White Card body with Clip Path */}
                  <div 
                    className="bg-white text-[#060D03] p-6 rounded-l-[1.5rem] rounded-br-[1.5rem] min-h-[240px] flex flex-col justify-between border border-transparent"
                    style={{ clipPath: "polygon(0 0, 75% 0, 100% 25%, 100% 100%, 0 100%)" }}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6 pr-6">
                        <span className="font-mono text-sm text-[#00B140] font-bold">
                          {!["01", "02", "03", "04"].includes(activeEvent.num) ? "#" : "02"}
                        </span>
                        <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-[#060D03]/50 bg-[#060D03]/5 px-2.5 py-0.5 rounded-full">
                          {activeEvent.tag}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-lg uppercase leading-tight text-[#060D03] mb-2">
                          {activeEvent.title}
                        </h3>
                        <p className="font-body text-xs text-[#060D03]/70 leading-relaxed mb-4 line-clamp-3">
                          {activeEvent.desc}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t border-[#060D03]/10 pt-3 flex items-center justify-between font-mono text-[9px] text-[#060D03]/60">
                      <span>{activeEvent.dateStr} à {activeEvent.time}</span>
                      <span className="text-[#00B140] font-bold">{activeEvent.seats} PLACES RESTANTES</span>
                    </div>
                  </div>

                  {/* Circular Button nested in the diagonal cut */}
                  <div className="absolute top-[-24px] right-[-10px] w-14 h-14 rounded-full border border-white bg-[#060D03] hover:bg-[#00B140] hover:text-white text-white flex items-center justify-center transition-all duration-300 group z-30 shadow-lg">
                    <ArrowDownLeft size={20} className="group-hover:scale-110 transition-transform" />
                  </div>

                  {/* 10-Second Linear Progress Bar */}
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 10, ease: "linear" }}
                    className="h-1.5 absolute bottom-0 left-0 bg-[#00B140]/30 rounded-bl-[1.5rem]"
                  />
                </motion.div>
              )}

              {/* CARD 03 - Mastermind Stratégique */}
              {activeEvent.templateStyle === "03" && (
                <motion.div
                  whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 30px rgba(0, 177, 64, 0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#00B140] rounded-[1.5rem] p-6 flex flex-col justify-between min-h-[240px] relative overflow-hidden text-white border border-white/5"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-sm text-white font-bold">
                      {!["01", "02", "03", "04"].includes(activeEvent.num) ? "#" : "03"}
                    </span>
                    <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-white/95 border border-white/20 px-2.5 py-0.5 rounded-full bg-white/10">
                      {activeEvent.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg uppercase leading-tight text-white mb-2">
                      {activeEvent.title}
                    </h3>
                    <p className="font-body text-xs text-white/90 leading-relaxed mb-4 line-clamp-3">
                      {activeEvent.desc}
                    </p>
                    <div className="border-t border-white/25 pt-3 flex items-center justify-between font-mono text-[9px] text-white/70">
                      <span>{activeEvent.dateStr} à {activeEvent.time}</span>
                      <span className="text-white font-bold">{activeEvent.seats} PLACES RESTANTES</span>
                    </div>
                  </div>

                  {/* 10-Second Linear Progress Bar */}
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 10, ease: "linear" }}
                    className="h-1.5 absolute bottom-0 left-0 bg-white/30"
                  />
                </motion.div>
              )}

              {/* CARD 04 - Afterworks Réseautage */}
              {activeEvent.templateStyle === "04" && (
                <motion.div
                  whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 30px rgba(245, 197, 24, 0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#F5C518] rounded-[1.5rem] p-6 flex flex-col justify-between min-h-[240px] relative overflow-hidden text-[#060D03] border border-black/5"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-sm text-[#060D03] font-bold">
                      {!["01", "02", "03", "04"].includes(activeEvent.num) ? "#" : "04"}
                    </span>
                    <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-[#060D03]/75 border border-[#060D03]/15 px-2.5 py-0.5 rounded-full bg-black/5">
                      {activeEvent.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg uppercase leading-tight text-[#060D03] mb-2">
                      {activeEvent.title}
                    </h3>
                    <p className="font-body text-xs text-[#060D03]/85 leading-relaxed mb-4 line-clamp-3">
                      {activeEvent.desc}
                    </p>
                    <div className="border-t border-[#060D03]/15 pt-3 flex items-center justify-between font-mono text-[9px] text-[#060D03]/70">
                      <span>{activeEvent.dateStr} à {activeEvent.time}</span>
                      <span className="text-[#060D03] font-bold">{activeEvent.seats} PLACES RESTANTES</span>
                    </div>
                  </div>

                  {/* 10-Second Linear Progress Bar */}
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 10, ease: "linear" }}
                    className="h-1.5 absolute bottom-0 left-0 bg-[#060D03]/20"
                  />
                </motion.div>
              )}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
