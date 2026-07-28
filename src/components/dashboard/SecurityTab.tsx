"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "@phosphor-icons/react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Onglet "Sécurité" : changement du mot de passe du compte connecté.

export function SecurityTab({
  email,
  notify,
}: {
  email: string | null;
  notify: (message: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (updateError) {
      setError("La mise à jour a échoué : " + updateError.message);
      return;
    }

    setPassword("");
    setConfirm("");
    notify("Mot de passe mis à jour");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-white border border-[#060D03]/10 rounded-[2rem] p-6 sm:p-8 shadow-sm">
        <h3 className="font-heading font-black text-xl uppercase tracking-tight mb-2 text-[#060D03]">
          Sécurité du Compte
        </h3>
        <p className="font-body text-xs text-[#060D03]/60 mb-8 max-w-xl">
          Connecté en tant que <span className="font-bold text-[#060D03]">{email ?? "administrateur"}</span>. Le mot de passe est vérifié côté serveur par Supabase Auth : il n&apos;est jamais stocké dans le navigateur.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md space-y-6">
          <div>
            <label htmlFor="new-password" className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-2">
              Nouveau mot de passe (8 caractères min.)
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Saisir le nouveau mot de passe"
              autoComplete="new-password"
              className="w-full h-12 px-4 rounded-xl border border-[#060D03]/15 focus:border-[#00B140] focus:ring-2 focus:ring-[#00B140]/10 bg-white text-sm focus:outline-none text-[#060D03]"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block font-heading font-bold text-[9px] uppercase tracking-widest text-[#060D03]/50 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirmer le nouveau mot de passe"
              autoComplete="new-password"
              className="w-full h-12 px-4 rounded-xl border border-[#060D03]/15 focus:border-[#00B140] focus:ring-2 focus:ring-[#00B140]/10 bg-white text-sm focus:outline-none text-[#060D03]"
            />
          </div>

          {error && (
            <p className="text-[#E63946] text-[11px] font-mono uppercase tracking-wider">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-4 bg-[#00B140] hover:bg-[#00D94F] text-white font-heading font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Lock size={14} weight="bold" />
            )}
            <span>Enregistrer le mot de passe</span>
          </button>
        </form>
      </div>
    </motion.div>
  );
}
