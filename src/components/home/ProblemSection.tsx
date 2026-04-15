"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "@phosphor-icons/react";
import Image from "next/image";

const problems = [
  {
    title: "Naviguer la bureaucratie complexe",
    content: "Les démarches administratives au Bénin peuvent être un labyrinthe. Nous simplifions et accélérons chaque étape pour vous.",
    image: "/images/problems/commu.png"
  },
  {
    title: "Trouver des financements fiables",
    content: "L'accès au capital est le principal frein à la croissance. Notre réseau vous connecte directement aux investisseurs et banques adaptées.",
    image: "/images/journey/Image col.png"
  },
  {
    title: "Manque d'accompagnement expert",
    content: "Trop d'entrepreneurs naviguent à vue. Nos mentors chevronnés vous fournissent des cadres stratégiques éprouvés.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Isolement du dirigeant",
    content: "Rejoignez une communauté active de décideurs. Ne prenez plus vos décisions stratégiques seul.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
  },
];

export const ProblemSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-32 bg-meb-dark w-full overflow-hidden relative">

      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#eabe07]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col mb-16 md:mb-24"
        >
          <span className="font-heading text-sm text-[#eabe07] font-bold tracking-widest uppercase mb-4 block">Les défis actuels</span>
          <h2 className="font-heading text-[40px] md:text-[56px] lg:text-[72px] leading-[1.05] tracking-tight text-white font-bold">
            Vos obstacles, <br />
            <span className="font-light text-meb-gray-400">nos priorités.</span>
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-20 items-start">

          {/* Sticky Visual (Desktop Only) */}
          <div className="hidden lg:block w-1/2 sticky top-32 xl:top-40 h-[450px] lg:h-[550px] xl:h-[600px] card-solid-dark rounded-2xl overflow-hidden border border-meb-dark-border group">
            <AnimatePresence mode="wait">
              <motion.div
                key={openIndex}
                initial={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                <Image
                  src={problems[openIndex ?? 0].image}
                  alt={problems[openIndex ?? 0].title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                {/* Lueur et Ombre Interne */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-meb-dark to-transparent opacity-90" />
                <div className="absolute inset-0 bg-[#eabe07]/10 mix-blend-overlay" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Accordion List */}
          <div className="w-full lg:w-1/2 flex flex-col border-t border-meb-dark-border/50 lg:mt-0 lg:pt-0">
            {problems.map((problem, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={index} className="border-b border-meb-dark-border/50 group">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between py-6 md:py-8 transition-colors"
                  >
                    <span
                      className={`font-heading font-medium text-xl md:text-2xl lg:text-[26px] xl:text-[32px] leading-tight text-left pr-6 transition-all duration-500 ${isOpen ? "text-white" : "text-meb-gray-400 group-hover:text-white"
                        }`}
                    >
                      {problem.title}
                    </span>

                    {/* Icon animé */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.4, ease: "anticipate" }}
                      className={`flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border transition-colors duration-500 ${isOpen ? "bg-[#eabe07] border-[#eabe07] text-meb-dark" : "border-meb-dark-border text-meb-gray-400 group-hover:border-meb-gray-400"
                        }`}
                    >
                      {isOpen ? <Minus size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 lg:pb-10 pt-2">
                          {/* Intérieur de l'accordéon : Glassmorphism léger */}
                          <div className="relative p-5 lg:p-6 xl:p-8 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] overflow-hidden">

                            {/* Background Image pour Mobile Uniquement */}
                            <div className="absolute inset-0 lg:hidden opacity-[0.20] grayscale">
                              <Image src={problem.image} alt={problem.title} fill className="object-cover" />
                            </div>

                            <div className="relative z-10 border-l-[3px] border-[#eabe07] pl-4 md:pl-5">
                              <p className="font-body text-sm md:text-base lg:text-lg text-meb-gray-300 font-light leading-relaxed">
                                {problem.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
