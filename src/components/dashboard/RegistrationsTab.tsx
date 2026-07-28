"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash, ArrowsClockwise, WhatsappLogo, EnvelopeSimple } from "@phosphor-icons/react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Onglet "Inscriptions" : liste les inscrits aux événements,
// avec un compteur par événement pour préparer chaque édition.

interface Registration {
  id: string;
  event_num: string;
  name: string;
  whatsapp: string;
  email: string | null;
  created_at: string;
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso)
  );

const waLink = (whatsapp: string) => `https://wa.me/${whatsapp.replace(/\D/g, "")}`;

export function RegistrationsTab({ notify }: { notify: (message: string) => void }) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [eventTitles, setEventTitles] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    const supabase = getSupabaseBrowserClient();
    return Promise.all([
      supabase.from("event_registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("events").select("num, title"),
    ]).then(([regsRes, eventsRes]) => {
      if (!regsRes.error && regsRes.data) setRegistrations(regsRes.data as Registration[]);
      if (!eventsRes.error && eventsRes.data) {
        setEventTitles(
          Object.fromEntries(eventsRes.data.map((e) => [e.num as string, e.title as string]))
        );
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!window.confirm("Supprimer cette inscription ? La place n'est pas re-créditée automatiquement.")) return;
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("event_registrations").delete().eq("id", id);
    if (error) {
      notify("La suppression a échoué");
      return;
    }
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    notify("Inscription supprimée");
  };

  const counts = registrations.reduce<Record<string, number>>((acc, r) => {
    acc[r.event_num] = (acc[r.event_num] ?? 0) + 1;
    return acc;
  }, {});

  const visible =
    filter === "all" ? registrations : registrations.filter((r) => r.event_num === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-white border border-[#060D03]/10 rounded-[2rem] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
          <h3 className="font-heading font-black text-xl uppercase tracking-tight text-[#060D03]">
            Inscriptions aux événements
          </h3>
          <button
            onClick={() => { setLoading(true); load(); }}
            className="px-3 py-1.5 rounded-lg bg-[#060D03]/5 border border-[#060D03]/10 text-[#060D03] hover:bg-[#060D03]/10 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowsClockwise size={12} weight="bold" className={loading ? "animate-spin" : ""} />
            <span>Actualiser</span>
          </button>
        </div>
        <p className="font-body text-xs text-[#060D03]/60 mb-6 max-w-xl">
          Chaque inscrit attend une confirmation WhatsApp sous 24h. Les places restantes sont décomptées automatiquement à chaque inscription.
        </p>

        {/* Filtres par événement */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full border font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
              filter === "all"
                ? "bg-[#060D03] border-[#060D03] text-white"
                : "bg-white border-[#060D03]/15 text-[#060D03]/60 hover:border-[#060D03]"
            }`}
          >
            Tous ({registrations.length})
          </button>
          {Object.entries(counts).map(([num, count]) => (
            <button
              key={num}
              onClick={() => setFilter(num)}
              className={`px-3 py-1.5 rounded-full border font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                filter === num
                  ? "bg-[#00B140] border-[#00B140] text-white"
                  : "bg-white border-[#060D03]/15 text-[#060D03]/60 hover:border-[#00B140]"
              }`}
            >
              {eventTitles[num] ?? `Événement ${num}`} ({count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-12 text-center text-[#060D03]/40 font-mono text-xs uppercase tracking-widest">
            Chargement...
          </div>
        ) : visible.length === 0 ? (
          <div className="py-12 text-center text-[#060D03]/40 font-heading text-xs uppercase tracking-widest">
            Aucune inscription pour le moment.
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((registration) => (
              <div
                key={registration.id}
                className="border border-[#060D03]/10 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-heading font-bold text-sm text-[#060D03] uppercase">
                      {registration.name}
                    </h4>
                    <span className="font-mono text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[#00B140] border border-[#00B140]/15">
                      {eventTitles[registration.event_num] ?? `Événement ${registration.event_num}`}
                    </span>
                    <span className="font-mono text-[9px] text-[#060D03]/40">
                      {formatDate(registration.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <a
                    href={waLink(registration.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg bg-[#00B140]/10 border border-[#00B140]/20 text-[#00B140] hover:bg-[#00B140] hover:text-white font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all"
                  >
                    <WhatsappLogo size={13} weight="bold" />
                    <span>{registration.whatsapp}</span>
                  </a>
                  {registration.email && (
                    <a
                      href={`mailto:${registration.email}`}
                      className="px-3 py-2 rounded-lg bg-[#060D03]/5 border border-[#060D03]/10 text-[#060D03] hover:bg-[#060D03]/10 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all"
                    >
                      <EnvelopeSimple size={13} weight="bold" />
                      <span className="lowercase">{registration.email}</span>
                    </a>
                  )}
                  <button
                    onClick={() => remove(registration.id)}
                    className="w-8 h-8 rounded-lg bg-[#E63946]/10 border border-[#E63946]/20 text-[#E63946] hover:bg-[#E63946]/20 flex items-center justify-center transition-colors cursor-pointer"
                    title="Supprimer l'inscription"
                  >
                    <Trash size={13} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
