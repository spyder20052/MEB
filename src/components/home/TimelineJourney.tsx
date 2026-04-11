"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDownRight } from "@phosphor-icons/react";

const steps = [
  {
    number: "01",
    title: "Diagnostic & Stratégie",
    desc: "Évaluez votre projet, identifiez vos forces et clarifiez votre vision avec nos experts sectoriels.",
    theme: "dark", 
  },
  {
    number: "02",
    title: "Réseau & Connexions",
    desc: "Développez votre carnet d'adresses et trouvez les partenaires clés pour faire avancer vos ambitions.",
    theme: "green",
  },
  {
    number: "03",
    title: "Exécution & Croissance",
    desc: "Bénéficiez de conseils financiers et d'un appui terrain structuré pour propulser votre entreprise.",
    theme: "white", 
  },
];

export const TimelineJourney = () => {
  return (
    <section className="py-20 md:py-32 bg-meb-dark w-full overflow-hidden relative">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        
        {/* Section Header - Restored to match standard site architecture */}
        <div className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <motion.span 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="font-heading text-sm font-bold tracking-widest uppercase text-meb-green mb-4 block"
            >
               Le Parcours MEB
            </motion.span>
            <motion.h2 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="font-heading text-[40px] md:text-[56px] lg:text-[72px] leading-[1.05] tracking-tight text-white font-bold"
            >
              De l'idée vers <br />
              <span className="font-light text-meb-gray-400">la réalisation.</span>
            </motion.h2>
          </div>
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="lg:pb-4"
          >
             <p className="font-body text-sm md:text-lg text-meb-gray-400 max-w-sm border-l-2 border-meb-dark-border pl-4 md:pl-6 leading-relaxed">
               Un accompagnement structuré et personnalisé, allant de l'évaluation initiale à l'exécution concrète sur le terrain.
             </p>
          </motion.div>
        </div>

        {/* Panoramic Cinematic Image */}
        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="w-full h-[350px] md:h-[400px] lg:h-[500px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative mb-12 group border border-meb-dark-border"
        >
          <Image 
             src="/images/journey/Image collée.png" 
             alt="Processus MEB - Accompagnement" 
             fill 
             className="object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 hover:scale-105"
             style={{ objectPosition: 'center 30%' }}
          />

          {/* Protective Gradient overlay ensuring text readability even on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-meb-dark/95 via-meb-dark/50 to-meb-dark/10 transition-opacity duration-500 pointer-events-none" />
          
          {/* Overlapping Hero Text within Image */}
          <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 z-20 max-w-2xl pr-6">
             <h2 className="font-heading font-medium text-3xl sm:text-4xl md:text-5xl lg:text-[64px] text-white leading-[1.05] tracking-tight group-hover:transform group-hover:translate-x-2 transition-transform duration-500">
               Votre expertise, <br />
               <span className="text-meb-green font-bold">au centre du processus.</span>
             </h2>
          </div>

          {/* Subtle tech overlay corner */}
          <div className="absolute top-6 right-6 bg-meb-dark/80 backdrop-blur-sm rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-meb-gray-700/50">
             <ArrowDownRight size={20} className="text-meb-green" />
          </div>
        </motion.div>

        {/* 3-Column Symmetrical Grid for Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {steps.map((step, index) => {
            const isDark = step.theme === "dark";
            const isGreen = step.theme === "green";
            const isWhite = step.theme === "white";

            // Map corresponding theme specific classes
            let bgClass = "";
            let textClass = "";
            let badgeClass = "";
            let descClass = "";
            let watermarkClass = "";

            if (isDark) {
              bgClass = "bg-[#0B1407] border-meb-gray-800 hover:border-meb-green";
              textClass = "text-white";
              badgeClass = "bg-white/5 text-meb-gray-300";
              descClass = "text-meb-gray-400 group-hover:text-meb-gray-300";
              watermarkClass = "text-white/5 group-hover:text-white/10 group-hover:-translate-x-4";
            } else if (isGreen) {
              bgClass = "bg-meb-green border-meb-green hover:border-meb-green-light";
              textClass = "text-meb-dark";
              badgeClass = "bg-meb-dark/10 text-meb-dark";
              descClass = "text-meb-dark/80 group-hover:text-meb-dark";
              watermarkClass = "text-meb-dark/10 group-hover:text-meb-dark/20 group-hover:scale-110 group-hover:-translate-y-2";
            } else if (isWhite) {
              bgClass = "bg-white border-transparent hover:border-meb-gray-300";
              textClass = "text-meb-dark";
              badgeClass = "bg-meb-dark/5 text-meb-dark";
              descClass = "text-meb-dark/70 group-hover:text-meb-dark/90";
              watermarkClass = "text-meb-dark/5 group-hover:text-meb-dark/10 group-hover:translate-x-4";
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 + (index * 0.15), ease: "easeOut" }}
                className={`rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden group cursor-pointer border transition-all duration-500 min-h-[320px] md:min-h-[420px] ${bgClass}`}
              >
                {/* INTERACTIVE BACKGROUNDS */}
                {isDark && (
                   <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-meb-green/10 rounded-full blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                )}
                {isWhite && (
                   <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-bl from-meb-gray-200 to-transparent rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                )}

                {/* WATERMARK NUMBER */}
                <div className={`absolute -right-2 -top-6 md:-right-4 md:-top-8 font-heading font-black text-[120px] md:text-[150px] leading-none pointer-events-none select-none transition-all duration-700 ${watermarkClass}`}>
                  {step.number}
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  {/* Badge */}
                  <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase mb-12 md:mb-16 self-start transition-colors duration-500 ${badgeClass}`}>
                    Étape {step.number}
                  </span>
                  
                  <div className="mt-auto">
                    <h3 className={`font-heading font-bold text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4 transition-colors duration-500 leading-tight ${textClass}`}>
                      {step.title}
                    </h3>
                    <p className={`font-body text-sm md:text-base leading-relaxed transition-colors duration-500 ${descClass}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
};
