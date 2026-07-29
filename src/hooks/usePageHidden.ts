"use client";

import { useEffect, useState } from "react";
import { getHiddenPages } from "@/utils/storage";

// Indique si la page est masquée depuis le dashboard, et se met à jour
// en direct : "meb_settings_updated" est déclenché par les sauvegardes
// locales ET par Supabase Realtime (autres onglets / autres visiteurs).
export function usePageHidden(path: string): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const check = () => {
      getHiddenPages().then((pages) => setHidden(pages.includes(path)));
    };
    check();
    window.addEventListener("meb_settings_updated", check);
    return () => window.removeEventListener("meb_settings_updated", check);
  }, [path]);

  return hidden;
}
