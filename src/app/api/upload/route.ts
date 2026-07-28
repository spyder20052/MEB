import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Formats acceptés et poids maximum par photo (5 Mo).
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024;

const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "events");

// Nettoie le nom d'origine pour éviter tout chemin traversant ou caractère exotique.
const slugify = (filename: string) => {
  const ext = path.extname(filename).toLowerCase();
  const base = path
    .basename(filename, ext)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60);
  return { base: base || "photo", ext: ext || ".jpg" };
};

export async function POST(req: NextRequest) {
  try {
    // Un corps vide ou mal formé fait échouer formData() : on renvoie un message clair.
    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }

    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

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
      await writeFile(path.join(UPLOAD_DIR, unique), buffer);

      paths.push(`/images/events/${unique}`);
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
