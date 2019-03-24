// Auteurs : Laurent Perron
//           Jonathan Claveau

// Dates : 18 avril 2018

// Ce programme a pour but de créer un jeu de poker shuffle à l'intérieur
// d'un document HTML et de l'afficher dans une page web. Le jeu doit être
// interactif et répondre au spécifications demandées.

var tabVide= Array(36).fill(0);

var cartes36 = function (tab) { // Cette portion importe les 54 figures qui seront utilisés
    var resultat = [];
    var i = 2;
    var j = 1;
    var c = "C";
    var d = "D";
    var h = "H";
    var s = "S";
    tab.map(function(x) { if (j % 4 == 1) {resultat.push("cards/" + i + c + ".svg");}
                          if (j % 4 == 2) {resultat.push("cards/" + i + d + ".svg");}
                          if (j % 4 == 3) {resultat.push("cards/" + i + h + ".svg");}
                          if (j % 4 == 0) {resultat.push("cards/" + i + s + ".svg");}
                          ; i += (j % 4 == 0); j++;});
    return resultat;
};

var cartes = cartes36(tabVide);

cartes.unshift("cards/AC.svg", "cards/AD.svg", "cards/AH.svg", "cards/AS.svg" );

cartes.push("cards/JC.svg","cards/JD.svg","cards/JH.svg","cards/JS.svg",
	    "cards/QC.svg","cards/QD.svg","cards/QH.svg","cards/QS.svg",
	    "cards/KC.svg","cards/KD.svg","cards/KH.svg","cards/KS.svg",
	    "cards/back.svg", "cards/empty.svg");
// Le dos des cartes est en position 52 et la carte vide est en position 53.


// Cette fonction prend le tableau de cartes et mélange l'ordre des 52 premiers index 
var shuffle = function(tab) { 
    var resultat = {cards:[],
		    value:[] };
    
    var paquet52 = [];
    
    for(var i = 0 ; i <= 51 ; i++) {
	paquet52.push(i);
    };

    while (resultat.value.length < 25) {
	var i = paquet52.splice(Math.floor(Math.random() * paquet52.length), 1);
	
	resultat.cards.push(tab[i]);
	resultat.value.push(i);
    }
    return resultat;
};

var dec;          // Les 25 cartes pigées pour commencer le jeu
var decNumerique; // L'identifiant numérique de ces cartes telles que suggérées dans l'énoncé
var grille;       // Représentation numérique de la grille de jeu
var selecteur;    // emmagasine si une carte est sélectionnée ou non.

// Crée l'interface de départ. Appelé quand la page "load" et que le bouton "nouvelle partie"
// est cliqué.

var init = function() {
    grille = Array(25).fill("a"); // crée la grille de jeu ou chaque "a" représente une case vide.
    var recordOfCards = shuffle(cartes);

    decNumerique = recordOfCards.value; 
    dec = recordOfCards.cards;
    selecteur = -1;

    var b = document.getElementById("b");
    
    b.innerHTML = "<table style=\"margin-right:70px;\"><tr><td>" +
	"<button type=\"button\" onclick=\"init();\">Nouvelle partie</button>" +
	"</td></tr></table>" +
	"<table style=\"margin-right:70px;\"><tr><td id=\"50\" onclick=\"clic(50);\">" +
	"<img src=" + cartes[52] + ">" +
	"</td></tr></table>" +
	"<table>" + tableauInit() + "</table>";
};

// Cette fonction retourne le tableau originale du début de la partie.

var tableauInit = function() {
    var vide = cartes[53];
    var interieur = "";
    
    for(var i = 0 ; i < 6 ; i++) {
	interieur += "<tr>";
	
	for(var j = 0 ; j < 6 ; j++) {
	    if (j < 5 && i < 5) {
		interieur += "<td id=" + (i*5+j) + " onclick=\"clic(" + (i*5+j) +
		             ");\"><img src = " + vide + "></td>";
	    } else if ( j == 5 && i < 5) {
		interieur += "<td id=\"totalH" + i + "\"></td>";
	    } else if ( j < 5 && i == 5) {
		interieur += "<td id=\"totalV" + j + "\"></td>";
	    } else {
		interieur += "<td id=\"total\">0</td>";
	    }
	}
	interieur += "</tr>";
    }
    return interieur;
};

// La fonction "clic" détermine ce qui se produit lorsque le joueur clic sur une carte
// Elle comporte différents tests qui permet de comprendre l'état du dec et de le changer.
// La fonction clic telle qu'elle est présentement ne permet que de placer les cartes du dec dans le
// jeu et d'afficher un message préliminaire de fin de partie.
// Le paquet porte le "id" 50 alors que chaque position du tableau de jeu prend une valeur de "id" de 0 à 24
// en commençant de compter par le coin en haut à gauche et en se déplaçant vers la droite, puis vers le bas.

