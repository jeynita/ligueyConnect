import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

/**
 * Configuration Sequelize pour Development et Production
 * 
 * Production (Render) : Utilise DATABASE_URL fourni automatiquement
 * Development (Local) : Utilise les variables .env individuelles
 */

let sequelize;

// ✅ PRODUCTION (Render) : Render fournit automatiquement DATABASE_URL
if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
  console.log("🎨 Connexion MySQL via Render (DATABASE_URL)...");
  
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    
    // Logging désactivé en production
    logging: false,
    
    // Pool de connexions optimisé pour Render
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    
    // Timezone UTC
    timezone: "+00:00",
    
    // Options par défaut des modèles
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });

} else {
  // ✅ DEVELOPMENT (Local) : Utilise les variables DB_NAME, DB_USER, etc.
  console.log("💻 Connexion MySQL locale...");
  
  sequelize = new Sequelize(
    process.env.DB_NAME || "liguey_connect",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      
      // Logging activé en développement
      logging: console.log,
      
      // Pool de connexions
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      
      // Timezone UTC
      timezone: "+00:00",
      
      // Options par défaut des modèles
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    }
  );
}

// Test de connexion au démarrage
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connexion à la base de données établie avec succès");
  })
  .catch((error) => {
    console.error("❌ Impossible de se connecter à la base de données:", error.message);
  });

export default sequelize;