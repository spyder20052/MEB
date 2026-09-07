import dynamic from "next/dynamic";

import { HeroSection } from "@/components/home/HeroSection";
import { SloganSection } from "@/components/home/SloganSection";
import { SolutionPillars } from "@/components/home/SolutionPillars";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { ContactCTA } from "@/components/home/ContactCTA";

// Sections situées sous la ligne de flottaison : leur JS n'a aucune raison
// de retarder le premier affichage. `ProblemSection` embarque un accordéon
// animé et EventPopup le client Supabase ; les charger à part réduit
// d'autant le bundle initial de l'accueil.
const ProblemSection = dynamic(() =>
  import("@/components/home/ProblemSection").then((m) => m.ProblemSection)
);
const TimelineJourney = dynamic(() =>
  import("@/components/home/TimelineJourney").then((m) => m.TimelineJourney)
);
const ImpactCounter = dynamic(() =>
  import("@/components/home/ImpactCounter").then((m) => m.ImpactCounter)
);
const EventPopup = dynamic(() =>
  import("@/components/home/EventPopup").then((m) => m.EventPopup)
);

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full relative">
      <HeroSection />
      <SloganSection />
      <ProblemSection />
      <SolutionPillars />
      <TimelineJourney />
      <ServicesPreview />
      <ImpactCounter />
      <ContactCTA />
      <EventPopup />
    </div>
  );
}
