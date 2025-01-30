
//Nombre de séquences à comparer initialement
let nb_seq = 2


//Fonction qui enlève un input pour mettre une séquence à comparer
function ajoute_seq() {
    if (nb_seq < 8) {
        nb_seq++;

        let label = document.createElement("label");
        label.setAttribute("for", `sequence_${nb_seq}`); //Créer des id différents pour chaque séquence
        label.setAttribute("class", "label_seq"); //On ajoute tous les attributs nécessaires
        label.setAttribute("id", `label_${nb_seq}`);
        label.textContent = `Séquence ${nb_seq} `;
   
        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("name", `sequence_${nb_seq}`);
        input.setAttribute("id", `sequence_${nb_seq}`);
        input.setAttribute("value", "");
        input.setAttribute("oninput", "ATGC(this)");
        input.setAttribute("autocomplete", "off");
        input.setAttribute("spellcheck", "false");
        input.setAttribute('required', 'true')

        let button = document.createElement("button");
        button.setAttribute("class", `boutons_generer`);
        button.setAttribute("id", `bouton_gen_${nb_seq}`);
        button.setAttribute("type", "button");
        button.setAttribute("onclick", `genere_seq(${nb_seq})`);
        button.textContent = "∞";

        let conteneur = document.getElementById("liste_seq");
        conteneur.appendChild(label);
        conteneur.appendChild(input);
        conteneur.appendChild(button);

        button.style.marginLeft = "5px"
        
        if (nb_seq % 2 !== 0 && nb_seq !== 8) {
            button.style.marginRight = "30px";
            
        }
        

        if (nb_seq % 2 === 0 && nb_seq !== 8) {
            let br1 = document.createElement("br");
            br1.setAttribute("id", `br_${nb_seq}_1`);
            conteneur.appendChild(br1);
            

            let br2 = document.createElement("br");
            br2.setAttribute("id", `br_${nb_seq}_2`);
            conteneur.appendChild(br2);
        }
        ajoute_seq_input()
    }
}

//Fonction qui ajoute un input pour mettre une séquence à comparer
function enleve_seq() {
    if (nb_seq > 2) {
        
        const conteneur = document.getElementById("liste_seq");
        const label = document.getElementById(`label_${nb_seq}`);
        const sequence = document.getElementById(`sequence_${nb_seq}`);
        const genere = document.getElementById(`bouton_gen_${nb_seq}`);
        

        conteneur.removeChild(label);
        conteneur.removeChild(sequence);
        conteneur.removeChild(genere);
        const br1 = document.getElementById(`br_${nb_seq}_1`);
        const br2 = document.getElementById(`br_${nb_seq}_2`);
        
        if (br1) {
            conteneur.removeChild(br1);
        }
        if (br2) {
            conteneur.removeChild(br2);
        }

        enleve_seq_input()
        nb_seq--;
    }
}

//fonction qui ajoute l'input pour changer le nom d'une séquence
function ajoute_seq_input() {
   
    let numero_seq = document.createElement("label");
    numero_seq.setAttribute("for", `nom_seq_${nb_seq}`);
    numero_seq.setAttribute("id", `input_numero_${nb_seq}`);
    numero_seq.textContent = `${nb_seq}- `;

    let ajoute_nom_seq = document.createElement("input");
    ajoute_nom_seq.setAttribute("name", `nom_seq_${nb_seq}`);

    ajoute_nom_seq.setAttribute("id", `nom_seq_${nb_seq}`);
    ajoute_nom_seq.setAttribute("type", "text");
    ajoute_nom_seq.setAttribute("maxlength", "20");
    ajoute_nom_seq.setAttribute("value", `Séquence ${nb_seq}`);
    ajoute_nom_seq.setAttribute("autocomplete", "off");
    ajoute_nom_seq.setAttribute("spellcheck", "false");

    let espace = document.createElement("br");
    espace.setAttribute("id", `espace_num_${nb_seq}`)

    let conteneur = document.getElementById("nom_des_seq");

    conteneur.appendChild(espace);
    conteneur.appendChild(numero_seq);
    conteneur.appendChild(ajoute_nom_seq);
    document.getElementById(`nom_seq_${nb_seq}`).style.width = "150px";
    
}

//fonction qui enleve l'input pour changer le nom d'une séquence
function enleve_seq_input() {
    const conteneur = document.getElementById("nom_des_seq");

    let enleve_espace = document.getElementById(`espace_num_${nb_seq}`);
    conteneur.removeChild(enleve_espace);
    let enleve_numero = document.getElementById(`input_numero_${nb_seq}`);
    conteneur.removeChild(enleve_numero);
    let enleve_nom_seq = document.getElementById(`nom_seq_${nb_seq}`);
    conteneur.removeChild(enleve_nom_seq);
}

//Modifie le nombre de nucleotides à générer aleatoirement
let nb_gen = 100

function nb_gen_modif(n) {
    nb_gen = n
}

//Generer une seule séquence aléatoire
function genere_seq(n) {
    let sequence_adn = []
    let nucleotides = ['A','T','G','C']
    for (let i = 1; i <= nb_gen; i++) {
        let index_aleatoire = Math.floor(Math.random() * 4); //Ajoute A,T,G ou C 
        sequence_adn.push(nucleotides[index_aleatoire]);
    let seq = document.getElementById(`sequence_${n}`);
    seq.value = sequence_adn.join('')
    }   
}

//Genère une séquence aléatoire pour chaque séquence
function genere_tout() {
    for (let i = 1; i <= nb_seq; i++) {
        genere_seq(i)
    }
}

//Pouvoir seulement ecrire ATGC
function ATGC(input) {
    //Ne laisses que l'utilisateur entrer A,T,G,C et si en minuscule le convertit en majuscule
    input.value = input.value.replace(/[^atgcATGC]/g, ''); 
    input.value = input.value.toUpperCase();
}

function Changer_nom() {
    let nom_utilises = [];
    for (let i = 1; i <= nb_seq; i++) {
        let nom_sequence = document.getElementById(`nom_seq_${i}`).value;
        

        if (!nom_utilises.includes(nom_sequence)) {
            document.getElementById('erreur').style.display = 'none' 
            document.getElementById(`label_${i}`).innerHTML = nom_sequence + " ";
            document.getElementById(`nom_seq_${i}`).value = nom_sequence + ""

            nom_utilises.push(nom_sequence);
        } else {
            document.getElementById('erreur').style.display = 'block' 
        }
    }
}

function fasta_enlever() {
    document.getElementById('upload_fasta').file_fasta.value = '';
    document.getElementById('sequence_form').reset();
}



