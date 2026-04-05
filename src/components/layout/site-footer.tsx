import Link from "next/link";

import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-white/40 backdrop-blur-sm">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-[#1a1a1a]">
            Marcos Papermache
          </p>
          <p className="mt-1 text-sm text-[#6f6257]">
            Sculptures contemporaines & création assistée par IA.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-[#6f6257]">
          <Link href="/about" className="transition hover:text-[#ff6a00]">
            À propos
          </Link>
          <Link href="/sculptures" className="transition hover:text-[#ff6a00]">
            Sculptures
          </Link>
          <Link href="/commande" className="transition hover:text-[#ff6a00]">
            Commande
          </Link>
          <Link href="/contact" className="transition hover:text-[#ff6a00]">
            Contact
          </Link>
        </div>
      </Container>
    </footer>
  );
}