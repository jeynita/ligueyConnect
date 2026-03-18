-- ============================================
-- LIGUEY CONNECT - Supabase Database Schema
-- ============================================
-- Exécuter ce script dans le SQL Editor de Supabase
-- ============================================

-- 1. TABLES ENUM (types personnalisés)
-- ============================================

CREATE TYPE user_role AS ENUM ('demandeur', 'prestataire', 'recruteur', 'client', 'admin');
CREATE TYPE availability_status AS ENUM ('disponible', 'occupe', 'indisponible');
CREATE TYPE service_category AS ENUM ('plomberie', 'electricite', 'menuiserie', 'maconnerie', 'peinture', 'immobilier', 'mecanique', 'informatique', 'nettoyage', 'restauration', 'couture', 'coiffure', 'cours_particuliers', 'demenagement', 'autre');
CREATE TYPE price_type AS ENUM ('heure', 'jour', 'forfait', 'devis');
CREATE TYPE service_status AS ENUM ('actif', 'inactif', 'suspendu');
CREATE TYPE contract_type AS ENUM ('CDD', 'CDI', 'stage', 'freelance', 'temporaire');
CREATE TYPE job_sector AS ENUM ('administration', 'agriculture', 'artisanat', 'commerce', 'construction', 'education', 'hotellerie_restauration', 'immobilier', 'industrie', 'informatique', 'sante', 'services', 'tourisme', 'transport', 'autre');
CREATE TYPE experience_level AS ENUM ('aucune', '0-1_ans', '1-3_ans', '3-5_ans', '5_ans_plus');
CREATE TYPE education_level AS ENUM ('aucun', 'primaire', 'secondaire', 'bac', 'bac_plus_2', 'bac_plus_3', 'bac_plus_5', 'doctorat');
CREATE TYPE salary_period AS ENUM ('heure', 'jour', 'mois', 'annuel', 'a_negocier');
CREATE TYPE offre_status AS ENUM ('active', 'inactive', 'pourvue', 'expiree');
CREATE TYPE candidature_status AS ENUM ('en_attente', 'vue', 'retenue', 'rejetee');
CREATE TYPE message_type AS ENUM ('general', 'service', 'offre', 'candidature');

-- 2. TABLE PROFILES (liée à auth.users de Supabase)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  bio TEXT,
  avatar VARCHAR(255),
  address VARCHAR(255),
  city VARCHAR(100),
  region VARCHAR(100),
  profession VARCHAR(100),
  skills JSONB DEFAULT '[]'::jsonb,
  experience TEXT,
  hourly_rate DECIMAL(10,2),
  availability availability_status DEFAULT 'disponible',
  company_name VARCHAR(200),
  company_size VARCHAR(50),
  profile_completeness INTEGER DEFAULT 0 CHECK (profile_completeness >= 0 AND profile_completeness <= 100),
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE SERVICES
-- ============================================

CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL CHECK (char_length(title) >= 5),
  description TEXT NOT NULL CHECK (char_length(description) >= 20),
  category service_category NOT NULL,
  price_type price_type DEFAULT 'heure',
  price_min DECIMAL(10,2) CHECK (price_min >= 0),
  price_max DECIMAL(10,2) CHECK (price_max >= 0),
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  zones JSONB DEFAULT '[]'::jsonb,
  availability availability_status DEFAULT 'disponible',
  available_days JSONB DEFAULT '["lundi","mardi","mercredi","jeudi","vendredi","samedi"]'::jsonb,
  response_time VARCHAR(50),
  images JSONB DEFAULT '[]'::jsonb,
  status service_status DEFAULT 'actif',
  view_count INTEGER DEFAULT 0,
  contact_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_city ON services(city);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_user_id ON services(user_id);

