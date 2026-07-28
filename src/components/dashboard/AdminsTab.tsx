"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash, ArrowsClockwise, PaperPlaneTilt, UserPlus } from "@phosphor-icons/react";

// Onglet "Administrateurs" : liste des comptes, invitation par e-mail
// (l'invité définit son mot de passe lui-même via le lien reçu),
// renvoi d'invitation et révocation.

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  pending: boolean;
  isMe: boolean;
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(iso));

export function AdminsTab({ notify }: { notify: (message: string) => void }) {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/admins");
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.admins) setAdmins(json.admins);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sendInvite = async (email: string, name?: string) => {
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: name || undefined }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "L'invitation a échoué.");
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviting(true);
    try {
      await sendInvite(inviteEmail.trim(), inviteName.trim());
      notify(`Invitation envoyée à ${inviteEmail.trim()}`);
      setInviteEmail("");
      setInviteName("");
      load();
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : "L'invitation a échoué.");
    } finally {
      setInviting(false);
    }
  };

  const resend = async (admin: AdminUser) => {
    try {
      await sendInvite(admin.email, admin.name ?? undefined);
      notify(`Invitation renvoyée à ${admin.email}`);
      load();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Le renvoi a échoué");
    }
  };

  const remove = async (admin: AdminUser) => {
    if (!window.confirm(`Révoquer l'accès administrateur de ${admin.email} ?`)) return;
    const res = await fetch("/api/admin/admins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: admin.id }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      notify(json.error || "La suppression a échoué");
      return;
    }
    setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
    notify("Administrateur révoqué");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Invitation d'un nouvel administrateur */}
      <div className="bg-white border border-[#060D03]/10 rounded-[2rem] p-6 sm:p-8 shadow-sm">
        <h3 className="font-heading font-black text-xl uppercase tracking-tight mb-2 text-[#060D03]">
          Inviter un Administrateur
        </h3>
        <p className="font-body text-xs text-[#060D03]/60 mb-6 max-w-xl">
          L&apos;invité reçoit un e-mail avec un lien personnel pour définir lui-même son mot de passe. Son compte n&apos;est actif qu&apos;après cette étape.
        </p>

        <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end max-w-3xl">
          <div className="sm:col-span-4">
            <label htmlFor="invite-name" className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
              Nom (optionnel)
            </label>
            <input
              id="invite-name"
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="ex: Awa Kponou"
              className="w-full h-11 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
            />
          </div>
          <div className="sm:col-span-5">
            <label htmlFor="invite-email" className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-1">
              Adresse e-mail *
            </label>
            <input
              id="invite-email"
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="admin@entrepreneurbenin.pro"
              className="w-full h-11 px-3 bg-white border border-[#060D03]/15 focus:border-[#00B140] rounded-xl text-xs focus:outline-none text-[#060D03]"
            />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={inviting}
              className="w-full h-11 px-4 bg-[#00B140] hover:bg-[#00D94F] text-white font-heading font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-60"
            >
              {inviting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={14} weight="bold" />
                  <span>Inviter</span>
                </>
              )}
            </button>
          </div>
        </form>
        {inviteError && (
          <p className="text-[#E63946] text-[11px] font-mono uppercase tracking-wider mt-3">{inviteError}</p>
        )}
      </div>

      {/* Liste des administrateurs */}
      <div className="bg-white border border-[#060D03]/10 rounded-[2rem] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <h3 className="font-heading font-black text-xl uppercase tracking-tight text-[#060D03]">
            Comptes Administrateurs
          </h3>
          <button
            onClick={() => { setLoading(true); load(); }}
            className="px-3 py-1.5 rounded-lg bg-[#060D03]/5 border border-[#060D03]/10 text-[#060D03] hover:bg-[#060D03]/10 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowsClockwise size={12} weight="bold" className={loading ? "animate-spin" : ""} />
            <span>Actualiser</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-[#060D03]/40 font-mono text-xs uppercase tracking-widest">
            Chargement...
          </div>
        ) : (
          <div className="space-y-3">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="border border-[#060D03]/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-heading font-bold text-sm text-[#060D03]">
                      {admin.name ?? admin.email}
                    </p>
                    {admin.isMe && (
                      <span className="font-mono text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#060D03] text-white">
                        Toi
                      </span>
                    )}
                    <span
                      className={`font-mono text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        admin.pending
                          ? "bg-[#F5C518]/15 text-[#8a6d00] border-[#F5C518]/40"
                          : "bg-[#00B140]/10 text-[#00B140] border-[#00B140]/20"
                      }`}
                    >
                      {admin.pending ? "Invitation en attente" : "Actif"}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-[#060D03]/50 mt-1 lowercase">
                    {admin.email}
                  </p>
                  <p className="font-mono text-[9px] text-[#060D03]/35 mt-0.5">
                    Créé le {formatDate(admin.createdAt)}
                    {admin.lastSignInAt ? ` · Dernière connexion le ${formatDate(admin.lastSignInAt)}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {admin.pending && (
                    <button
                      onClick={() => resend(admin)}
                      className="px-3 py-2 rounded-lg bg-[#00B140]/10 border border-[#00B140]/20 text-[#00B140] hover:bg-[#00B140]/20 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <PaperPlaneTilt size={12} weight="bold" />
                      <span>Renvoyer l&apos;invitation</span>
                    </button>
                  )}
                  {!admin.isMe && (
                    <button
                      onClick={() => remove(admin)}
                      className="w-8 h-8 rounded-lg bg-[#E63946]/10 border border-[#E63946]/20 text-[#E63946] hover:bg-[#E63946]/20 flex items-center justify-center transition-colors cursor-pointer"
                      title="Révoquer cet administrateur"
                    >
                      <Trash size={13} weight="bold" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
