# Guide de Développement IA - Projet MEB (Maison de l'Entrepreneur du Bénin)

Ce document centralise toutes les spécifications architecturales, techniques, graphiques et éditoriales du projet **Site Web MEB**. Il sert de référence absolue (Single Source of Truth) pour toutes les tâches de génération de code, de modification, d'optimisation et d'ajout de fonctionnalités sur le site.

---

## 0. Identité & Rôle de l'Assistant IA (Antigravity)

**Mon Rôle :**
Je suis un agent IA de pointe spécialisé en développement Full-Stack et conception UI/UX premium (Advanced Agentic Coding). Je suis officiellement désigné comme le **Lead Developer et Intégrateur** responsable de la réalisation du site de la Maison de l'Entrepreneur du Bénin.

**Mon Expertise (Pourquoi je suis le plus compétent pour ce projet) :**
1. **Maîtrise absolue de la Stack Moderne :** J'ai une expertise technique avancée sur Next.js 14+ (App Router), Tailwind CSS et Supabase, me permettant de bâtir une architecture robuste, rapide et sécurisée dès le premier octet.
2. **Sensibilité "Premium" & UI/UX :** Je comprends profondément comment traduire une charte graphique (Vert MEB, polices Poppins/Inter) en expériences web premium. Je maîtrise Framer Motion pour inclure des micro-interactions qui modernisent l'interface et apportent l'énergie de l'action demandée par le CDC.
3. **Accessibilité et Mobile-First gravés dans le code :** Ayant intégré que 80% de la cible navigue sur smartphone au Bénin, mon code est par définition "Mobile-First" et respecte de façon innée les critères WCAG AA (Navigation clavier, contrastes, balises sémantiques).
4. **Respect rigoureux du périmètre :** J'assimile instantanément le besoin de vulgarisation (tutoiement, phrases courtes) et me calque strictement sur les personas cibles. Ma programmation algorithmique m'assure de ne jamais dévier de cette Source Unique de Vérité.

*Je m'appuie intégralement sur ce fichier `CLAUDE.md` pour garantir une conformité de 100% avec les exigences de la MEB.*

---

## 1. Contexte & Vision Globale

