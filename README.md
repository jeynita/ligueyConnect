# ligueyConnect
Mise en relation professionnel : recruteur et chercheurs d'emploi , freelances et particuliers

# 🚀 Liguey Connect - Backend

Backend API pour l'application Liguey Connect.

## 📋 Stack Technique

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Sequelize
- **Base de données:** MySQL
- **Authentification:** JWT (JSON Web Tokens)
- **Sécurité:** Helmet, CORS, Rate Limiting
- **Validation:** Express Validator

## 🔧 Installation

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd ligueyConnect-backend
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de l'environnement

Créer un fichier `.env` à la racine du projet :

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_NAME=liguey_connect
DB_USER=root
DB_PASSWORD=votre_mot_de_passe

# JWT (IMPORTANT: Générer un secret fort)
JWT_SECRET=votre_secret_jwt_très_long_et_complexe
JWT_EXPIRES_IN=7d

# Frontend URL (pour CORS)
FRONTEND_URL=http://localhost:5173
```

### 4. Générer un JWT_SECRET sécurisé

**IMPORTANT:** Ne jamais utiliser un secret simple comme "liguey_secret_dev"

```bash
# Générer un secret fort avec Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copiez le résultat dans votre `.env` comme `JWT_SECRET`

### 5. Créer la base de données

```sql
CREATE DATABASE liguey_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6. Démarrer le serveur

**Mode développement (avec nodemon):**
```bash
npm run dev
```

**Mode production:**
```bash
npm start
```

## 🔐 Sécurité

### Fonctionnalités de sécurité implémentées :

✅ **Helmet** - Protection des headers HTTP
✅ **CORS** - Gestion Cross-Origin Resource Sharing
✅ **Rate Limiting** - Protection contre les attaques par force brute
✅ **JWT** - Authentification sécurisée
✅ **Bcrypt** - Hashage des mots de passe (10 rounds)
✅ **Express Validator** - Validation des inputs
✅ **Error Handling** - Gestion centralisée des erreurs

### Bonnes pratiques :

- ✅ `.gitignore` configuré (protège .env, node_modules)
- ✅ Variables d'environnement pour les credentials
- ✅ Messages d'erreur génériques (pas de fuite d'information)
- ✅ Validation des inputs
- ✅ Protection CSRF via tokens
- ✅ Timestamps automatiques sur les modèles

## 📡 API Endpoints

### Authentification

#### Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Règles de validation:**
- Email valide
- Mot de passe min 8 caractères
- Doit contenir: 1 majuscule, 1 minuscule, 1 chiffre

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Routes protégées

Pour accéder aux routes protégées, ajoutez le header :
```http
Authorization: Bearer <votre_token>
```

## 🏗️ Structure du projet

```
backend/
├── server.js                 # Point d'entrée
├── package.json
├── .env                      # Variables d'environnement (GIT IGNORÉ)
├── .gitignore
└── src/
    ├── config/
    │   └── db.js            # Configuration Sequelize
    ├── models/
    │   ├── Users.js         # Modèle utilisateur
    │   ├── Profile.js       # À implémenter
    │   ├── Message.js       # À implémenter
    │   └── Offer.js         # À implémenter
    ├── controllers/
    │   └── auth.controller.js
    ├── routes/
    │   └── auth.routes.js
    └── middlewares/
        ├── auth.middleware.js
        ├── security.middleware.js
        ├── error.middleware.js
        └── validation.middleware.js
```

## ⚠️ IMPORTANT - SÉCURITÉ

### ❌ À NE JAMAIS FAIRE :

1. **Ne JAMAIS committer le fichier `.env`**
2. **Ne JAMAIS utiliser de secrets faibles** (ex: "secret123")
3. **Ne JAMAIS utiliser `{ force: true }`** en production
4. **Ne JAMAIS exposer les mots de passe** dans les logs ou réponses
5. **Ne JAMAIS désactiver les validations** en production

### ✅ À TOUJOURS FAIRE :

1. **Générer des JWT_SECRET forts** (min 32 caractères aléatoires)
2. **Valider tous les inputs** utilisateur
3. **Utiliser HTTPS** en production
4. **Mettre à jour les dépendances** régulièrement
5. **Faire des backups** de la base de données

## 📝 TODO

- [ ] Implémenter Profile.js
- [ ] Implémenter Message.js
- [ ] Implémenter Offer.js
- [ ] Ajouter routes protégées
- [ ] Système de refresh tokens
- [ ] Mot de passe oublié
- [ ] Vérification email
- [ ] Tests unitaires
- [ ] Documentation API (Swagger)

## 🐛 Débogage

### Logs de développement
Les logs HTTP sont activés en mode développement via Morgan.

### Erreurs courantes

**"DB error: Access denied"**
→ Vérifiez DB_USER et DB_PASSWORD dans .env

**"JWT_SECRET is required"**
→ Vérifiez que JWT_SECRET est défini dans .env

**"Too many requests"**
→ Rate limiting actif, attendez 15 minutes

## 📞 Support

Pour toute question : [votre email]

## 📄 Licence

ISC
