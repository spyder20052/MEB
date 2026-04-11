"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import Image from "next/image";

export const ServicesPreview = () => {
   return (
      <section className="py-20 md:py-32 bg-meb-dark w-full overflow-hidden relative">
         <div className="max-w-[1240px] mx-auto px-5 sm:px-8">

            {/* Section Header */}
            <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="max-w-2xl">
                  <motion.span
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="font-heading text-sm font-bold tracking-widest uppercase text-meb-green mb-4 block"
                  >
                     Notre Expertise
                  </motion.span>
                  <motion.h2
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.1 }}
                     className="font-heading text-[40px] md:text-[56px] lg:text-[72px] leading-[1.05] tracking-tight text-white font-bold"
                  >
                     Nos Services
                     <br /> <span className="font-light text-meb-gray-400">Fondamentaux.</span>
                  </motion.h2>
               </div>
               <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="md:pb-4"
               >
                  <p className="font-body text-sm md:text-lg text-meb-gray-400 max-w-sm border-l-2 border-meb-dark-border pl-4 md:pl-6 leading-relaxed">
                     Des solutions conçues sur mesure pour vous accompagner et exécuter à chaque étape de votre croissance.
                  </p>
               </motion.div>
            </div>

            {/* Dynamic Bento Grid - 2 Rows, 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">

               {/* Card 1: Création & Structuration (Dark / Wide / Col Span 2) */}
               <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="md:col-span-2 group cursor-pointer relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-[#080E05] border border-meb-dark-border transition-colors duration-500 hover:border-meb-green min-h-[350px] md:min-h-[420px] p-8 md:p-12 flex flex-col justify-end"
               >
                  {/* Background Image full width */}
                  <Image
                     src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
                     alt="Création et Structuration en équipe"
                     fill
                     className="object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700 hover:scale-105 pointer-events-none"
                  />
                  {/* Cinematic Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-meb-dark/95 via-meb-dark/70 to-transparent group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />

                  {/* Glowing Corner */}
                  <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-meb-green/10 rounded-full blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                     <div className="max-w-md">
                        <div className="flex items-center gap-4 mb-4">
                           <span className="font-mono text-meb-gray-400 group-hover:text-meb-green transition-colors duration-500 text-lg">01</span>
                           <div className="h-[1px] w-12 bg-meb-gray-700 group-hover:bg-meb-green transition-colors duration-500" />
                        </div>
                        <h3 className="font-heading font-bold text-3xl md:text-4xl lg:text-[40px] leading-tight text-white mb-4">
                           Création & <br />Structuration
                        </h3>
                        <p className="font-body text-sm md:text-base text-meb-gray-400 group-hover:text-meb-gray-300 transition-colors duration-500 leading-relaxed">
                           Nous préparons le terrain pour votre succès avec une approche rigoureuse et stratégique, adaptée aux startups et PME naissantes.
                        </p>
                     </div>

                     <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-full text-white group-hover:bg-meb-green group-hover:text-meb-dark group-hover:-translate-y-2 group-hover:translate-x-2 transition-all duration-500 self-start md:self-end">
                        <ArrowUpRight size={28} weight="bold" />
                     </div>
                  </div>
               </motion.div>

               {/* Card 2: Accompagnement & Financement (Green / Tall / Col Span 1) */}
               <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="md:col-span-1 group cursor-pointer relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-meb-green min-h-[350px] md:min-h-[420px] p-8 md:p-10 flex flex-col"
               >
                  {/* Tech lines decoration */}
                  <div className="absolute top-8 right-8 w-12 h-[1px] bg-meb-dark opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute top-8 right-8 w-[1px] h-12 bg-meb-dark opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Dark overlay swelling up on hover */}
                  <div className="absolute inset-0 bg-meb-dark translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-in-out pointer-events-none" />

                  <div className="relative z-10 flex-1 flex flex-col">
                     <div className="flex justify-between items-start mb-auto">
                        <span className="font-mono text-meb-dark group-hover:text-meb-green transition-colors duration-700 text-lg">02</span>
                        <div className="bg-meb-dark text-meb-green group-hover:bg-white group-hover:text-meb-dark p-3 rounded-full transition-all duration-500 transform group-hover:scale-110">
                           <ArrowUpRight size={24} weight="bold" />
                        </div>
                     </div>

                     <div className="mt-12">
                        <h3 className="font-heading font-bold text-3xl md:text-4xl leading-tight text-meb-dark group-hover:text-white transition-colors duration-500 mb-4">
                           Capital & <br />Financement
                        </h3>
                        <p className="font-body text-sm font-medium text-meb-dark/80 group-hover:text-meb-gray-400 transition-colors duration-500">
                           Ne laissez pas vos idées manquer de ressources. Nos partenaires stratégiques sont à disposition pour la levée de fonds.
                        </p>
                     </div>
                  </div>
               </motion.div>

               {/* Card 3: CTA Compact (White / Col Span 1) */}
               <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="md:col-span-1 group cursor-pointer relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-white hover:bg-meb-gray-50 transition-colors duration-500 min-h-[300px] md:min-h-[420px] p-8 md:p-10 flex flex-col justify-between"
               >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-meb-green/10 rounded-full blur-[40px] group-hover:bg-meb-green/20 transition-all duration-500 pointer-events-none" />

                  <span className="font-heading text-xs font-bold tracking-widest uppercase text-meb-gray-500 group-hover:text-meb-dark transition-colors duration-500">
                     Vers l'excellence
                  </span>

                  <div>
                     <h3 className="font-heading font-bold text-2xl md:text-3xl lg:text-[32px] leading-tight text-meb-dark mb-6">
                        Découvrir tous <br />notre catalogue.
                     </h3>
                     <div className="inline-flex items-center gap-2 border-b-2 border-meb-dark pb-1 font-body font-bold text-sm text-meb-dark group-hover:text-meb-green group-hover:border-meb-green transition-colors duration-300">
                        Explorer <ArrowUpRight size={16} weight="bold" />
                     </div>
                  </div>
               </motion.div>

               {/* Card 4: Développement & Croissance (Dark Photo / Wide / Col Span 2) */}
               <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="md:col-span-2 group cursor-pointer relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-meb-dark border border-meb-dark-border transition-colors duration-500 hover:border-white/20 min-h-[350px] md:min-h-[420px] p-8 md:p-12 flex flex-col justify-end"
               >
                  {/* Background Image right aligned */}
                  <Image
                     src="/images/journey/Image col.png"
                     alt="Croissance et Hub MEB"
                     fill
                     className="object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-700 hover:scale-[1.02] pointer-events-none"
                     style={{ objectPosition: 'center top' }}
                  />
                  {/* Split Gradient fading out to the right */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#060D03] via-[#060D03]/90 to-transparent group-hover:via-[#060D03]/70 transition-colors duration-500 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060D03] via-transparent to-transparent opacity-80 pointer-events-none" />

                  <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-xl">
                     <div>
                        <div className="flex items-center gap-4 mb-4">
                           <span className="font-mono text-meb-gray-400 group-hover:text-white transition-colors duration-500 text-lg">03</span>
                           <div className="h-[1px] w-12 bg-meb-gray-700 group-hover:bg-white transition-colors duration-500" />
                        </div>
                        <h3 className="font-heading font-bold text-3xl md:text-4xl lg:text-[40px] leading-tight text-white mb-4">
                           Développement <br />& Croissance
                        </h3>
                        <p className="font-body text-sm md:text-base text-meb-gray-400 group-hover:text-meb-gray-300 transition-colors duration-500 leading-relaxed border-l-2 border-meb-green pl-4">
                           Des solutions avancées pour scaler vos opérations, conquérir de nouveaux marchés, et asseoir un leadership imbattable.
                        </p>
                     </div>
                  </div>

                  {/* Floating Top Right Button */}
                  <div className="absolute top-8 right-8 bg-black/40 border border-white/10 backdrop-blur-md p-4 rounded-full text-white group-hover:bg-white group-hover:text-meb-dark group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500 z-10">
                     <ArrowUpRight size={24} weight="bold" />
                  </div>

               </motion.div>

            </div>
         </div>
      </section>
   );
};
