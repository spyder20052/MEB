"use client";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  FacebookLogo,
  LinkedinLogo,
  InstagramLogo,
  ArrowUpRight,
  CaretRight
} from "@phosphor-icons/react";
import { motion } from "framer-motion";

const links = {
  services: [
    { label: "Positionnement", href: "/services/positionnement" },
    { label: "Orientation", href: "/services/orientation" },
    { label: "Assistance RDV", href: "/services/assistance-rdv" },
    { label: "Infos sectorielles", href: "/services/informations" },
    { label: "Analyse sectorielle", href: "/services/analyse-sectorielle" },
  ],
  evenements: [
    { label: "Journées Portes Ouvertes", href: "/evenements/jpo" },
    { label: "Petits-Déj'", href: "/evenements/petit-dej" },
    { label: "Afterworks", href: "/evenements/afterworks" },
    { label: "Mastermind", href: "/evenements/mastermind" },
  ],
  apropos: [
    { label: "Notre mission", href: "/a-propos/mission" },
    { label: "L'équipe", href: "/a-propos/equipe" },
    { label: "Gouvernance", href: "/a-propos/gouvernance" },
    { label: "Impact", href: "/a-propos/impact" },
    { label: "FAQ", href: "/faq" },
  ],
};

export const Footer = () => {
  return (
    <footer className="relative bg-[#060D03] border-t border-white/[0.05] overflow-hidden pt-24 pb-8">
      {/* Tech Line Patterns */}
      <div className="absolute inset-0 tech-lines-light opacity-[0.03] pointer-events-none" />

      {/* Massive Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-meb-green/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative z-10">



        {/* Links Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12 mb-16 border-t border-white/[0.05] pt-16">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center group mb-4">
              <Image
                src="/images/logo.png"
                alt="MEB Logo"
                width={144}
                height={144}
                className="transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_12px_rgba(0,240,64,0.4)]"
              />
            </Link>
            <p className="font-body text-[14px] text-white/50 leading-[1.8] max-w-sm mb-8">
              Le premier hub entrepreneurial du Bénin. Connectez-vous, développez votre réseau et accélérez votre croissance.
            </p>

            {/* Minimalist Newsletter */}
            <div className="max-w-sm">
              <h5 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">Newsletter</h5>
              <div className="relative group/input">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-full py-3 px-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-meb-green/50 transition-all duration-300"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-meb-green text-meb-dark flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
                  <CaretRight weight="bold" />
                </button>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {([
            { title: "Services", items: links.services },
            { title: "Événements", items: links.evenements },
            { title: "À propos", items: links.apropos },
          ] as const).map((col) => (
            <div key={col.title} className="lg:col-span-1 lg:col-start-auto">
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-meb-green/70 mb-6">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.items.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-heading font-medium text-[15px] tracking-tight text-white/60 hover:text-white hover:translate-x-1 transition-all inline-block duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Huge MEB Text */}
        <div className="w-full flex justify-center mt-20 mb-8 pointer-events-none select-none overflow-hidden">
          <span className="font-heading font-black text-[18vw] leading-none text-white/[0.03] tracking-tighter">
            MEB<span className="text-meb-green/[0.05]">.</span>
          </span>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <p className="font-mono text-[10px] tracking-widest uppercase font-bold text-white/30 text-center md:text-left">
            © {new Date().getFullYear()} Maison de l&apos;Entrepreneur du Bénin.<br className="md:hidden" /> Tous droits réservés.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <Link
              href="/prendre-rdv"
              className="px-6 py-2.5 rounded-full border border-meb-green text-meb-green font-heading font-bold uppercase tracking-widest text-[10px] hover:bg-meb-green hover:text-meb-dark transition-all duration-300"
            >
              Rejoindre le MEB
            </Link>
            <Link
              href="/mentions-legales"
              className="font-mono text-[10px] tracking-widest uppercase font-bold text-white/30 hover:text-white transition-colors duration-300"
            >
              Mentions légales
            </Link>
            <div className="flex items-center gap-2">
              {[
                { icon: <FacebookLogo size={18} weight="fill" />, label: "Facebook" },
                { icon: <LinkedinLogo size={18} weight="fill" />, label: "LinkedIn" },
                { icon: <InstagramLogo size={18} weight="fill" />, label: "Instagram" },
              ].map((s) => (
                <motion.a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  whileHover={{ y: -4, backgroundColor: "var(--color-meb-green)", color: "#060D03" }}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 transition-colors duration-300"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
