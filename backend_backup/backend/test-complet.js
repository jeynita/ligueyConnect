import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// Couleurs console
const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

// Compteurs
let passed = 0;
let failed = 0;
let total = 0;

// Données partagées entre les tests
const data = {
  tokens: {},
  users: {},
  profiles: {},
  services: {},
  offres: {},
  candidatures: {},
  messages: {},
  resetCode: null
};

// Instance axios
const api = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true
});

// Helpers
const ok = (msg) => { passed++; total++; console.log(`  ${c.green}✅ PASS${c.reset} - ${msg}`); };
const ko = (msg, err) => { failed++; total++; console.log(`  ${c.red}❌ FAIL${c.reset} - ${msg} ${c.yellow}→ ${err}${c.reset}`); };
const section = (title) => console.log(`\n${c.bold}${c.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}\n${c.bold}${c.cyan}  🧪 ${title}${c.reset}\n${c.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}\n`);
const info = (msg) => console.log(`  ${c.cyan}ℹ${c.reset}  ${msg}`);

// ============================================================
// TEST 1 : AUTHENTIFICATION
// ============================================================
async function testAuthentification() {
  section('TEST 1 : AUTHENTIFICATION (10 tests)');

  // 1.1 Inscription avec email invalide
  info('Inscription avec email invalide...');
  const r1 = await api.post('/auth/register', { email: 'pasunemail', password: 'Test1234', role: 'client' });
  r1.status === 400 ? ok('Email invalide rejeté') : ko('Email invalide accepté', r1.data.message);

  // 1.2 Inscription avec mot de passe trop court
  info('Inscription avec mot de passe trop court...');
  const r2 = await api.post('/auth/register', { email: 'test@test.sn', password: '123', role: 'client' });
  r2.status === 400 ? ok('Mot de passe trop court rejeté') : ko('Mot de passe trop court accepté', r2.data.message);

  // 1.3 Inscription Client valide
  info('Inscription Client valide...');
  const r3 = await api.post('/auth/register', { email: 'client@liguey.sn', password: 'Test1234', role: 'client' });
  if (r3.data.success) {
    ok('Client inscrit avec succès');
    data.tokens.client = r3.data.data.token;
    data.users.client = r3.data.data.user;
  } else {
    ko('Inscription client échouée', r3.data.message);
  }

  // 1.4 Inscription Prestataire
  info('Inscription Prestataire...');
  const r4 = await api.post('/auth/register', { email: 'prestataire@liguey.sn', password: 'Test1234', role: 'prestataire' });
  if (r4.data.success) {
    ok('Prestataire inscrit');
    data.tokens.prestataire = r4.data.data.token;
    data.users.prestataire = r4.data.data.user;
  } else {
    ko('Inscription prestataire échouée', r4.data.message);
  }

  // 1.5 Inscription Demandeur
  info('Inscription Demandeur...');
  const r5 = await api.post('/auth/register', { email: 'demandeur@liguey.sn', password: 'Test1234', role: 'demandeur' });
  if (r5.data.success) {
    ok('Demandeur inscrit');
    data.tokens.demandeur = r5.data.data.token;
    data.users.demandeur = r5.data.data.user;
  } else {
    ko('Inscription demandeur échouée', r5.data.message);
  }

  // 1.6 Inscription Recruteur
  info('Inscription Recruteur...');
  const r6 = await api.post('/auth/register', { email: 'recruteur@liguey.sn', password: 'Test1234', role: 'recruteur' });
  if (r6.data.success) {
    ok('Recruteur inscrit');
    data.tokens.recruteur = r6.data.data.token;
    data.users.recruteur = r6.data.data.user;
  } else {
    ko('Inscription recruteur échouée', r6.data.message);
  }

  // 1.7 Inscription avec email déjà utilisé
  info('Inscription avec email déjà utilisé...');
  const r7 = await api.post('/auth/register', { email: 'client@liguey.sn', password: 'Test1234', role: 'client' });
  r7.status === 400 ? ok('Email dupliqué rejeté') : ko('Email dupliqué accepté', r7.data.message);

  // 1.8 Connexion valide
  info('Connexion valide...');
  const r8 = await api.post('/auth/login', { email: 'client@liguey.sn', password: 'Test1234' });
  r8.data.success ? ok('Connexion réussie') : ko('Connexion échouée', r8.data.message);

  // 1.9 Connexion avec mauvais mot de passe
  info('Connexion avec mauvais mot de passe...');
  const r9 = await api.post('/auth/login', { email: 'client@liguey.sn', password: 'MauvaisPass' });
  r9.status === 401 ? ok('Mauvais mot de passe rejeté') : ko('Mauvais mot de passe accepté', r9.data.message);

  // 1.10 Mot de passe oublié
  info('Mot de passe oublié...');
  const r10 = await api.post('/auth/forgot-password', { email: 'client@liguey.sn' });
  if (r10.data.success) {
    ok('Code de réinitialisation généré');
    data.resetCode = r10.data.devCode;
    console.log(`      ${c.yellow}🔐 Code : ${data.resetCode}${c.reset}`);
  } else {
    ko('Réinitialisation échouée', r10.data.message);
  }
}

