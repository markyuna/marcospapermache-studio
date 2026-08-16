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
      {
        source: "/contactez-nous",
        destination: "/fr/contact",
        permanent: true,
      },
      {
        source: "/sculptures",
        destination: "/fr/sculptures",
        permanent: true,
      },
      {
        source: "/a-propos-de-nous",
        destination: "/fr/about",
        permanent: true,
      },
      {
        source: "/contactez-nous/avis-juridique",
        destination: "/fr/mentions-legales",
        permanent: true,
      },
      {
        source: "/contactez-nous/politique-de-confidentialite",
        destination: "/fr/politique-de-confidentialite",
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