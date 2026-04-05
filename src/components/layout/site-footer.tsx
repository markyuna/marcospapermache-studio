import Link from "next/link";

import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-white">Marcos Papermache</p>
          <p className="mt-1 text-sm text-neutral-400">
            Sculptures contemporaines & création assistée par IA.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-neutral-400">
          <Link href="/about" className="transition hover:text-white">
            À propos
          </Link>
          <Link href="/sculptures" className="transition hover:text-white">
            Sculptures
          </Link>
          <Link href="/commande" className="transition hover:text-white">
            Commande
          </Link>
          <Link href="/contact" className="transition hover:text-white">
            Contact
          </Link>
        </div>
      </Container>
    </footer>
  );
}