# Site MEB — Maison de l'Entrepreneur du Bénin

Site Next.js 16 (App Router) + Supabase (PostgreSQL, Auth, Storage, Realtime) + e-mails SMTP (MailHog en dev, Resend/SMTP en prod).

Les spécifications backend d'origine sont dans [BACKEND.md](BACKEND.md) — elles sont désormais implémentées.

## Mise en route (développement)

Prérequis : Node 22+, Docker Desktop.

```bash
# 1. Dépendances
npm install

# 2. Variables d'environnement
cp .env.example .env.local   # les valeurs locales par défaut fonctionnent telles quelles

# 3. Supabase local (Postgres + Auth + Storage + Realtime + Studio)
npm run db:start             # applique les migrations et le seed automatiquement

# 4. MailHog (boîte mail de test) — interface : http://localhost:8025
npm run mail:start

# 5. Premier compte administrateur
npm run admin:create -- admin@entrepreneurbenin.pro MotDePasseSolide1 "Admin MEB"

# 6. Serveur de développement
npm run dev
```

- Site : http://localhost:3000 · Dashboard : http://localhost:3000/dashboard
- Supabase Studio : http://localhost:54323 · MailHog : http://localhost:8025

## Architecture backend

| Élément | Emplacement |
|---|---|
| Schéma SQL, RLS, RPC places, bucket | `supabase/migrations/` + `supabase/seed.sql` |
| Clients Supabase (navigateur / serveur / service_role) | `src/lib/supabase/` |
| E-mails (transport SMTP + templates) | `src/lib/mailer.ts`, `src/lib/emails.ts` |
| Schémas Zod partagés client/serveur | `src/lib/schemas.ts` |
| Routes formulaires | `src/app/api/rdv`, `api/event-registration`, `api/newsletter` |
| Upload photos (Supabase Storage) | `src/app/api/upload` |
| Gestion des administrateurs (invitations) | `src/app/api/admin/admins` |
| Protection de session (Next 16 proxy) | `src/proxy.ts` |
| Couche de données du front | `src/utils/storage.ts` (async, Supabase + Realtime) |

### Fonctionnement des invitations admin

Depuis l'onglet **Administrateurs** du dashboard, un admin saisit l'e-mail d'un
collègue. Celui-ci reçoit un lien personnel (`/dashboard/definir-mot-de-passe`)
où il choisit son propre mot de passe ; le compte n'est actif qu'après cette étape.
Les invitations en attente peuvent être renvoyées ou révoquées.

### Inscriptions aux événements

La RPC Postgres `register_for_event` décrémente les places de façon atomique :
deux inscriptions simultanées sur la dernière place sont départagées par la base.
Événement complet → réponse 409 affichée à l'utilisateur.

## Passage en production

1. Créer un projet sur [supabase.com](https://supabase.com) puis :
   `npx supabase link --project-ref <ref>` et `npx supabase db push`.
2. Renseigner dans l'hébergeur (Vercel...) les variables de `.env.example` :
   clés du projet Supabase hébergé + SMTP réel (ex. Resend : `smtp.resend.com`,
   port 465, user `resend`, mot de passe = clé API, domaine expéditeur vérifié).
3. Créer le premier admin : `npm run admin:create -- <email> <mot_de_passe> "<nom>"`
   (avec les variables de prod dans l'environnement).
4. `NEXT_PUBLIC_SITE_URL` = URL publique du site (liens des e-mails).

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run db:start` / `db:stop` / `db:reset` | Stack Supabase locale |
| `npm run mail:start` | MailHog |
| `npm run admin:create -- <email> <mdp> [nom]` | Créer/réinitialiser un admin |
