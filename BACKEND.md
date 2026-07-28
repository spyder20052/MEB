# Spécifications Backend — Site MEB

Document destiné au développeur backend.
État du dépôt à la date de rédaction : **frontend complet, backend inexistant**.

---

## 1. Résumé en une page

Le site est un **Next.js 16 (App Router)** entièrement fonctionnel côté interface.
Aucune donnée n'est persistée sur un serveur. Trois manques bloquent la mise en production :

| # | Manque | Conséquence aujourd'hui |
|---|--------|-------------------------|
| 1 | **Aucune base de données** | Événements, projets, récaps et réglages vivent dans le `localStorage` du navigateur de l'admin. Un visiteur ne voit jamais ces modifications. |
| 2 | **Upload sur disque local** | `/api/upload` écrit dans `public/images/events/`. Échoue sur Vercel (FS en lecture seule), effacé à chaque redéploiement ailleurs. |
| 3 | **Aucun envoi d'e-mail** | Les **trois** formulaires du site simulent l'envoi. Toutes les saisies des visiteurs sont **définitivement perdues** (détail en §6). |

Stack cible, déjà prévue au CDC : **Supabase** (PostgreSQL + Storage) et **Resend** (e-mails).

---

## 2. Ce qui existe déjà

### Pages publiques
`/` · `/pourquoi` · `/comment` · `/services` · `/evenements` · `/communaute`
`/a-propos` · `/prendre-rdv` · `/projets` · `/collaborateurs` · `/faq`

### Dashboard admin — `/dashboard`
Quatre onglets fonctionnels côté interface :
- **Pages** — masquer/afficher une page du site
- **Événements MEB** — créer, modifier, masquer, supprimer ; 5 modèles de carte ; upload photos ; bloc récap d'après-événement
- **Projets** — créer, modifier, masquer
- **Sécurité** — changer le code d'accès

### Route API existante
`POST /api/upload` — [src/app/api/upload/route.ts](src/app/api/upload/route.ts)
Valide le type (JPG/PNG/WebP/AVIF), la taille (5 Mo), nettoie le nom de fichier, écrit sur disque.
**À réécrire** vers Supabase Storage en conservant strictement son contrat d'entrée/sortie (voir §5).

---

## 3. Authentification admin — À REFAIRE EN PRIORITÉ

### État actuel — non sécurisé

Fichier : [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx)

```ts
if (inputCode.trim() === adminCode.trim()) {
  sessionStorage.setItem("meb_admin_logged_in", "true");
}
```

Trois failles, à traiter comme bloquantes :

1. **Le code est en clair dans le bundle JavaScript** — visible par n'importe qui via les outils développeur. Valeur par défaut : `1234`.
2. **La session est un simple booléen dans `sessionStorage`** — se falsifie en une ligne dans la console du navigateur.
3. **Aucune vérification côté serveur** — l'API d'upload accepte n'importe quel appel, sans authentification.

⚠️ **Le dashboard ne doit pas être mis en ligne en l'état.**

### Cible

- **Supabase Auth**, e-mail + mot de passe, un seul compte administrateur (ou plusieurs si la MEB le souhaite).
- Middleware Next.js protégeant `/dashboard` et toutes les routes `/api/*` d'écriture.
- **RLS (Row Level Security)** sur toutes les tables : lecture publique restreinte aux contenus publiés, écriture réservée aux comptes authentifiés.

### Nettoyage à faire

Dans [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx), une ligne force le code sur `1234` à chaque chargement :

```ts
// Réinitialisation du code d'accès sur "1234" au chargement
saveAdminCode("1234");
```

Ajoutée en dépannage pendant le développement. **À supprimer**, ainsi que `getAdminCode` / `saveAdminCode` dans [src/utils/storage.ts](src/utils/storage.ts).

---

## 4. Base de données

Aujourd'hui, tout passe par [src/utils/storage.ts](src/utils/storage.ts) → `localStorage`.
Chaque fonction de ce fichier doit être remplacée par un appel Supabase, **en conservant les mêmes signatures** pour que les composants n'aient pas à être réécrits.