// ============================================================
// TEST 2 : PROFILS
// ============================================================
async function testProfils() {
  section('TEST 2 : PROFILS (6 tests)');

  // 2.1 Accès profil sans token
  info('Accès profil sans token...');
  const r1 = await api.get('/profiles/me');
  r1.status === 401 ? ok('Accès refusé sans token') : ko('Accès autorisé sans token', r1.status);

  // 2.2 Créer profil Prestataire
  info('Création profil Prestataire...');
  const r2 = await api.put('/profiles/me', {
    firstName: 'Moussa',
    lastName: 'Diallo',
    phone: '771234567',
    city: 'Dakar',
    region: 'Dakar',
    profession: 'Plombier',
    bio: 'Plombier professionnel avec 5 ans d\'expérience',
    skills: ['Plomberie', 'Électricité', 'Chauffage'],
    experience: '5 ans d\'expérience',
    hourlyRate: 5000,
    availability: 'disponible'
  }, { headers: { Authorization: `Bearer ${data.tokens.prestataire}` } });
  if (r2.data.success) {
    ok('Profil prestataire créé');
    data.profiles.prestataire = r2.data.data;
  } else {
    ko('Profil prestataire échoué', r2.data.message);
  }

  // 2.3 Créer profil Recruteur
  info('Création profil Recruteur...');
  const r3 = await api.put('/profiles/me', {
    firstName: 'Fatou',
    lastName: 'Sow',
    phone: '775555555',
    city: 'Dakar',
    companyName: 'TechSenegal SARL',
    companySize: '10-50',
    companySector: 'informatique'
  }, { headers: { Authorization: `Bearer ${data.tokens.recruteur}` } });
  r3.data.success ? ok('Profil recruteur créé') : ko('Profil recruteur échoué', r3.data.message);

  // 2.4 Créer profil Demandeur
  info('Création profil Demandeur...');
  const r4 = await api.put('/profiles/me', {
    firstName: 'Ibrahima',
    lastName: 'Ndiaye',
    phone: '779999999',
    city: 'Dakar',
    profession: 'Développeur Web',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: '3 ans d\'expérience en développement web'
  }, { headers: { Authorization: `Bearer ${data.tokens.demandeur}` } });
  r4.data.success ? ok('Profil demandeur créé') : ko('Profil demandeur échoué', r4.data.message);

  // 2.5 Récupérer mon profil
  info('Récupération mon profil...');
  const r5 = await api.get('/profiles/me', {
    headers: { Authorization: `Bearer ${data.tokens.prestataire}` }
  });
  r5.data.success ? ok('Profil récupéré avec succès') : ko('Récupération profil échouée', r5.data.message);

  // 2.6 Voir le profil d'un autre utilisateur
  info('Voir profil d\'un autre utilisateur...');
  const r6 = await api.get(`/profiles/${data.users.prestataire.id}`);
  r6.data.success ? ok('Profil autre utilisateur visible') : ko('Profil autre utilisateur non visible', r6.data.message);
}

