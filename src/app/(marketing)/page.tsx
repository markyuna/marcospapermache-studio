// src/app/(marketing)/page.tsx

import { HeroSection } from "@/components/home/hero-section";
import { FeaturedSection } from "@/components/home/featured-section";
import { ProcessSection } from "@/components/home/process-section";
import { CtaSection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <div className="relative z-10">
        <FeaturedSection />
        <ProcessSection />
        <CtaSection />
      </div>
    </>
  );
}