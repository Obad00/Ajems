# AJEMS — site officiel

Site de l'Alliance des Jeunes Entrepreneurs de Mermoz-Sacré-Cœur (Dakar) : présentation de l'association,
fiche d'adhésion en 5 étapes avec acceptation du règlement intérieur, et espace d'administration pour le bureau.

- **Stack** : React 19, TypeScript, Vite, Tailwind CSS 4, React Router, React Hook Form, Zod, Lucide, Supabase, Vitest.
- **Deux modes** : `mock` (démonstration, données fictives en mémoire) et `supabase` (production).
- **Données personnelles** : jamais dans le navigateur (`localStorage` / `sessionStorage`), les logs ou le dépôt.

---

## 1. Démarrage local

Prérequis : Node 22 (voir `.nvmrc`).

```bash
nvm use
npm install
cp .env.example .env      # VITE_STORAGE=mock par défaut
npm run dev               # http://localhost:5173
```

En mode `mock` :

- le formulaire fonctionne de bout en bout, sans rien enregistrer durablement (tout disparaît au rechargement) ;
- `/adhesion?simuler-erreur` simule une panne d'envoi ;
- `/admin` : compte de démonstration `bureau@ajems.example` / `demo-ajems-2026` (fictif), 12 fiches fictives ;
- l'accueil affiche des chiffres fictifs avec la mention « démonstration ».

| Script | Rôle |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm run build` | vérification TypeScript + build de production dans `dist/` |
| `npm test` | tests Vitest |
| `npm run lint` | lint (oxlint) |
| `npm run captures` | captures 390 px et 1280 px dans `captures/` (ignoré par git) |
| `npm run build:map` | régénère `src/assets/mermoz-map.svg` depuis OpenStreetMap (rarement utile) |

## 2. Variables d'environnement

| Variable | Valeur |
| --- | --- |
| `VITE_STORAGE` | `mock` ou `supabase` |
| `VITE_SUPABASE_URL` | URL du projet, ex. `https://xxxx.supabase.co` (mode `supabase`) |
| `VITE_SUPABASE_ANON_KEY` | clé **publique** du projet : `anon` ou `publishable` (mode `supabase`) |

> ⚠️ Ces variables sont intégrées au JavaScript public : c'est normal pour l'URL et la clé publique,
> protégées par les règles RLS. **Ne jamais utiliser la clé `service_role` / `secret`.**
> Le fichier `.env` n'est jamais commité (`.gitignore`).

## 3. Configuration Supabase, pas à pas

### 3.1 Créer le projet