// ============================================================
// TEST 3 : SERVICES
// ============================================================
async function testServices() {
  section('TEST 3 : SERVICES (8 tests)');

  // 3.1 Créer service sans token
  info('Créer service sans token...');
  const r1 = await api.post('/services', { title: 'Test' });
  r1.status === 401 ? ok('Création service refusée sans token') : ko('Création service autorisée sans token', r1.status);

  // 3.2 Créer service par un client (non autorisé)
  info('Créer service par un client (non autorisé)...');
  const r2 = await api.post('/services', {
    title: 'Test service',
    description: 'Description test',
    category: 'plomberie'
  }, { headers: { Authorization: `Bearer ${data.tokens.client}` } });
  r2.status === 403 ? ok('Client ne peut pas créer un service') : ko('Client a pu créer un service', r2.status);

  // 3.3 Créer service Plomberie
  info('Création service Plomberie...');
  const r3 = await api.post('/services', {
    title: 'Plomberie - Dépannage et installation',
    description: 'Service de plomberie professionnelle à Dakar. Installation, réparation et dépannage d\'urgence disponible 7j/7.',
    category: 'plomberie',
    priceType: 'heure',
    priceMin: 5000,
    priceMax: 10000,
    city: 'Dakar',
    region: 'Dakar',
    zones: ['Plateau', 'Almadies', 'Sacré-Coeur'],
    availability: 'disponible',
    availableDays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
    responseTime: 'Moins de 2 heures'
  }, { headers: { Authorization: `Bearer ${data.tokens.prestataire}` } });
  if (r3.data.success) {
    ok('Service plomberie créé');
    data.services.plomberie = r3.data.data;
  } else {
    ko('Création service échouée', r3.data.message);
  }

  // 3.4 Créer second service
  info('Création service Électricité...');
  const r4 = await api.post('/services', {
    title: 'Électricité - Installation et réparation',
    description: 'Électricien certifié disponible pour tous vos travaux d\'installation et réparation électrique à domicile.',
    category: 'electricite',
    priceType: 'heure',
    priceMin: 8000,
    priceMax: 15000,
    city: 'Dakar',
    region: 'Dakar',
    zones: ['Dakar', 'Mermoz', 'Point E'],
    availability: 'disponible',
    availableDays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'],
    responseTime: 'Dans la journée'
  }, { headers: { Authorization: `Bearer ${data.tokens.prestataire}` } });
  r4.data.success ? ok('Service électricité créé') : ko('Création service électricité échouée', r4.data.message);

  // 3.5 Lister mes services
  info('Liste mes services...');
  const r5 = await api.get('/services/me', {
    headers: { Authorization: `Bearer ${data.tokens.prestataire}` }
  });
  if (r5.data.success) {
    ok(`${r5.data.count} service(s) trouvé(s)`);
  } else {
    ko('Liste services échouée', r5.data.message);
  }

  // 3.6 Recherche publique par catégorie
  info('Recherche services par catégorie...');
  const r6 = await api.get('/services/search', { params: { category: 'plomberie' } });
  if (r6.data.success) {
    ok(`Recherche : ${r6.data.count} service(s) trouvé(s)`);
  } else {
    ko('Recherche services échouée', r6.data.message);
  }

  // 3.7 Recherche par ville
  info('Recherche services par ville...');
  const r7 = await api.get('/services/search', { params: { city: 'Dakar' } });
  r7.data.success ? ok(`Recherche par ville : ${r7.data.count} résultat(s)`) : ko('Recherche par ville échouée', r7.data.message);

  // 3.8 Voir détail service
  if (data.services.plomberie) {
    info('Voir détail service...');
    const r8 = await api.get(`/services/${data.services.plomberie.id}`);
    r8.data.success ? ok('Détail service visible') : ko('Détail service non visible', r8.data.message);
  }
}

