import { HeroSection } from "@/components/home/HeroSection";
import { SloganSection } from "@/components/home/SloganSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { SolutionPillars } from "@/components/home/SolutionPillars";
import { TimelineJourney } from "@/components/home/TimelineJourney";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { ImpactCounter } from "@/components/home/ImpactCounter";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactCTA } from "@/components/home/ContactCTA";

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
      <Testimonials />
      <ContactCTA />
    </div>
  );
}
