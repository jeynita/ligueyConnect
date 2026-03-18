    import axios from 'axios';

    const BASE_URL = 'http://localhost:3000/api';
    const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
    };

    let tokens = {};
    let testData = {
    users: {},
    services: {},
    offres: {},
    candidatures: {},
    conversations: {}
    };

    const log = {
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
    section: (msg) => console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}\n${colors.blue}${msg}${colors.reset}\n${colors.blue}${'='.repeat(60)}${colors.reset}\n`)
    };

    // Helper pour les requêtes
    const api = axios.create({
    baseURL: BASE_URL,
    validateStatus: () => true // Ne pas throw sur les erreurs HTTP
    });

    // Tests
    async function testAuth() {
    log.section('TEST 1 : AUTHENTIFICATION');

    // Inscription Client
    log.info('Inscription Client...');
    const registerClient = await api.post('/auth/register', {
        email: 'client-test@liguey.sn',
        password: 'Test1234',
        role: 'client'
    });
    
    if (registerClient.data.success) {
        log.success('Client inscrit');
        tokens.client = registerClient.data.data.token;
        testData.users.client = registerClient.data.data.user;
    } else {
        log.error(`Inscription client échouée : ${registerClient.data.message}`);
    }

    // Inscription Prestataire
    log.info('Inscription Prestataire...');
    const registerPrestataire = await api.post('/auth/register', {
        email: 'prestataire-test@liguey.sn',
        password: 'Test1234',
        role: 'prestataire'
    });
    
    if (registerPrestataire.data.success) {
        log.success('Prestataire inscrit');
        tokens.prestataire = registerPrestataire.data.data.token;
        testData.users.prestataire = registerPrestataire.data.data.user;
    } else {
        log.error(`Inscription prestataire échouée : ${registerPrestataire.data.message}`);
    }

    // Inscription Demandeur
    log.info('Inscription Demandeur...');
    const registerDemandeur = await api.post('/auth/register', {
        email: 'demandeur-test@liguey.sn',
        password: 'Test1234',
        role: 'demandeur'
    });
    
    if (registerDemandeur.data.success) {
        log.success('Demandeur inscrit');
        tokens.demandeur = registerDemandeur.data.data.token;
        testData.users.demandeur = registerDemandeur.data.data.user;
    } else {
        log.error(`Inscription demandeur échouée : ${registerDemandeur.data.message}`);
    }

    // Inscription Recruteur
    log.info('Inscription Recruteur...');
    const registerRecruteur = await api.post('/auth/register', {
        email: 'recruteur-test@liguey.sn',
        password: 'Test1234',
        role: 'recruteur'
    });
    
    if (registerRecruteur.data.success) {
        log.success('Recruteur inscrit');
        tokens.recruteur = registerRecruteur.data.data.token;
        testData.users.recruteur = registerRecruteur.data.data.user;
    } else {
        log.error(`Inscription recruteur échouée : ${registerRecruteur.data.message}`);
    }

    // Test Connexion
    log.info('Test connexion Client...');
    const login = await api.post('/auth/login', {
        email: 'client-test@liguey.sn',
        password: 'Test1234'
    });
    
    if (login.data.success) {
        log.success('Connexion réussie');
    } else {
        log.error(`Connexion échouée : ${login.data.message}`);
    }

    // Test Mot de passe oublié
    log.info('Test réinitialisation mot de passe...');
    const forgotPassword = await api.post('/auth/forgot-password', {
        email: 'client-test@liguey.sn'
    });
    
    if (forgotPassword.data.success) {
        log.success('Code de réinitialisation généré');
        console.log(`   Code : ${forgotPassword.data.devCode || 'Voir console backend'}`);
    } else {
        log.error(`Réinitialisation échouée : ${forgotPassword.data.message}`);
    }
    }

    async function testProfiles() {
    log.section('TEST 2 : PROFILS');

    // Créer profil Prestataire
    log.info('Création profil Prestataire...');
    const profilePrestataire = await api.post('/profiles', {
        firstName: 'Jean',
        lastName: 'Dupont',
        phone: '771234567',
        city: 'Dakar',
        region: 'Dakar',
        profession: 'Plombier',
        skills: ['Plomberie', 'Électricité', 'Chauffage'],
        experience: '5 ans d\'expérience professionnelle',
        hourlyRate: 5000,
        availability: 'disponible'
    }, {
        headers: { Authorization: `Bearer ${tokens.prestataire}` }
    });
    
    if (profilePrestataire.data.success) {
        log.success('Profil prestataire créé');
    } else {
        log.error(`Profil prestataire échoué : ${profilePrestataire.data.message}`);
    }

    // Créer profil Recruteur
    log.info('Création profil Recruteur...');
    const profileRecruteur = await api.post('/profiles', {
        firstName: 'Marie',
        lastName: 'Sow',
        phone: '775555555',
        city: 'Dakar',
        companyName: 'TechSenegal',
        companySize: '10-50'
    }, {
        headers: { Authorization: `Bearer ${tokens.recruteur}` }
    });
    
    if (profileRecruteur.data.success) {
        log.success('Profil recruteur créé');
    } else {
        log.error(`Profil recruteur échoué : ${profileRecruteur.data.message}`);
    }
    }

    async function testServices() {
    log.section('TEST 3 : SERVICES');

    // Créer service
    log.info('Création service Plomberie...');
    const service = await api.post('/services', {
        title: 'Plomberie - Dépannage et installation',
        description: 'Service de plomberie professionnelle à Dakar. Installation, réparation, dépannage d\'urgence. Disponible 7j/7.',
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
    }, {
        headers: { Authorization: `Bearer ${tokens.prestataire}` }
    });
    
    if (service.data.success) {
        log.success('Service créé');
        testData.services.plomberie = service.data.data;
    } else {
        log.error(`Service échoué : ${service.data.message}`);
    }

    // Lister mes services
    log.info('Liste des services du prestataire...');
    const myServices = await api.get('/services/me', {
        headers: { Authorization: `Bearer ${tokens.prestataire}` }
    });
    
    if (myServices.data.success) {
        log.success(`${myServices.data.count} service(s) trouvé(s)`);
    } else {
        log.error(`Liste services échouée : ${myServices.data.message}`);
    }

    // Recherche publique
    log.info('Recherche publique de services...');
    const searchServices = await api.get('/services/search', {
        params: { category: 'plomberie', city: 'Dakar' }
    });
    
    if (searchServices.data.success) {
        log.success(`${searchServices.data.count} service(s) trouvé(s) dans la recherche`);
    } else {
        log.error(`Recherche échouée : ${searchServices.data.message}`);
    }
    }

    async function testOffres() {
    log.section('TEST 4 : OFFRES D\'EMPLOI');

    // Créer offre
    log.info('Création offre d\'emploi...');
    const offre = await api.post('/offres', {
        title: 'Développeur Full Stack',
        description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe technique. Vous serez en charge du développement et de la maintenance de nos applications web.',
        contractType: 'CDI',
        sector: 'informatique',
        city: 'Dakar',
        region: 'Dakar',
        salaryMin: 500000,
        salaryMax: 800000,
        salaryPeriod: 'mois',
        experienceRequired: '3-5_ans',
        educationLevel: 'bac_plus_3',
        skills: ['JavaScript', 'React', 'Node.js', 'MySQL'],
        languages: ['Français', 'Anglais'],
        numberOfPositions: 1,
        workSchedule: 'Temps plein'
    }, {
        headers: { Authorization: `Bearer ${tokens.recruteur}` }
    });
    
    if (offre.data.success) {
        log.success('Offre créée');
        testData.offres.dev = offre.data.data;
    } else {
        log.error(`Offre échouée : ${offre.data.message}`);
    }

    // Recherche offres
    log.info('Recherche offres...');
    const searchOffres = await api.get('/offres/search', {
        params: { sector: 'informatique', city: 'Dakar' }
    });
    
    if (searchOffres.data.success) {
        log.success(`${searchOffres.data.count} offre(s) trouvée(s)`);
    } else {
        log.error(`Recherche offres échouée : ${searchOffres.data.message}`);
    }
    }

    async function testCandidatures() {
    log.section('TEST 5 : CANDIDATURES');

    if (!testData.offres.dev) {
        log.error('Pas d\'offre disponible pour postuler');
        return;
    }

    // Postuler
    log.info('Envoi candidature...');
    const candidature = await api.post(`/offres/${testData.offres.dev.id}/postuler`, {
        coverLetter: 'Je suis très intéressé par ce poste de développeur Full Stack. Mon expérience en React et Node.js correspond parfaitement à vos besoins.',
        cvText: '5 ans d\'expérience en développement web. Projets : e-commerce, applications SaaS, APIs RESTful.'
    }, {
        headers: { Authorization: `Bearer ${tokens.demandeur}` }
    });
    
    if (candidature.data.success) {
        log.success('Candidature envoyée');
        testData.candidatures.dev = candidature.data.data;
    } else {
        log.error(`Candidature échouée : ${candidature.data.message}`);
    }

    // Voir mes candidatures (Demandeur)
    log.info('Liste candidatures du demandeur...');
    const myCandidatures = await api.get('/offres/candidatures', {
        headers: { Authorization: `Bearer ${tokens.demandeur}` }
    });
    
    if (myCandidatures.data.success) {
        log.success(`${myCandidatures.data.count} candidature(s) envoyée(s)`);
    } else {
        log.error(`Liste candidatures échouée : ${myCandidatures.data.message}`);
    }

    // Voir candidatures reçues (Recruteur)
    log.info('Liste candidatures reçues par le recruteur...');
    const candidaturesRecues = await api.get(`/offres/${testData.offres.dev.id}/candidatures`, {
        headers: { Authorization: `Bearer ${tokens.recruteur}` }
    });
    
    if (candidaturesRecues.data.success) {
        log.success(`${candidaturesRecues.data.count} candidature(s) reçue(s)`);
    } else {
        log.error(`Liste candidatures reçues échouée : ${candidaturesRecues.data.message}`);
    }
    }

    async function testMessages() {
    log.section('TEST 6 : MESSAGERIE');

    if (!testData.users.prestataire) {
        log.error('Pas de prestataire disponible pour messagerie');
        return;
    }

    // Envoyer message (Client → Prestataire)
    log.info('Envoi message Client → Prestataire...');
    const message1 = await api.post('/messages', {
        receiverId: testData.users.prestataire.id,
        content: 'Bonjour, êtes-vous disponible demain pour un dépannage ?'
    }, {
        headers: { Authorization: `Bearer ${tokens.client}` }
    });
    
    if (message1.data.success) {
        log.success('Message envoyé');
    } else {
        log.error(`Message échoué : ${message1.data.message}`);
    }

    // Voir conversations (Prestataire)
    log.info('Liste conversations du prestataire...');
    const conversations = await api.get('/messages/conversations', {
        headers: { Authorization: `Bearer ${tokens.prestataire}` }
    });
    
    if (conversations.data.success) {
        log.success(`${conversations.data.count} conversation(s)`);
    } else {
        log.error(`Conversations échouées : ${conversations.data.message}`);
    }

    // Répondre (Prestataire → Client)
    log.info('Réponse Prestataire → Client...');
    const message2 = await api.post('/messages', {
        receiverId: testData.users.client.id,
        content: 'Oui, je suis disponible demain après-midi. À quelle heure ?'
    }, {
        headers: { Authorization: `Bearer ${tokens.prestataire}` }
    });
    
    if (message2.data.success) {
        log.success('Réponse envoyée');
    } else {
        log.error(`Réponse échouée : ${message2.data.message}`);
    }

    // Voir messages (Client)
    log.info('Liste messages Client ↔ Prestataire...');
    const messages = await api.get(`/messages/${testData.users.prestataire.id}`, {
        headers: { Authorization: `Bearer ${tokens.client}` }
    });
    
    if (messages.data.success) {
        log.success(`${messages.data.count} message(s) dans la conversation`);
    } else {
        log.error(`Messages échoués : ${messages.data.message}`);
    }
    }

    // Exécution
    async function runTests() {
    console.log(`\n${colors.cyan}${'═'.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}  🧪 TESTS AUTOMATIQUES API LIGUEY CONNECT${colors.reset}`);
    console.log(`${colors.cyan}${'═'.repeat(60)}${colors.reset}\n`);

    try {
        await testAuth();
        await testProfiles();
        await testServices();
        await testOffres();
        await testCandidatures();
        await testMessages();

        log.section('RÉSUMÉ DES TESTS');
        log.success('Tous les tests terminés !');
        console.log(`\n${colors.yellow}⚠ Vérifiez les messages d'erreur ci-dessus pour les tests échoués${colors.reset}\n`);
        
    } catch (error) {
        log.error(`Erreur critique : ${error.message}`);
        console.error(error);
    }
    }

    runTests();