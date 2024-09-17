const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;
const session = require('express-session');
const { insertUser, findUserByEmail } = require('./database');

const app = express();

// Configuration de la session
app.use(session({
    secret: 'votre_clé_secrète_ici', // Changez ceci pour une chaîne aléatoire
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Mettez à true si vous utilisez HTTPS
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route pour servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour l'inscription
app.post('/api/inscription', async (req, res) => {
    const { prenom, nom, email, password } = req.body;
    
    // Vérification du domaine de l'email
    if (!email.endsWith('@laplateforme.io')) {
        return res.status(400).json({ error: 'Seules les adresses email de La Plateforme_ sont autorisées.' });
    }

    try {
        // Lire le fichier data.json
        const data = await fs.readFile('data.json', 'utf8');
        const jsonData = JSON.parse(data);
        
        // Ajouter le nouvel utilisateur
        const newUser = { prenom, nom, email, password };
        jsonData.users.push(newUser);

        // Écrire les données mises à jour dans data.json
        await fs.writeFile('data.json', JSON.stringify(jsonData, null, 2));

        // Insérer l'utilisateur dans la base de données
        await insertUser(newUser);

        res.status(201).json({ message: 'Utilisateur inscrit avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
});

// Nouvelle route pour la connexion
app.post('/api/connexion', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({ error: 'Utilisateur non trouvé' });
        }

        if (user.password !== password) {
            return res.status(400).json({ error: 'Mot de passe incorrect' });
        }

        // Stocker les informations de l'utilisateur dans la session
        req.session.user = {
            id: user.id,
            prenom: user.prenom,
            nom: user.nom,
            email: user.email
        };

        res.status(200).json({ message: 'Connexion réussie', user: req.session.user });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

// Route pour la déconnexion
app.post('/api/deconnexion', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
        }
        res.status(200).json({ message: 'Déconnexion réussie' });
    });
});

// Middleware pour vérifier si l'utilisateur est connecté
function estConnecte(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Non autorisé' });
    }
}

// Exemple de route protégée
app.get('/api/profil', estConnecte, (req, res) => {
    res.json({ user: req.session.user });
});

module.exports = app;
