"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";

const impacts = [
  { value: "500", suffix: "+", label: "ENTREPRISES ACCOMPAGNÉES", type: "dark" },
  { value: "85", suffix: "%", label: "TAUX DE SURVIE À 3 ANS", type: "green" },
  { value: "3", suffix: "M", label: "FCFA LEVÉS PAR NOS MEMBRES", type: "dark" },
  { value: "40", suffix: "+", label: "EXPERTS ET MENTORS ACTIFS", type: "white" },
];

export const ImpactCounter = () => {
  return (
    <section className="py-20 md:py-32 bg-meb-dark w-full overflow-hidden relative">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
           
          {/* Left Column: Text Content */}
          <div className="lg:col-span-5 flex flex-col justify-center relative z-10 pr-0 lg:pr-10">
            <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6 }}
            >
              <span className="font-heading text-sm font-bold tracking-widest uppercase text-meb-green mb-4 block">
                 Notre Impact
              </span>
              <h2 className="font-heading font-bold text-[40px] md:text-[56px] lg:text-[72px] leading-[1.05] tracking-tight text-white mb-8">
                Des chiffres<br />
                <span className="font-light text-meb-gray-400">qui parlent.</span>
              </h2>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
               <p className="font-body text-sm md:text-lg text-meb-gray-400 leading-relaxed border-l-2 border-meb-dark-border pl-4 md:pl-6 max-w-md">
                 Notre approche transformative des solutions entrepreneuriales fait de nous un 
                 catalyseur majeur de croissance au Bénin. Des résultats concrets, mesurables, 
                 axés sur la pérennité.
               </p>
            </motion.div>

            {/* Glowing Accent */}
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-meb-green/5 rounded-full blur-[100px] pointer-events-none" />
          </div>

          {/* Right Column: Giant Blocks Bento */}
          <div className="lg:col-span-7 relative z-10 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
               {impacts.map((impact, idx) => {
                 const isGreen = impact.type === "green";
                 const isWhite = impact.type === "white";
                 const isDark = impact.type === "dark";

                 // Assign visual variants based on type
                 let bgClass = "";
                 let valueClass = "";
                 let suffixClass = "";
                 let labelClass = "";
                 
                 if (isDark) {
                    bgClass = "bg-[#0B1407] border border-meb-dark-border hover:border-meb-green";
                    valueClass = "text-white";
                    suffixClass = "text-meb-green";
                    labelClass = "text-meb-gray-400";
                 } else if (isGreen) {
                    bgClass = "bg-meb-green border border-transparent";
                    valueClass = "text-meb-dark group-hover:text-white";
                    suffixClass = "text-meb-dark group-hover:text-white";
                    labelClass = "text-meb-dark/80 group-hover:text-meb-gray-200";
                 } else if (isWhite) {
                    bgClass = "bg-white border border-transparent hover:border-meb-gray-300";
                    valueClass = "text-meb-dark";
                    suffixClass = "text-meb-green";
                    labelClass = "text-meb-gray-500";
                 }

                 return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: idx * 0.15 }}
                      className={`${bgClass} p-8 lg:p-10 min-h-[250px] md:min-h-[280px] rounded-[1.5rem] md:rounded-[2rem] flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all duration-500`}
                    >
                      {/* Interactive Backgrounds */}
                      {isGreen && (
                         <div className="absolute inset-0 bg-meb-dark translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out origin-bottom pointer-events-none" />
                      )}
                      {isDark && (
                         <div className="absolute -top-10 -right-10 w-32 h-32 bg-meb-green/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      )}
                      {isWhite && (
                         <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-to-tr from-transparent to-meb-gray-200 rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      )}

                      {/* Top Header Row of Card */}
                      <div className="relative z-10 flex items-start justify-between w-full">
                         <div className="flex flex-col gap-3">
                            <div className={`h-[2px] w-8 rounded-full transition-colors duration-500 ${isDark || isGreen ? "bg-meb-gray-600 group-hover:bg-meb-green" : "bg-meb-gray-300 group-hover:bg-meb-dark"}`} />
                            <span className={`font-mono text-[10px] md:text-xs tracking-widest font-bold uppercase transition-colors duration-500 ${labelClass} max-w-[120px]`}>
                               {impact.label}
                            </span>
                         </div>
                         <div className={`p-2 rounded-full opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500 ${isDark ? "text-meb-green" : isGreen ? "text-white" : "text-meb-dark"}`}>
                            <ArrowUpRight size={20} weight="bold" />
                         </div>
                      </div>

                      {/* Bottom Massive Number */}
                      <div className="relative z-10 mt-auto pt-8 group-hover:transform group-hover:translate-x-2 transition-transform duration-500">
                        <div className="flex items-baseline gap-1">
                           <span className={`font-heading font-bold text-[64px] md:text-[80px] lg:text-[96px] leading-[0.8] tracking-tighter transition-colors duration-500 ${valueClass}`}>
                             {impact.value}
                           </span>
                           <span className={`font-heading font-medium text-3xl md:text-4xl lg:text-[40px] transition-colors duration-500 ${suffixClass}`}>
                              {impact.suffix}
                           </span>
                        </div>
                      </div>

                    </motion.div>
                 )
               })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
