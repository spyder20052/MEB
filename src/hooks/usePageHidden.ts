"use client";

import { useEffect, useState } from "react";
import { getHiddenPagesLite } from "@/utils/hiddenPages";

// Indique si la page est masquée depuis le dashboard, et se met à jour en
// direct : "meb_settings_updated" est déclenché par les sauvegardes locales ET
// par Supabase Realtime (autres onglets / autres visiteurs).
//
// `initialHidden` permet à une page rendue côté serveur de fournir la valeur
// réelle dès le premier rendu, sans passer par un état « visible » transitoire.
// La lecture passe par l'API REST directe (pas de supabase-js dans le bundle).
export function usePageHidden(path: string, initialHidden = false): boolean {
  const [hidden, setHidden] = useState(initialHidden);

  useEffect(() => {
    let cancelled = false;
    const check = (fresh: boolean) => {
      getHiddenPagesLite({ fresh }).then((pages) => {
        if (!cancelled) setHidden(pages.includes(path));
      });
    };
    check(false);
    const onUpdate = () => check(true);
    window.addEventListener("meb_settings_updated", onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener("meb_settings_updated", onUpdate);
    };
  }, [path]);

  return hidden;
}
