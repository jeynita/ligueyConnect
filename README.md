# LigueyConnect

> Plateforme de mise en relation professionnelle au Sénégal : recruteurs, demandeurs d'emploi, prestataires et clients.

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)

Démo en ligne : <lien Vercel>

## Présentation

LigueyConnect met en relation les acteurs du marché du travail au Sénégal sur une seule plateforme. Elle distingue quatre profils, chacun avec ses propres droits et ses propres écrans.

## Rôles

| Rôle | Usage |
|---|---|
| **Recruteur** | <ex : publier des offres, consulter des candidatures> |
| **Demandeur d'emploi** | <ex : consulter les offres, postuler> |
| **Prestataire** | <ex : proposer ses services> |
| **Client** | <ex : rechercher et contacter un prestataire> |



## Architecture

```
Frontend (React + Vite)  -->  API REST (Node.js / Express)  -->  MySQL (Sequelize)
        Vercel                        Render                        Railway
```

## Structure du projet

```
ligueyConnect/
├── <dossier frontend>/   # Application React (Vite)
├── <dossier backend>/    # API Express, modèles Sequelize
└── README.md
```

## Technologies

- **Front-end** : React, Vite
- **Back-end** : Node.js, Express
- **ORM** : Sequelize
- **Base de données** : MySQL
- **Déploiement** : Vercel (front), Render (API), Railway (base de données)

## Installation

```bash
git clone https://github.com/jeynita/ligueyConnect.git
cd ligueyConnect
```

Back-end :
```bash
cd <dossier backend>
npm install
cp .env.example .env    # renseigner les variables (base de données, secret JWT...)
npm run dev
```

Front-end :
```bash
cd <dossier frontend>
npm install
npm run dev
```

