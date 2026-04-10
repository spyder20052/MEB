import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEB – Maison de l'Entrepreneur du Bénin | Cotonou 2030",
  description:
    "Le premier hub entrepreneurial du Bénin. Conseil, communauté, connexions pour entrepreneurs, artisans et PME à Cotonou.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%2300B140'/><text y='72' x='50' text-anchor='middle' font-size='62' font-family='Georgia,serif' font-weight='900' fill='%23060D03'>M</text></svg>",
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
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