// ============================================================
// TEST 4 : OFFRES D'EMPLOI
// ============================================================
async function testOffres() {
  section('TEST 4 : OFFRES D\'EMPLOI (7 tests)');

  // 4.1 Créer offre sans token
  info('Créer offre sans token...');
  const r1 = await api.post('/offres', { title: 'Test' });
  r1.status === 401 ? ok('Création offre refusée sans token') : ko('Création offre autorisée sans token', r1.status);

  // 4.2 Créer offre par un client (non autorisé)
  info('Créer offre par un client (non autorisé)...');
  const r2 = await api.post('/offres', {
    title: 'Test offre',
    description: 'Description test',
    contractType: 'CDI'
  }, { headers: { Authorization: `Bearer ${data.tokens.client}` } });
  r2.status === 403 ? ok('Client ne peut pas créer une offre') : ko('Client a pu créer une offre', r2.status);

  // 4.3 Créer offre valide
  info('Création offre Développeur Full Stack...');
  const r3 = await api.post('/offres', {
    title: 'Développeur Full Stack',
    description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe technique. Vous serez en charge du développement et de la maintenance de nos applications web.',
    contractType: 'CDI',
    sector: 'informatique',
    city: 'Dakar',
    region: 'Dakar',
    companyName: 'TechSenegal SARL',
    salaryMin: 500000,
    salaryMax: 800000,
    salaryPeriod: 'mois',
    experienceRequired: '3-5_ans',
    educationLevel: 'bac_plus_3',
    skills: ['JavaScript', 'React', 'Node.js', 'MySQL'],
    languages: ['Français', 'Anglais'],
    numberOfPositions: 1,
    workSchedule: 'Temps plein'
  }, { headers: { Authorization: `Bearer ${data.tokens.recruteur}` } });
  if (r3.data.success) {
    ok('Offre créée');
    data.offres.dev = r3.data.data;
  } else {
    ko('Création offre échouée', r3.data.message);
  }

  // 4.4 Créer seconde offre
  info('Création offre Commercial...');
  const r4 = await api.post('/offres', {
    title: 'Commercial Terrain',
    description: 'Nous cherchons un commercial dynamique pour développer notre portefeuille client dans la région de Dakar.',
    contractType: 'CDD',
    sector: 'commerce',
    city: 'Dakar',
    region: 'Dakar',
    companyName: 'TechSenegal SARL',
    salaryMin: 200000,
    salaryMax: 400000,
    salaryPeriod: 'mois',
    experienceRequired: '1-3_ans',
    educationLevel: 'bac',
    skills: ['Vente', 'Négociation', 'Communication'],
    numberOfPositions: 2,
    workSchedule: 'Temps plein'
  }, { headers: { Authorization: `Bearer ${data.tokens.recruteur}` } });
  r4.data.success ? ok('Offre Commercial créée') : ko('Création offre Commercial échouée', r4.data.message);

  // 4.5 Lister mes offres
  info('Liste mes offres...');
  const r5 = await api.get('/offres/me', {
    headers: { Authorization: `Bearer ${data.tokens.recruteur}` }
  });
  r5.data.success ? ok(`${r5.data.count} offre(s) trouvée(s)`) : ko('Liste offres échouée', r5.data.message);

  // 4.6 Recherche publique
  info('Recherche offres publique...');
  const r6 = await api.get('/offres/search', { params: { sector: 'informatique' } });
  r6.data.success ? ok(`Recherche : ${r6.data.count} offre(s)`) : ko('Recherche offres échouée', r6.data.message);

  // 4.7 Voir secteurs disponibles
  info('Liste secteurs...');
  const r7 = await api.get('/offres/sectors');
  r7.data.success ? ok(`${r7.data.data.length} secteur(s) disponible(s)`) : ko('Liste secteurs échouée', r7.data.message);
}

