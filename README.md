# Liguey Connect (React + Supabase)

Plateforme de mise en relation (recruteur/demandeur, prestataires/clients) construite en **React (Vite)** avec **Supabase** (Auth + Postgres).

## ✅ Prérequis

- Node.js + npm
- Un projet Supabase

## 🔐 Variables d’environnement (frontend)

Créer `frontend/.env` (non committé) :

```bash
VITE_SUPABASE_URL=https://jpxwjtulpmeymyzobrah.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_2ONk0IMVw6lkv7fvIwyLZw_9gGuPv0x
```

> Le client Supabase est initialisé dans `frontend/src/lib/supabase.js`.

## 🗄️ Base de données Supabase

1. Supabase → **SQL Editor**
2. Copier / coller puis exécuter `supabase_schema.sql` (à la racine du repo)

Ce script crée :

- `profiles` (liée à `auth.users`) + trigger `handle_new_user()`
- `services`, `offres`, `candidatures`, `messages`, `conversations`
- `RLS` activé + policies de base (lecture publique pour offres/services, écriture limitée au propriétaire, etc.)

## ▶️ Lancer en local

```bash
cd frontend
npm install
npm run dev
```

## 🧩 Où est la logique “API” ?

L’app n’a plus de backend Node/Express.

- **Auth**: `frontend/src/services/api.js`
- **CRUD** (tables): `frontend/src/services/supabase-crud.js`
- **Client Supabase**: `frontend/src/lib/supabase.js`

## 🔎 Notes importantes

- **Rôles**: `client`, `prestataire`, `demandeur`, `recruteur`, `admin` (enum `user_role` dans `supabase_schema.sql`).
- **Protected routes**: gérées via la session Supabase dans `frontend/src/App.jsx`.

