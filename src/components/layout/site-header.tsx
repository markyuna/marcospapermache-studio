import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Container } from "./container";
import { navigation } from "@/data/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-2xl">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ff6a00]/15 bg-gradient-to-br from-[#fff4ea] to-[#f3e8dc] shadow-sm">
            <Sparkles className="h-4 w-4 text-[#ff6a00]" />
          </div>

          <div className="leading-tight">
            <p className="text-sm uppercase tracking-[0.28em] text-[#9a6b47]">
              Marcos
            </p>
            <p className="text-sm font-medium text-[#1a1a1a]">
              Papermache Studio
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#5f5348] transition hover:text-[#ff6a00]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/create"
          className="rounded-full border border-[#ff6a00]/20 bg-[#ff6a00] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:scale-[1.02] hover:bg-[#e85f00]"
        >
          Générer une idée
        </Link>
      </Container>
    </header>
  );
}