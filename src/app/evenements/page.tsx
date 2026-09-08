import type { Metadata } from "next";
import { fetchEventsRest, toEventViews } from "@/lib/events";
import { getHiddenPagesLite } from "@/utils/hiddenPages";
import { EvenementsClient } from "./EvenementsClient";

export const metadata: Metadata = {
  title: "Événements | MEB – Maison de l'Entrepreneur du Bénin",
  description:
    "Journées portes ouvertes, petits-déj', masterminds et afterworks : l'agenda des événements MEB à Cotonou, avec inscription en ligne et récaps des éditions passées.",
};

// Rendu à chaque requête : la liste vient de la base au moment de la visite,
// jamais d'un instantané pris au build ni d'un contenu par défaut. Le premier
// HTML est donc déjà le bon, et le temps réel côté client prend le relais.
export const dynamic = "force-dynamic";

export default async function EvenementsPage() {
  const [eventsResult, hiddenPages] = await Promise.all([
    fetchEventsRest()
      .then((events) => ({ events, failed: false }))
      .catch((err: unknown) => {
        console.error("[evenements] lecture des événements :", err instanceof Error ? err.message : err);
        return { events: [], failed: true };
      }),
    getHiddenPagesLite({ fresh: true }),
  ]);

  return (
    <EvenementsClient
      initialEvents={toEventViews(eventsResult.events)}
      loadFailed={eventsResult.failed}
      initialHidden={hiddenPages.includes("/evenements")}
    />
  );
}
