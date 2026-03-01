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

Pour toute question :dieynababalde36@gmail.com

## 📄 Licence

ISC




# 🚀 Liguey Connect - Version Enrichie

## 📋 Vue d'ensemble

**Liguey Connect** est une plateforme hybride de mise en relation professionnelle au Sénégal, ciblant principalement les personnes peu scolarisées.

### 🎯 Les 4 rôles supportés

| Rôle | Description | Cas d'usage |
|------|-------------|-------------|
| **Prestataire** 🔧 | Travailleur indépendant proposant des services à la tâche | Plombier, électricien, mécanicien, maçon |
| **Demandeur d'emploi** 💼 | Personne cherchant un emploi stable (CDI/CDD) | Gardien, chauffeur, ouvrier cherchant un poste fixe |
| **Recruteur** 🏢 | Entreprise cherchant à recruter | Restaurant, société de BTP, commerce |
| **Client** 🛍️ | Particulier cherchant des services ponctuels | Famille ayant besoin d'un plombier, d'un jardinier |

---

## 📦 Installation

### 1️⃣ Prérequis

- Node.js (v14+)
- MySQL (v8+)
- npm ou yarn

### 2️⃣ Installation des dépendances

```bash
# Backend
npm install express cors helmet morgan dotenv mysql2 bcryptjs jsonwebtoken

# Ou avec toutes les dépendances
npm install
```

### 3️⃣ Configuration de la base de données

```bash
# 1. Créer la base de données
mysql -u root -p
CREATE DATABASE liguey_connect;
USE liguey_connect;

# 2. Exécuter la migration
mysql -u root -p liguey_connect < migration.sql
```

### 4️⃣ Configuration de l'environnement

Votre fichier `.env` est déjà configuré :

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=liguey_connect
DB_USER=root
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=32d4d0fac879c7d73ada85006c653c36f807b09f7c9d886f7add85e50202acb5a7ba7435eaac7f59bd4f75213fbccb7a887611feac763375be8d688b92e508ab
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10

# Frontend
FRONTEND_URL=http://localhost:5173

# API
API_VERSION=/api/v1
```

### 5️⃣ Démarrer le serveur

```bash
# Développement
npm run dev

# Production
npm start
```

Le serveur démarre sur **http://localhost:5000**

---

## 📁 Structure des fichiers

```
liguey-connect/
│
├── backend/
│   ├── server.js                 ← Point d'entrée du serveur
│   ├── .env                      ← Configuration
│   │
│   ├── controllers/
│   │   └── profile.controller.js ← Logique métier des profils
│   │
│   ├── routes/
│   │   ├── profile.routes.js     ← Routes API profils
│   │   ├── auth.routes.js        ← Routes authentification
│   │   └── user.routes.js        ← Routes utilisateurs
│   │
│   └── middlewares/
│       └── auth.middleware.js    ← Vérification JWT
│
├── frontend/
│   └── src/
│       └── pages/
│           └── ProfileEdit.jsx   ← Formulaire de profil enrichi
│
├── migration.sql                 ← Script de migration SQL
└── README.md                     ← Ce fichier
```

---

## 🔌 API Endpoints

### Authentication

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/register` | Inscription |
| POST | `/api/v1/auth/login` | Connexion |

