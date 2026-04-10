"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, PlayCircle, StarIcon, QuotesIcon } from "@phosphor-icons/react";

const testimonials = [
  {
    quote: "La MEB a été le catalyseur dont mon entreprise avait besoin. Leur expertise et leur réseau ont littéralement transformé notre trajectoire de croissance.",
    name: "Josué K.",
    title: "Fondateur, TechBénin",
    image: "/images/entrepreneur-1.png",
    stars: 5,
  },
  {
    quote: "En 6 mois d'adhésion, j'ai signé 3 contrats majeurs grâce aux connexions du MEB. Cet écosystème est unique au Bénin.",
    name: "Fatima A.",
    title: "CEO, AgroFutur SARL",
    image: "/images/entrepreneur-2.png",
    stars: 5,
  },
  {
    quote: "Le Mastermind mensuel m'a permis de résoudre des blocages stratégiques que je traînais depuis des années. Indispensable.",
    name: "Marc-Élie D.",
    title: "Directeur, InnoBénin",
    image: "/images/entrepreneur-1.png",
    stars: 5,
  },
];

const brands = [
  "TechBénin", "AgroFutur", "InnoBénin", "CotonouHub", "StartBJ", "Petits-Déj'", "Mastermind", "MEB 2030",
  "TechBénin", "AgroFutur", "InnoBénin", "CotonouHub", "StartBJ", "Petits-Déj'",
];

// Direction-aware slide variants — type-safe Framer Motion config
const slideVariants = {
  enter: (dir: number) => ({
    x: dir * 40,
    opacity: 0,
    filter: "blur(6px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      x: { type: "spring" as const, stiffness: 260, damping: 28 },
      opacity: { duration: 0.35, ease: "easeOut" as const },
      filter: { duration: 0.35, ease: "easeOut" as const },
    },
  },
  exit: (dir: number) => ({
    x: dir * -40,
    opacity: 0,
    filter: "blur(6px)",
    transition: {
      x: { type: "spring" as const, stiffness: 260, damping: 28 },
      opacity: { duration: 0.25, ease: "easeIn" as const },
      filter: { duration: 0.25, ease: "easeIn" as const },
    },
  }),
};

const portraitVariants = {
  enter: { opacity: 0, scale: 1.04 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
};

export const Testimonials = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const isPaused = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused.current) {
        setDirection(1);
        setActive((prev) => (prev + 1) % testimonials.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (i: number) => {
    if (i === active) return;
    setDirection(i > active ? 1 : -1);
    setActive(i);
    isPaused.current = true;
    setTimeout(() => { isPaused.current = false; }, 8000);
  };

  const t = testimonials[active];

  return (
    <section
      className="py-20 md:py-32 bg-meb-dark w-full overflow-hidden relative"
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-meb-green/[0.04] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-heading text-sm font-bold tracking-widest uppercase text-meb-green mb-4 block">
              La Voix des Entrepreneurs
            </span>
            <h2 className="font-heading font-bold text-[40px] md:text-[56px] lg:text-[72px] leading-[1.05] tracking-tight text-white max-w-2xl">
              Ils réinventent<br />
              <span className="font-light text-meb-gray-400">l&apos;économie.</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-sm md:text-base text-meb-gray-400 max-w-xs border-l-2 border-meb-dark-border pl-4 leading-relaxed md:pb-4"
          >
            Des centaines d&apos;entrepreneurs ont transformé leur trajectoire grâce au MEB.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`relative flex items-center px-5 py-2.5 rounded-full border text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300 overflow-hidden ${
                active === i
                  ? "bg-meb-green text-meb-dark border-meb-green"
                  : "text-white/50 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {active === i && (
                <span
                  key={`prog-${active}`}
                  className="absolute inset-0 bg-meb-dark/20 origin-right animate-[shrink_5s_linear_forwards]"
                />
              )}
              <span className="relative z-10">{String(i + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* ── LEFT: white quote card ── */}
          {/*
            Card itself is static. Only the inner content animates.
            overflow-hidden + relative wrapper ensures nothing bleeds outside.
          */}
          <div className="lg:col-span-8 bg-white rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden group min-h-[440px] md:min-h-[500px]">
            {/* Static decorations that never change */}
            <QuotesIcon
              size={180}
              weight="fill"
              className="absolute right-4 top-8 text-meb-gray-100 pointer-events-none select-none z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-meb-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

            {/* Stars row — static */}
            <div className="absolute top-8 md:top-14 left-8 md:left-14 lg:left-16 flex gap-1 z-10">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} size={18} weight="fill" className="text-meb-green" />
              ))}
            </div>

            {/* Animated content block — absolutely fills the card */}
            <AnimatePresence mode="sync" custom={direction} initial={false}>
              <motion.div
                key={active}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex flex-col justify-between p-8 md:p-14 lg:p-16 pt-20 md:pt-28"
              >
                {/* Quote */}
                <div className="flex-1 flex items-center">
                  <h3 className="font-heading font-medium italic text-[22px] md:text-[30px] lg:text-[36px] text-meb-dark leading-[1.25] tracking-tight">
                    &ldquo;{t.quote}&rdquo;
                  </h3>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between border-t border-meb-gray-200 pt-6 mt-6">
                  <div>
                    <div className="font-heading font-bold text-xl md:text-2xl text-meb-dark">{t.name}</div>
                    <div className="font-mono text-xs text-meb-gray-500 uppercase tracking-[0.2em] font-bold mt-1.5">{t.title}</div>
                  </div>
                  <div className="p-3 md:p-5 rounded-full bg-meb-gray-100 group-hover:bg-meb-green group-hover:text-white transition-colors duration-500 transform group-hover:rotate-45 shrink-0">
                    <ArrowUpRight size={22} weight="bold" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── RIGHT column ── */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            {/* Portrait — fixed container, only image crossfades */}
            <div className="rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden min-h-[300px] lg:min-h-0 flex-1 bg-[#111] group/img">
              <AnimatePresence mode="sync" custom={direction} initial={false}>
                <motion.div
                  key={`img-${active}`}
                  variants={portraitVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover grayscale group-hover/img:grayscale-0 transition-all duration-700"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Overlay — static */}
              <div className="absolute inset-0 bg-gradient-to-t from-meb-dark/90 via-meb-dark/20 to-transparent z-10 pointer-events-none" />

              {/* Bottom label — static */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between z-20">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white uppercase font-bold">
                  Voir l&apos;histoire
                </span>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover/img:bg-meb-green group-hover/img:border-meb-green transition-all duration-500">
                  <PlayCircle size={20} weight="fill" />
                </div>
              </div>
            </div>

            {/* Stats mini-card */}
            <div className="bg-[#0B1407] border border-white/[0.06] rounded-[1.5rem] p-6 flex items-center justify-between group hover:-translate-y-0.5 transition-transform duration-400">
              <div>
                <div className="font-heading font-black text-4xl text-white tracking-tight">
                  500<span className="text-meb-green">+</span>
                </div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-white/40 font-bold mt-1">
                  Entrepreneurs accompagnés
                </div>
              </div>
              <div className="w-11 h-11 rounded-full bg-meb-green/10 flex items-center justify-center text-meb-green group-hover:bg-meb-green group-hover:text-meb-dark transition-all duration-400">
                <ArrowUpRight size={18} weight="bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="mt-12 overflow-hidden py-5 border-t border-white/[0.05]">
          <div className="flex gap-8 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
            {brands.map((b, i) => (
              <span
                key={i}
                className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-white/20 hover:text-meb-green transition-colors duration-300 cursor-default shrink-0 px-4"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
