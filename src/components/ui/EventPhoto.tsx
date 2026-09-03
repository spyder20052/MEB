"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageBroken } from "@phosphor-icons/react";
import { canOptimizePhoto, resolvePhotoUrl } from "@/lib/photos";

// Photo d'événement (carte, galerie de récap, aperçu dashboard) qui ne casse
// jamais la mise en page :
//   1. next/image optimisé (comportement normal) ;
//   2. si l'optimiseur échoue (hôte injoignable côté serveur, fichier refusé),
//      on retente l'image brute directement depuis le navigateur ;
//   3. si elle échoue encore, une tuile neutre "Photo indisponible" remplace
//      l'image, ou rien du tout quand la photo n'est qu'un fond décoratif.
// Le parent doit être positionné (relative/absolute) avec une taille : l'image
// le remplit (`fill`).

type Stage = "optimized" | "raw" | "failed";

type EventPhotoProps = {
  src?: string | null;
  alt: string;
  sizes?: string;
  className?: string;
  /** "placeholder" : tuile neutre ; "none" : rien, le fond du parent reste visible. */
  fallback?: "placeholder" | "none";
  /** Saute l'optimiseur Next dès le départ (aperçus du dashboard). */
  unoptimized?: boolean;
  /** Photo purement décorative : alt vide et masquée des lecteurs d'écran. */
  decorative?: boolean;
  priority?: boolean;
};

export function EventPhoto({
  src,
  alt,
  sizes,
  className = "",
  fallback = "placeholder",
  unoptimized = false,
  decorative = false,
  priority = false,
}: EventPhotoProps) {
  const url = src ? resolvePhotoUrl(src) : "";
  const initialStage: Stage = !url
    ? "failed"
    : unoptimized || !canOptimizePhoto(url)
      ? "raw"
      : "optimized";

  const [trackedUrl, setTrackedUrl] = useState(url);
  const [stage, setStage] = useState<Stage>(initialStage);

  // Nouvelle source (photo remplacée depuis le dashboard) : on repart de zéro.
  if (trackedUrl !== url) {
    setTrackedUrl(url);
    setStage(initialStage);
  }

  if (stage === "failed") {
    if (fallback === "none") return null;
    return (
      <div
        role="img"
        aria-label={`${alt || "Photo"} (indisponible)`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#E8F5EE] text-[#555555]"
      >
        <ImageBroken size={24} weight="regular" className="text-[#00B140]/70" aria-hidden="true" />
        <span className="font-mono text-[9px] uppercase tracking-wider text-center leading-tight px-2">
          Photo indisponible
        </span>
      </div>
    );
  }

  return (
    <Image
      // Remonte l'élément à chaque bascule pour relancer le chargement.
      key={`${stage}:${url}`}
      src={url}
      alt={decorative ? "" : alt}
      aria-hidden={decorative ? "true" : undefined}
      fill
      sizes={sizes}
      unoptimized={stage === "raw"}
      priority={priority}
      className={className}
      onError={() => setStage((current) => (current === "optimized" ? "raw" : "failed"))}
    />
  );
}
