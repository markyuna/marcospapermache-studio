import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import ClarityInit from "@/components/analytics/ClarityInit";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.marcospapermache.com"),
  title: {
    default: "Marcos Papermache",
    template: "%s | Marcos Papermache",
  },
  description:
    "Sculptures contemporaines en papier mâché et expérience de création assistée par IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen antialiased">
        {children}
        <Analytics />
        <ClarityInit />
      </body>
    </html>
  );
}