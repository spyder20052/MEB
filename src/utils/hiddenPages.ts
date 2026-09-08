/**
 * Lecture des pages masquées sans le client Supabase.
 *
 * `getHiddenPages()` vivait dans `storage.ts`, qui importe
 * `@supabase/ssr` : la Navbar et le Footer tiraient donc tout le client
 * (auth + realtime + storage, ~240 Ko de JS) sur CHAQUE page, pour lire
 * une seule colonne publique.
 *
 * Ici on interroge directement l'API REST avec `fetch` : même endpoint,
 * même table, même clé anon — sans la bibliothèque.
 */

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Navbar, Footer et le garde-fou de page demandent tous la meme liste au
// meme instant : sans mise en commun, c'est trois requetes identiques par
// page, et autant de nouvelles a chaque echec.
let cache: { at: number; value: string[] } | null = null;
let inflight: Promise<string[]> | null = null;
const TTL = 60_000;

// `fresh` ignore le cache : rendu serveur d'une page à la demande, ou
// notification temps réel (le masquage vient de changer, la valeur en cache
// est justement celle qu'il faut oublier).
export async function getHiddenPagesLite(opts: { fresh?: boolean } = {}): Promise<string[]> {
  if (!URL_BASE || !ANON_KEY) return [];

  if (!opts.fresh) {
    if (cache && Date.now() - cache.at < TTL) return cache.value;
    if (inflight) return inflight;
  }

  inflight = fetchHiddenPages(opts.fresh ?? false).then((value) => {
    // On memorise aussi les echecs (liste vide) : sinon chaque composant
    // relance sa propre requete tant que la base ne repond pas.
    cache = { at: Date.now(), value };
    inflight = null;
    return value;
  });
  return inflight;
}

async function fetchHiddenPages(fresh: boolean): Promise<string[]> {
  if (!URL_BASE || !ANON_KEY) return [];
  try {
    const res = await fetch(
      `${URL_BASE}/rest/v1/site_settings?select=hidden_pages&id=eq.1`,
      {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
          Accept: "application/json",
        },
        // Le masquage change rarement : on tolère 60 s de cache, sauf quand
        // l'appelant exige la valeur du moment.
        ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 60 } }),
        signal: AbortSignal.timeout(6_000),
      }
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as { hidden_pages?: string[] }[];
    return rows?.[0]?.hidden_pages ?? [];
  } catch {
    // Base injoignable : on n'empêche jamais le rendu du site.
    return [];
  }
}
