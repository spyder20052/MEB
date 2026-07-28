// Crée (ou réinitialise) un compte administrateur Supabase Auth.
// Usage : node scripts/create-admin.mjs <email> <mot_de_passe> [nom]
// Les variables NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY
// sont lues depuis l'environnement ou .env.local.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// Chargement minimal de .env.local si les variables ne sont pas déjà posées.
try {
  const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of env.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^"|"$/g, "");
    }
  }
} catch {
  // pas de .env.local : les variables doivent venir de l'environnement
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const [email, password, name] = process.argv.slice(2);

if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis.");
  process.exit(1);
}
if (!email || !password) {
  console.error("Usage : node scripts/create-admin.mjs <email> <mot_de_passe> [nom]");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Le mot de passe doit contenir au moins 8 caractères.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: existing } = await supabase.auth.admin.listUsers({ perPage: 200 });
const existingUser = existing?.users.find(
  (u) => u.email?.toLowerCase() === email.toLowerCase()
);

if (existingUser) {
  const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
    password,
    email_confirm: true,
    user_metadata: name ? { name } : undefined,
  });
  if (error) {
    console.error("Échec de la mise à jour :", error.message);
    process.exit(1);
  }
  console.log(`✔ Mot de passe réinitialisé pour ${email}`);
} else {
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: name ? { name } : undefined,
  });
  if (error) {
    console.error("Échec de la création :", error.message);
    process.exit(1);
  }
  console.log(`✔ Administrateur créé : ${email}`);
}
