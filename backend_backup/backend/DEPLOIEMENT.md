# 🚀 Checklist déploiement — LigueyConnect

## Arborescence des fichiers livrés

```
deploy/
├── backend/
│   ├── server.js                              → remplace ton server.js racine
│   ├── src/
│   │   ├── middlewares/
│   │   │   └── cors.middleware.js             → NOUVEAU fichier à créer
│   │   ├── routes/
│   │   │   └── candidature.routes.js          → NOUVEAU fichier à créer
│   │   └── controllers/
│   │       └── candidature.controller.js      → NOUVEAU fichier à créer
│   └── .env.production.template               → variables à copier dans Render
└── frontend/
    ├── src/services/api.js                    → remplace ton api.js
    ├── .env.development                       → renommer en .env.local
    ├── .env.production                        → variables à copier dans Vercel
    └── vercel.json                            → à placer à la racine du frontend
```

---

## 1. Correction critique — Route candidatures (source des 404)

Ton `server.js` n'enregistrait pas les routes de candidatures.
Le fichier `candidature.routes.js` créé expose :

| Méthode | Route | Utilisé par |
|---|---|---|
| `GET` | `/api/offres/candidatures` | `CandidatureList.jsx` |
| `POST` | `/api/offres/:offreId/postuler` | `OffrePostuler.jsx` |
| `GET` | `/api/offres/:offreId/candidatures` | Page recruteur |
| `PATCH` | `/api/offres/:offreId/candidatures/:id/statut` | Gestion statut |

**⚠️ Ordre important dans server.js** — la route statique `/candidatures`
doit être définie AVANT la route dynamique `/:offreId`, sinon Express
interprétera "candidatures" comme un offreId.
C'est déjà géré dans le fichier livré.

---

## 2. Préfixe API — Alignement frontend/backend

Ton `server.js` utilise `/api` (sans `/v1`).
Le frontend doit donc utiliser :

```
# .env.local (développement)
VITE_API_URL=http://localhost:5000/api

# Vercel (production)
VITE_API_URL=https://TON-APP.onrender.com/api
```

Si tu veux passer à `/api/v1`, change les deux en même temps :
- `server.js` : `const API = "/api/v1";`
- `.env.local` : `VITE_API_URL=http://localhost:5000/api/v1`

---

## 3. Variables Render (backend)

Copier dans Render → Environment → Add Environment Variable :

| Variable | Valeur |
|---|---|
| `NODE_ENV` | `production` |
| `DB_HOST` | Host DB MySQL prod (PlanetScale, Railway...) |
| `DB_PORT` | `3306` |
| `DB_NAME` | `liguey_connect` |
| `DB_USER` | Utilisateur DB prod |
| `DB_PASSWORD` | Mot de passe DB prod |
| `JWT_SECRET` | Secret 64+ chars (voir commande ci-dessous) |
| `JWT_EXPIRES_IN` | `7d` |
| `BCRYPT_ROUNDS` | `12` |
| `FRONTEND_URL` | `https://TON-APP.vercel.app` |

> ⚠️ Ne pas définir `PORT` — Render l'injecte automatiquement.

Générer un JWT_SECRET fort :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 4. Variables Vercel (frontend)

Copier dans Vercel → Project → Settings → Environment Variables :

| Variable | Valeur |
|---|---|
| `VITE_API_URL` | `https://TON-APP.onrender.com/api` |

---

## 5. Scripts package.json — déjà corrects ✅

```json
{
  "scripts": {
    "start": "node server.js",
    "dev":   "nodemon server.js"
  }
}
```
- **Render** : Start Command = `npm start`
- **Vercel** : Build Command = `npm run build`, Output = `dist`

---

## 6. Base de données MySQL en production

MySQL local n'est pas accessible depuis Render.
Services recommandés (compatibles Sequelize) :

| Service | Gratuit | Notes |
|---|---|---|
| **PlanetScale** | ✅ | MySQL-compatible, le plus simple |
| **Railway** | ✅ crédits | MySQL natif |
| **Aiven** | ✅ trial | MySQL managé |

---

## 7. Ordre de déploiement

```
1. Déployer backend sur Render
   → noter l'URL : https://xxx.onrender.com

2. Sur Vercel : VITE_API_URL=https://xxx.onrender.com/api
3. Déployer frontend sur Vercel
   → noter l'URL : https://xxx.vercel.app

4. Sur Render : FRONTEND_URL=https://xxx.vercel.app
5. Redéployer le backend (pour appliquer le nouveau CORS)

6. Tester :
   curl https://xxx.onrender.com/health
```

---

## 8. Vérification post-déploiement

```bash
# Health check backend
curl https://TON-APP.onrender.com/health
# → {"success":true,"status":"OK","database":"connected","environment":"production"}

# Test CORS depuis la console navigateur
fetch("https://TON-APP.onrender.com/api/offres/search")
  .then(r => r.json()).then(console.log)
```
