"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsappLogo, X } from "@phosphor-icons/react";

export const WhatsAppButton = () => {
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t2 = setTimeout(() => setTooltip(true), 4000);
    return () => clearTimeout(t2);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 pointer-events-none">
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="bg-meb-dark-card border border-meb-dark-border rounded-2xl p-3.5 max-w-[230px] relative pointer-events-auto"
          >
            <button
              onClick={() => setTooltip(false)}
              className="absolute top-2 right-2 text-meb-gray-400 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X size={12} />
            </button>
            <p className="font-body text-[13px] text-white leading-snug pr-3">
              Une question ? Écrivez-nous !
            </p>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-meb-dark-card border-r border-b border-meb-dark-border rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href="https://wa.me/22960007007"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-13 h-13 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:shadow-[0_6px_24px_rgba(37,211,102,0.5)] transition-shadow pointer-events-auto"
        aria-label="WhatsApp"
      >
        <WhatsappLogo size={26} weight="fill" className="text-white" />
      </motion.a>
    </div>
  );
};
