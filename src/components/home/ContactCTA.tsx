"use client";

import { motion } from "framer-motion";
import { ArrowRight, EnvelopeSimple, Phone, MapPin } from "@phosphor-icons/react";

export const ContactCTA = () => {
  return (
    <section className="py-20 md:py-32 bg-meb-dark w-full overflow-hidden relative">
      {/* Decorative full-width line separator */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-meb-gray-600 to-transparent opacity-20" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">

        {/* Bento Grid Structure - Similar to HeroSection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:h-[450px]">

          {/* Box 1: Large Main Slogan (Col 1-2) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-2 bg-white rounded-xl p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group cursor-pointer lg:h-full border border-meb-dark-border shadow-2xl"
          >
            <div className="relative z-10">
              <span className="font-heading text-xs font-bold tracking-widest uppercase text-meb-green mb-6 block">
                Prêt à accélérer ?
              </span>
              <h2 className="font-heading font-black text-[36px] sm:text-[44px] md:text-[52px] text-meb-dark leading-[1.05] tracking-tighter mb-6">
                Ta maison, <span className="text-[#eabe07]">ton réseau,</span> <br />
                <span className="text-[#c61827]">ton avenir.</span>
              </h2>
              <p className="font-body text-sm md:text-base text-meb-gray-500 max-w-md border-l-2 border-[#eabe07] pl-4">
                Rejoignez les leaders de demain. Nos experts sont prêts à diagnostiquer et structurer vos opportunités.
              </p>
            </div>

            <div className="relative z-10 mt-8">
              <button className="flex items-center gap-4 bg-[#eabe07] text-meb-dark px-6 md:px-8 py-3.5 md:py-4 rounded-full font-heading font-bold tracking-wider uppercase text-xs md:text-sm hover:bg-meb-dark hover:text-white transition-all duration-500 shadow-xl shadow-[#eabe07]/20">
                Prendre un RDV
                <ArrowRight size={18} weight="bold" />
              </button>
            </div>
          </motion.div>

          {/* Box 2: "Des questions?" (Col 3) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-1 bg-[#eabe07] rounded-xl p-6 md:p-8 flex flex-col justify-end relative overflow-hidden group cursor-pointer lg:h-full"
          >
            <div className="absolute inset-0 bg-meb-dark translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out origin-bottom" />

            {/* Crosshair decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[1px] bg-meb-dark group-hover:bg-meb-green opacity-10 group-hover:opacity-30 transition-colors" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[80%] bg-meb-dark group-hover:bg-meb-green opacity-10 group-hover:opacity-30 transition-colors" />

            <div className="relative z-10 border-l-[3px] border-meb-dark group-hover:border-[#eabe07] pl-4 transition-colors">
              <EnvelopeSimple size={32} weight="bold" className="text-meb-dark group-hover:text-[#eabe07] mb-4" />
              <h3 className="font-heading font-bold text-2xl text-meb-dark group-hover:text-white leading-tight">
                Des questions ? <br />
                <span className="font-light italic outline-2">Écrivez-nous.</span>
              </h3>
            </div>
          </motion.div>

          {/* Box 3: Contact Details (Col 4) */}
          <div className="lg:col-span-1 flex flex-col gap-2 md:gap-3 lg:h-full">

            {/* Email Case */}
            <motion.a
              href="mailto:hello@meb.bj"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 bg-meb-dark border border-meb-dark-border rounded-xl p-5 flex flex-col justify-between group hover:border-meb-gray-600 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#eabe07]/10 flex items-center justify-center text-[#eabe07] group-hover:bg-[#eabe07] group-hover:text-meb-dark transition-colors">
                <EnvelopeSimple size={16} weight="fill" />
              </div>
              <span className="font-mono text-xs text-white/60 tracking-tight group-hover:text-white transition-colors">hello@meb.bj</span>
            </motion.a>

            {/* Phone Case */}
            <motion.a
              href="tel:+22900000000"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex-1 bg-meb-dark border border-meb-dark-border rounded-xl p-5 flex flex-col justify-between group hover:border-meb-gray-600 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#c61827]/10 flex items-center justify-center text-[#c61827] group-hover:bg-[#c61827] group-hover:text-white transition-colors">
                <Phone size={16} weight="fill" />
              </div>
              <span className="font-mono text-xs text-white/60 tracking-tight group-hover:text-white transition-colors">+229 00 00 00 00</span>
            </motion.a>

            {/* Location Case */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex-[1.5] bg-meb-dark border border-meb-dark-border rounded-xl p-5 flex flex-col justify-between group hover:border-[#eabe07]/30 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-[#eabe07] transition-colors">
                <MapPin size={16} weight="fill" />
              </div>
              <p className="font-body text-[11px] text-white/40 leading-relaxed group-hover:text-white/80 transition-colors">
                Quartier Jack, Cotonou<br />
                République du Bénin
              </p>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
};
