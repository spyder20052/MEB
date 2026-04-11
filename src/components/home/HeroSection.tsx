"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export const HeroSection = () => {
  // Optionnel: On pourrait utiliser un state pour gérer des effets magnétiques avancés
  // Mais ici, on va utiliser Framer Motion et le CSS natif pour une performance et 
  // une fluidité optimales conformes à la DA Ampdrive.

  return (
    <section className="relative w-full min-h-screen bg-meb-dark pt-32 pb-4 sm:pb-16 overflow-hidden flex flex-col justify-center">

      {/* Lueur d'arrière-plan organique et très subtile */}
      <div className="absolute top-1/4 -right-[20%] w-[800px] h-[800px] bg-meb-green/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -left-[10%] w-[600px] h-[600px] bg-meb-green/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative z-10 w-full flex flex-col items-center mt-12">

        {/* Massive Centered Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12 sm:mb-16"
        >
          <h1 className="font-heading text-[48px] sm:text-[64px] md:text-[80px] lg:text-[84px] leading-[1.05] tracking-tight text-white mb-6">
            <span className="font-bold">L'Écosystème Actif Du</span> <br />
            <span className="font-light">Business Béninois</span>
          </h1>
          <p className="font-body text-[14px] md:text-[15px] text-meb-gray-400 max-w-2xl font-light leading-relaxed">
            Centre d'innovation d'avant-garde, concentré sur les solutions d'accompagnement et la technologie
            qui dynamisent une croissance durable et connectée pour les PME.
          </p>
        </motion.div>

        {/* Ampdrive Exact Bento Grid - Responsive & Animé */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:h-[420px]"
        >

          {/* Column 1 */}
          <div className="col-span-1 flex flex-col gap-2 md:gap-3">
            <div className="flex-[0.8] lg:flex-1 card-solid-dark rounded-xl overflow-hidden relative min-h-[120px] lg:min-h-0 border border-meb-dark-border group cursor-crosshair">
              <Image
                src="/images/journey/Image co.png"
                alt="Workshop MEB"
                fill
                className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-meb-dark to-transparent opacity-80" />
            </div>

            <div className="flex-[1.2] bg-meb-green rounded-xl p-4 lg:p-6 flex items-end relative overflow-hidden group cursor-pointer min-h-[160px] lg:min-h-0">
              {/* Effet d'expansion du fond sombre au survol (Consistant) */}
              <div className="absolute inset-0 bg-meb-dark translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out" />

              {/* Tech lines decoration (réactives) */}
              <div className="absolute top-4 right-4 lg:top-5 lg:right-5 w-6 lg:w-8 h-[1px] bg-meb-dark group-hover:bg-meb-green opacity-40 group-hover:opacity-100 transition-colors duration-500" />
              <div className="absolute top-4 right-4 lg:top-5 lg:right-5 w-[1px] h-6 lg:h-8 bg-meb-dark group-hover:bg-meb-green opacity-40 group-hover:opacity-100 transition-colors duration-500" />

              <div className="relative z-10 border-l-[3px] border-meb-dark group-hover:border-meb-green pl-3 lg:pl-4 transition-colors duration-500 h-full flex flex-col justify-end">
                <span className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-meb-dark group-hover:text-white transition-colors duration-500 leading-tight block mb-1 lg:mb-2">
                  Communauté<br />Dynamique
                </span>
                <p className="font-body text-[10px] sm:text-xs font-medium text-meb-gray-400 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500 overflow-hidden line-clamp-2">
                  Connectez-vous aux leaders de demain
                </p>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="col-span-1 flex flex-col gap-2 md:gap-3">
            <div className="flex-[1.2] bg-meb-green rounded-xl p-4 lg:p-6 flex items-end relative overflow-hidden group cursor-pointer min-h-[160px] lg:min-h-0">
              {/* Effet d'expansion du fond sombre au survol (Consistant) */}
              <div className="absolute inset-0 bg-meb-dark translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out" />

              {/* Tech lines decoration */}
              <div className="absolute bottom-4 right-4 lg:bottom-5 lg:right-5 w-10 lg:w-12 h-[1px] bg-meb-dark opacity-30 group-hover:bg-meb-green group-hover:opacity-100 transition-all duration-500 ease-out" />

              <div className="relative z-10 border-l-[3px] border-meb-dark group-hover:border-meb-green pl-3 lg:pl-4 transition-colors duration-500 h-full flex flex-col justify-end">
                <span className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-meb-dark group-hover:text-white transition-colors duration-500 leading-tight block mb-1 lg:mb-2">
                  Croissance<br />Durable
                </span>
                <p className="font-body text-[10px] sm:text-xs font-medium text-meb-gray-400 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500 overflow-hidden line-clamp-2">
                  Stratégies pérennes pour vos marchés
                </p>
              </div>
            </div>

            <div className="flex-[0.8] lg:flex-1 card-solid-dark rounded-xl overflow-hidden relative min-h-[120px] lg:min-h-0 border border-meb-dark-border group cursor-crosshair">
              <Image
                src="/images/journey/Image colléee.png"
                alt="Business Community"
                fill
                className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-meb-dark to-transparent opacity-80" />
            </div>
          </div>

          {/* Column 3 - Image experte */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 card-solid-dark rounded-xl overflow-hidden relative min-h-[220px] lg:min-h-full border border-meb-dark-border group cursor-crosshair">
            <Image
              src="/images/journey/Image collée.png" 
              alt="Expert Leadership"
              fill
              className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-100 hover:scale-105"
              style={{ objectPosition: 'center top' }}
            />
            <div className="absolute inset-0 border-[4px] border-meb-green/0 group-hover:border-meb-green/10 transition-colors duration-500 z-10 rounded-xl pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-meb-dark to-transparent opacity-80" />
          </div>

          {/* Column 4 - Grande Carte Avenir */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 bg-meb-green rounded-xl p-5 lg:p-8 flex items-end relative overflow-hidden min-h-[220px] lg:min-h-full group cursor-pointer">
            {/* Effet d'expansion du fond sombre au survol (Consistant avec direction diagonale pour la touche finale) */}
            <div className="absolute inset-0 bg-meb-dark translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out origin-bottom" />

            {/* Animating tech crosshairs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[1px] bg-meb-dark group-hover:bg-meb-green opacity-10 group-hover:opacity-30 transition-colors duration-500 delay-100" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[80%] bg-meb-dark group-hover:bg-meb-green opacity-10 group-hover:opacity-30 transition-colors duration-500 delay-100" />

            <div className="relative z-10 border-l-[3px] border-meb-dark group-hover:border-meb-green pl-4 lg:pl-5 transition-colors duration-500 h-full flex flex-col justify-end">
              <span className="font-heading font-bold text-2xl lg:text-3xl text-meb-dark group-hover:text-white transition-colors duration-500 leading-[1.1] block">
                Avenir<br />Connecté
              </span>
              <p className="font-body text-xs lg:text-sm font-medium text-meb-gray-400 mt-2 lg:mt-4 max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 overflow-hidden line-clamp-3">
                Déployez des solutions axées sur la rentabilité avec un impact direct garanti.
              </p>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