// ============================================================
// TEST 5 : CANDIDATURES
// ============================================================
async function testCandidatures() {
  section('TEST 5 : CANDIDATURES (7 tests)');

  if (!data.offres.dev) {
    console.log(`  ${c.yellow}⚠️  Pas d'offre disponible - Tests candidatures ignorés${c.reset}`);
    return;
  }

  // 5.1 Postuler sans token
  info('Postuler sans token...');
  const r1 = await api.post(`/offres/${data.offres.dev.id}/postuler`, { coverLetter: 'Test' });
  r1.status === 401 ? ok('Candidature refusée sans token') : ko('Candidature autorisée sans token', r1.status);

  // 5.2 Postuler en tant que recruteur (non autorisé)
  info('Postuler en tant que recruteur...');
  const r2 = await api.post(`/offres/${data.offres.dev.id}/postuler`, {
    coverLetter: 'Test'
  }, { headers: { Authorization: `Bearer ${data.tokens.recruteur}` } });
  r2.status === 403 ? ok('Recruteur ne peut pas postuler') : ko('Recruteur a pu postuler', r2.status);

  // 5.3 Postuler valide
  info('Envoi candidature valide...');
  const r3 = await api.post(`/offres/${data.offres.dev.id}/postuler`, {
    coverLetter: 'Je suis très intéressé par ce poste de développeur Full Stack. Mon expérience de 3 ans en React et Node.js correspond à vos besoins.',
    cvText: 'Ibrahima Ndiaye - Développeur Web\n3 ans d\'expérience\nCompétences : JavaScript, React, Node.js, MySQL\nFormation : Licence Informatique - UCAD 2022'
  }, { headers: { Authorization: `Bearer ${data.tokens.demandeur}` } });
  if (r3.data.success) {
    ok('Candidature envoyée');
    data.candidatures.dev = r3.data.data;
  } else {
    ko('Candidature échouée', r3.data.message);
  }

  // 5.4 Postuler deux fois (non autorisé)
  info('Postuler deux fois à la même offre...');
  const r4 = await api.post(`/offres/${data.offres.dev.id}/postuler`, {
    coverLetter: 'Deuxième tentative'
  }, { headers: { Authorization: `Bearer ${data.tokens.demandeur}` } });
  r4.status === 400 ? ok('Double candidature refusée') : ko('Double candidature acceptée', r4.status);

  // 5.5 Voir mes candidatures (Demandeur)
  info('Liste mes candidatures...');
  const r5 = await api.get('/offres/candidatures', {
    headers: { Authorization: `Bearer ${data.tokens.demandeur}` }
  });
  r5.data.success ? ok(`${r5.data.count} candidature(s) trouvée(s)`) : ko('Liste candidatures échouée', r5.data.message);

  // 5.6 Voir candidatures reçues (Recruteur)
  info('Liste candidatures reçues...');
  const r6 = await api.get(`/offres/${data.offres.dev.id}/candidatures`, {
    headers: { Authorization: `Bearer ${data.tokens.recruteur}` }
  });
  r6.data.success ? ok(`${r6.data.count} candidature(s) reçue(s)`) : ko('Liste candidatures reçues échouée', r6.data.message);

  // 5.7 Modifier statut candidature
  if (data.candidatures.dev) {
    info('Modifier statut candidature...');
    const r7 = await api.put(`/offres/candidatures/${data.candidatures.dev.id}`, {
      status: 'retenue',
      recruiterNotes: 'Excellent profil, à convoquer en entretien'
    }, { headers: { Authorization: `Bearer ${data.tokens.recruteur}` } });
    r7.data.success ? ok('Statut candidature modifié → retenue') : ko('Modification statut échouée', r7.data.message);
  }
}

