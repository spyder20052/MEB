"use client";

import { useEffect } from "react";

// Abonne toute l'application aux changements de contenu Supabase
// (événements, projets, visibilité des pages) : chaque modification
// faite depuis le dashboard est répercutée en direct chez les visiteurs
// via l'événement navigateur "meb_settings_updated".
//
// L'import est dynamique et différé : un import statique de `storage`
// embarquait le client Supabase (~240 Ko) dans le bundle initial de
// CHAQUE page, alors que le temps réel n'est utile qu'après l'affichage.
export function RealtimeRefresher() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    // On attend que la page soit peinte pour ne pas concurrencer le rendu.
    const start = () => {
      import("@/utils/storage").then(({ subscribeToContentUpdates }) => {
        if (!cancelled) cleanup = subscribeToContentUpdates();
      });
    };

    const idle = (window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;

    if (idle) idle(start, { timeout: 3000 });
    else setTimeout(start, 1500);

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
