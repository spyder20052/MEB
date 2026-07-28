import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

// POST /api/upload — envoi de photos vers Supabase Storage (bucket "event-photos").
// Le contrat d'entrée/sortie est identique à l'ancienne version disque
// (BACKEND.md §5) : le frontend n'a rien à changer.

// Formats acceptés et poids maximum par photo (5 Mo).
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024;
const BUCKET = "event-photos";

// Nettoie le nom d'origine pour éviter tout chemin traversant ou caractère exotique.
const slugify = (filename: string) => {
  const dot = filename.lastIndexOf(".");
  const rawExt = dot >= 0 ? filename.slice(dot).toLowerCase() : "";
  const rawBase = dot >= 0 ? filename.slice(0, dot) : filename;
  const base = rawBase
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60);
  const ext = /^\.[a-z0-9]+$/.test(rawExt) ? rawExt : ".jpg";
  return { base: base || "photo", ext };
};

export async function POST(req: NextRequest) {
  try {
    // Écriture réservée aux administrateurs connectés.
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Session expirée. Reconnecte-toi au dashboard." },
        { status: 401 }
      );
    }

    // Un corps vide ou mal formé fait échouer formData() : on renvoie un message clair.
    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }

    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const paths: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name} : format non supporté (JPG, PNG, WebP ou AVIF attendu).`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        errors.push(`${file.name} : fichier trop lourd (5 Mo maximum).`);
        continue;
      }

      const { base, ext } = slugify(file.name);
      // Suffixe unique pour ne jamais écraser une photo déjà en ligne.
      const unique = `${base}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(unique, buffer, { contentType: file.type, upsert: false });

      if (uploadError) {
        console.error("[upload] storage:", uploadError.message);
        errors.push(`${file.name} : l'envoi a échoué.`);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(unique);
      paths.push(publicUrl);
    }

    if (paths.length === 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    return NextResponse.json({ paths, errors });
  } catch (err) {
    console.error("[upload] échec:", err);
    return NextResponse.json(
      { error: "L'envoi a échoué. Réessaie." },
      { status: 500 }
    );
  }
}