### Table `events`

Type source : `EventItem` dans [src/utils/storage.ts](src/utils/storage.ts)

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `num` | text unique | `"01"`–`"04"` = les 4 récurrents ; timestamp pour les créations |
| `title` | text | |
| `tag` | text | ex. « Événement Public » |
| `date_str` | text | date affichée, ex. « Jeudi 2 Juillet 2026 » |
| `recurring_str` | text | ex. « Chaque 1er Jeudi du Mois » |
| `time` | text | ex. « 09:00 - 13:00 » |
| `venue` | text | |
| `desc` | text | |
| `seats` | int | places restantes |
| `date_raw` | timestamptz | date réelle, sert au tri et au filtrage |
| `is_hidden` | bool | défaut `false` |
| `template_style` | text | `"01"`…`"05"` — 05 = photo plein cadre |
| `card_photo` | text | URL de la photo de carte (template 05), choisie à la création |
| `recap_published` | bool | défaut `false` |
| `recap_text` | text | résumé / rapport d'activité |
| `recap_photos` | text[] | URLs de la galerie |
| `recap_attendees` | int | participants réellement présents |
| `recap_date_str` | text | date de l'édition passée |

Valeurs initiales à insérer : `DEFAULT_EVENTS` dans [src/utils/storage.ts](src/utils/storage.ts).

> **Distinction importante à préserver.** `card_photo` est l'illustration choisie **avant** l'événement (template 05). `recap_photos` sont les photos ajoutées **après**. Les deux ne doivent pas être fusionnés : ajouter un récap ne doit pas changer l'illustration de la carte.

### Table `projects`

Type source : `ProjectItem`

| Colonne | Type |
|---|---|
| `id` | uuid PK |
| `title` | text |
| `sector` | text |
| `desc` | text |
| `image` | text |
| `bg_color` | text |
| `tag_color` | text |
| `is_hidden` | bool |

### Table `site_settings`

Remplace la clé `meb_hidden_pages`. Un enregistrement, ou une table clé/valeur.

| Colonne | Type |
|---|---|
| `hidden_pages` | text[] |

### Table `rdv_requests` — à créer

Reçoit les demandes du formulaire `/prendre-rdv`. Voir §6.

| Colonne | Type |
|---|---|
| `id` | uuid PK |
| `full_name` | text |
| `whatsapp` | text |
| `email` | text nullable |
| `service` | text |
| `project_description` | text nullable |
| `newsletter` | bool |
| `created_at` | timestamptz |
| `status` | text — `nouveau` / `traité` |

### Table `event_registrations` — à créer

Reçoit les inscriptions depuis la modale de `/evenements`.

| Colonne | Type |
|---|---|
| `id` | uuid PK |
| `event_num` | text FK → `events.num` |
| `name` | text |
| `whatsapp` | text |
| `email` | text |
| `created_at` | timestamptz |

> À décider avec la MEB : faut-il décrémenter `events.seats` à chaque inscription ? Le frontend affiche « N PLACES RESTANTES » mais rien ne décompte aujourd'hui. Voir §6.2.

### Table `newsletter_subscribers` — à créer

Alimentée par le pied de page et par la case à cocher du formulaire RDV.

| Colonne | Type |
|---|---|
| `id` | uuid PK |
| `email` | text unique |
| `source` | text — `footer` / `rdv` |
| `confirmed` | bool |
| `created_at` | timestamptz |

### Synchronisation temps réel

Le frontend écoute déjà un événement navigateur pour se rafraîchir sans rechargement :

```ts
window.dispatchEvent(new Event("meb_settings_updated"));
```

Émis par `saveEvents` et `saveHiddenPages` dans [src/utils/storage.ts](src/utils/storage.ts), écouté par [src/app/evenements/page.tsx](src/app/evenements/page.tsx) et [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx).
À conserver, ou à remplacer par **Supabase Realtime** pour que les visiteurs voient les changements en direct.

