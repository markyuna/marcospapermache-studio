import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-neutral-200/60 bg-gradient-to-b from-[#fffaf5] to-[#fff3e8]">
      {/* Glow decorativo */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,140,60,0.12),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          
          {/* Branding */}
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Marcos Papermache
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-600">
              Sculptures artisanales en papier mâché, mêlant design contemporain,
              matières recyclées et expression artistique unique.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Navigation
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-700">
              <li>
                <Link href="/" className="hover:text-orange-500 transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/sculptures" className="hover:text-orange-500 transition">
                  Sculptures
                </Link>
              </li>
              <li>
                <Link href="/creations-sur-mesure" className="hover:text-orange-500 transition">
                  Créations sur mesure
                </Link>
              </li>
              <li>
                <Link href="/experience-ia" className="hover:text-orange-500 transition">
                  Expérience IA
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-500 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Contact
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-neutral-700">
              <li>
                <a
                  href="mailto:contact@marcospapermache.com"
                  className="hover:text-orange-500 transition"
                >
                  contact@marcospapermache.com
                </a>
              </li>

              <li>
                <a
                  href="https://www.instagram.com/marcospapermache"
                  target="_blank"
                  className="hover:text-orange-500 transition"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-neutral-200/60 pt-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Marcos Papermache — Tous droits réservés
        </div>
      </div>
    </footer>
  );
}