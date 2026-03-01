# 📂 Structure du Projet Liguey Connect

## 🎯 Organisation des fichiers

Voici comment organiser votre projet complet :

```
liguey-connect/
│
├── 📁 backend/
│   ├── 📄 server.js                    ← Point d'entrée du serveur
│   ├── 📄 .env                         ← Configuration (ne pas commit sur Git)
│   ├── 📄 package.json                 ← Dépendances npm
│   │
│   ├── 📁 controllers/
│   │   ├── auth.controller.js          ← Logique authentification
│   │   ├── profile.controller.js       ← Logique profils (NOUVEAU ✨)
│   │   └── user.controller.js          ← Logique utilisateurs
│   │
│   ├── 📁 routes/
│   │   ├── auth.routes.js              ← Routes auth
│   │   ├── profile.routes.js           ← Routes profils (NOUVEAU ✨)
│   │   └── user.routes.js              ← Routes users
│   │
│   ├── 📁 middlewares/
│   │   ├── auth.middleware.js          ← Vérification JWT (NOUVEAU ✨)
│   │   └── validation.middleware.js    ← Validation des données
│   │
│   ├── 📁 models/
│   │   ├── User.js                     ← Modèle utilisateur
│   │   └── Profile.js                  ← Modèle profil
│   │
│   └── 📁 utils/
│       ├── jwt.js                      ← Utilitaires JWT
│       └── helpers.js                  ← Fonctions utilitaires
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 pages/
│   │   │   ├── Login.jsx               ← Page de connexion
│   │   │   ├── Register.jsx            ← Page d'inscription
│   │   │   ├── Dashboard.jsx           ← Tableau de bord
│   │   │   └── ProfileEdit.jsx         ← Page de profil (ENRICHI ✨)
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProfileCard.jsx
│   │   │
│   │   ├── 📁 services/
│   │   │   └── api.js                  ← Configuration Axios
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── 📁 database/
│   ├── 📄 migration.sql                ← Migration principale (NOUVEAU ✨)
│   ├── schema.sql                      ← Schéma de base
│   └── seeds.sql                       ← Données de test
│
├── 📄 README.md                        ← Documentation (MISE À JOUR ✨)
└── 📄 .gitignore                       ← Fichiers à ignorer

```

## 📋 Checklist d'installation

### ✅ Backend

1. **Créer le dossier backend/**
   ```bash
   mkdir -p backend/{controllers,routes,middlewares,models,utils}
   ```

2. **Placer les fichiers** :
   - `server.js` → `backend/server.js`
   - `profile.controller.js` → `backend/controllers/profile.controller.js`
   - `profile.routes.js` → `backend/routes/profile.routes.js`
   - `auth.middleware.js` → `backend/middlewares/auth.middleware.js`

3. **Créer le .env** dans `backend/` avec vos paramètres

4. **Installer les dépendances** :
   ```bash
   cd backend
   npm install
   ```

### ✅ Frontend

1. **Placer les fichiers** :
   - `ProfileEdit.jsx` → `frontend/src/pages/ProfileEdit.jsx`

2. **Installer les dépendances** :
   ```bash
   cd frontend
   npm install
   ```

### ✅ Database

1. **Exécuter la migration** :
   ```bash
   mysql -u root -p liguey_connect < migration.sql
   ```

## 🚀 Commandes de démarrage

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Le serveur démarre sur http://localhost:3000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# L'app démarre sur http://localhost:5173
```

## 📝 Fichiers fournis

Vous avez reçu :

| Fichier | Description | Emplacement |
|---------|-------------|-------------|
| `server.js` | Serveur Express complet | `backend/server.js` |
| `profile.controller.js` | Contrôleur profils | `backend/controllers/` |
| `profile.routes.js` | Routes API profils | `backend/routes/` |
| `auth.middleware.js` | Middleware JWT | `backend/middlewares/` |
| `ProfileEdit.jsx` | Formulaire React enrichi | `frontend/src/pages/` |
| `migration.sql` | Script SQL migration | `database/` |
| `README.md` | Documentation complète | Racine du projet |

## 🔧 Fichiers à créer vous-même

Vous devrez créer ces fichiers pour compléter le projet :

### Backend

1. **auth.controller.js** - Gestion connexion/inscription
2. **auth.routes.js** - Routes d'authentification
3. **user.controller.js** - Gestion utilisateurs
4. **user.routes.js** - Routes utilisateurs
5. **package.json** - Dépendances npm

### Frontend

1. **Login.jsx** - Page de connexion
2. **Register.jsx** - Page d'inscription
3. **Dashboard.jsx** - Tableau de bord
4. **api.js** - Configuration Axios
5. **App.jsx** - Composant racine

## 📦 Package.json recommandé

### Backend
```json
{
  "name": "liguey-connect-backend",
  "version": "2.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "mysql2": "^3.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Frontend
```json
{
  "name": "liguey-connect-frontend",
  "version": "2.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "axios": "^1.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.4",
    "vite": "^4.4.9"
  }
}
```

## 🎯 Prochaines étapes

1. ✅ Créer la structure de dossiers
2. ✅ Placer les fichiers fournis
3. ⬜ Créer les fichiers manquants
4. ⬜ Installer les dépendances
5. ⬜ Exécuter la migration SQL
6. ⬜ Tester l'API
7. ⬜ Tester le frontend
8. ⬜ Déployer en production

## ❓ Besoin d'aide ?

Si vous avez besoin des fichiers manquants (auth.controller.js, Login.jsx, etc.), demandez-les !

---

**Bonne chance avec Liguey Connect ! 🚀🇸🇳**