---

## 5. Upload de fichiers

### État actuel

[src/app/api/upload/route.ts](src/app/api/upload/route.ts) écrit dans `public/images/events/` via `fs.writeFile`.

Sur **Vercel**, le système de fichiers est en lecture seule : l'upload échouera à l'exécution.
Sur un serveur classique, les fichiers sont **perdus à chaque redéploiement**.

### Cible — Supabase Storage

Bucket `event-photos`, lecture publique, écriture réservée aux comptes authentifiés.

**Le contrat de la route doit rester identique** — le frontend n'aura ainsi rien à changer :

```
POST /api/upload
Content-Type: multipart/form-data
Champ : "files" (un ou plusieurs)

→ 200 { "paths": ["https://...", ...], "errors": [] }
→ 400 { "error": "message lisible en français" }
```

Règles déjà implémentées, à conserver :
- types acceptés : `image/jpeg`, `image/png`, `image/webp`, `image/avif`
- taille maximale : **5 Mo** par fichier
- nom de fichier nettoyé (accents et caractères de chemin retirés) + suffixe unique
- un fichier refusé n'interrompt pas les autres : il est signalé dans `errors`

**À ajouter :** vérification de la session admin avant toute écriture.

### Points d'appel côté frontend

Trois handlers dans [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx) — aucun ne changera si le contrat est respecté :
- `handleUploadPhotos` — galerie récap d'un événement existant
- `handleUploadNewEventPhotos` — photo choisie pendant la création (template 05)
- `handleUploadCardPhoto` — remplacement de la photo de carte

### Optimisation recommandée

Les photos sont envoyées à leur taille d'origine (un test récent : 1,8 Mo pour une capture d'écran).
**80 % de la cible MEB navigue sur mobile**, souvent en connexion limitée.
Prévoir une compression et une génération de miniatures à l'upload — Supabase Storage propose des transformations d'image à la volée.

---

## 6. Formulaires et e-mails — LE MANQUE LE PLUS GRAVE

> Point explicitement demandé par la MEB.
> **Aucun e-mail n'est envoyé. Aucune saisie n'est enregistrée. Tout est perdu.**

Le site compte **trois formulaires**. Les trois affichent un message de succès sans que personne ne reçoive quoi que ce soit. La conversion en prises de RDV étant l'objectif n°1 du cahier des charges, c'est le chantier prioritaire.

| # | Formulaire | Emplacement | État |
|---|---|---|---|
| 1 | Prise de RDV | `/prendre-rdv` | `setTimeout(1500)` puis faux succès |
| 2 | Inscription à un événement | modale sur `/evenements` | `setTimeout(1200)` puis faux succès |
| 3 | Newsletter | pied de page, toutes les pages | champ décoratif, aucun code |

---

### 6.1 — Formulaire de prise de RDV

Fichier : [src/app/prendre-rdv/page.tsx](src/app/prendre-rdv/page.tsx)

```ts
const onSubmit = async (data: RdvFormData) => {
  setIsSubmitting(true);
  await new Promise((resolve) => setTimeout(resolve, 1500)); // ← simulation
  setIsSubmitting(false);
  setSubmitSuccess(true); // ← succès mensonger
};
```

**Champs** — validation Zod déjà en place, à réutiliser telle quelle côté serveur :

| Champ | Type | Obligatoire | Règle |
|---|---|---|---|
| `fullName` | string | oui | ≥ 2 caractères |
| `whatsapp` | string | oui | ≥ 8 chiffres |
| `service` | string | oui | choix dans une liste |
| `email` | string | non | format e-mail si renseigné |
| `projectDescription` | string | non | |
| `newsletter` | bool | — | consentement newsletter |

**Route à créer : `POST /api/rdv`**

1. Revalider avec le **même schéma Zod** — ne jamais faire confiance au client.
2. Enregistrer dans `rdv_requests`.
3. Envoyer deux e-mails via Resend :
   - **À la MEB** → `contact@entrepreneurbenin.pro`, avec le numéro WhatsApp bien visible : c'est le canal de rappel annoncé à l'utilisateur.
   - **À l'utilisateur**, si un e-mail est fourni — accusé de réception, tutoiement conforme à la ligne éditoriale.