// ============================================================
// TEST 6 : MESSAGERIE
// ============================================================
async function testMessagerie() {
  section('TEST 6 : MESSAGERIE (8 tests)');

  // 6.1 Envoyer message sans token
  info('Envoyer message sans token...');
  const r1 = await api.post('/messages', { receiverId: 1, content: 'Test' });
  r1.status === 401 ? ok('Message refusé sans token') : ko('Message autorisé sans token', r1.status);

  // 6.2 Envoyer message à soi-même
  info('Envoyer message à soi-même...');
  const r2 = await api.post('/messages', {
    receiverId: data.users.client.id,
    content: 'Message à moi-même'
  }, { headers: { Authorization: `Bearer ${data.tokens.client}` } });
  r2.status === 400 ? ok('Auto-message refusé') : ko('Auto-message accepté', r2.status);

  // 6.3 Client → Prestataire
  info('Envoi message Client → Prestataire...');
  const r3 = await api.post('/messages', {
    receiverId: data.users.prestataire.id,
    content: 'Bonjour, êtes-vous disponible demain pour un dépannage urgent ?'
  }, { headers: { Authorization: `Bearer ${data.tokens.client}` } });
  r3.data.success ? ok('Message Client → Prestataire envoyé') : ko('Message Client → Prestataire échoué', r3.data.message);

  // 6.4 Prestataire → Client (réponse)
  info('Réponse Prestataire → Client...');
  const r4 = await api.post('/messages', {
    receiverId: data.users.client.id,
    content: 'Oui, je suis disponible demain après-midi. À quelle heure vous convient-il ?'
  }, { headers: { Authorization: `Bearer ${data.tokens.prestataire}` } });
  r4.data.success ? ok('Réponse Prestataire → Client envoyée') : ko('Réponse échouée', r4.data.message);

  // 6.5 Demandeur → Recruteur
  info('Envoi message Demandeur → Recruteur...');
  const r5 = await api.post('/messages', {
    receiverId: data.users.recruteur.id,
    content: 'Bonjour, j\'ai postulé à votre offre de développeur. Pouvez-vous me donner plus d\'informations ?'
  }, { headers: { Authorization: `Bearer ${data.tokens.demandeur}` } });
  r5.data.success ? ok('Message Demandeur → Recruteur envoyé') : ko('Message Demandeur échoué', r5.data.message);

  // 6.6 Voir conversations (Client)
  info('Liste conversations Client...');
  const r6 = await api.get('/messages/conversations', {
    headers: { Authorization: `Bearer ${data.tokens.client}` }
  });
  r6.data.success ? ok(`${r6.data.count} conversation(s)`) : ko('Conversations échouées', r6.data.message);

  // 6.7 Voir messages dans une conversation
  info('Voir messages dans une conversation...');
  const r7 = await api.get(`/messages/${data.users.prestataire.id}`, {
    headers: { Authorization: `Bearer ${data.tokens.client}` }
  });
  r7.data.success ? ok(`${r7.data.count} message(s) dans la conversation`) : ko('Messages échoués', r7.data.message);

  // 6.8 Compter messages non lus
  info('Compter messages non lus...');
  const r8 = await api.get('/messages/unread-count', {
    headers: { Authorization: `Bearer ${data.tokens.prestataire}` }
  });
  r8.data.success ? ok(`${r8.data.data.unreadCount} message(s) non lu(s)`) : ko('Comptage non lus échoué', r8.data.message);
}