var clic = function(id) {
    var element = document.getElementById(id);
    var elementAnt = document.getElementById(selecteur);

    // Change l'allure du paquet si on clic dessus (couleur et image).
    if (id == 50) {
	if (selecteur == -1){
	    pige(id, element);
	    
	} else if (id == selecteur){
	    element.style.backgroundColor = "transparent";
	    selecteur = -1;
	    
	} else if (selecteur != id && selecteur != -1 && element.style.backgroundColor == "initial") {
	    pige(id, element);
	    elementAnt.style.backgroundColor = "transparent";
	
	} else /* if (selecteur != id && selecteur != -1)*/ {
	    element.style.backgroundColor ="lime";
	    document.getElementById(selecteur).style.backgroundColor = "transparent";
	    selecteur = id;
	}
    }

    // Opérations à effectuer si la carte selectionnée est sur le le tableau du jeu.
    else if (id >= 0 && id < 25) {

	// Va placer une carte
	if (selecteur == 50 && grille[id] =="a") {
	                          // veut dire que la carte est vide.
	    placerCarte(id, selecteur, element, elementAnt);
	    evaluerJeu(id);
	    afficherGrandTotal();

	    if (dec.length == 0) { // condition de fin de partie
		elementAnt.innerHTML = "<img src=" + cartes[53] + ">";
		elementAnt.style.backgroundColor = "initial";
		alert("Votre pointage final est " + document.getElementById("total").innerHTML); // Timeout enlevé
		init();
		
	    } else {
		elementAnt.innerHTML = "<img src=" + cartes[52] + ">";
		elementAnt.style.backgroundColor = "initial";

	    }
	    selecteur = -1;

	  // Selectionne une carte sur le jeu s'il y en a déjà une.  
	} else if (selecteur == -1 && grille[id] != "a") {
	    element.style.backgroundColor = "lime";
	    selecteur = id;

	  // Cliquer deux fois sur la même carte l'enlève de la sélection.
	} else if (selecteur == id) {
	    element.style.backgroundColor = "transparent";
	    selecteur = -1;
	    
	  // Cliquer sur une carte du jeu alors qu'il y en a déjà une de selectionné. 
	} else if (selecteur != 50 && selecteur != -1) {
	    swap(id, selecteur, element, elementAnt);
	    evaluerJeu(id);
	    evaluerJeu(selecteur);
	    afficherGrandTotal();
	    selecteur = -1;
	    
	  // Si le paquet est sélectionné et qu'on clique sur une carte déjà présente sur le jeu.  
	} else if (selecteur == 50 && grille[id] != "a") {
	    elementAnt.style.backgroundColor = "transparent";
	    element.style.backgroundColor = "lime";
	    selecteur = id;
	}
    }

};

// Fonction qui échange les positions de deux cartes présentes sur le jeu.
// Elle change également leur place à l'intérieur de la grille de jeu numérique.
var swap = function(id, selecteur, carte, cartePrecedente) {
    var carteIntermediaire = carte.innerHTML;
    var valIntermediaire = grille[selecteur];
    
    carte.innerHTML = cartePrecedente.innerHTML;
    cartePrecedente.innerHTML = carteIntermediaire;
    cartePrecedente.style.backgroundColor = "initial";
    
    grille[selecteur] = grille[id];
    grille[id] = valIntermediaire;
};

var pige = function(id, carte) {
    carte.innerHTML = "<img src=" + dec[0] +">";
    carte.style.backgroundColor = "lime";
    selecteur = id;
};

var placerCarte = function(id, selecteur, carte, cartePrecedente) {
    carte.innerHTML = cartePrecedente.innerHTML;
    cartePrecedente.innerHTML = "<img src=" + cartes[52] + ">";
    cartePrecedente.style.backgroundColor = "initial";

    dec.shift();
    grille[id] = decNumerique[0];
    decNumerique.shift();
};

//Fonction principale qui évalue les mains du jeu.

var evaluerJeu = function(id) {
    var quelleLigne = Math.floor(id/5);
    var quelleColonne = id % 5;
    var ligne = batirLigne(quelleLigne);
    var colonne = batirColonne(quelleColonne);
    var pointsL = 0;
    var pointsC = 0;

    if (ligne.length < 2) {
	 afficherTotal("H", quelleLigne, "")
    }

    if (colonne.length < 2) {
	 afficherTotal("V", quelleColonne, "")
    }

    // Evalue les valeurs de carte similaires pour les lignes
    if (ligne.length > 1){
	var similaireL = evaluerValeur(ligne);
    
	if (similaireL > 0) {
	    pointsSimilaire(similaireL, quelleLigne, "H");
	    
	} else afficherTotal("H", quelleLigne, "")
    }

    // Evalue les valeurs de carte similaires pour les colonnes
    if (colonne.length > 1) {
	var similaireC = evaluerValeur(colonne);

	if (similaireC > 0) {
	    pointsSimilaire(similaireC, quelleColonne, "V");
	    
	} else afficherTotal("V", quelleColonne, "")
    }

    // Evalue les quintes et les couleurs pour les lignes
    if (ligne.length == 5 && similaireL == 0){
	var couleurL = evaluerCouleur(ligne);
	var quinteL = evaluerQuinte(ligne);

	pointageQuinteCouleur(couleurL, quinteL, ligne, quelleLigne, "H");
    }

    // Evalue les quintes et les couleurs pour les colonnes.
    if (colonne.length == 5 && similaireC == 0) {
	var couleurC =evaluerCouleur(colonne);
	var quinteC = evaluerQuinte(colonne);

	pointageQuinteCouleur(couleurC, quinteC, colonne, quelleColonne, "V");
    }
	
};