4. Si `newsletter` est coché, inscrire l'adresse à la liste de diffusion.
5. Répondre `{ ok: true }` ou `{ error: "..." }`.

---

### 6.2 — Inscription à un événement

Fichier : [src/app/evenements/page.tsx](src/app/evenements/page.tsx) — modale ouverte au clic sur une carte.

```ts
setIsSubmitting(true);
setTimeout(() => {
  setIsSubmitting(false);
  setSubmitSuccess(true); // ← succès mensonger
}, 1200);
```

**Ce que voit l'utilisateur.** La modale affiche l'événement (titre, date, horaires, lieu), puis demande nom complet, WhatsApp et e-mail optionnel. Sous le bouton **« Confirmer l'inscription »** : *« Gratuit. Confirmation immédiate. »*

Après validation, un message annonce :

> « Un récapitulatif a été enregistré et nous te recontactons sous 24h par WhatsApp au [numéro] pour la confirmation finale. »

**Trois promesses explicites, aucune tenue.** Rien n'est enregistré, aucune confirmation n'est envoyée, et personne à la MEB ne reçoit le numéro à rappeler. Un entrepreneur qui s'inscrit à un Mastermind se présentera à un événement dont la MEB ignore qu'il vient — ou, plus probablement, ne viendra jamais et gardera une mauvaise impression de la maison.

**Champs**

| Champ | Type | Obligatoire |
|---|---|---|
| `name` | string | oui |
| `whatsapp` | string | oui |
| `email` | string | non |
| `eventNum` | string | oui — `num` de l'événement concerné |

**Route à créer : `POST /api/event-registration`**

1. Valider les champs, vérifier que l'événement existe et n'est pas masqué.
2. Enregistrer dans `event_registrations`.
3. Envoyer deux e-mails :
   - **À la MEB** — nom de l'événement, date, coordonnées de l'inscrit, WhatsApp en évidence.
   - **À l'inscrit**, si un e-mail est fourni — confirmation avec le rappel de la date, de l'heure et du lieu.
4. Décider du sort de `events.seats` (voir ci-dessous).

**Décisions à prendre avec la MEB :**

- **Le compteur de places.** La carte affiche « N PLACES RESTANTES » mais rien ne décompte. Faut-il décrémenter à chaque inscription, et refuser les inscriptions à zéro place ? Attention à la concurrence : deux inscriptions simultanées sur la dernière place doivent être gérées côté base, pas côté application.
- **La promesse « confirmation immédiate ».** Soit l'e-mail part instantanément et la promesse est tenue, soit le texte doit être revu. Ne pas laisser un message qui annonce plus que ce que le système fait.
- **Le rappel WhatsApp sous 24h.** Annoncé à l'utilisateur. Prévoir au minimum une notification fiable côté MEB, et idéalement un suivi du statut de chaque inscription.

---

### 6.3 — Newsletter du pied de page

Fichier : [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)

Champ e-mail et bouton présents sur **toutes les pages du site**. Le bouton n'a **aucun gestionnaire d'événement** : rien ne se passe au clic, pas même un faux message de succès. Un visiteur qui saisit son adresse croit s'être abonné.

**Route à créer : `POST /api/newsletter`** — valider l'adresse, enregistrer dans une table `newsletter_subscribers` (avec `created_at` et un statut de confirmation), envoyer un e-mail de bienvenue. Prévoir un lien de désinscription dans chaque envoi.

À défaut d'implémentation immédiate, **retirer le champ** plutôt que de laisser un formulaire qui ne fait rien.

---

### 6.4 — Règles communes aux trois routes

**Ne jamais afficher le succès avant la confirmation du serveur.** Côté frontend, remplacer chaque `setTimeout` par l'appel réel et n'afficher le message de réussite que sur réponse positive. En cas d'échec, afficher une erreur en `#E63946` avec un recours utilisable — par exemple le lien WhatsApp direct.

