// src/app/[locale]/create/page.tsx
import { Container } from "@/components/layout/container";
import AIExperienceSection from "@/components/create/AIExperienceSection";

export default function CreatePage() {
  return (
    <main className="py-24 md:py-32">
      <Container className="max-w-6xl">
        <AIExperienceSection />
      </Container>
    </main>
  );
}