// Evalue la couleur et la quinte et affiche les pointages èa l'aide de la fonction afficherTotal.
var pointageQuinteCouleur = function(couleur, quinte, range, emplacement, sufixe) {
    
    if (couleur == 20) {

	if (quinte == 15) {

	    if (range.reduce(function(x,y) { return +x > +y ? x : y; }) >= 49){
		afficherTotal(sufixe, emplacement, 100);
		
	    } else {
		afficherTotal(sufixe, emplacement, 75);

	    }
	    
	} else {
	    afficherTotal(sufixe, emplacement, couleur);

	}
	
    } else if (quinte == 15) {
	afficherTotal(sufixe, emplacement, quinte);
	
    } else {
	afficherTotal(sufixe, emplacement, "");
    }
};

// Crée un tableau numérique qui représente chaque ligne en temps réel
var batirLigne = function(idLigne) {
    var ligne = [];
    var idDebutLigne = idLigne * 5;
    
    for(var i = idDebutLigne ; i < (idDebutLigne + 5) ; i++) {
	if (grille[i] != "a") {
	    ligne.push(grille[i]);
	}
    }
    return ligne;
};

// Crée un tableau numérique qui représente chanque colonne en temps réel
var batirColonne = function(idColonne) {
    var colonne = [];

    for(var i = 0 ; i < grille.length ; i ++ ) {
        if (idColonne == i % 5 && grille[i] != "a") {
	    colonne.push(grille[i]);

	    if (colonne.length == 5) {
		break;
	    }
	}
    }
    return colonne;    
};

// Fonction secondaire qui permet d'évaluer les carte de valeur équivalentes
var evaluerValeur = function(tab) {
    var paire = 0;
    var triple = 0;
    var carre = 0;
    
    for(var i = 0 ; i < tab.length ; i++) {
	var acc = [];
	
	for(var j = (i + 1) ; j < tab.length ; j++) {
	    	
	    if (tab[i]>>2 == tab[j]>>2) {
		acc.push(tab.splice(j,1));
		--j;
	    }
	}
	// Si j'ai trouvé un pareil (double)
	if (acc.length == 1) {
	    paire += 2;
	    // ou deux (triple)
	} else if (acc.length == 2) {
	    triple += 3;
	    // ou trois (carre)
	} else if (acc.length == 3) {
	    carre += 8;
	    
	}
    }
    return (paire + triple + carre);
};

// Affiche le pointage des doubles, triples, carrés
var pointsSimilaire = function(valeur, endroit, s) {
    var points = 0;
    
    if (valeur == 2){
	points = 2;
	
    } else if (valeur == 4) {
	points = 5;
	
    } else if (valeur == 3) {
	points = 10;
	
    } else if (valeur == 5) {
	points = 25;
	
    } else if (valeur == 8) {
	points = 50;
	
    }
    document.getElementById("total" + s + endroit).innerHTML = points;
};

// Permet d'évaluer si toutes les cartes d'une ligne ou d'une colonne sont de la même couleur
var evaluerCouleur = function(tab) {
    var resultat = 16;

    for(var i = 1 ; i < tab.length ; i++) {

	if( (tab[0] & 3) == (tab[i] & 3) ){
	    ++resultat;
	}
    }
    return resultat;
};

// Permet d'évaluer si toutes les cartes se trouvent dans l'intervalle d'une suite.
var evaluerQuinte = function(tab) {
    var min = tab.reduce(function(x,y) { return +x < +y ? x : y; });

    min -= (min % 4); // situe à la valure numerique de la carte la plus basse possible.
    
    var max = tab.reduce(function(x,y) { return +x > +y ? x : y; });

    // Si il y a un roi et un as sur la ligne. Condition importante pour trouver la quinte flush royale
    if(min == 0 && max >= 48) {

	for(var i = 0 ; i < tab.length ; i++) {

	    if (+tab[i] < 4) {
		tab.splice(i,1);
		break;
	    }
	}
	min = tab.reduce(function(x,y) { return +x < +y ? x : y; });

	if (min < 36) { // Si le mimnimum est plus bas que 36 (un dix) on sabote le test.
	    min = 0;
	    
	}
	min -= (min % 4);
    }

    var resultat = max - min;
    
    if (resultat < 20) {
	return 15;
	
    } else {
	return -1;
    }
};

// Affiche le total de chaque ligne et colonne. Cette courte fonction est appelée fréquement.
var afficherTotal = function(sufixe, position, pointage) {
    document.getElementById("total" + sufixe + position).innerHTML = pointage;
};

// Affiche le grand total, dans le coin du jeu.
var afficherGrandTotal = function() {
    var total = 0;
    var i = 0;
    
    while(i < 5) {
	total += +(document.getElementById("totalH" + i).innerHTML);
	total += +(document.getElementById("totalV" + i).innerHTML);
	i++;
    }
    document.getElementById("total").innerHTML = total;
};
