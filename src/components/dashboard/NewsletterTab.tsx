"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash, ArrowsClockwise, Copy } from "@phosphor-icons/react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Onglet "Newsletter" : liste des abonnés (pied de page + case RDV),
// avec copie rapide des adresses pour préparer un envoi.

interface Subscriber {
  id: string;
  email: string;
  source: "footer" | "rdv";
  created_at: string;
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(iso));

export function NewsletterTab({ notify }: { notify: (message: string) => void }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    const supabase = getSupabaseBrowserClient();
    return supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setSubscribers(data as Subscriber[]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!window.confirm("Désinscrire cette adresse ?")) return;
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) {
      notify("La suppression a échoué");
      return;
    }
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    notify("Abonné désinscrit");
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(subscribers.map((s) => s.email).join(", "));
      notify(`${subscribers.length} adresse(s) copiée(s)`);
    } catch {
      notify("La copie a échoué");
    }
  };

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
            Abonnés Newsletter
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={copyAll}
              disabled={subscribers.length === 0}
              className="px-3 py-1.5 rounded-lg bg-[#00B140]/10 border border-[#00B140]/20 text-[#00B140] hover:bg-[#00B140]/20 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
            >
              <Copy size={12} weight="bold" />
              <span>Copier les adresses</span>
            </button>
            <button
              onClick={() => { setLoading(true); load(); }}
              className="px-3 py-1.5 rounded-lg bg-[#060D03]/5 border border-[#060D03]/10 text-[#060D03] hover:bg-[#060D03]/10 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowsClockwise size={12} weight="bold" className={loading ? "animate-spin" : ""} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>
        <p className="font-body text-xs text-[#060D03]/60 mb-8 max-w-xl">
          {subscribers.length} abonné{subscribers.length > 1 ? "s" : ""} — inscrits depuis le pied de page du site ou la case à cocher du formulaire RDV. Chaque e-mail envoyé contient un lien de désinscription.
        </p>

        {loading ? (
          <div className="py-12 text-center text-[#060D03]/40 font-mono text-xs uppercase tracking-widest">
            Chargement...
          </div>
        ) : subscribers.length === 0 ? (
          <div className="py-12 text-center text-[#060D03]/40 font-heading text-xs uppercase tracking-widest">
            Aucun abonné pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className="border border-[#060D03]/10 rounded-2xl p-4 flex items-center justify-between gap-3 bg-white"
              >
                <div className="min-w-0">
                  <p className="font-body text-sm text-[#060D03] font-medium truncate">
                    {subscriber.email}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-[#060D03]/40 mt-0.5">
                    {subscriber.source === "rdv" ? "Formulaire RDV" : "Pied de page"} · {formatDate(subscriber.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => remove(subscriber.id)}
                  className="w-8 h-8 rounded-lg bg-[#E63946]/10 border border-[#E63946]/20 text-[#E63946] hover:bg-[#E63946]/20 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Désinscrire"
                >
                  <Trash size={13} weight="bold" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
