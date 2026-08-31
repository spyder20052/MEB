import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { RealtimeRefresher } from "@/components/layout/RealtimeRefresher";
import "./globals.css";

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
    <html lang="fr">
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