1. Sur [supabase.com](https://supabase.com), créer un projet **en région Europe (Frankfurt, `eu-central-1`)**.
2. Garder le mot de passe de la base dans un gestionnaire de mots de passe (jamais dans le dépôt).

### 3.2 Créer le schéma

1. *SQL Editor* → *New query* → coller tout le contenu de [`supabase/schema.sql`](supabase/schema.sql) → *Run*.
2. Le script est ré-exécutable : on peut le relancer après une mise à jour.

Il crée :

| Objet | Rôle |
| --- | --- |
| `members` | les fiches, avec des contraintes qui reprennent les règles du formulaire |
| `admins` | la liste des comptes autorisés à l'administration |
| `submit_member(payload)` | **seule** façon pour le public d'enregistrer une fiche ; renvoie uniquement le numéro de dossier ; limite à 3 fiches par numéro de téléphone |
| `public_stats()` | totaux pour l'accueil ; tout total inférieur à 10 est renvoyé vide (`null`) |
| RLS + droits | le public ne peut ni lire, ni modifier, ni supprimer ; les admins lisent et ne modifient que le statut ; personne ne supprime via l'API |

### 3.3 Fermer les inscriptions

*Authentication* → *Sign In / Providers* :

- garder **Email** activé ;
- **désactiver « Allow new users to sign up »** (aucune inscription publique).

### 3.4 Créer un compte administrateur

1. *Authentication* → *Users* → *Add user* → *Create new user* : email + mot de passe solide, cocher *Auto Confirm User*.
2. *SQL Editor* :

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'prenom.nom@exemple.org';
   ```

Retirer un accès :

```sql
delete from public.admins
where user_id = (select id from auth.users where email = 'prenom.nom@exemple.org');
```

Un compte authentifié mais absent de `admins` est refusé à la connexion et ne voit aucune fiche.

### 3.5 Brancher le site

1. *Project Settings* → *API Keys* : copier l'URL du projet et la clé publique (`anon` / `publishable`).
2. Dans `.env` :

   ```bash
   VITE_STORAGE=supabase
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=...
   ```

3. `npm run dev`, puis vérifier (avec des **données fictives**) :
   - envoyer une fiche → un numéro `AJEMS-2026-0001` s'affiche ;
   - `/admin` → se connecter → la fiche apparaît → changer son statut ;
   - supprimer la fiche de test : *Table Editor* → `members` → supprimer la ligne
     (le numéro suivant sera `0002` : la séquence ne revient pas en arrière, c'est normal).

### 3.6 Demande de suppression d'un membre

Aucune suppression n'est possible depuis le site. Depuis le tableau de bord Supabase (*Table Editor* → `members`),
rechercher la fiche par son numéro de dossier puis la supprimer.

## 4. Déploiement (site statique)

`npm run build` produit `dist/`. Les variables `VITE_*` sont lues **au moment du build** : les définir chez l'hébergeur
avant de lancer le build.

| Hébergeur | Réglages |
| --- | --- |
| **Vercel** | Framework *Vite*, build `npm run build`, sortie `dist`. Variables dans *Settings → Environment Variables*. `vercel.json` gère les routes et les en-têtes de sécurité. |
| **Netlify** | Build `npm run build`, publication `dist`. Variables dans *Site configuration → Environment variables*. `public/_redirects` et `public/_headers` sont copiés automatiquement. |
| **Hostinger** | Builder en local avec le `.env` de production, puis envoyer le **contenu** de `dist/` dans `public_html` (le fichier `.htaccess`, caché, doit être inclus : il gère les routes et les en-têtes). |

Sans la règle de repli (`vercel.json`, `_redirects` ou `.htaccess`), recharger `/adhesion` ou `/admin` donnerait une erreur 404.

## 5. Checklist de mise en production

- [ ] Projet Supabase en région Frankfurt, `schema.sql` exécuté sans erreur.
- [ ] Inscriptions publiques désactivées ; comptes du bureau créés et ajoutés dans `admins`.
- [ ] Variables `VITE_STORAGE=supabase`, URL et clé **publique** définies chez l'hébergeur (jamais `service_role`).
- [ ] Test complet avec une fiche fictive (envoi, admin, statut, impression, export CSV), puis fiche de test supprimée.
- [ ] Recharger `/adhesion` et `/admin` sur le site en ligne : pas de 404.
- [ ] Textes `[À VALIDER]` relus par le bureau : coordonnées, cotisation, durée de conservation, responsable de publication, hébergeur, chiffres saisis (`src/content/figures.ts`), manifeste.
- [ ] Règlement intérieur définitif dans `src/content/reglement.ts`, avec une nouvelle `version` (ex. `v1-2026-11`).
- [ ] Déclaration CDP et transfert des données vers l'Union européenne vérifiés (mention dans la notice de confidentialité).
- [ ] Vraies photos ajoutées (`public/photos/` + `src/content/photos.ts`), aucune banque d'images.
- [ ] `npm test` et `npm run build` verts.

## 6. Organisation du code

```
src/
├── content/      textes modifiables : accueil, à propos, règlement, confidentialité, photos, chiffres du bureau
├── schemas/      schémas Zod (un par étape + schéma complet)
├── services/     envoi, âge, filtres admin, export CSV, chiffres publics, formatage
├── storage/      MemberRepository + MockRepository + SupabaseRepository (+ fiches fictives de démo)
├── auth/         AuthService + MockAuthService + SupabaseAuthService
├── pages/        pages publiques et formulaire
├── admin/        espace d'administration (chargé à la demande)
└── ui/           composants (champs, boutons, plan du quartier, animations…)
supabase/schema.sql   base de données, droits et RLS
scripts/              captures d'écran, génération du plan
```

## 7. Crédits

Plan du quartier simplifié à partir des données © les contributeurs OpenStreetMap, sous licence ODbL
([openstreetmap.org/copyright](https://www.openstreetmap.org/copyright)).
