import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Container } from "./container";
import { navigation } from "@/data/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-2xl">      
        <Container className="flex h-20 items-center justify-between">        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5">
            <Sparkles className="h-4 w-4 text-neutral-200" />
          </div>
          <div className="leading-tight">
            <p className="text-sm uppercase tracking-[0.28em] text-neutral-400">
              Marcos
            </p>
            <p className="text-sm font-medium text-white">Papermache Studio</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-neutral-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/create"
          className="rounded-full border border-white/15 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200"
        >
          Générer une idée
        </Link>
        </Container>
    </header>
  );
}