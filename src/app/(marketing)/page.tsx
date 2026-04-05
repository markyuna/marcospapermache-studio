import { HeroSection } from "@/components/home/hero-section";
import { FeaturedSection } from "@/components/home/featured-section";
import { ProcessSection } from "@/components/home/process-section";
import { CtaSection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <main className="relative">
      <HeroSection />
      <FeaturedSection />
      <ProcessSection />
      <CtaSection />
    </main>
  );
}