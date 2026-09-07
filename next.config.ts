import path from "path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      // Collapse the bare domain onto the default locale with a permanent (308)
      // redirect. Runs at the edge before the next-intl proxy, so http/https and
      // www/non-www variants of "/" consolidate onto /fr in a single hop and
      // Google can pick one canonical.
      {
        source: "/",
        destination: "/fr",
        permanent: true,
      },
      // Legacy URLs from the previous site. `/:path*` also matches the bare path
      // and a stray trailing slash (Google has `/…/` variants indexed), so every
      // variant resolves in one 308 hop. Specific sub-paths must come before the
      // `/contactez-nous` catch-all — first match wins.
      {
        source: "/contactez-nous/avis-juridique/:path*",
        destination: "/fr/mentions-legales",
        permanent: true,
      },
      {
        source: "/contactez-nous/politique-de-confidentialite/:path*",
        destination: "/fr/politique-de-confidentialite",
        permanent: true,
      },
      {
        source: "/contactez-nous/:path*",
        destination: "/fr/contact",
        permanent: true,
      },
      {
        source: "/sculptures/:path*",
        destination: "/fr/sculptures/:path*",
        permanent: true,
      },
      {
        source: "/a-propos-de-nous/:path*",
        destination: "/fr/about",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "auqffceixjyogdqzlejf.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Fewer breakpoints/formats = fewer distinct Vercel Image Optimization
    // transformations per source image (Hobby plan is capped at 5K/month).
    deviceSizes: [640, 1080, 1920],
    imageSizes: [16, 64, 128, 256],
    formats: ["image/webp"],
    minimumCacheTTL: 2678400, // 31 days
    qualities: [75],
  },
};

export default withNextIntl(nextConfig);