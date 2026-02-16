// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";

// dotenv.config();

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         host: process.env.DB_HOST,
//         dialect: "mysql",
//         logging: false
//     }
// );

// export default sequelize;


import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    
    // Logging
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    
    // Pool de connexions (performance)
    pool: {
      max: 5,           // Maximum de connexions
      min: 0,           // Minimum de connexions
      acquire: 30000,   // Temps max pour acquérir une connexion (30s)
      idle: 10000       // Temps max d'inactivité avant fermeture (10s)
    },
    
    // Timezone UTC
    timezone: "+00:00",
    
    // Options par défaut des modèles
    define: {
      timestamps: true,     // createdAt, updatedAt automatiques
      underscored: true,    // snake_case pour les colonnes
      freezeTableName: true // Désactive la pluralisation automatique
    }
  }
);

export default sequelize;
