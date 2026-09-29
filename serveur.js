/**
 * Serveur Express pour l'application de gestion de tâches (Todo List)
 * Fournit une API REST pour gérer les tâches
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// ========== INITIALISATION ==========
const app = express();
const PORT = 3000;
const FICHIER_TACHES = path.join(__dirname, 'taches.json');

// ========== MIDDLEWARE ==========
// Active CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Parse les données JSON du body
app.use(express.json());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(__dirname));

// ========== FONCTIONS UTILITAIRES ==========

/**
 * Charge toutes les tâches depuis le fichier JSON
 * @returns {Array} - Tableau des tâches
 */
function chargerTaches() {
    try {
        if (fs.existsSync(FICHIER_TACHES)) {
            const donnees = fs.readFileSync(FICHIER_TACHES, 'utf-8');
            return JSON.parse(donnees);
        }
        return [];
    } catch (erreur) {
        console.error('Erreur lors de la lecture des tâches:', erreur);
        return [];
    }
}

/**
 * Sauvegarde les tâches dans le fichier JSON
 * @param {Array} taches - Tableau des tâches à sauvegarder
 */
function sauvegarderTaches(taches) {
    try {
        fs.writeFileSync(FICHIER_TACHES, JSON.stringify(taches, null, 2), 'utf-8');
    } catch (erreur) {
        console.error('Erreur lors de la sauvegarde des tâches:', erreur);
    }
}

/**
 * Trouve le prochain ID disponible
 * @param {Array} taches - Tableau des tâches
 * @returns {number} - Prochain ID
 */
function trouverProchainId(taches) {
    if (taches.length === 0) return 1;
    return Math.max(...taches.map(t => t.id)) + 1;
}

// ========== ROUTES API ==========

/**
 * GET /api/taches
 * Récupère toutes les tâches
 */
app.get('/api/taches', (req, res) => {
    const taches = chargerTaches();
    res.json(taches);
});

/**
 * POST /api/taches
 * Ajoute une nouvelle tâche
 * Body: { texte: string }
 */
app.post('/api/taches', (req, res) => {
    const { texte } = req.body;

    // Validation
    if (!texte || texte.trim() === '') {
        return res.status(400).json({ 
            erreur: 'Le texte de la tâche ne doit pas être vide' 
        });
    }

    // Charger les tâches existantes
    const taches = chargerTaches();

    // Créer la nouvelle tâche
    const nouvelleTache = {
        id: trouverProchainId(taches),
        texte: texte.trim(),
        terminee: false
    };

    // Ajouter à la liste
    taches.push(nouvelleTache);

    // Sauvegarder
    sauvegarderTaches(taches);

    // Retourner la tâche créée
    res.status(201).json(nouvelleTache);
});

/**
 * PUT /api/taches/:id
 * Met à jour une tâche (bascule l'état de completion)
 * Body: { terminee: boolean } (optionnel)
 */
app.put('/api/taches/:id', (req, res) => {
    const { id } = req.params;
    const { terminee, texte } = req.body;

    // Charger les tâches
    let taches = chargerTaches();

    // Trouver la tâche
    const tacheIndex = taches.findIndex(t => t.id === parseInt(id));

    if (tacheIndex === -1) {
        return res.status(404).json({ 
            erreur: 'Tâche non trouvée' 
        });
    }

    // Mettre à jour le statut ou le texte
    if (terminee !== undefined) {
        taches[tacheIndex].terminee = terminee;
    }
    if (texte !== undefined && texte.trim() !== '') {
        taches[tacheIndex].texte = texte.trim();
    }

    // Sauvegarder
    sauvegarderTaches(taches);

    // Retourner la tâche mise à jour
    res.json(taches[tacheIndex]);
});

/**
 * DELETE /api/taches/:id
 * Supprime une tâche
 */
app.delete('/api/taches/:id', (req, res) => {
    const { id } = req.params;

    // Charger les tâches
    let taches = chargerTaches();

    // Trouver et supprimer la tâche
    const tacheIndex = taches.findIndex(t => t.id === parseInt(id));

    if (tacheIndex === -1) {
        return res.status(404).json({ 
            erreur: 'Tâche non trouvée' 
        });
    }

    // Supprimer la tâche
    const tacheSupprimee = taches.splice(tacheIndex, 1)[0];

    // Sauvegarder
    sauvegarderTaches(taches);

    // Confirmer la suppression
    res.json({ 
        message: 'Tâche supprimée avec succès',
        tache: tacheSupprimee 
    });
});

// ========== GESTION DES ERREURS ==========

/**
 * Route 404 - Page non trouvée
 */
app.use((req, res) => {
    res.status(404).json({ 
        erreur: 'Route non trouvée' 
    });
});

// ========== DÉMARRAGE DU SERVEUR ==========

app.listen(PORT, () => {
    console.log(`\n✅ Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📱 Ouvrez votre navigateur à : http://localhost:${PORT}`);
    console.log(`📂 Les tâches sont sauvegardées dans : ${FICHIER_TACHES}\n`);
});