// ============================================================
// TEST 7 : SÉCURITÉ
// ============================================================
async function testSecurite() {
  section('TEST 7 : SÉCURITÉ (5 tests)');

  // 7.1 Token invalide
  info('Accès avec token invalide...');
  const r1 = await api.get('/profiles/me', {
    headers: { Authorization: 'Bearer tokeninvalide123' }
  });
  r1.status === 401 ? ok('Token invalide rejeté') : ko('Token invalide accepté', r1.status);

  // 7.2 Accès route admin sans être admin
  info('Accès route protégée sans bon rôle...');
  const r2 = await api.get('/offres/me', {
    headers: { Authorization: `Bearer ${data.tokens.client}` }
  });
  r2.status === 403 ? ok('Accès admin refusé au client') : ko('Client a accès aux routes recruteur', r2.status);

  // 7.3 Modifier offre d'un autre recruteur
  if (data.offres.dev) {
    info('Modifier offre d\'un autre utilisateur...');
    const r3 = await api.put(`/offres/${data.offres.dev.id}`, {
      title: 'Offre piratée'
    }, { headers: { Authorization: `Bearer ${data.tokens.demandeur}` } });
    r3.status === 403 ? ok('Modification offre tierce refusée') : ko('Modification offre tierce acceptée', r3.status);
  }

  // 7.4 Accès sans Authorization header
  info('Accès sans header Authorization...');
  const r4 = await api.get('/profiles/me');
  r4.status === 401 ? ok('Accès sans header refusé') : ko('Accès sans header accepté', r4.status);

  // 7.5 Reset password avec mauvais code
  info('Reset password avec mauvais code...');
  const r5 = await api.post('/auth/reset-password', {
    email: 'client@liguey.sn',
    code: '000000',
    newPassword: 'NouveauTest1234'
  });
  r5.status === 400 ? ok('Mauvais code de reset refusé') : ko('Mauvais code de reset accepté', r5.status);
}

// ============================================================
// RÉSUMÉ FINAL
// ============================================================
function afficherResume() {
  const successRate = Math.round((passed / total) * 100);
  
  console.log(`\n${c.bold}${c.blue}${'═'.repeat(60)}${c.reset}`);
  console.log(`${c.bold}${c.cyan}  📊 RÉSUMÉ FINAL DES TESTS${c.reset}`);
  console.log(`${c.bold}${c.blue}${'═'.repeat(60)}${c.reset}\n`);
  
  console.log(`  ${c.green}✅ Tests réussis  : ${passed}/${total}${c.reset}`);
  console.log(`  ${c.red}❌ Tests échoués  : ${failed}/${total}${c.reset}`);
  console.log(`  ${c.cyan}📈 Taux de succès : ${successRate}%${c.reset}\n`);

  if (successRate === 100) {
    console.log(`  ${c.green}${c.bold}🎉 PARFAIT ! TOUS LES TESTS PASSENT !${c.reset}`);
    console.log(`  ${c.green}${c.bold}✅ PRÊT POUR LE DÉPLOIEMENT !${c.reset}\n`);
  } else if (successRate >= 80) {
    console.log(`  ${c.yellow}${c.bold}👍 BON RÉSULTAT ! Quelques corrections à faire.${c.reset}\n`);
  } else {
    console.log(`  ${c.red}${c.bold}⚠️  ATTENTION ! Des corrections importantes sont nécessaires.${c.reset}\n`);
  }

  console.log(`${c.bold}${c.blue}${'═'.repeat(60)}${c.reset}\n`);
}

// ============================================================
// LANCEMENT DES TESTS
// ============================================================
async function runTests() {
  console.log(`\n${c.bold}${c.cyan}${'═'.repeat(60)}${c.reset}`);
  console.log(`${c.bold}${c.cyan}  🚀 LIGUEY CONNECT - TESTS COMPLETS V2${c.reset}`);
  console.log(`${c.bold}${c.cyan}  📅 ${new Date().toLocaleString('fr-FR')}${c.reset}`);
  console.log(`${c.bold}${c.cyan}${'═'.repeat(60)}${c.reset}`);

  try {
    await testAuthentification();
    await testProfils();
    await testServices();
    await testOffres();
    await testCandidatures();
    await testMessagerie();
    await testSecurite();
    afficherResume();
  } catch (error) {
    console.log(`\n${c.red}${c.bold}💥 ERREUR CRITIQUE : ${error.message}${c.reset}`);
    console.log(`${c.yellow}Vérifiez que le backend tourne sur http://localhost:3000${c.reset}\n`);
  }
}

runTests();