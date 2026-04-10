"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ListIcon, XIcon, ArrowRightIcon } from "@phosphor-icons/react";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Événements", href: "/evenements" },
  { label: "Communauté", href: "/communaute" },
  { label: "À propos", href: "/a-propos" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-8 pointer-events-none transition-all duration-500 pt-6">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto flex items-center justify-between w-full max-w-[1240px] px-4 py-3 sm:px-6 rounded-full transition-all duration-500 ${scrolled
            ? "bg-[#060D03]/60 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "bg-transparent border border-transparent"
            }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-36 h-36 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_12px_rgba(0,240,64,0.4)]">
              <Image
                src="/images/logo.png"
                alt="MEB Logo"
                width={144}
                height={144}
                className="w-full h-full"
                priority
              />
            </div>

          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.02] rounded-full p-1 border border-white/[0.02]">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative px-5 py-2 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors duration-300 rounded-full group overflow-hidden"
              >
                <span className="relative z-10">{l.label}</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/espace-membre"
              className="relative text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300 group"
            >
              Espace Membre
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-meb-green transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/prendre-rdv"
              className="group relative overflow-hidden inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-meb-green shadow-[0_0_20px_rgba(0,177,64,0.15)] hover:shadow-[0_0_30px_rgba(0,177,64,0.3)] transition-shadow duration-500"
            >
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              <span className="relative z-10 text-meb-dark font-heading font-bold uppercase tracking-widest text-[11px] transition-colors duration-500">
                Prendre RDV
              </span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2.5 text-white bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md border border-white/10 transition-colors"
            aria-label="Menu"
          >
            <ListIcon size={20} weight="bold" />
          </button>
        </motion.header>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#060D03] lg:hidden"
          >
            <div className="relative flex flex-col h-full px-6 py-6 overflow-hidden">
              {/* Accents */}
              <div className="absolute top-1/4 -right-40 w-96 h-96 bg-meb-green/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 -left-20 w-80 h-80 bg-meb-green/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="flex items-center justify-between mb-16 relative z-10">
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                  <div className="relative w-36 h-36 drop-shadow-[0_0_12px_rgba(0,240,64,0.4)]">
                    <Image
                      src="/images/logo.png"
                      alt="MEB Logo"
                      width={144}
                      height={144}
                      className="w-full h-full"
                    />
                  </div>

                </Link>
                <button onClick={() => setOpen(false)} className="p-3 text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors" aria-label="Fermer">
                  <XIcon size={20} weight="bold" />
                </button>
              </div>
              <nav className="flex flex-col gap-2 flex-1 relative z-10">
                {navLinks.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, ease: "easeOut" }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-5 border-b border-white/[0.05] group overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-meb-green/0 via-meb-green/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <span className="relative z-10 font-heading font-bold text-[36px] tracking-tight text-white group-hover:text-meb-green transition-colors duration-500">
                        {l.label}
                      </span>
                      <ArrowRightIcon size={24} className="relative z-10 text-white/20 group-hover:text-meb-green group-hover:-rotate-45 transition-all duration-300" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto pt-10 flex flex-col gap-4 relative z-10">
                <Link
                  href="/espace-membre"
                  onClick={() => setOpen(false)}
                  className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-white/50 text-center py-4 hover:text-white transition-colors"
                >
                  Accès Espace Membre
                </Link>
                <Link
                  href="/prendre-rdv"
                  onClick={() => setOpen(false)}
                  className="relative overflow-hidden group bg-meb-green text-meb-dark font-heading font-bold uppercase tracking-widest text-[11px] text-center py-5 rounded-full"
                >
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                  <span className="relative z-10 transition-colors duration-500">Prendre rendez-vous</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
