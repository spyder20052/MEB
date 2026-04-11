"use client";

import { motion } from "framer-motion";
import { ArrowRight, EnvelopeSimple, Phone, MapPin } from "@phosphor-icons/react";

export const ContactCTA = () => {
  return (
    <section className="py-16 md:py-24 bg-meb-dark w-full overflow-hidden relative">
      {/* Decorative full-width line separator */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-meb-gray-600 to-transparent opacity-20" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8">

        {/* Left Side: Massive Contact Block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 bg-white rounded-[1.5rem] md:rounded-[2rem] p-8 sm:p-10 md:p-12 flex flex-col justify-between relative overflow-hidden group border border-transparent hover:border-meb-gray-300 transition-colors duration-500 cursor-pointer min-h-[350px] lg:min-h-[400px]"
        >
          {/* Abstract background gradient */}
          <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-gradient-to-tl from-meb-green/20 to-transparent rounded-full blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10">
            <span className="font-heading text-xs md:text-sm font-bold tracking-widest uppercase text-meb-green mb-6 block">
              Prêt à accélérer ?
            </span>
            <h2 className="font-heading font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-meb-dark leading-[1.05] tracking-tight mb-6">
              Ta maison, ton réseau, <br />
              <span className="text-meb-green">ton avenir.</span>
            </h2>
            <p className="font-body text-sm sm:text-base md:text-lg text-meb-gray-500 max-w-sm mb-8 group-hover:text-meb-dark transition-colors duration-500 border-l-2 border-meb-green pl-4">
              Rejoignez les leaders de demain. Nos experts sont prêts à diagnostiquer et structurer vos prochaines opportunités.
            </p>
          </div>

          <div className="w-full mt-auto relative z-10 flex items-center justify-between">
            <button className="flex items-center gap-4 bg-meb-dark text-white px-6 md:px-8 py-4 md:py-5 rounded-full font-heading font-bold tracking-wider uppercase text-xs md:text-sm group-hover:bg-meb-green group-hover:text-meb-dark transition-colors duration-500 shadow-xl group-hover:shadow-meb-green/20">
              Prendre un RDV
              <div className="bg-white/10 p-2 rounded-full group-hover:bg-meb-dark/10 transition-colors duration-500">
                <ArrowRight size={20} weight="bold" />
              </div>
            </button>
          </div>
        </motion.div>

        {/* Right Side: Links & Socials Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 bg-meb-green rounded-[1.5rem] md:rounded-[2rem] p-8 sm:p-10 md:p-12 flex flex-col justify-end relative overflow-hidden group cursor-crosshair min-h-[350px] lg:min-h-[400px]"
        >
          {/* Sweeping dark background */}
          <div className="absolute inset-0 bg-meb-dark translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out origin-bottom" />

          {/* Tech lines specifically for green card */}
          <div className="absolute top-10 right-10 w-8 h-[2px] bg-meb-dark group-hover:bg-meb-green opacity-40 group-hover:opacity-100 transition-colors duration-500 pointer-events-none" />
          <div className="absolute top-10 right-10 w-[2px] h-8 bg-meb-dark group-hover:bg-meb-green opacity-40 group-hover:opacity-100 transition-colors duration-500 pointer-events-none" />

          {/* Quick Context / Connect */}
          <div className="mb-auto relative z-10 pt-4">
            <div className="w-12 h-12 bg-meb-dark text-meb-green rounded-full flex items-center justify-center mb-6 group-hover:bg-meb-green group-hover:text-meb-dark transition-colors duration-500">
              <EnvelopeSimple size={24} weight="fill" />
            </div>
            <p className="font-heading font-medium text-xl md:text-2xl text-meb-dark group-hover:text-white transition-colors duration-500 leading-snug">
              Des questions ? <br />
              <span className="text-meb-dark/70 group-hover:text-meb-gray-400">Écrivez-nous directement.</span>
            </p>
          </div>

          {/* Contact Details List */}
          <div className="w-full space-y-5 text-sm md:text-base font-body text-meb-dark/80 group-hover:text-meb-gray-400 transition-colors duration-500 relative z-10 border-t border-meb-dark/10 group-hover:border-white/10 pt-8">

            <a href="mailto:hello@meb.bj" className="flex items-center gap-4 group/link hover:text-white transition-colors">
              <EnvelopeSimple size={20} className="text-meb-dark group-hover:text-meb-green transition-colors duration-500" />
              <span className="tracking-wide">hello@meb.bj</span>
            </a>

            <a href="tel:+22900000000" className="flex items-center gap-4 group/link hover:text-white transition-colors">
              <Phone size={20} className="text-meb-dark group-hover:text-meb-green transition-colors duration-500" />
              <span className="tracking-wide">+229 00 00 00 00</span>
            </a>

            <div className="flex items-start gap-4 group/link hover:text-white transition-colors">
              <MapPin size={20} className="text-meb-dark group-hover:text-meb-green transition-colors duration-500 mt-1" />
              <span className="tracking-wide leading-relaxed">
                Quartier Jack, Cotonou<br />
                République du Bénin
              </span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
