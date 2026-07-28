-- ============================================================
-- MEB — Données initiales (reprend DEFAULT_EVENTS et
-- DEFAULT_PROJECTS de src/utils/storage.ts)
-- ============================================================

insert into public.events
  (num, title, tag, recurring_str, date_str, time, venue, "desc", seats, date_raw, template_style)
values
  ('01', 'Journées Portes Ouvertes', 'Événement Public', 'Chaque 1er Jeudi du Mois', 'Jeudi 2 Juillet 2026',
   '09:00 - 13:00', 'Ciné Concorde, Cotonou',
   'Découvrez nos programmes d''accompagnement, visitez notre hub physique et rencontrez nos conseillers pour diagnostiquer ton projet.',
   15, '2026-07-02T09:00:00+01:00', '01'),
  ('02', 'Petits-Déj'' MEB', 'Membres & Invités', 'Un Mardi sur deux', 'Mardi 30 Juin 2026',
   '08:30 - 10:30', 'Ciné Concorde, Cotonou',
   'Un moment convivial d''échanges autour d''une thématique clé (fiscalité, digital, droit) animé par un expert praticien invité.',
   8, '2026-06-30T08:30:00+01:00', '02'),
  ('03', 'Mastermind Stratégique', 'Membres Élite', 'Dernier Samedi du mois', 'Samedi 27 Juin 2026',
   '15:00 - 18:00', 'Ciné Concorde, Cotonou',
   'Atelier fermé de co-développement pour entrepreneurs avancés. Résolvez collectivement tes défis de structuration et de croissance.',
   5, '2026-06-27T15:00:00+01:00', '03'),
  ('04', 'Afterworks Réseautage', 'Public & Partenaires', 'Une fois par trimestre', 'Mercredi 15 Juillet 2026',
   '18:30 - 21:30', 'Ciné Concorde, Cotonou',
   'Rencontrez la communauté MEB, nos mentors, sponsors et investisseurs lors de nos grandes soirées informelles de connexion.',
   30, '2026-07-15T18:30:00+01:00', '04')
on conflict (num) do nothing;

insert into public.projects (id, title, sector, "desc", image, bg_color, tag_color)
values
  ('1', 'Cacao du Bénin', 'Agro-transformation', 'Chocolaterie artisanale valorisant le cacao local.',
   '/images/entrepreneur-1.png', 'bg-red-50 border-red-200 text-red-950', 'bg-red-100 text-red-700'),
  ('2', 'Karité Naturel', 'Cosmétique', 'Soins naturels équitables par des coopératives de femmes.',
   '/images/journey/Image co.png', 'bg-yellow-50 border-yellow-200 text-yellow-950', 'bg-yellow-100 text-yellow-700'),
  ('3', 'Menuiserie Moderne', 'Artisanat', 'Mobilier durable éco-conçu en bois local.',
   '/images/entrepreneur-1.png', 'bg-cyan-50 border-cyan-200 text-cyan-950', 'bg-cyan-100 text-cyan-700'),
  ('4', 'Agri-Tech Bénin', 'Technologie', 'Plateforme de vente directe connectant producteurs et marchés.',
   '/images/journey/Image co.png', 'bg-green-50 border-green-200 text-green-950', 'bg-green-100 text-green-700'),
  ('5', 'Énergie Verte', 'Énergie', 'Kits solaires abordables pour l''électrification rurale.',
   '/images/entrepreneur-1.png', 'bg-stone-50 border-stone-200 text-stone-950', 'bg-stone-100 text-stone-700')
on conflict (id) do nothing;

insert into public.site_settings (id, hidden_pages)
values (1, '{}')
on conflict (id) do nothing;