*   **Identité** : La MEB (Maison de l'Entrepreneur du Bénin) est le premier hub entrepreneurial (physique et digital) du Bénin, s'inscrivant dans la vision "Cotonou 2030".
*   **Mission** : Fédérer l'écosystème, accompagner de l'idée à la croissance, aider à la formalisation (80% des cibles sont dans l'informel) et connecter avec les PTF (Partenaires Techniques et Financiers).
*   **Objectifs du site** :
    *   Conversion : Générer des prises de RDV qualifiées.
    *   Inclusion : Rassurer et orienter l'entrepreneur informel ou débutant.
    *   Crédibilité : Convaincre les acteurs institutionnels et les sponsors.

---

## 2. Stack Technologique

*   **Framework Frontend** : Next.js 14+ (App Router, Server-Side Rendering / Static Site Generation)
*   **Styling** : Tailwind CSS
*   **Composants / Animations** : Framer Motion (Transitions, Scroll Count-up, Micro-interactions)
*   **Base de données & Auth** : Supabase (PostgreSQL + Supabase Auth)
*   **Gestion des Formulaires** : React Hook Form + Zod (Validation stricte côté client ET serveur)
*   **Icônes** : Phosphor Icons (Regular ou Bold uniformément)
*   **CMS (Prévu)** : Sanity.io ou Directus
*   **Services Tiers** : Luma (Événements), Cal.com (RDV), Resend/Sendgrid (Emails)

---

## 3. Direction Artistique (DA) - Règles Strictes

⚠️ **AVERTISSEMENT** : Aucune déviation de la palette ou de la typographie n'est autorisée.

### Palette de Couleurs (HEX)
*   **Vert Primaire** : `#00B140` (Boutons, Liens, Icônes, Accents)
*   **Vert Électrique** : `#00D94F` (Hover, Animations)
*   **Vert Pâle** : `#E8F5EE` (Fonds de section, Cartes)
*   **Navy Dark** : `#0D1B2A` (Header/Footer, Titres, Fonds sombres)
*   **Jaune / Or** : `#F5C518` (Badges, Accents secondaires)
*   **Rouge Accent** : `#E63946` (Erreurs formulaires, Alertes - Pas de suremploi)
*   **Neutres** : Blanc `#FFFFFF` (Fonds), Gris Clair `#F5F5F5` (Fonds alternatifs), Gris Moyen `#CCCCCC` (Bordures), Gris Texte `#555555` (Texte secondaire), Noir Texte `#1A1A2E` (Texte principal).

### Typographie
*   **Titres (H1-H4), Boutons, Labels** : **Poppins** (Bold 700, SemiBold 600, Medium 500)
*   **Corps de texte** : **Inter** (Regular 400, Medium 500)
*   **Données tarifaires / Code** : **IBM Plex Mono** (Ex: `10 000 FCFA`)

### UI Components & Spacing (Base 8px)
*   **Cartes (Cards)** : Fond blanc, `border-radius: 12-16px`, `box-shadow: 0 4px 20px rgba(0,0,0,0.07)`. Padding (24px Desktop / 16px Mobile). Hover : `translateY(-4px)`.
*   **Boutons (CTA)** :
    *   *Primaire* : Fond `#00B140`, Texte Blanc, `border-radius: 8px`, `padding: 14px 28px`.
    *   *Secondaire* : Transparent, `border: 2px solid #00B140`, Texte `#00B140`.
*   **Formulaires** : Labels TOUJOURS visibles. Focus : `border: 2px solid #00B140` + glow `rgba(0,177,64,0.2)`. Border-radius : `8px`. Hauteur minimale input : `48px`. Accessibilité clavier (Tab+Enter) obligatoire.
*   **Images** : Uniquement entrepreneurs ouest-africains/béninois. Pas de stock générique caucasien. Format WebP optimisé via `next/image`.

---

## 4. Architecture de l'Application

### Espace Public (Navigation principale)
*   `/` : Accueil (Hero interactif, Piliers, Impact count-up, Témoignages slider)
*   `/pourquoi` : La problématique et la vision MEB
*   `/comment` : Parcours utilisateur (Boussole > Réseau > Fusée)
*   `/services` : Catalogue tarifaire (Positionnement, Orientation, Assistance RDV, Info, Analyse)
*   `/evenements` : Calendrier (JPO, Petit-Dej', Mastermind)
*   `/communaute` : Offres membres, institutions, sponsors
*   `/a-propos` : Mission, Équipe, CSA, Impact
*   `/prendre-rdv` : **Page CTA Majeure.** Formulaire Wizard 2 étapes optimisé.
*   `/temoignages`, `/ressources`, `/contact`, `/faq`, `/mentions-legales`

### Espace Membre (Authentifié)
*   `/espace-membre` : Dashboard
*   `/espace-membre/profil`, `/espace-membre/ressources`, `/espace-membre/wall-of-needs` (Je cherche/Je propose), `/espace-membre/mes-rdv`, `/espace-membre/evenements`

### Composants Transversaux
*   **Bouton WhatsApp Flottant** : Présent sur toutes les pages. Pré-rempli avec intention.
*   **Notification RDV / Email** : Intégrations backend pour confirmation systématique.
*   **Wall of Needs Banner** : Défilement dynamique sur la homepage.

---

## 5. Ligne Éditoriale (Ton & Voix)
*   **Tutoiement** : Pour les entrepreneurs (Persona 1, 2, 3 : "Ta maison. Ton réseau.").
*   **Vouvoiement** : Strictement réservé aux institutions, PTF, et investisseurs.
*   **Style** : Phrases courtes (max 20 mots), dynamique, concret, orienté solution et bénéfice utilisateur. Pas de formules lourdes ("Afin d'optimiser...").
*   **Accessibilité textuelle** : Ton bienveillant, décomplexé vis-à-vis du secteur informel ("Tu as ta place ici. L'informel, c'est notre cœur de cible.").

---

## 6. Accessibilité & Standards SEO/Perf

### Accessibilité (WCAG AA)
*   Contraste vérifié : ratio 4.5:1 minimum pour le texte. (Ex: Pas de rouge sur fond vert).
*   Navigation clavier complète (`Tab`, `Enter`). Outline focus vert 3px toujours actif/visible.
*   Balises `alt` obligatoires et descriptives sur les images.
*   Attributs `aria` indispensables sur les popups, modales, et menus.

### SEO
*   Métadonnées uniques (Title + Description) générées par page.
*   Hiérarchie Sémantique Stricte : Un seul `H1` par page (Titre principal), puis `H2` `H3`.
*   URLs "propres" SEO-friendly en français.
*   Open Graph dynamique sur toutes les pages. JSON-LD implanté pour le SEO Local et Événements.

### Performance (Vitales)
*   **Mobile-First** : Intégration toujours pensée d'abord pour Breakpoint 320px, puis scale-up. L'utilisateur béninois est à +80% sur mobile.
*   Score PageSpeed visé : Mobile > 80, Desktop > 90.
*   LCP < 2.5s. TTFB < 600ms.

---

## 🤖 Instructions Directes pour l'Assistant IA (Modifications Futures)

1.  **Génération de code Tailwind** : Tu **DOIS** utiliser exclusivement les codes couleurs HEX de la MEB documentés ci-dessus (et les inclure/les vérifier dans `tailwind.config.ts`).
2.  **Animations** : Intègre **Framer Motion** judicieusement (fade-in, slide-up, count-up) pour garantir le positionnement "Startup chaleureuse mais premium". Pas d'animation excessive, mais un ressenti fluide.
3.  **Composants** : Privilégie la création de composants réutilisables (Ex: `Button.tsx`, `ServiceCard.tsx`, `SectionHeading.tsx`).
4.  **Formulaires** : Lorsque tu implémentes `/prendre-rdv` ou tout autre formulaire, génère le code avec une validation Zod robuste et gère parfaitement les UI States (Erreur en rouge, Succès en vert, Loading spinners).
5.  **Vérification systématique** : Avant de proposer un composant, demande-toi : *Est-ce mobile-first ? Le focus est-il géré ? Le contraste est-il respecté ?*
