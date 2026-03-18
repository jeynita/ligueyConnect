# 📂 Structure du Projet Liguey Connect (React + Supabase)

## 🎯 Vue d’ensemble

Le projet utilise désormais **React (Vite)** + **Supabase** :

- **Auth**: Supabase Auth (email/password)
- **Base de données**: Postgres Supabase
- **Sécurité**: RLS + policies (définies dans `supabase_schema.sql`)

## 🗂️ Organisation des fichiers

```
ligueyConnect/
│
├── frontend/
│   ├── .env.example
│   ├── .env.production
│   ├── package.json
│   └── src/
│       ├── lib/
│       │   └── supabase.js          ← Client Supabase
│       ├── services/
│       │   ├── api.js              ← Auth Supabase (login/register/logout/etc.)
│       │   └── supabase-crud.js    ← CRUD Supabase (tables)
│       ├── pages/
│       ├── App.jsx                 ← Routes + ProtectedRoute
│       └── main.jsx
│
├── supabase_schema.sql             ← Schéma Postgres + triggers + RLS policies
└── README.md
```

## ✅ Checklist de mise en route

### Supabase

1. Créer un projet Supabase
2. Aller dans **SQL Editor** et exécuter `supabase_schema.sql`
3. Aller dans **Authentication → Providers** et vérifier que **Email** est activé

### Frontend

1. Installer les dépendances

```bash
cd frontend
npm install
```

2. Créer `frontend/.env` (local) avec:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
```

3. Démarrer l’app

```bash
npm run dev
```

