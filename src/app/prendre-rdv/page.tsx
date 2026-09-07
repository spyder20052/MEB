"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, Check } from "@phosphor-icons/react";
import { usePageHidden } from "@/hooks/usePageHidden";
import { PageHiddenFallback } from "@/components/layout/PageHiddenFallback";
// Schéma Zod partagé avec la route API : mêmes règles client et serveur.
import { rdvSchema, type RdvFormData } from "@/lib/schemas";

export default function PrendreRdvPage() {
  const isPageHidden = usePageHidden("/prendre-rdv");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Honeypot anti-spam : champ invisible pour un humain, rempli par les bots.
  const honeypotRef = useRef<HTMLInputElement>(null);


  // Apparition du titre et du formulaire desormais en CSS
  // (.hero-reveal et .meb-stagger-children) : GSAP n'etait charge que
  // pour ce fondu joue une seule fois au chargement.

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RdvFormData>({
    resolver: zodResolver(rdvSchema),
    defaultValues: {
      fullName: "",
      whatsapp: "",
      service: "",
      email: "",
      newsletter: false,
      projectDescription: "",
    },
  });

  const onSubmit = async (data: RdvFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/rdv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: honeypotRef.current?.value ?? "" }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSubmitError(json.error || "L'envoi a échoué. Réessaie dans un instant.");
        return;
      }

      // Le succès n'est affiché qu'après confirmation du serveur.
      setSubmitSuccess(true);
      reset();
    } catch {
      setSubmitError("Connexion impossible. Vérifie ton réseau puis réessaie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageHidden) {
    return <PageHiddenFallback pageName="Prendre RDV" />;
  }

  return (
    <div className="min-h-screen bg-white text-[#060D03] pt-52 md:pt-60 pb-24 relative overflow-hidden flex flex-col items-center">
      <div className="max-w-[1240px] w-full mx-auto px-5 sm:px-8 flex-1 flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          {!submitSuccess ? (
            <motion.div
              key="form-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col"
            >
              {/* Giant Brutalist Header */}
              <div className="overflow-hidden mb-16 sm:mb-24 text-center sm:text-left">
                <h1 ref={titleRef} className="font-heading font-black text-[12vw] sm:text-[10vw] leading-[0.8] tracking-tighter text-[#060D03] uppercase select-none w-full">
                  <span className="hero-reveal inline-block">PRENDRE RDV</span>
                </h1>
              </div>

              <div ref={contentRef} className="meb-stagger-children grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16">
                
                {/* Left Column: Metadata */}
                <div className="md:col-span-4 flex flex-col gap-10 font-mono text-xs sm:text-sm text-[#060D03]/60 tracking-widest uppercase">
                  
                  {/* Location & Year */}
                  <div className="space-y-1">
                    <p className="font-bold text-[#060D03]">Akpakpa, Cotonou</p>
                    <p>Bénin / 2026</p>
                  </div>

                  {/* Office Hours */}
                  <div className="space-y-1">
                    <p className="font-bold text-[#060D03]">Horaires</p>
                    <p>Lun - Ven : 8h00 - 19h00</p>
                    <p>Sam : 9h00 - 13h00</p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1">
                    <p className="font-bold text-[#060D03]">Contact Direct</p>
                    <a href="mailto:contact@entrepreneurbenin.pro" className="hover:text-[#00B140] transition-colors block lowercase">contact@entrepreneurbenin.pro</a>
                    <a href="tel:+2290160007007" className="hover:text-[#00B140] transition-colors block">+229 01 60 00 70 07</a>
                  </div>

                </div>

                {/* Right Column: Form */}
                <form 
                  onSubmit={handleSubmit(onSubmit)}
                  className="md:col-span-8 flex flex-col w-full"
                >
                  {/* Honeypot anti-spam — ne pas remplir */}
                  <input
                    ref={honeypotRef}
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="sr-only"
                  />

                                {/* Nom complet */}
                  <div className="flex flex-col mb-8">
                    <label className="font-heading font-bold text-sm text-[#060D03] block mb-4">
                      Nom complet (requis)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Jean Houndé"
                      {...register("fullName")}
                      className="w-full border-b border-[#060D03]/20 focus:border-[#060D03] bg-transparent outline-none py-2.5 text-sm transition-colors placeholder-[#060D03]/35"
                    />
                    {errors.fullName && (
                      <span className="text-red-600 text-xs mt-1 font-mono uppercase tracking-wider">
                        {errors.fullName.message}
                      </span>
                    )}
                  </div>

                  {/* Numéro WhatsApp */}
                  <div className="flex flex-col mb-8">
                    <label className="font-heading font-bold text-sm text-[#060D03] block mb-4">
                      Numéro WhatsApp (requis)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 01 60 007 007"
                      {...register("whatsapp")}
                      className="w-full border-b border-[#060D03]/20 focus:border-[#060D03] bg-transparent outline-none py-2.5 text-sm transition-colors placeholder-[#060D03]/35"
                    />
                    {errors.whatsapp && (
                      <span className="text-red-600 text-xs mt-1 font-mono uppercase tracking-wider">
                        {errors.whatsapp.message}
                      </span>
                    )}
                  </div>

                  {/* Service dropdown */}
                  <div className="flex flex-col mb-8">
                    <label className="font-heading font-bold text-sm text-[#060D03] block mb-4">
                      Service
                    </label>
                    <div className="relative">
                      <select
                        {...register("service")}
                        className="w-full border-b border-[#060D03]/20 focus:border-[#060D03] bg-transparent outline-none py-2.5 text-sm appearance-none cursor-pointer text-[#060D03]/80"
                        defaultValue=""
                      >
                        <option value="" disabled>Choisir un service</option>
                        <option value="positionnement">Positionnement (10 000 FCFA)</option>
                        <option value="orientation">Orientation (10 000 FCFA)</option>
                        <option value="assistance-rdv">Assistance RDV (10 000 FCFA)</option>
                        <option value="informations">Informations sectorielles (10 000 FCFA)</option>
                        <option value="analyse-sectorielle">Analyse sectorielle (Sur mesure)</option>
                        <option value="autre">Autre demande</option>
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#060D03]/40">
                        <CaretDown size={14} weight="bold" />
                      </div>
                    </div>
                    {errors.service && (
                      <span className="text-red-600 text-xs mt-1 font-mono uppercase tracking-wider">
                        {errors.service.message}
                      </span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col mb-8">
                    <label className="font-heading font-bold text-sm text-[#060D03] block mb-4">
                      Email (optionnel)
                    </label>
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      {...register("email")}
                      className="w-full border-b border-[#060D03]/20 focus:border-[#060D03] bg-transparent outline-none py-2.5 text-sm transition-colors placeholder-[#060D03]/35"
                    />
                    {errors.email && (
                      <span className="text-red-600 text-xs mt-1 font-mono uppercase tracking-wider">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  {/* Newsletter Checkbox */}
                  <div className="flex items-center gap-3 mb-8">
                    <input
                      type="checkbox"
                      id="newsletter"
                      {...register("newsletter")}
                      className="w-4 h-4 rounded border-[#060D03]/20 text-[#060D03] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="newsletter" className="font-body text-xs text-[#060D03]/70 cursor-pointer select-none">
                      S&apos;inscrire pour recevoir les actualités et tendances
                    </label>
                  </div>

                  {/* Project description field */}
                  <div className="flex flex-col mb-8">
                    <label className="font-heading font-bold text-sm text-[#060D03] block mb-4">
                      Description du projet (optionnel)
                    </label>
                    <textarea
                      placeholder="Décrivez brièvement votre projet ou vos objectifs..."
                      {...register("projectDescription")}
                      rows={3}
                      className="w-full border-b border-[#060D03]/20 focus:border-[#060D03] bg-transparent outline-none py-2.5 text-sm transition-colors placeholder-[#060D03]/35 resize-none"
                    />
                    {errors.projectDescription && (
                      <span className="text-red-600 text-xs mt-1 font-mono uppercase tracking-wider">
                        {errors.projectDescription.message}
                      </span>
                    )}
                  </div>

                  {/* Erreur serveur : message + recours WhatsApp direct */}
                  {submitError && (
                    <div className="mb-8 border border-[#E63946]/30 bg-[#E63946]/5 rounded-xl p-4">
                      <p className="text-[#E63946] text-xs font-mono uppercase tracking-wider mb-2">
                        {submitError}
                      </p>
                      <a
                        href="https://wa.me/2290160007007?text=Bonjour%2C%20je%20souhaite%20prendre%20un%20RDV%20avec%20la%20MEB."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-heading font-bold text-[#060D03] underline hover:text-[#00B140] transition-colors"
                      >
                        Écris-nous directement sur WhatsApp →
                      </a>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-start">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center min-w-[130px] h-12 bg-[#060D03] hover:bg-[#00B140] text-white py-3.5 px-8 rounded-full font-heading font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Envoyer"
                      )}
                    </button>
                  </div>

                </form>

              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-section"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md w-full border border-black/10 rounded-3xl p-8 sm:p-10 shadow-sm bg-stone-50/50 mx-auto my-auto text-center flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 bg-[#E8F5EE] text-[#00B140] rounded-full flex items-center justify-center mb-6">
                <Check size={30} weight="bold" />
              </div>
              <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#060D03] mb-4">
                Demande Reçue !
              </h2>
              <p className="font-body text-sm text-[#060D03]/75 mb-8 leading-relaxed">
                Merci pour votre intérêt. Notre équipe de la Maison de l&apos;Entrepreneur va étudier vos informations et vous recontacter par email ou WhatsApp sous 24 heures pour convenir d&apos;un créneau.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="bg-[#060D03] hover:bg-[#00B140] text-white py-3.5 px-8 rounded-full font-heading font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer"
              >
                Retour au formulaire
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
