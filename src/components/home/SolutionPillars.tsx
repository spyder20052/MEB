"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const SolutionPillars = () => {
  return (
    <section className="py-24 md:py-32 bg-[#F4F4F2] w-full overflow-hidden relative">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <span className="font-heading text-sm font-bold tracking-widest uppercase text-meb-green mb-4 block">
              Nos Solutions
            </span>
            <h2 className="font-heading text-[40px] md:text-[56px] lg:text-[72px] leading-[1.05] tracking-tight text-meb-dark font-bold max-w-2xl">
              Stratégies pour <br />
              <span className="font-light text-meb-gray-500">votre futur.</span>
            </h2>
          </div>
        </motion.div>

        {/* Grid layout matching Ampdrive Bento details */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >

          {/* Card 1: Large White Card */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white rounded-2xl p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden group cursor-pointer border border-transparent hover:border-meb-gray-300 transition-colors duration-500">
            {/* Décoration subtile en arrière-plan */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-meb-green/10 to-transparent rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <h3 className="relative z-10 font-heading text-2xl md:text-3xl lg:text-[40px] leading-tight text-meb-dark font-medium mb-6 md:mb-10 group-hover:transform group-hover:translate-x-2 transition-transform duration-500">
              Nous adoptons une <span className="font-bold text-meb-green">approche consultative</span> des ventes, travaillant en étroite collaboration
              avec nos clients pour trouver les <span className="font-bold">meilleures solutions</span>.
            </h3>
            <p className="relative z-10 font-body text-sm md:text-base font-medium text-meb-gray-500 max-w-md border-l-2 border-meb-green pl-4">
              Notre but n'est pas seulement de proposer des services, mais de bâtir des relations durables au cœur de l'écosystème béninois.
            </p>
          </div>

          {/* Card 2: Image Card */}
          <div className="col-span-1 card-solid-dark rounded-2xl overflow-hidden relative min-h-[250px] lg:min-h-[400px] border border-meb-dark-border group cursor-crosshair">
            <Image
              src="/images/problems/Image collée.png"
              alt="Consultation Communautaire"
              fill
              className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 hover:scale-105"
              style={{ objectPosition: 'center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-meb-dark via-meb-dark/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />

            <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end z-10">
              <h4 className="font-heading font-bold text-xl md:text-2xl text-white mb-2">Consultation<br />D'Expert</h4>
              <p className="font-body text-sm text-meb-gray-300 font-light max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                Nos conseillers hautement qualifiés travaillent main dans la main avec vous.
              </p>
            </div>
          </div>

          {/* Card 3: Green Interactive Card */}
          <div className="col-span-1 bg-meb-green rounded-2xl overflow-hidden relative flex flex-col p-6 lg:p-8 min-h-[250px] lg:min-h-[400px] group cursor-pointer">
            {/* Effet d'expansion du fond sombre au survol (Consistant avec le reste du site) */}
            <div className="absolute inset-0 bg-meb-dark translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out origin-bottom" />

            {/* Tech lines decoration */}
            <div className="absolute top-6 right-6 w-12 h-[1px] bg-meb-dark group-hover:bg-meb-green opacity-40 group-hover:opacity-100 transition-colors duration-500" />
            <div className="absolute top-6 right-6 w-[1px] h-12 bg-meb-dark group-hover:bg-meb-green opacity-40 group-hover:opacity-100 transition-colors duration-500" />

            {/* Image abstraite/tech optionnelle en fond au hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.15] grayscale mix-blend-overlay transition-opacity duration-700 delay-200 pointer-events-none">
              <Image src="/images/journey/Image col.png" alt="Support Tech" fill className="object-cover" />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-end border-l-[3px] border-meb-dark group-hover:border-meb-green pl-4 transition-colors duration-500">
              <h4 className="font-heading font-bold text-2xl md:text-3xl text-meb-dark group-hover:text-white transition-colors duration-500 leading-tight block mb-3">
                Support<br />Immersif
              </h4>
              <p className="font-body text-sm font-medium text-meb-dark/80 group-hover:text-meb-gray-400 transition-colors duration-500">
                Des équipes dédiées pour identifier les failles et optimiser vos processus au quotidien.
              </p>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};
