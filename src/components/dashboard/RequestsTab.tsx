"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Trash, ArrowsClockwise, WhatsappLogo, EnvelopeSimple } from "@phosphor-icons/react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { SERVICE_LABELS } from "@/lib/schemas";

// Onglet "Demandes RDV" : liste les demandes du formulaire /prendre-rdv,
// permet de les marquer traitées et de rappeler l'entrepreneur en un clic.

interface RdvRequest {
  id: string;
  full_name: string;
  whatsapp: string;
  email: string | null;
  service: string;
  project_description: string | null;
  newsletter: boolean;
  status: "nouveau" | "traité";
  created_at: string;
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso)
  );

const waLink = (whatsapp: string) => `https://wa.me/${whatsapp.replace(/\D/g, "")}`;

export function RequestsTab({ notify }: { notify: (message: string) => void }) {
  const [requests, setRequests] = useState<RdvRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    const supabase = getSupabaseBrowserClient();
    return supabase
      .from("rdv_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setRequests(data as RdvRequest[]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleStatus = async (request: RdvRequest) => {
    const status = request.status === "nouveau" ? "traité" : "nouveau";
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from("rdv_requests")
      .update({ status })
      .eq("id", request.id);
    if (error) {
      notify("La mise à jour a échoué");
      return;
    }
    setRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status } : r)));
    notify(status === "traité" ? "Demande marquée traitée" : "Demande rouverte");
  };

  const remove = async (id: string) => {
    if (!window.confirm("Supprimer définitivement cette demande ?")) return;
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("rdv_requests").delete().eq("id", id);
    if (error) {
      notify("La suppression a échoué");
      return;
    }
    setRequests((prev) => prev.filter((r) => r.id !== id));
    notify("Demande supprimée");
  };

  const newCount = requests.filter((r) => r.status === "nouveau").length;

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
            Demandes de RDV
          </h3>
          <div className="flex items-center gap-2">
            {newCount > 0 && (
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider bg-[#F5C518]/20 text-[#8a6d00] border border-[#F5C518]/40 px-2.5 py-1 rounded-full">
                {newCount} nouvelle{newCount > 1 ? "s" : ""}
              </span>
            )}
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
          Chaque demande attend un rappel WhatsApp sous 24h. Marque-la « traitée » une fois le rendez-vous fixé.
        </p>

        {loading ? (
          <div className="py-12 text-center text-[#060D03]/40 font-mono text-xs uppercase tracking-widest">
            Chargement...
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-[#060D03]/40 font-heading text-xs uppercase tracking-widest">
            Aucune demande pour le moment.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className={`border rounded-2xl p-5 transition-all ${
                  request.status === "nouveau"
                    ? "border-[#00B140]/30 bg-[#E8F5EE]/40"
                    : "border-[#060D03]/10 bg-white opacity-75"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h4 className="font-heading font-bold text-sm text-[#060D03] uppercase">
                        {request.full_name}
                      </h4>
                      <span
                        className={`font-mono text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          request.status === "nouveau"
                            ? "bg-[#00B140]/10 text-[#00B140] border border-[#00B140]/20"
                            : "bg-[#060D03]/5 text-[#060D03]/50 border border-[#060D03]/10"
                        }`}
                      >
                        {request.status}
                      </span>
                      <span className="font-mono text-[9px] text-[#060D03]/40">
                        {formatDate(request.created_at)}
                      </span>
                    </div>

                    <p className="font-body text-xs text-[#060D03]/70 mb-1">
                      <span className="font-bold">Service :</span>{" "}
                      {SERVICE_LABELS[request.service] ?? request.service}
                    </p>
                    {request.project_description && (
                      <p className="font-body text-xs text-[#060D03]/60 mb-1 whitespace-pre-line">
                        <span className="font-bold">Projet :</span> {request.project_description}
                      </p>
                    )}
                    {request.newsletter && (
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[#00B140]">
                        Inscrit(e) à la newsletter
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <a
                      href={waLink(request.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-[#00B140]/10 border border-[#00B140]/20 text-[#00B140] hover:bg-[#00B140] hover:text-white font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all"
                    >
                      <WhatsappLogo size={13} weight="bold" />
                      <span>{request.whatsapp}</span>
                    </a>
                    {request.email && (
                      <a
                        href={`mailto:${request.email}`}
                        className="px-3 py-2 rounded-lg bg-[#060D03]/5 border border-[#060D03]/10 text-[#060D03] hover:bg-[#060D03]/10 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all"
                      >
                        <EnvelopeSimple size={13} weight="bold" />
                        <span className="lowercase">{request.email}</span>
                      </a>
                    )}
                    <button
                      onClick={() => toggleStatus(request)}
                      className={`px-3 py-2 rounded-lg border font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        request.status === "nouveau"
                          ? "bg-[#00B140]/10 border-[#00B140]/20 text-[#00B140] hover:bg-[#00B140]/20"
                          : "bg-[#060D03]/5 border-[#060D03]/15 text-[#060D03]/60 hover:bg-[#060D03]/10"
                      }`}
                    >
                      <Check size={12} weight="bold" />
                      <span>{request.status === "nouveau" ? "Marquer traitée" : "Rouvrir"}</span>
                    </button>
                    <button
                      onClick={() => remove(request.id)}
                      className="w-8 h-8 rounded-lg bg-[#E63946]/10 border border-[#E63946]/20 text-[#E63946] hover:bg-[#E63946]/20 flex items-center justify-center transition-colors cursor-pointer"
                      title="Supprimer la demande"
                    >
                      <Trash size={13} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
