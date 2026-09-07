import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Poppins, Inter, IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RealtimeRefresher } from "@/components/layout/RealtimeRefresher";

// Bouton flottant secondaire, jamais utile au premier affichage : le sortir
// du lot initial evite d'y embarquer framer-motion, qui serait alors charge
// sur chaque page du site.
const WhatsAppButton = dynamic(() =>
  import("@/components/layout/WhatsAppButton").then((m) => m.WhatsAppButton)
);
import "./globals.css";

// Polices auto-hébergées par Next au lieu d'un @import CSS vers Google.
// L'@import créait une cascade bloquante (CSS du site -> CSS Google -> fichiers
// de police) avant le moindre texte affiché ; ici les fichiers sont servis par
// notre domaine, préchargés, et `display: swap` montre le texte tout de suite.
// Seules les graisses réellement présentes dans le code sont demandées.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Le mono ne sert qu'aux petits libellés : deux graisses suffisent.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "MEB – Maison de l'Entrepreneur du Bénin | Cotonou 2030",
  description:
    "Le premier hub entrepreneurial du Bénin. Conseil, communauté, connexions pour entrepreneurs, artisans et PME à Cotonou.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${poppins.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <RealtimeRefresher />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
