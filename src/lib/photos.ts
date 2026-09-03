// Normalisation des URLs de photos (Supabase Storage).
//
// Les photos sont enregistrées en base sous forme d'URL publique absolue,
// telle que renvoyée par getPublicUrl() au moment de l'upload. Cette URL
// embarque donc l'hôte Supabase de l'environnement où l'upload a eu lieu :
// 127.0.0.1:54321 en local, <ref>.supabase.co ou <ref>.storage.supabase.co
// en production. Dès que les données circulent d'un environnement à l'autre
// (dump local rejoué en prod, prod consultée depuis un poste de dev, migration
// de projet Supabase), l'hôte enregistré ne répond plus et l'image casse.
//
// resolvePhotoUrl() recolle le chemin de l'objet sur l'hôte Supabase COURANT
// (NEXT_PUBLIC_SUPABASE_URL) : la donnée stockée reste inchangée, seul
// l'affichage est corrigé. Les autres sources (/images/..., Unsplash) passent
// telles quelles.

const STORAGE_PUBLIC_PREFIX = "/storage/v1/object/public/";

const currentSupabaseOrigin = (): string | null => {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
};

export const isSupabaseStorageUrl = (src: string): boolean =>
  src.includes(STORAGE_PUBLIC_PREFIX);

export const resolvePhotoUrl = (src: string): string => {
  const trimmed = (src ?? "").trim();
  const idx = trimmed.indexOf(STORAGE_PUBLIC_PREFIX);
  if (idx === -1) return trimmed;
  const origin = currentSupabaseOrigin();
  if (!origin) return trimmed;
  return `${origin}${trimmed.slice(idx)}`;
};

export const resolvePhotoUrls = (list: string[] | null | undefined): string[] =>
  (list ?? [])
    .filter((s): s is string => typeof s === "string" && s.trim() !== "")
    .map(resolvePhotoUrl);

// Hôtes Storage que next/image est autorisé à optimiser — à garder aligné avec
// `images.remotePatterns` dans next.config.ts. Une URL hors de cette liste est
// affichée sans passer par l'optimiseur, pour ne jamais faire planter la page
// ("hostname is not configured under images").
const OPTIMIZABLE_STORAGE_HOSTS = [
  "127.0.0.1", // Supabase local
  "localhost",
  "api.entrepreneurbenin.pro", // Supabase auto-hébergé de production
];

const currentSupabaseHostname = (): string | null => {
  const origin = currentSupabaseOrigin();
  return origin ? new URL(origin).hostname : null;
};

export const canOptimizePhoto = (src: string): boolean => {
  if (src.startsWith("/")) return true; // fichiers servis depuis public/
  try {
    const { hostname, pathname } = new URL(src);
    if (hostname === "images.unsplash.com") return true;
    if (!pathname.startsWith(STORAGE_PUBLIC_PREFIX)) return false;
    return (
      hostname === currentSupabaseHostname() ||
      OPTIMIZABLE_STORAGE_HOSTS.includes(hostname) ||
      hostname.endsWith(".supabase.co")
    );
  } catch {
    return false;
  }
};
