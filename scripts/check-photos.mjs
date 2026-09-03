#!/usr/bin/env node
// Diagnostic : vérifie que chaque photo d'événement enregistrée en base répond.
//
//   npm run photos:check
//     -> environnement de .env.local (Supabase local)
//
//   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co \
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=<clé anon du projet> \
//   node scripts/check-photos.mjs
//     -> production (les deux valeurs sont dans Supabase > Settings > API)
//
// Pour chaque photo : statut de l'URL telle qu'enregistrée, puis statut de
// l'URL recollée sur l'hôte Supabase courant (ce que le site affiche réellement,
// cf. resolvePhotoUrl dans src/lib/photos.ts). Code de sortie 2 si une photo
// est indisponible.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

if (!supabaseUrl || !anonKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont requis.");
  process.exit(1);
}

const PREFIX = "/storage/v1/object/public/";
const origin = new URL(supabaseUrl).origin;

const resolvePhotoUrl = (src) => {
  const idx = src.indexOf(PREFIX);
  if (idx !== -1) return origin + src.slice(idx);
  if (src.startsWith("/") && siteUrl) return new URL(src, siteUrl).toString();
  return src;
};

const probe = async (target) => {
  try {
    const res = await fetch(target, { method: "HEAD", redirect: "follow" });
    return { ok: res.ok, label: `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, label: `injoignable (${err.cause?.code ?? err.message})` };
  }
};

const res = await fetch(
  `${origin}/rest/v1/events?select=num,title,is_hidden,recap_published,card_photo,recap_photos&order=num`,
  { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
);
if (!res.ok) {
  console.error(`Lecture des événements impossible : HTTP ${res.status} sur ${origin}`);
  process.exit(1);
}
const events = await res.json();

console.log(`Supabase : ${origin}`);
let total = 0;
let broken = 0;

for (const event of events) {
  const photos = [
    ...(event.card_photo ? [event.card_photo] : []),
    ...(event.recap_photos ?? []),
  ];
  if (photos.length === 0) continue;

  const flags = [
    event.is_hidden ? "masqué" : null,
    event.recap_published ? "récap publié" : null,
  ].filter(Boolean);
  console.log(`\n[${event.num}] ${event.title}${flags.length ? ` (${flags.join(", ")})` : ""}`);

  for (const stored of photos) {
    total += 1;
    const displayed = resolvePhotoUrl(stored);
    const displayedStatus = await probe(displayed);
    if (!displayedStatus.ok) broken += 1;

    console.log(`  ${displayedStatus.ok ? "OK" : "KO"}  ${stored}`);
    if (displayed !== stored) {
      console.log(`      affichée comme ${displayed} : ${displayedStatus.label}`);
      const storedStatus = await probe(stored);
      console.log(`      telle qu'enregistrée : ${storedStatus.label}`);
    } else if (!displayedStatus.ok) {
      console.log(`      ${displayedStatus.label}`);
    }
  }
}

console.log(`\n${total} photo(s) vérifiée(s), ${broken} indisponible(s).`);
process.exit(broken > 0 ? 2 : 0);
