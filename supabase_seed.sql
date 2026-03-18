-- ============================================
-- LIGUEY CONNECT - Seed data (Supabase)
-- ============================================
-- PRÉREQUIS
-- 1) Dans Supabase Dashboard -> Authentication -> Users
--    crée ces comptes (email/password au choix, email confirmé si besoin):
--      - client@demo.liguey
--      - prestataire@demo.liguey
--      - recruteur@demo.liguey
--      - demandeur@demo.liguey
-- 2) Ensuite exécute ce script dans SQL Editor.
--
-- Note: `profiles.id` référence `auth.users(id)` => on récupère les UUID via auth.users.

do $$
declare
  email_client text := 'client@demo.liguey';
  email_prestataire text := 'prestataire@demo.liguey';
  email_recruteur text := 'recruteur@demo.liguey';
  email_demandeur text := 'demandeur@demo.liguey';

  u_client uuid;
  u_prestataire uuid;
  u_recruteur uuid;
  u_demandeur uuid;
  offre1_id bigint;
  offre2_id bigint;
begin
  select id into u_client from auth.users where lower(email) = lower(email_client);
  select id into u_prestataire from auth.users where lower(email) = lower(email_prestataire);
  select id into u_recruteur from auth.users where lower(email) = lower(email_recruteur);
  select id into u_demandeur from auth.users where lower(email) = lower(email_demandeur);

  if u_client is null or u_prestataire is null or u_recruteur is null or u_demandeur is null then
    raise exception using message =
      concat(
        'Seed impossible: au moins 1 user Auth manquant.', chr(10),
        'Attendus:', chr(10),
        ' - ', email_client, chr(10),
        ' - ', email_prestataire, chr(10),
        ' - ', email_recruteur, chr(10),
        ' - ', email_demandeur, chr(10),
        chr(10),
        'Users trouvés dans auth.users (top 20):', chr(10),
        (
          select coalesce(string_agg(email, chr(10)), '(aucun)') from (
            select email from auth.users order by created_at desc limit 20
          ) t
        )
      );
  end if;

  -- PROFILES (upsert)
  insert into public.profiles (id, email, role, first_name, last_name, phone, city, region, bio, rating, review_count, availability, company_name)
  values
    (u_client,      email_client,      'client',      'Awa',   'Diop',   '+221770000001', 'Dakar',  'Dakar',  'Je cherche des prestataires fiables pour des travaux à domicile.', 4.6, 12, 'disponible', null),
    (u_prestataire, email_prestataire, 'prestataire', 'Moussa','Sarr',   '+221770000002', 'Dakar',  'Dakar',  'Plombier/électricien. Intervention rapide, devis clair.',          4.8, 41, 'disponible', null),
    (u_recruteur,   email_recruteur,   'recruteur',   'Fatou', 'Ndiaye', '+221770000003', 'Thiès',  'Thiès',  'PME locale en croissance. Nous recrutons régulièrement.',          4.4,  8, 'disponible', 'SenTech Services'),
    (u_demandeur,   email_demandeur,   'demandeur',   'Ibrahima','Ba',   '+221770000004', 'Kaolack','Kaolack','Motivé, disponible, prêt à apprendre. Expérience terrain.',        4.2,  5, 'disponible', null)
  on conflict (id) do update set
    role = excluded.role,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    phone = excluded.phone,
    city = excluded.city,
    region = excluded.region,
    bio = excluded.bio,
    rating = excluded.rating,
    review_count = excluded.review_count,
    availability = excluded.availability,
    company_name = excluded.company_name,
    updated_at = now();

  -- SERVICES (prestataire)
  insert into public.services (user_id, title, description, category, price_type, price_min, price_max, city, region, zones, availability, available_days, response_time, images, status, view_count, contact_count, rating, review_count)
  values
    (u_prestataire,
     'Dépannage plomberie & fuites (24/7)',
     'Intervention rapide: fuites, robinets, chauffe-eau, évacuations. Devis avant travaux. Matériel pro.',
     'plomberie', 'heure', 5000, 15000, 'Dakar', 'Dakar',
     '["Parcelles Assainies","Pikine","Guédiawaye"]'::jsonb,
     'disponible', '["lundi","mardi","mercredi","jeudi","vendredi","samedi"]'::jsonb, '24h',
     '[]'::jsonb, 'actif', 128, 34, 4.8, 41),
    (u_prestataire,
     'Installation électrique sécurisée',
     'Pose prises/interrupteurs, diagnostic, remise en conformité, éclairage. Travail propre et sécurisé.',
     'electricite', 'forfait', 15000, 80000, 'Dakar', 'Dakar',
     '["Dakar","Rufisque"]'::jsonb,
     'disponible', '["lundi","mardi","mercredi","jeudi","vendredi"]'::jsonb, '48h',
     '[]'::jsonb, 'actif', 96, 21, 4.7, 28)
  ;

  -- OFFRES (recruteur)
  insert into public.offres (user_id, title, description, contract_type, sector, city, region, address, salary_min, salary_max, salary_period, experience_required, education_level, skills, languages, number_of_positions, work_schedule, start_date, application_deadline, company_name, status, view_count, application_count)
  values
    (u_recruteur,
     'Assistant administratif (H/F)',
     'PME recherche un assistant administratif: accueil, classement, saisie, suivi dossiers. Bonne organisation et ponctualité.',
     'CDD', 'administration', 'Thiès', 'Thiès', 'Thiès Nord',
     120000, 180000, 'mois', '0-1_ans', 'bac',
     '["organisation","bureautique","communication"]'::jsonb,
     '["français"]'::jsonb,
     2, 'Temps plein', current_date + 7, current_date + 21,
     'SenTech Services', 'active', 210, 0),
    (u_recruteur,
     'Technicien support informatique (Junior)',
     'Support niveau 1: assistance utilisateurs, installation, diagnostic. Une première expérience est un plus.',
     'CDI', 'informatique', 'Dakar', 'Dakar', 'Plateau',
     200000, 350000, 'mois', '0-1_ans', 'bac_plus_2',
     '["support","windows","réseaux"]'::jsonb,
     '["français","anglais"]'::jsonb,
     1, 'Temps plein', current_date + 14, current_date + 30,
     'SenTech Services', 'active', 156, 0)
  ;

  -- Pour récupérer les 2 ids d'offres (si returning ne renvoie qu’un)
  select id into offre1_id from public.offres where user_id = u_recruteur order by created_at desc limit 1 offset 0;
  select id into offre2_id from public.offres where user_id = u_recruteur order by created_at desc limit 1 offset 1;

  -- CANDIDATURES (demandeur -> offres)
  insert into public.candidatures (offre_id, candidat_id, cover_letter, cv_text, status)
  values
    (offre1_id, u_demandeur,
     'Bonjour, je suis motivé et disponible. Je maîtrise les bases de la bureautique et je suis très sérieux.',
     'Expérience: stage 3 mois, saisie de données, accueil. Compétences: Word/Excel, rigueur.',
     'vue'),
    (offre2_id, u_demandeur,
     'Bonjour, passionné d’informatique. Je souhaite évoluer en support et apprendre rapidement.',
     'Compétences: Windows, installation logiciels, notions réseau. Disponible immédiatement.',
     'en_attente')
  on conflict do nothing;

  -- MESSAGES (client <-> prestataire)
  insert into public.messages (sender_id, receiver_id, content, is_read, message_type)
  values
    (u_client, u_prestataire, 'Bonjour, avez-vous une disponibilité demain matin pour une fuite ?', true, 'service'),
    (u_prestataire, u_client, 'Oui, je peux passer vers 10h. Pouvez-vous préciser l’adresse ?', true, 'service'),
    (u_client, u_prestataire, 'Parcelles Assainies Unité 15. Merci !', false, 'service');

  -- CONVERSATIONS (optionnel, pour la liste)
  insert into public.conversations (user1_id, user2_id, last_message_content, last_message_at, last_message_sender_id, unread_count_user1, unread_count_user2)
  values
    (least(u_client, u_prestataire), greatest(u_client, u_prestataire),
     'Parcelles Assainies Unité 15. Merci !', now(), u_client,
     0, 1)
  on conflict (user1_id, user2_id) do update set
    last_message_content = excluded.last_message_content,
    last_message_at = excluded.last_message_at,
    last_message_sender_id = excluded.last_message_sender_id,
    unread_count_user1 = excluded.unread_count_user1,
    unread_count_user2 = excluded.unread_count_user2,
    updated_at = now();

end $$;

