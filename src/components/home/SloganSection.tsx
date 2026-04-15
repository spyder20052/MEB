"use client";

import { motion } from "framer-motion";

export const SloganSection = () => {
    return (
        <section className="py-24 md:py-32 bg-white w-full overflow-hidden relative">
            <div className="max-w-[1240px] mx-auto px-5 sm:px-8 flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center text-center space-y-4 md:space-y-6"
                >
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                        <h2 className="font-heading font-black text-[42px] sm:text-[60px] md:text-[80px] lg:text-[100px] leading-none tracking-tighter text-meb-dark">
                            TA <span className="text-meb-green">MAISON.</span>
                        </h2>
                        <div className="hidden md:block w-3 h-3 bg-meb-gray-200 rounded-full" />
                        <h2 className="font-heading font-black text-[42px] sm:text-[60px] md:text-[80px] lg:text-[100px] leading-none tracking-tighter text-meb-dark">
                            TON <span className="text-[#eabe07]">RÉSEAU.</span>
                        </h2>
                        <div className="hidden md:block w-3 h-3 bg-meb-gray-200 rounded-full" />
                        <h2 className="font-heading font-black text-[42px] sm:text-[60px] md:text-[80px] lg:text-[100px] leading-none tracking-tighter text-meb-dark">
                            TON <span className="text-[#c61827]">AVENIR.</span>
                        </h2>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="font-mono text-xs md:text-sm font-bold tracking-[0.4em] uppercase text-meb-gray-400 mt-8"
                    >
                        L'Écosystème Actif Du Business Béninois
                    </motion.p>
                </motion.div>

            </div>

            {/* Decorative vertical lines on white */}
            <div className="absolute top-0 left-1/4 w-[1px] h-full bg-meb-gray-100 opacity-50" />
            <div className="absolute top-0 right-1/4 w-[1px] h-full bg-meb-gray-100 opacity-50" />
        </section>
    );
};
