"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Check, ArrowsClockwise } from "@phosphor-icons/react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Page d'activation d'un compte administrateur invité :
// vérifie le jeton reçu par e-mail puis laisse l'invité choisir
// son propre mot de passe.

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [verifyResult, setVerifyResult] = useState<"pending" | "ok" | "failed">("pending");
  const [formStatus, setFormStatus] = useState<"idle" | "saving" | "done">("idle");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // L'absence de jeton dans l'URL se déduit du rendu, sans passer par un état.
  const tokenHash = searchParams.get("token_hash");

  useEffect(() => {
    if (!tokenHash) return;
    const type = searchParams.get("type") === "recovery" ? "recovery" : "invite";

    const supabase = getSupabaseBrowserClient();
    supabase.auth
      .verifyOtp({ type, token_hash: tokenHash })
      .then(({ error: otpError }) => {
        setVerifyResult(otpError ? "failed" : "ok");
      });
  }, [searchParams, tokenHash]);

  const status: "verifying" | "ready" | "invalid" | "saving" | "done" = !tokenHash
    ? "invalid"
    : verifyResult === "pending"
      ? "verifying"
      : verifyResult === "failed"
        ? "invalid"
        : formStatus === "idle"
          ? "ready"
          : formStatus;

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

    setFormStatus("saving");
    const supabase = getSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setFormStatus("idle");
      setError("La mise à jour a échoué : " + updateError.message);
      return;
    }

    setFormStatus("done");
    setTimeout(() => router.push("/dashboard"), 1800);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#060D03] flex items-center justify-center pt-24 pb-20 relative px-4">
      <div className="max-w-[420px] w-full bg-white border border-[#060D03]/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl relative z-10 text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative w-24 h-24 drop-shadow-[0_0_12px_rgba(0,240,64,0.2)]">
            <Image
              src="/images/logo.png"
              alt="MEB Logo"
              width={96}
              height={96}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>

        {status === "verifying" && (
          <div className="py-8 flex flex-col items-center gap-4">
            <ArrowsClockwise size={28} weight="bold" className="text-[#00B140] animate-spin" />
            <p className="font-body text-xs text-[#060D03]/60">Vérification de ton invitation...</p>
          </div>
        )}

        {status === "invalid" && (
          <>
            <h2 className="font-heading font-black text-2xl uppercase tracking-tighter leading-none text-[#060D03] mb-2">
              LIEN <span className="text-[#E63946]">EXPIRÉ</span>
            </h2>
            <p className="font-body text-xs text-[#060D03]/60 mb-8 leading-relaxed">
              Ce lien d&apos;invitation n&apos;est plus valide. Demande à un administrateur de te renvoyer une invitation depuis le dashboard.
            </p>
            <Link
              href="/"
              className="block text-center text-[#060D03]/40 hover:text-[#060D03] transition-colors text-[10px] font-mono uppercase tracking-widest"
            >
              Retour au site
            </Link>
          </>
        )}

        {(status === "ready" || status === "saving") && (
          <>
            <h2 className="font-heading font-black text-2xl uppercase tracking-tighter leading-none text-[#060D03] mb-2">
              CHOISIS TON <span className="text-[#00B140]">MOT DE PASSE</span>
            </h2>
            <p className="font-body text-xs text-[#060D03]/60 mb-8 leading-relaxed">
              Ton compte administrateur est presque prêt. Définis un mot de passe d&apos;au moins 8 caractères.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div>
                <label htmlFor="password" className="block font-heading font-bold text-[10px] uppercase tracking-widest text-[#060D03]/50 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full h-12 px-4 rounded-xl border border-[#060D03]/15 focus:border-[#00B140] focus:ring-2 focus:ring-[#00B140]/10 bg-transparent text-sm focus:outline-none transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="confirm" className="block font-heading font-bold text-[10px] uppercase tracking-widest text-[#060D03]/50 mb-2">
                  Confirme le mot de passe
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full h-12 px-4 rounded-xl border border-[#060D03]/15 focus:border-[#00B140] focus:ring-2 focus:ring-[#00B140]/10 bg-transparent text-sm focus:outline-none transition-all"
                />
              </div>

              {error && (
                <p className="text-[#E63946] text-[11px] font-mono uppercase tracking-wider text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={status === "saving"}
                className="w-full bg-[#00B140] hover:bg-[#00D94F] text-white font-heading font-bold py-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-60"
              >
                {status === "saving" ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={14} weight="bold" />
                    <span>Activer mon compte</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {status === "done" && (
          <div className="py-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#E8F5EE] text-[#00B140] rounded-full flex items-center justify-center mb-6">
              <Check size={32} weight="bold" />
            </div>
            <h2 className="font-heading font-black text-xl uppercase tracking-tight mb-2">
              Compte activé !
            </h2>
            <p className="font-body text-xs text-[#060D03]/60">
              Redirection vers le tableau de bord...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DefinirMotDePassePage() {
  return (
    <Suspense fallback={null}>
      <SetPasswordForm />
    </Suspense>
  );
}