**Adresse de destination** : `contact@entrepreneurbenin.pro`, déjà présente dans [src/app/prendre-rdv/page.tsx](src/app/prendre-rdv/page.tsx) et [src/components/home/ContactCTA.tsx](src/components/home/ContactCTA.tsx). **À confirmer avec la MEB** et à externaliser en variable d'environnement.

**Anti-spam** : les trois formulaires sont publics et sans aucune protection. Prévoir au minimum une limitation de débit par IP, plus un honeypot ou un captcha.

**Données personnelles** : noms, numéros WhatsApp et e-mails sont collectés. Prévoir une politique de conservation, et un lien vers les mentions légales depuis chaque formulaire.

---

## 7. Variables d'environnement

Aucun fichier `.env` dans le dépôt. À créer :

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # serveur uniquement — ne jamais exposer au client

RESEND_API_KEY=
CONTACT_EMAIL_TO=contact@entrepreneurbenin.pro
CONTACT_EMAIL_FROM=             # domaine vérifié chez Resend
```

Ajouter `.env*.local` au `.gitignore`.

---

## 8. Points de vigilance

**`public/` n'est pas ignoré par git.** Les photos déjà envoyées en local partiront dans le dépôt. Une fois Supabase Storage en place, faire le ménage et ignorer `public/images/events/`.

**Une seule question de conception reste ouverte.** Le récap est aujourd'hui rattaché à l'événement lui-même. Or une JPO a lieu chaque mois : si la MEB veut conserver l'historique de **chaque** édition (mars, avril, mai…) plutôt qu'un récap unique écrasé à chaque fois, il faut une table `event_editions` séparée, liée à `events`.
**À trancher avec la MEB avant de figer le schéma** — la migration est bien plus coûteuse ensuite.

**Le compteur de places ne décompte pas.** Le frontend affiche « N PLACES RESTANTES » mais aucune inscription ne le décrémente. Voir §6.2.

**Des promesses sont affichées aux visiteurs sans être tenues** — « Confirmation immédiate », « nous te recontactons sous 24h par WhatsApp ». Soit le backend les honore, soit les textes doivent être revus. Voir §6.2.

**Pas de sitemap ni de `robots.txt`.** Le CDC demande un SEO local soigné (JSON-LD, Open Graph dynamique).

---

## 9. Ordre de travail suggéré

1. **Les trois routes de formulaire** — `/api/rdv`, `/api/event-registration`, `/api/newsletter`. Priorité absolue : chaque jour qui passe, des demandes de RDV et des inscriptions à des événements sont définitivement perdues.
2. **Auth Supabase + protection de `/dashboard`** — bloquant pour la sécurité
3. **Migration `storage.ts` → Supabase** — rend le dashboard réellement utile
4. **Upload → Supabase Storage** — rend les photos persistantes
5. Anti-spam, optimisation des images, SEO technique

Les étapes 1 et 2 peuvent être menées en parallèle. La 4 dépend de la 2 pour l'authentification des écritures.

> **Si une seule chose doit être faite en premier**, c'est l'étape 1. Le reste dégrade l'expérience d'administration ; l'étape 1 fait perdre des clients.

---

## 10. Ce qui ne doit pas être modifié

Le frontend est terminé et validé. Pour éviter les régressions :

- **La charte graphique** — couleurs, typographies et composants sont figés dans [CLAUDE.md](CLAUDE.md). Aucune déviation autorisée.
- **Le contrat de `/api/upload`** — mêmes entrées, mêmes sorties, seule l'implémentation change.
- **Les signatures de [src/utils/storage.ts](src/utils/storage.ts)** — les remplacer par des appels asynchrones à Supabase en conservant les noms de fonctions limite la réécriture des composants (prévoir le passage en `async`).
- **Les schémas Zod existants** — à réutiliser côté serveur plutôt qu'à redéfinir, pour garantir des règles identiques client et serveur.
