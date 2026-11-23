# PLÉIADE LOCATION

Application immobilière en React + Vite + Supabase (JavaScript JSX, pas TypeScript).

## 1. Prérequis
- Node.js 18 ou plus récent
- Un projet Supabase
- Un compte WhatsApp pour recevoir les demandes

## 2. Installation
Dans le terminal, à la racine du projet :

```bash
npm install
cp .env.example .env.local
```

Ouvrez `.env.local` et renseignez :
- `VITE_SUPABASE_URL` : URL du projet Supabase
- `VITE_SUPABASE_ANON_KEY` : clé `sb_publishable` (jamais la clé `service_role`)
- `VITE_WHATSAPP_NUMBER` : numéro au format international sans `+`, espaces ou tirets. Exemple : `243XXXXXXXXX`

Démarrer :
```bash
npm run dev
```
Créer la version de production :
```bash
npm run build
```

## 3. Préparer Supabase
1. Ouvrez le SQL Editor de votre projet Supabase.
2. Copiez et exécutez `supabase/schema.sql`.
3. Dans Authentication > Users, créez votre utilisateur administrateur avec votre adresse e-mail et un nouveau mot de passe sécurisé.
4. Copiez l'UUID de cet utilisateur.
5. Exécutez dans SQL Editor (remplacez l'UUID) :

```sql
insert into public.admin_users(user_id)
values ('fed033b4-8432-4ba8-a9df-5fa8717d8be2');

insert into public.admin_profiles(id, full_name)
values ('fed033b4-8432-4ba8-a9df-5fa8717d8be2', 'David Makindu');
```

L'utilisateur ne peut pas devenir administrateur simplement en s'inscrivant : il doit être ajouté explicitement à `admin_users` par le propriétaire du projet.

## 4. Fonctionnement
- Les visiteurs consultent les annonces publiées et disponibles sans compte.
- L'administrateur se connecte via `/admin/login`.
- L'administrateur ajoute, modifie, masque, supprime ou marque une maison comme louée.
- Une maison louée n'est plus visible sur le site public.
- Les demandes sont sauvegardées dans `rental_requests` et visibles dans l'administration.
- Après sauvegarde, le site ouvre WhatsApp avec un message prérempli. Le navigateur/l'utilisateur doit confirmer l'envoi dans WhatsApp : l'application ne peut pas envoyer silencieusement un message WhatsApp sans API officielle.
- Les photos et vidéos sont stockées dans Supabase Storage.
- La base refuse les fingerprints de maisons identiques et les request_token dupliqués.

## 5. Limites et recommandations de production
- La clé `sb_publishable` est publique par conception. La sécurité repose sur RLS et les politiques Storage.
- Ne jamais placer une clé `service_role` dans React, `.env.local` ou le navigateur.
- Le formulaire public est soumis aux limites RLS; ajoutez un CAPTCHA/anti-spam et une limitation de débit côté serveur avant une mise en production à grande échelle.
- Le lien WhatsApp prérempli nécessite une action de confirmation. Pour une notification automatique sans intervention, utilisez une Edge Function Supabase avec l'API officielle WhatsApp Business et des secrets serveur.
- Le PWA inclut un manifeste et un service worker simple. Pour les icônes PNG conformes à certains navigateurs/stores, générez également des versions PNG 192x192 et 512x512.
- Les photos publiques sont servies par URL publique. Ne téléversez jamais de documents privés dans ce bucket.
- Les annonces d'exemple visibles sans configuration Supabase sont uniquement une démonstration; elles ne sont pas des logements réels.

## 6. Structure
- `src/pages/Home.jsx` : site public
- `src/pages/AdminLogin.jsx` : connexion administrateur
- `src/pages/Admin.jsx` : gestion des logements, demandes et profil
- `src/components/` : composants de l'interface
- `src/lib/supabase.js` : connexion Supabase
- `supabase/schema.sql` : tables, index, RLS et Storage
- `public/manifest.webmanifest` : configuration PWA
# pleiade-location