### Profiles

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/v1/profiles/me` | Mon profil | ✅ |
| PUT | `/api/v1/profiles/me` | Mettre à jour mon profil | ✅ |
| GET | `/api/v1/profiles/search` | Rechercher des profils | ✅ |
| GET | `/api/v1/profiles/:id` | Profil par ID | ✅ |

### Exemple de requête

```javascript
// Mettre à jour son profil
const response = await api.put('/api/v1/profiles/me', {
  firstName: 'Amadou',
  lastName: 'Diallo',
  phone: '+221771234567',
  profession: 'Plombier',
  skills: ['Installation', 'Dépannage', 'Maintenance'],
  city: 'Dakar',
  region: 'Dakar',
  
  // Champs spécifiques prestataire
  hourlyRate: 5000,
  availability: 'disponible',
  transportMode: 'moto',
  workZones: 'Dakar, Pikine, Guédiawaye'
});
```

---

## 🗂️ Schéma de la base de données

### Table `profiles` - Nouveaux champs ajoutés

#### Champs communs (tous les rôles)
- `firstName`, `lastName`, `phone`, `bio`
- `address`, `city`, `region`
- `profession`, `skills`, `experience`

#### Prestataire 🔧
- `hourlyRate` - Tarif horaire (FCFA)
- `availability` - disponible / occupe / indisponible
- `transportMode` - moto / voiture / velo / pieds / transport_commun
- `workZones` - Zones d'intervention

#### Demandeur d'emploi 💼
- `contractType` - cdi / cdd / journalier / saisonnier
- `expectedSalary` - Salaire souhaité (FCFA/mois)
- `availabilityDelay` - immediat / 1semaine / 1mois
- `educationLevel` - aucun / primaire / college / lycee / formation / superieur
- `references` - Références professionnelles
- `hasWorkPermit` - Papiers en règle (boolean)

#### Recruteur 🏢
- `companyName` - Nom de l'entreprise
- `companySize` - 1-5 / 6-20 / 21-50 / 50+
- `companySector` - construction / restauration / commerce / transport / agriculture / services / autre
- `companyNinea` - Numéro NINEA

#### Client 🛍️
- `servicePreferences` - Services recherchés
- `budgetRange` - 0-5000 / 5000-15000 / 15000-50000 / 50000+
- `clientType` - particulier / petite_entreprise

---

## 🧪 Tester l'API

### Avec curl

```bash
# Inscription
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "amadou@example.com",
    "password": "Test1234!",
    "role": "prestataire"
  }'

# Connexion
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "amadou@example.com",
    "password": "Test1234!"
  }'

# Récupérer mon profil
curl -X GET http://localhost:3000/api/v1/profiles/me \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

### Avec Postman

1. Créer une collection "Liguey Connect"
2. Ajouter les endpoints ci-dessus
3. Configurer l'authentification Bearer Token

---

## 🎨 Frontend - ProfileEdit.jsx

Le composant React supporte maintenant les 4 rôles avec affichage conditionnel :

```jsx
{user && user.role === "prestataire" && (
  // Formulaire prestataire
)}

{user && user.role === "demandeur_emploi" && (
  // Formulaire demandeur d'emploi
)}

{user && user.role === "recruteur" && (
  // Formulaire recruteur
)}

{user && user.role === "client" && (
  // Formulaire client
)}
```

---

## 🔐 Sécurité

- JWT pour l'authentification
- Mots de passe hashés avec bcrypt
- Helmet pour les en-têtes HTTP sécurisés
- CORS configuré
- Validation des données côté serveur

---

## 📊 Fonctionnalités

✅ **Inscription/Connexion** avec 4 rôles différents  
✅ **Profils personnalisés** selon le rôle  
✅ **Recherche de profils** avec filtres  
✅ **Calcul automatique** de la complétion du profil  
✅ **Gestion des compétences** (format tableau)  
✅ **Zones d'intervention** pour prestataires  
✅ **Références professionnelles** pour demandeurs d'emploi  
✅ **Secteur d'activité** pour recruteurs  
✅ **Préférences de services** pour clients  

---

## 🚧 Prochaines étapes

- [ ] Upload d'images de profil
- [ ] Système de notation/avis
- [ ] Messagerie interne
- [ ] Gestion des offres d'emploi
- [ ] Gestion des demandes de services
- [ ] Dashboard avec statistiques
- [ ] Notifications par email/SMS
- [ ] Géolocalisation

---

## 📞 Support

Pour toute question ou problème :
- Vérifier les logs du serveur
- Consulter la documentation MySQL
- Vérifier que tous les packages npm sont installés

---

## 📝 Changelog

### Version 2.0.0 (2025)
- ✨ Ajout du rôle "demandeur_emploi"
- ✨ Ajout du rôle "client"
- ✨ Enrichissement du rôle "prestataire"
- ✨ Enrichissement du rôle "recruteur"
- 🗃️ Migration de la base de données
- 📝 Documentation complète

### Version 1.0.0
- 🎉 Version initiale
- 👥 Support des rôles prestataire et recruteur

---

## 📜 Licence

MIT License - Projet Liguey Connect 2025
