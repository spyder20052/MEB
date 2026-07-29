import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales — MEB | Maison de l'Entrepreneur du Bénin",
  description:
    "Mentions légales, données personnelles et contacts de la Maison de l'Entrepreneur du Bénin.",
};

const sections = [
  {
    title: "Éditeur du site",
    content: [
      "Le site entrepreneurbenin.pro est édité par la Maison de l'Entrepreneur du Bénin (MEB), hub entrepreneurial basé à Akpakpa, Cotonou, Bénin.",
      "Contact : contact@entrepreneurbenin.pro · +229 01 60 00 70 07",
    ],
  },
  {
    title: "Hébergement",
    content: [
      "Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.",
      "Les données du site sont hébergées par Supabase Inc. (base de données et stockage de fichiers).",
    ],
  },
  {
    title: "Données personnelles",
    content: [
      "Les formulaires du site (prise de rendez-vous, inscription à un événement, newsletter) collectent uniquement les informations nécessaires au traitement de ta demande : nom, numéro WhatsApp et, si tu le renseignes, adresse e-mail.",
      "Ces données sont utilisées exclusivement par l'équipe de la MEB pour te recontacter, confirmer ta participation aux événements ou t'envoyer la newsletter si tu y as consenti. Elles ne sont ni vendues, ni transmises à des tiers.",
      "Chaque e-mail de la newsletter contient un lien de désinscription immédiate. Pour toute demande de consultation, de rectification ou de suppression de tes données, écris-nous à contact@entrepreneurbenin.pro : nous traitons ta demande sous 30 jours.",
    ],
  },
  {
    title: "Propriété intellectuelle",
    content: [
      "L'ensemble des contenus du site (textes, visuels, logo, charte graphique) est la propriété de la Maison de l'Entrepreneur du Bénin. Toute reproduction sans autorisation écrite préalable est interdite.",
    ],
  },
  {
    title: "Responsabilité",
    content: [
      "La MEB s'efforce d'assurer l'exactitude des informations publiées (dates d'événements, tarifs des services), qui peuvent toutefois évoluer. Les informations contractuelles font foi au moment de la confirmation de ton rendez-vous ou de ton inscription.",
    ],
  },
];

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-white text-[#1A1A2E] pt-44 pb-24">
      <div className="max-w-[840px] mx-auto px-5 sm:px-8">
        <span className="inline-block font-mono text-[10px] font-bold uppercase tracking-widest text-[#00B140] bg-[#E8F5EE] px-3 py-1 rounded-full mb-6">
          Informations légales
        </span>

        <h1 className="font-heading font-black text-4xl sm:text-5xl uppercase tracking-tighter leading-none mb-4">
          Mentions <span className="text-[#00B140]">légales</span>
        </h1>
        <p className="font-body text-sm text-[#555555] mb-14 max-w-xl leading-relaxed">
          Tout ce qu&apos;il faut savoir sur le site de la Maison de l&apos;Entrepreneur du Bénin
          et sur la façon dont tes données sont protégées.
        </p>

        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-heading font-bold text-xl uppercase tracking-tight mb-4 pb-3 border-b border-[#060D03]/10">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.content.map((paragraph, i) => (
                  <p key={i} className="font-body text-sm text-[#555555] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-[#060D03]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#060D03]/40">
            Dernière mise à jour : juillet 2026
          </p>
          <Link
            href="/prendre-rdv"
            className="inline-flex items-center gap-2 bg-[#060D03] hover:bg-[#00B140] text-white py-3 px-6 rounded-full font-heading font-bold text-xs uppercase tracking-widest transition-all duration-300"
          >
            Une question ? Écris-nous
          </Link>
        </div>
      </div>
    </div>
  );
}