-- 4. TABLE OFFRES (offres d'emploi)
-- ============================================

CREATE TABLE offres (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL CHECK (char_length(title) >= 5),
  description TEXT NOT NULL CHECK (char_length(description) >= 50),
  contract_type contract_type NOT NULL,
  sector job_sector,
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  address VARCHAR(255),
  salary_min DECIMAL(10,2) CHECK (salary_min >= 0),
  salary_max DECIMAL(10,2) CHECK (salary_max >= 0),
  salary_period salary_period DEFAULT 'mois',
  experience_required experience_level DEFAULT 'aucune',
  education_level education_level DEFAULT 'aucun',
  skills JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  number_of_positions INTEGER DEFAULT 1 CHECK (number_of_positions >= 1),
  work_schedule VARCHAR(100),
  start_date DATE,
  application_deadline DATE,
  company_name VARCHAR(200),
  status offre_status DEFAULT 'active',
  view_count INTEGER DEFAULT 0,
  application_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_offres_contract_type ON offres(contract_type);
CREATE INDEX idx_offres_city ON offres(city);
CREATE INDEX idx_offres_sector ON offres(sector);
CREATE INDEX idx_offres_status ON offres(status);
CREATE INDEX idx_offres_user_id ON offres(user_id);

-- 5. TABLE CANDIDATURES
-- ============================================

CREATE TABLE candidatures (
  id BIGSERIAL PRIMARY KEY,
  offre_id BIGINT NOT NULL REFERENCES offres(id) ON DELETE CASCADE,
  candidat_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  cv_text TEXT,
  cv_url VARCHAR(255),
  status candidature_status DEFAULT 'en_attente',
  recruiter_notes TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(offre_id, candidat_id)
);

CREATE INDEX idx_candidatures_offre_id ON candidatures(offre_id);
CREATE INDEX idx_candidatures_candidat_id ON candidatures(candidat_id);
CREATE INDEX idx_candidatures_status ON candidatures(status);

-- 6. TABLE MESSAGES
-- ============================================

CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
  subject VARCHAR(200),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  message_type message_type DEFAULT 'general',
  reference_id BIGINT,
  reply_to_id BIGINT REFERENCES messages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- 7. TABLE CONVERSATIONS
-- ============================================

CREATE TABLE conversations (
  id BIGSERIAL PRIMARY KEY,
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_content TEXT,
  last_message_at TIMESTAMPTZ,
  last_message_sender_id UUID,
  unread_count_user1 INTEGER DEFAULT 0,
  unread_count_user2 INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at);

-- 8. FONCTION : Créer profil automatiquement à l'inscription
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. FONCTION : Mise à jour automatique de updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_offres_updated_at BEFORE UPDATE ON offres FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_candidatures_updated_at BEFORE UPDATE ON candidatures FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE offres ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- PROFILES : tout le monde peut lire, seul le propriétaire peut modifier
CREATE POLICY "Profiles visibles par tous" ON profiles FOR SELECT USING (true);
CREATE POLICY "Modifier son propre profil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- SERVICES : lecture publique, CRUD pour le propriétaire
CREATE POLICY "Services visibles par tous" ON services FOR SELECT USING (true);
CREATE POLICY "Créer ses services" ON services FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Modifier ses services" ON services FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Supprimer ses services" ON services FOR DELETE USING (auth.uid() = user_id);

-- OFFRES : lecture publique, CRUD pour le propriétaire
CREATE POLICY "Offres visibles par tous" ON offres FOR SELECT USING (true);
CREATE POLICY "Créer ses offres" ON offres FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Modifier ses offres" ON offres FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Supprimer ses offres" ON offres FOR DELETE USING (auth.uid() = user_id);

-- CANDIDATURES : le candidat et le recruteur de l'offre peuvent voir
CREATE POLICY "Voir ses candidatures" ON candidatures FOR SELECT
  USING (
    auth.uid() = candidat_id
    OR auth.uid() IN (SELECT user_id FROM offres WHERE id = candidatures.offre_id)
  );
CREATE POLICY "Créer une candidature" ON candidatures FOR INSERT WITH CHECK (auth.uid() = candidat_id);
CREATE POLICY "Modifier candidature (recruteur)" ON candidatures FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM offres WHERE id = candidatures.offre_id));

-- MESSAGES : seuls l'envoyeur et le receveur peuvent voir
CREATE POLICY "Voir ses messages" ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Envoyer un message" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Marquer message lu" ON messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- CONVERSATIONS : seuls les participants peuvent voir
CREATE POLICY "Voir ses conversations" ON conversations FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Créer une conversation" ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Modifier sa conversation" ON conversations FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);
