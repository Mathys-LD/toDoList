/**
 * Frontend JavaScript pour Todo List
 * Communique avec le serveur Express via l'API REST
 */

// ========== CONFIGURATION API ==========
const URL_API = 'http://localhost:3000/api/taches';

// ========== VARIABLES GLOBALES ==========
let listeTaches = [];

// ========== ÉLÉMENTS DU DOM ==========
const champSaisie = document.getElementById("champSaisie");
const boutonAjouter = document.getElementById("boutonAjouter");
const listeTachesDiv = document.getElementById("listeTaches");
const compteurElement = document.getElementById("compteurTaches");

// ========== FONCTIONS API (FETCH) ==========

/**
 * Récupère toutes les tâches depuis le serveur
 */
async function chargerTaches() {
    try {
        const reponse = await fetch(URL_API);
        if (!reponse.ok) {
            throw new Error('Erreur lors du chargement des tâches');
        }
        listeTaches = await reponse.json();
        afficherTaches();
    } catch (erreur) {
        console.error('Erreur:', erreur);
        listeTachesDiv.innerHTML = '<p class="erreur">❌ Erreur de connexion au serveur</p>';
    }
}

/**
 * Ajoute une nouvelle tâche au serveur
 */
async function ajouterTache() {
    const texte = champSaisie.value.trim();

    // Validation
    if (texte === "") {
        alert("Veuillez entrer une tâche valide!");
        return;
    }

    try {
        const reponse = await fetch(URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texte: texte })
        });

        if (!reponse.ok) {
            throw new Error('Erreur lors de l\'ajout de la tâche');
        }

        // Vider le champ et recharger la liste
        champSaisie.value = "";
        champSaisie.focus();
        await chargerTaches();
    } catch (erreur) {
        console.error('Erreur:', erreur);
        alert('Erreur: impossible d\'ajouter la tâche');
    }
}

/**
 * Bascule l'état de completion d'une tâche (terminée/non-terminée)
 * @param {number} id - ID de la tâche
 */
async function basculerTache(id) {
    const tache = listeTaches.find(t => t.id === id);
    if (!tache) return;

    try {
        const reponse = await fetch(`${URL_API}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ terminee: !tache.terminee })
        });

        if (!reponse.ok) {
            throw new Error('Erreur lors de la mise à jour');
        }

        // Recharger la liste
        await chargerTaches();
    } catch (erreur) {
        console.error('Erreur:', erreur);
        alert('Erreur: impossible de mettre à jour la tâche');
    }
}

/**
 * Supprime une tâche du serveur
 * @param {number} id - ID de la tâche
 */
async function supprimerTache(id) {
    try {
        const reponse = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        });

        if (!reponse.ok) {
            throw new Error('Erreur lors de la suppression');
        }

        // Recharger la liste
        await chargerTaches();
    } catch (erreur) {
        console.error('Erreur:', erreur);
        alert('Erreur: impossible de supprimer la tâche');
    }
}

// ========== FONCTIONS D'AFFICHAGE ==========

/**
 * Affiche toutes les tâches de la liste
 * Utilise map() pour transformer les objets en éléments HTML
 */
function afficherTaches() {
    // Effacer le contenu précédent
    listeTachesDiv.innerHTML = "";

    // Vérifier s'il y a des tâches
    if (listeTaches.length === 0) {
        listeTachesDiv.innerHTML = '<p class="aucune-tache">Aucune tâche. Bien joué! 🎉</p>';
        mettreAJourCompteur();
        return;
    }

    // Utiliser map() pour créer les éléments HTML (requis par les spécifications)
    const elementsTaches = listeTaches.map(function(tache) {
        return creerElementTache(tache);
    });

    // Ajouter tous les éléments au DOM
    elementsTaches.forEach(element => {
        listeTachesDiv.appendChild(element);
    });

    // Mettre à jour le compteur
    mettreAJourCompteur();
}

/**
 * Crée un élément DOM pour une tâche
 * @param {Object} tache - L'objet tâche
 * @returns {HTMLElement} - L'élément div contenant la tâche
 */
function creerElementTache(tache) {
    const div = document.createElement("div");
    div.className = "tache";

    // Ajouter la classe "terminee" si la tâche est complétée
    if (tache.terminee) {
        div.classList.add("terminee");
    }

    // Créer la checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tache.terminee;
    checkbox.addEventListener("change", function() {
        basculerTache(tache.id);
    });

    // Créer le label (texte de la tâche)
    const label = document.createElement("label");
    label.textContent = tache.texte;

    // Créer le bouton de suppression
    const boutonSupprimer = document.createElement("button");
    boutonSupprimer.className = "bouton-supprimer";
    boutonSupprimer.textContent = "Supprimer";
    boutonSupprimer.addEventListener("click", function() {
        supprimerTache(tache.id);
    });

    // Assembler les éléments
    div.appendChild(checkbox);
    div.appendChild(label);
    div.appendChild(boutonSupprimer);

    return div;
}

/**
 * Met à jour le compteur de tâches restantes (non-terminées)
 */
function mettreAJourCompteur() {
    const tachesRestantes = listeTaches.filter(t => !t.terminee).length;
    compteurElement.textContent = tachesRestantes;
}

// ========== ÉVÉNEMENTS ==========

// Événement : clic sur le bouton "Ajouter"
boutonAjouter.addEventListener("click", ajouterTache);

// Événement : touche "Entrée" dans le champ de saisie
champSaisie.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        ajouterTache();
    }
});

// ========== INITIALISATION ==========

// Charger les tâches au démarrage
chargerTaches();