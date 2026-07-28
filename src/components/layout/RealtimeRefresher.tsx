"use client";

import { useEffect } from "react";
import { subscribeToContentUpdates } from "@/utils/storage";

// Abonne toute l'application aux changements de contenu Supabase
// (événements, projets, visibilité des pages) : chaque modification
// faite depuis le dashboard est répercutée en direct chez les visiteurs
// via l'événement navigateur "meb_settings_updated".
export function RealtimeRefresher() {
  useEffect(() => subscribeToContentUpdates(), []);
  return null;
}
