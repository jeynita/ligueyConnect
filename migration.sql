-- ====================================================================
-- LIGUEY CONNECT - MIGRATION SQL
-- Ajout des nouveaux champs pour les 4 rôles
-- ====================================================================
-- Date: 2025
-- Description: Ajoute les colonnes manquantes pour supporter:
--   - Prestataire (transport, zones)
--   - Demandeur d'emploi (contrat, salaire, éducation, références)
--   - Recruteur (secteur, NINEA)
--   - Client (préférences, budget)
-- ====================================================================

USE liguey_connect;

-- ====================================================================
-- 1. CHAMPS PRESTATAIRE (nouveaux)
-- ====================================================================

-- Moyen de transport
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS transportMode VARCHAR(50) DEFAULT NULL
COMMENT 'Moyen de transport: moto, voiture, velo, pieds, transport_commun';

-- Zones d'intervention
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS workZones TEXT DEFAULT NULL
COMMENT 'Zones géographiques où le prestataire peut intervenir';

-- ====================================================================
-- 2. CHAMPS DEMANDEUR D'EMPLOI (nouveaux)
-- ====================================================================

-- Type de contrat recherché
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS contractType VARCHAR(50) DEFAULT NULL
COMMENT 'Type de contrat: cdi, cdd, journalier, saisonnier';

-- Salaire minimum souhaité
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS expectedSalary INT DEFAULT NULL
COMMENT 'Salaire minimum souhaité en FCFA par mois';

-- Disponibilité (délai avant de commencer)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS availabilityDelay VARCHAR(50) DEFAULT NULL
COMMENT 'Délai de disponibilité: immediat, 1semaine, 1mois';

-- Niveau d'études
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS educationLevel VARCHAR(50) DEFAULT NULL
COMMENT 'Niveau: aucun, primaire, college, lycee, formation, superieur';

-- Références professionnelles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS `references` TEXT DEFAULT NULL
COMMENT 'Références d\'anciens employeurs';

-- Papiers en règle
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS hasWorkPermit BOOLEAN DEFAULT FALSE
COMMENT 'Indique si la personne a ses papiers en règle (CNI, etc.)';

-- ====================================================================
-- 3. CHAMPS RECRUTEUR (nouveaux)
-- ====================================================================

-- Secteur d'activité
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS companySector VARCHAR(100) DEFAULT NULL
COMMENT 'Secteur: construction, restauration, commerce, transport, agriculture, services, autre';

-- Numéro NINEA
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS companyNinea VARCHAR(50) DEFAULT NULL
COMMENT 'Numéro d\'identification national des entreprises et associations (NINEA)';

-- ====================================================================
-- 4. CHAMPS CLIENT (nouveaux)
-- ====================================================================

-- Préférences de services
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS servicePreferences TEXT DEFAULT NULL
COMMENT 'Types de services recherchés par le client';

-- Fourchette budgétaire
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS budgetRange VARCHAR(50) DEFAULT NULL
COMMENT 'Budget habituel: 0-5000, 5000-15000, 15000-50000, 50000+';

-- Type de client
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS clientType VARCHAR(50) DEFAULT NULL
COMMENT 'Type: particulier, petite_entreprise';

-- ====================================================================
-- 5. VÉRIFICATION DES INDEX
-- ====================================================================

-- Index sur les champs fréquemment recherchés
CREATE INDEX IF NOT EXISTS idx_availability ON profiles(availability);
CREATE INDEX IF NOT EXISTS idx_contract_type ON profiles(contractType);
CREATE INDEX IF NOT EXISTS idx_company_sector ON profiles(companySector);
CREATE INDEX IF NOT EXISTS idx_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_region ON profiles(region);

-- ====================================================================
-- 6. AFFICHAGE DES RÉSULTATS
-- ====================================================================

SELECT 'Migration terminée avec succès ! ✅' AS Status;

-- Vérifier la structure de la table
DESCRIBE profiles;

-- Compter les profils par rôle
SELECT 
  u.role,
  COUNT(*) AS total_users
FROM users u
LEFT JOIN profiles p ON u.id = p.userId
GROUP BY u.role
ORDER BY total_users DESC;

-- ====================================================================
-- FIN DE LA MIGRATION
-- ====================================================================
