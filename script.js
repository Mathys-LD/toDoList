// ========== DONNÉES ==========
// Tableau pour stocker les tâches sous forme d'objets
let listeTaches = [];
let idCompteur = 0;

// ========== CLASSE TÂCHE ==========
/**
 * Classe représentant une tâche
 * @param {number} id - Identifiant unique de la tâche
 * @param {string} texte - Description de la tâche
 * @param {boolean} terminee - Statut de completion (false par défaut = à faire)
 */
class Tache {
    constructor(id, texte, terminee = false) {
        this.id = id;
        this.texte = texte;
        this.terminee = terminee;
    }
}

// ========== GESTION DU DOM ==========
const champSaisie = document.getElementById("champSaisie");
const boutonAjouter = document.getElementById("boutonAjouter");
const listeTachesDiv = document.getElementById("listeTaches");
const compteurElement = document.getElementById("compteurTaches");

// ========== FONCTIONS PRINCIPALES ==========

/**
 * Ajoute une nouvelle tâche à la liste
 * Valide que le champ n'est pas vide
 */
function ajouterTache() {
    const texte = champSaisie.value.trim();

    // Validation : le texte ne doit pas être vide
    if (texte === "") {
        alert("Veuillez entrer une tâche valide!");
        return;
    }

    // Créer un nouvel objet tâche
    const nouvelleTache = new Tache(idCompteur, texte, false);
    
    // Ajouter à la liste
    listeTaches.push(nouvelleTache);
    idCompteur++;

    // Vider le champ de saisie
    champSaisie.value = "";
    champSaisie.focus();

    // Mettre à jour l'affichage
    afficherTaches();
}

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
 * @param {Tache} tache - L'objet tâche
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
 * Bascule l'état de completion d'une tâche (terminée/non-terminée)
 * @param {number} id - L'id de la tâche à basculer
 */
function basculerTache(id) {
    const tache = listeTaches.find(t => t.id === id);
    if (tache) {
        tache.terminee = !tache.terminee;
        afficherTaches();
    }
}

/**
 * Supprime une tâche de la liste
 * @param {number} id - L'id de la tâche à supprimer
 */
function supprimerTache(id) {
    listeTaches = listeTaches.filter(t => t.id !== id);
    afficherTaches();
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

// Initialiser l'affichage au chargement
afficherTaches();
