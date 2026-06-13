"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowDownLeft, X, Check, Calendar, MapPin } from "@phosphor-icons/react";
import { getEvents, getHiddenPages, EventItem, DEFAULT_EVENTS } from "@/utils/storage";
import { PageHiddenFallback } from "@/components/layout/PageHiddenFallback";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function EvenementsPage() {
  const [isPageHidden, setIsPageHidden] = useState(false);
  const [eventList, setEventList] = useState<EventItem[]>(DEFAULT_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", whatsapp: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<any>({});
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hidden = getHiddenPages();
    if (hidden.includes("/evenements")) {
      setIsPageHidden(true);
    }
    setEventList(getEvents());
  }, []);

  const e1 = eventList.find(e => e.num === "01");
  const e2 = eventList.find(e => e.num === "02");
  const e3 = eventList.find(e => e.num === "03");
  const e4 = eventList.find(e => e.num === "04");

  const otherEvents = eventList.filter(e => !["01", "02", "03", "04"].includes(e.num));

  const renderEventCard = (event: EventItem) => {
    const style = event.templateStyle || "01";
    
    if (style === "01") {
      return (
        <motion.div
          key={event.num}
          onClick={() => openModal(event)}
          whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 30px rgba(230, 57, 70, 0.25)" }}
          whileTap={{ scale: 0.95, y: -2 }}
          className="group border border-transparent bg-[#E63946] hover:bg-[#E63946]/95 rounded-[1.5rem] p-6 flex flex-col justify-between min-h-[220px] cursor-pointer transition-colors duration-300 relative overflow-hidden text-white"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="font-mono text-sm text-white font-bold">#</span>
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
              <span>{event.dateStr}</span>
              <span className="text-white font-bold">{event.seats} PLACES RESTANTES</span>
            </div>
          </div>
        </motion.div>
      );
    }
    
    if (style === "02") {
      return (
        <motion.div
          key={event.num}
          onClick={() => openModal(event)}
          whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 30px rgba(255, 255, 255, 0.08)" }}
          whileTap={{ scale: 0.95, y: -2 }}
          className="relative group cursor-pointer rounded-[1.5rem] flex min-h-[220px]"
        >
          <div 
            className="bg-white text-[#060D03] p-6 rounded-l-[1.5rem] rounded-br-[1.5rem] flex-1 flex flex-col justify-between"
            style={{ clipPath: "polygon(0 0, 75% 0, 100% 25%, 100% 100%, 0 100%)" }}
          >
            <div>
              <div className="flex justify-between items-start mb-6 pr-6">
                <span className="font-mono text-sm text-[#00B140] font-bold">#</span>
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
              <span>{event.dateStr}</span>
              <span className="text-[#00B140] font-bold">{event.seats} PLACES RESTANTES</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              openModal(event);
            }}
            className="absolute top-[-28px] right-[-12px] w-14 h-14 rounded-full border border-white bg-[#060D03] hover:bg-[#00B140] hover:text-white text-white flex items-center justify-center transition-all duration-300 group z-30 shadow-lg"
          >
            <ArrowDownLeft size={20} className="group-hover:scale-110 transition-transform" />
          </motion.button>
        </motion.div>
      );
    }
    
    if (style === "03") {
      return (
        <motion.div
          key={event.num}
          onClick={() => openModal(event)}
          whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 30px rgba(0, 177, 64, 0.25)" }}
          whileTap={{ scale: 0.95, y: -2 }}
          className="group border border-transparent bg-[#00B140] hover:bg-[#00D94F] rounded-[1.5rem] p-6 flex flex-col justify-between min-h-[220px] cursor-pointer transition-colors duration-300 relative overflow-hidden text-white"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="font-mono text-sm text-white font-bold">#</span>
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
              <span>{event.dateStr}</span>
              <span className="text-white font-bold">{event.seats} PLACES RESTANTES</span>
            </div>
          </div>
        </motion.div>
      );
    }
    
    if (style === "04") {
      return (
        <motion.div
          key={event.num}
          onClick={() => openModal(event)}
          whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 30px rgba(245, 197, 24, 0.25)" }}
          whileTap={{ scale: 0.95, y: -2 }}
          className="group border border-transparent bg-[#F5C518] hover:bg-[#ffda3c] rounded-[1.5rem] p-6 flex flex-col justify-between min-h-[220px] cursor-pointer transition-colors duration-300 relative overflow-hidden text-[#060D03]"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="font-mono text-sm text-[#060D03] font-bold">#</span>
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
              <span>{event.dateStr}</span>
              <span className="text-[#060D03] font-bold">{event.seats} PLACES RESTANTES</span>
            </div>
          </div>
        </motion.div>
      );
    }
  };

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

  const openModal = (event: any) => {
    setSelectedEvent(event);
    setFormData({ name: "", whatsapp: "", email: "" });
    setFormErrors({});
    setSubmitSuccess(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: any = {};
    if (!formData.name.trim()) errors.name = "Le nom complet est requis.";
    if (!formData.whatsapp.trim()) errors.whatsapp = "Le numéro WhatsApp est requis.";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1200);
  };

  if (isPageHidden) {
    return <PageHiddenFallback pageName="Événements" />;
  }

  return (
    <div className="min-h-screen bg-white text-[#060D03] pt-44 pb-20">

      {/* ── HERO BRUTALIST (MIMICKING THE HALLOWEEN PARTY DESIGN) ───────────────────────── */}
      <section className="max-w-[1240px] mx-auto px-5 sm:px-8 pb-10">
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Huge Typography Header */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full">
            <div className="relative">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-heading font-light text-[11vw] sm:text-[9vw] lg:text-[7vw] leading-[0.95] tracking-tighter text-[#060D03] uppercase relative"
              >
                AGENDA <br />
                <span className="font-extrabold">MEB</span>
                <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-light align-super ml-2">
                  (01)
                </span>
              </motion.h1>

              {/* Overlapping Brutalist Circular Button */}
              <motion.a 
                href="/prendre-rdv"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.08, rotate: 5 }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute right-[5%] top-[60%] lg:right-[15%] lg:top-[50%] w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-[#060D03] bg-white flex flex-col items-center justify-center cursor-pointer group hover:bg-[#060D03] hover:text-white transition-all duration-500 shadow-md"
              >
                <ArrowUpRight size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span className="font-mono text-[9px] font-bold tracking-widest uppercase mt-2 text-center leading-tight">
                  S&apos;inscrire <br />à l&apos;agenda
                </span>
              </motion.a>
            </div>

            {/* Left and Middle Columns below Header */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-16 mt-8 border-t border-[#060D03]/10">
              
              {/* Left Tags Column */}
              <div className="md:col-span-4 flex flex-col gap-2.5">
                <div className="border border-[#060D03] rounded-full px-5 py-2.5 inline-flex items-center justify-center font-mono text-[10px] font-bold uppercase tracking-widest text-[#060D03] hover:bg-[#060D03] hover:text-white transition-colors duration-300">
                  Calendrier 2026
                </div>
                <div className="border border-[#060D03] rounded-full px-5 py-2.5 inline-flex items-center justify-center font-mono text-[10px] font-bold uppercase tracking-widest text-[#060D03] hover:bg-[#060D03] hover:text-white transition-colors duration-300">
                  Ciné Concorde
                </div>
              </div>

              {/* Middle Paragraph Column */}
              <div className="md:col-span-8 pr-4">
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#060D03]/40 uppercase mb-3 block">
                  L&apos;impact par le réseau
                </span>
                <h3 className="font-heading font-bold text-lg text-[#060D03] uppercase tracking-tight mb-3">
                  ENTREPRENDRE EN COLLECTIF.
                </h3>
                <p className="font-body text-sm text-[#060D03]/70 leading-relaxed">
                  Notre hub digital et physique réunit des sessions régulières conçues pour débloquer votre croissance. Choisissez votre format et réservez vos places via Luma pour rejoindre l&apos;écosystème.
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Dynamic Duo of Images (col-span-4) */}
          <div className="lg:col-span-4 flex items-end justify-end gap-4 w-full pt-10 lg:pt-0">
            {/* Small Portrait Image */}
            <motion.div 
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-[110px] h-[150px] sm:w-[130px] sm:h-[180px] rounded-[1.5rem] overflow-hidden border border-[#060D03]/10 shrink-0 shadow-sm"
            >
              <Image 
                src="/images/journey/Image co.png" 
                alt="MEB workshop" 
                fill 
                className="object-cover grayscale"
              />
            </motion.div>

            {/* Large Portrait Image */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative w-[200px] h-[280px] sm:w-[240px] sm:h-[320px] rounded-[2rem] overflow-hidden border border-[#060D03]/10 shrink-0 shadow-md"
            >
              <Image 
                src="/images/entrepreneur-1.png" 
                alt="MEB community" 
                fill 
                className="object-cover grayscale"
              />
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── RUNNING TICKER MARQUEE ───────────────────────── */}
      <div className="w-full border-y border-[#060D03] py-4 my-16 overflow-hidden bg-white relative z-20">
        <div className="flex gap-16 animate-[marquee_35s_linear_infinite] whitespace-nowrap">
          {Array.from({ length: 3 }).map((_, o) => (
            <div key={o} className="flex gap-16 shrink-0">
              {["JPO", "PETIT-DEJ", "AFTERWORK", "MASTERMIND", "CO-CREATION", "LUMA EVENTS"].map((text, i) => (
                <span 
                  key={i} 
                  className="font-heading font-black text-xs tracking-[0.25em] uppercase text-[#060D03] flex items-center gap-4"
                >
                  {text} <span className="text-[#00B140]">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── NEW DARK BRUTALIST EVENTS CALENDAR SECTION ───────────────────────── */}
      <section className="bg-[#060D03] text-white py-24 border-t border-white/5 relative z-20">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          
          {/* Section Header */}
          <div ref={headerRef} className="mb-16 overflow-hidden">
            <h2 className="font-heading font-light text-4xl sm:text-5xl lg:text-7xl uppercase tracking-tighter leading-[0.95] text-white">
              <span className="block overflow-hidden mb-2">
                <span className="reveal-line inline-block">
                  <span className="font-mono text-xl sm:text-2xl lg:text-3xl align-super mr-4 text-[#00B140]">(02)</span>
                  AGENDA DES
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="reveal-line inline-block font-extrabold">
                  EVENEMENTS MEB
                </span>
              </span>
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* COLUMN 1: Pill & Image */}
            <div className="lg:col-span-3 flex flex-col gap-6 justify-between h-full">
              <div>
                <div className="border border-white/20 rounded-full px-5 py-2 inline-flex items-center justify-center font-mono text-[10px] font-bold uppercase tracking-widest text-white hover:border-[#00B140] hover:text-[#00B140] transition-all duration-300">
                  AGENDA 2026
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative w-full h-[250px] sm:h-[300px] lg:h-[220px] xl:h-[260px] rounded-[1.5rem] overflow-hidden border border-white/10 shadow-lg mt-8 lg:mt-0"
              >
                <Image 
                  src="/images/journey/Image co.png" 
                  alt="MEB Community Events" 
                  fill 
                  className="object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700"
                />
              </motion.div>
            </div>

            {/* COLUMN 2: Card 01 & Card 03 */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Card 01 - JPO */}
              {e1 && !e1.isHidden && (
                <motion.div
                  onClick={() => openModal(e1)}
                  whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 30px rgba(230, 57, 70, 0.25)" }}
                  whileTap={{ scale: 0.95, y: -2 }}
                  className="group border border-transparent bg-[#E63946] hover:bg-[#E63946]/95 rounded-[1.5rem] p-6 flex flex-col justify-between min-h-[200px] cursor-pointer transition-colors duration-300 relative overflow-hidden text-white"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-sm text-white font-bold">01</span>
                    <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-white/95 border border-white/20 px-2.5 py-0.5 rounded-full bg-white/10">
                      {e1.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg uppercase leading-tight text-white mb-2">
                      {e1.title}
                    </h3>
                    <p className="font-body text-xs text-white/90 leading-relaxed mb-4 line-clamp-3">
                      {e1.desc}
                    </p>
                    <div className="border-t border-white/25 pt-3 flex items-center justify-between font-mono text-[9px] text-white/70">
                      <span>{e1.dateStr}</span>
                      <span className="text-white font-bold">{e1.seats} PLACES RESTANTES</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Card 03 - Mastermind */}
              {e3 && !e3.isHidden && (
                <motion.div
                  onClick={() => openModal(e3)}
                  whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 30px rgba(0, 177, 64, 0.25)" }}
                  whileTap={{ scale: 0.95, y: -2 }}
                  className="group border border-transparent bg-[#00B140] hover:bg-[#00D94F] rounded-[1.5rem] p-6 flex flex-col justify-between min-h-[200px] cursor-pointer transition-colors duration-300 relative overflow-hidden text-white"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-sm text-white font-bold">03</span>
                    <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-white/95 border border-white/20 px-2.5 py-0.5 rounded-full bg-white/10">
                      {e3.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg uppercase leading-tight text-white mb-2">
                      {e3.title}
                    </h3>
                    <p className="font-body text-xs text-white/90 leading-relaxed mb-4 line-clamp-3">
                      {e3.desc}
                    </p>
                    <div className="border-t border-white/25 pt-3 flex items-center justify-between font-mono text-[9px] text-white/70">
                      <span>{e3.dateStr}</span>
                      <span className="text-white font-bold">{e3.seats} PLACES RESTANTES</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* COLUMN 3: Card 02 (White with diagonal cut) & Overlapping button */}
            <div className="lg:col-span-3 flex flex-col gap-6 justify-between h-full relative">
              {e2 && !e2.isHidden && (
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 30px rgba(255, 255, 255, 0.08)" }}
                  whileTap={{ scale: 0.95, y: -2 }}
                  className="relative group cursor-pointer rounded-[1.5rem]" 
                  onClick={() => openModal(e2)}
                >
                  {/* White Card body with Clip Path */}
                  <div 
                    className="bg-white text-[#060D03] p-6 rounded-l-[1.5rem] rounded-br-[1.5rem] min-h-[200px] flex flex-col justify-between"
                    style={{ clipPath: "polygon(0 0, 75% 0, 100% 25%, 100% 100%, 0 100%)" }}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6 pr-6">
                        <span className="font-mono text-sm text-[#00B140] font-bold">02</span>
                        <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-[#060D03]/50 bg-[#060D03]/5 px-2.5 py-0.5 rounded-full">
                          {e2.tag}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-lg uppercase leading-tight text-[#060D03] mb-2">
                          {e2.title}
                        </h3>
                        <p className="font-body text-xs text-[#060D03]/70 leading-relaxed mb-4 line-clamp-3">
                          {e2.desc}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t border-[#060D03]/10 pt-3 flex items-center justify-between font-mono text-[9px] text-[#060D03]/60">
                      <span>{e2.dateStr}</span>
                      <span className="text-[#00B140] font-bold">{e2.seats} PLACES RESTANTES</span>
                    </div>
                  </div>

                  {/* Circular Button nested in the diagonal cut */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(e2);
                    }}
                    className="absolute top-[-28px] right-[-12px] w-14 h-14 rounded-full border border-white bg-[#060D03] hover:bg-[#00B140] hover:text-white text-white flex items-center justify-center transition-all duration-300 group z-30 shadow-lg"
                  >
                    <ArrowDownLeft size={20} className="group-hover:scale-110 transition-transform" />
                  </motion.button>
                </motion.div>
              )}

              {/* Spacing alignment for bento layout on desktop */}
              <div className="hidden lg:block h-24"></div>
            </div>

            {/* COLUMN 4: Card 04 (Spans full height of others) */}
            <div className="lg:col-span-3 flex h-full">
              {e4 && !e4.isHidden && (
                <motion.div
                  onClick={() => openModal(e4)}
                  whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 30px rgba(245, 197, 24, 0.25)" }}
                  whileTap={{ scale: 0.95, y: -2 }}
                  className="group border border-transparent bg-[#F5C518] hover:bg-[#ffda3c] rounded-[1.5rem] p-6 flex flex-col justify-between w-full min-h-[300px] lg:min-h-full cursor-pointer transition-colors duration-300 relative overflow-hidden text-[#060D03]"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-sm text-[#060D03] font-bold">04</span>
                    <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-[#060D03]/75 border border-[#060D03]/15 px-2.5 py-0.5 rounded-full bg-black/5">
                      {e4.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg uppercase leading-tight text-[#060D03] mb-2">
                      {e4.title}
                    </h3>
                    <p className="font-body text-xs text-[#060D03]/85 leading-relaxed mb-4">
                      {e4.desc}
                    </p>
                    <div className="border-t border-[#060D03]/15 pt-3 flex items-center justify-between font-mono text-[9px] text-[#060D03]/70 mt-6">
                      <span>{e4.dateStr}</span>
                      <span className="text-[#060D03] font-bold">{e4.seats} PLACES RESTANTES</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── AUTRES ÉVÉNEMENTS À VENIR ───────────────────────── */}
      {otherEvents.length > 0 && (
        <section className="bg-[#060D03] text-white pb-24 relative z-20 border-t border-white/5 pt-12">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
            <h3 className="font-heading font-light text-xl sm:text-2xl uppercase tracking-tight mb-12 text-white">
              <span className="font-mono text-lg mr-3 text-[#00B140]">(03)</span>
              AUTRES ÉVÉNEMENTS À VENIR
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {otherEvents.map((event) => renderEventCard(event))}
            </div>
          </div>
        </section>
      )}

      {/* ── REGISTRATION MODAL ───────────────────────── */}
      <AnimatePresence>
        {isModalOpen && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-[#060D03] rounded-2xl max-w-md w-full p-8 relative text-[#060D03] shadow-2xl"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-[#060D03]/60 hover:text-[#060D03] p-1 rounded-full hover:bg-black/5 transition-colors"
                aria-label="Fermer"
              >
                <X size={20} weight="bold" />
              </button>

              {!submitSuccess ? (
                <>
                  <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#00B140] uppercase mb-1 block">
                    Inscription
                  </span>
                  <h3 className="font-heading font-black text-xl uppercase leading-tight tracking-tight mb-4 pr-6">
                    {selectedEvent.title}
                  </h3>
                  
                  <div className="mb-6 bg-[#F5F5F5] p-4 rounded-xl border border-[#060D03]/5">
                    <div className="text-xs font-mono text-[#060D03]/70 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} weight="bold" className="text-[#00B140]" />
                        <span>{selectedEvent.dateStr || selectedEvent.date} ({selectedEvent.time})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} weight="bold" className="text-[#00B140]" />
                        <span>{selectedEvent.venue}</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block font-heading font-bold text-xs uppercase tracking-wider text-[#060D03] mb-1.5">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ton nom complet"
                        className={`w-full h-12 px-4 rounded-xl border-2 bg-transparent text-sm focus:outline-none transition-all ${
                          formErrors.name 
                            ? "border-[#E63946] focus:border-[#E63946]" 
                            : "border-[#060D03]/10 focus:border-[#00B140] focus:ring-2 focus:ring-[#00B140]/10"
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-[#E63946] text-xs mt-1 font-medium">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="whatsapp" className="block font-heading font-bold text-xs uppercase tracking-wider text-[#060D03] mb-1.5">
                        Numéro WhatsApp *
                      </label>
                      <input
                        type="text"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="Ton numéro WhatsApp (ex: 01 60 007 007)"
                        className={`w-full h-12 px-4 rounded-xl border-2 bg-transparent text-sm focus:outline-none transition-all ${
                          formErrors.whatsapp 
                            ? "border-[#E63946] focus:border-[#E63946]" 
                            : "border-[#060D03]/10 focus:border-[#00B140] focus:ring-2 focus:ring-[#00B140]/10"
                        }`}
                      />
                      {formErrors.whatsapp && (
                        <p className="text-[#E63946] text-xs mt-1 font-medium">{formErrors.whatsapp}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block font-heading font-bold text-xs uppercase tracking-wider text-[#060D03] mb-1.5">
                        Adresse e-mail (Optionnel)
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Ton adresse e-mail"
                        className="w-full h-12 px-4 rounded-xl border-2 border-[#060D03]/10 bg-transparent text-sm focus:outline-none focus:border-[#00B140] focus:ring-2 focus:ring-[#00B140]/10 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#00B140] hover:bg-[#00D94F] text-white font-heading font-bold py-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-xs mt-4 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Confirmer l'inscription"
                      )}
                    </button>
                    
                    <p className="text-center font-mono text-[9px] text-[#060D03]/40 uppercase tracking-wider mt-3">
                      Gratuit. Confirmation immédiate.
                    </p>
                  </form>
                </>
              ) : (
                <div className="py-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#E8F5EE] text-[#00B140] rounded-full flex items-center justify-center mb-6">
                    <Check size={32} weight="bold" />
                  </div>
                  <h3 className="font-heading font-black text-2xl uppercase leading-tight tracking-tight mb-2">
                    Inscription confirmée !
                  </h3>
                  <p className="font-body text-sm text-[#060D03]/70 leading-relaxed mb-6">
                    Merci <span className="font-bold text-[#060D03]">{formData.name}</span>, ta place est réservée pour <span className="font-bold text-[#060D03]">{selectedEvent.title}</span>.
                  </p>
                  <div className="w-full bg-[#F5F5F5] p-4 rounded-xl border border-[#060D03]/5 mb-6 text-xs text-[#060D03]/60 font-body">
                    Un récapitulatif a été enregistré et nous te recontactons sous 24h par WhatsApp au <span className="font-bold text-[#060D03]">{formData.whatsapp}</span> pour la confirmation finale.
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-full bg-[#060D03] hover:bg-[#060D03]/90 text-white font-heading font-bold py-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-xs"
                  >
                    Fermer la fenêtre
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
