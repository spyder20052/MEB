import Link from "next/link";
import Image from "next/image";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeSimpleIcon,
  FacebookLogoIcon,
  LinkedinLogoIcon,
  InstagramLogoIcon,
  ArrowUpRightIcon
} from "@phosphor-icons/react/dist/ssr";

const links = {
  services: [
    { label: "Positionnement", href: "/services/positionnement" },
    { label: "Orientation", href: "/services/orientation" },
    { label: "Assistance RDV", href: "/services/assistance-rdv" },
    { label: "Infos sectorielles", href: "/services/informations" },
    { label: "Analyse sectorielle", href: "/services/analyse-sectorielle" },
  ],
  evenements: [
    { label: "Journées Portes Ouvertes", href: "/evenements/jpo" },
    { label: "Petits-Déj'", href: "/evenements/petit-dej" },
    { label: "Afterworks", href: "/evenements/afterworks" },
    { label: "Mastermind", href: "/evenements/mastermind" },
  ],
  apropos: [
    { label: "Notre mission", href: "/a-propos/mission" },
    { label: "L'équipe", href: "/a-propos/equipe" },
    { label: "Gouvernance", href: "/a-propos/gouvernance" },
    { label: "Impact", href: "/a-propos/impact" },
    { label: "FAQ", href: "/faq" },
  ],
};

export const Footer = () => {
  return (
    <footer className="relative bg-[#060D03] border-t border-white/[0.05] overflow-hidden pt-24 pb-8">
      {/* Massive Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-meb-green/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative z-10">

        {/* Bento Top CTA Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-24">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-10 md:p-14 flex flex-col justify-between group hover:bg-white/[0.04] transition-colors duration-500 relative overflow-hidden">
            {/* Subtile Hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-meb-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <h3 className="font-heading font-black text-4xl md:text-5xl text-white tracking-tight mb-8">
              Prêt à accélérer<br />
              <span className="text-meb-green">ton business ?</span>
            </h3>
            <Link href="/prendre-rdv" className="inline-flex items-center gap-4 bg-meb-green text-meb-dark px-8 py-4 rounded-full font-heading font-bold uppercase tracking-widest text-xs w-fit hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(0,177,64,0.3)] hover:shadow-[0_0_50px_rgba(0,177,64,0.5)]">
              Rejoindre le MEB
              <ArrowUpRightIcon size={18} weight="bold" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Address Bento Card */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 flex flex-col justify-center group hover:-translate-y-1 transition-transform duration-500">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-meb-green group-hover:scale-110 transition-transform duration-500 group-hover:bg-meb-green group-hover:text-meb-dark">
                <MapPinIcon size={24} weight="fill" />
              </div>
              <h4 className="font-mono text-[10px] text-white/50 uppercase tracking-[0.2em] mb-2 font-bold">L'Espace</h4>
              <p className="font-heading font-semibold text-white text-lg">AKPAKPA<br />Cinéma Concorde<br />Cotonou</p>
            </div>

            {/* Contact Bento Card */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 flex flex-col justify-center group hover:-translate-y-1 transition-transform duration-500">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-meb-green group-hover:scale-110 transition-transform duration-500 group-hover:bg-meb-green group-hover:text-meb-dark">
                <EnvelopeSimpleIcon size={24} weight="fill" />
              </div>
              <h4 className="font-mono text-[10px] text-white/50 uppercase tracking-[0.2em] mb-2 font-bold">Nous contacter</h4>
              <a href="mailto:contact@meb.bj" className="font-heading font-semibold text-white text-lg hover:text-meb-green transition-colors mb-1">
                contact@meb.bj
              </a>
              <a href="tel:0160007007" className="font-heading font-semibold text-white text-lg hover:text-meb-green transition-colors">
                01 60 007 007
              </a>
            </div>
          </div>
        </div>

        {/* Links Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12 mb-16 border-t border-white/[0.05] pt-16">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center group mb-4">
              <Image
                src="/images/logo.png"
                alt="MEB Logo"
                width={144}
                height={144}
                className="transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_12px_rgba(0,240,64,0.4)]"
              />
            </Link>
            <p className="font-body text-[14px] text-white/50 leading-[1.8] max-w-sm">
              Le premier hub entrepreneurial du Bénin. Connectez-vous, développez votre réseau et accélérez votre croissance.
            </p>
          </div>

          {/* Link columns */}
          {([
            { title: "Services", items: links.services },
            { title: "Événements", items: links.evenements },
            { title: "À propos", items: links.apropos },
          ] as const).map((col) => (
            <div key={col.title} className="lg:col-span-1 lg:col-start-auto">
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-meb-green/70 mb-6">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.items.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-heading font-medium text-[15px] tracking-tight text-white/60 hover:text-white hover:translate-x-1 transition-all inline-block duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Huge MEB Text */}
        <div className="w-full flex justify-center mt-20 mb-8 pointer-events-none select-none overflow-hidden">
          <span className="font-heading font-black text-[18vw] leading-none text-white/[0.03] tracking-tighter">
            MEB<span className="text-meb-green/[0.05]">.</span>
          </span>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <p className="font-mono text-[10px] tracking-widest uppercase font-bold text-white/30 text-center md:text-left">
            © {new Date().getFullYear()} Maison de l&apos;Entrepreneur du Bénin.<br className="md:hidden" /> Tous droits réservés.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link
              href="/mentions-legales"
              className="font-mono text-[10px] tracking-widest uppercase font-bold text-white/30 hover:text-white transition-colors duration-300"
            >
              Mentions légales
            </Link>
            <div className="flex items-center gap-2">
              {[
                { icon: <FacebookLogoIcon size={18} weight="fill" />, label: "Facebook" },
                { icon: <LinkedinLogoIcon size={18} weight="fill" />, label: "LinkedIn" },
                { icon: <InstagramLogoIcon size={18} weight="fill" />, label: "Instagram" },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-meb-green hover:text-[#060D03] transition-all duration-300 transform hover:-translate-y-1">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
