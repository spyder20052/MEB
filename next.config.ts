import type { NextConfig } from "next";

// Hôte Supabase de l'environnement courant : 127.0.0.1:54321 en local,
// https://api.entrepreneurbenin.pro en production (injecté en build-arg par le
// Dockerfile). Ses photos Storage doivent pouvoir passer par l'optimiseur
// next/image, quel que soit l'hébergement choisi.
const currentSupabaseStoragePattern = (() => {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;
  try {
    const { protocol, hostname, port } = new URL(raw);
    if (protocol !== "http:" && protocol !== "https:") return null;
    return {
      protocol: protocol.slice(0, -1) as "http" | "https",
      hostname,
      ...(port ? { port } : {}),
      pathname: "/storage/v1/object/public/**",
    };
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Next 16 refuse d'optimiser une image dont l'hôte résout vers une IP privée
    // ou loopback (protection SSRF) : sans cette exception, chaque photo servie
    // par le Supabase local (127.0.0.1:54321) répondait 400 et s'affichait
    // cassée. Activée en développement seulement ; en production les photos
    // viennent d'un hôte public et la protection reste entière.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    // Hôtes autorisés pour next/image. À garder aligné avec canOptimizePhoto()
    // dans src/lib/photos.ts (qui évite l'optimiseur pour tout autre hôte).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Supabase Storage local (photos d'événements en développement),
      // accessible indifféremment via 127.0.0.1 ou localhost.
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "54321",
        pathname: "/storage/v1/object/public/**",
      },
      // Supabase auto-hébergé de production (deploy/nginx, supabase/self-host).
      {
        protocol: "https",
        hostname: "api.entrepreneurbenin.pro",
        pathname: "/storage/v1/object/public/**",
      },
      // Supabase hébergé sur supabase.com : <ref>.supabase.co et le nouvel hôte
      // dédié <ref>.storage.supabase.co.
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Et, quoi qu'il arrive, l'hôte réellement configuré pour ce build.
      ...(currentSupabaseStoragePattern ? [currentSupabaseStoragePattern] : []),
    ],
  },
};

export default nextConfig;
