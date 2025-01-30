import flask, random, sys, os, platform
from flask import Flask, request, render_template
import matplotlib.pyplot as plt
from Bio import Phylo, SeqIO, AlignIO
from Bio.Align.Applications import ClustalwCommandline
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
from Bio.Phylo.TreeConstruction import DistanceCalculator, DistanceTreeConstructor
from io import StringIO
import subprocess

app = Flask(__name__)

#Pour que ca run 
#install biopython, matplotlib

@app.route("/")
def index():
    return flask.render_template("index.html")

def creer_fichier_fasta(sequences:dict):
    """ créer à partir du dictionnaire sequences un fichier fasta"""
    contenu_fasta = []
    for seq_nom, seq_adn in sequences.items():
        adn_fasta = SeqRecord(Seq(seq_adn), id=seq_nom)
        contenu_fasta.append(adn_fasta)

    with open("sequences.fasta", 'w') as fichier_fasta: #Ecrit le fichier fasta "sequences.fasta"
        SeqIO.write(contenu_fasta, fichier_fasta, "fasta")


@app.route("/indice", methods=['POST']) #amène vers la page hmtl indice
def indice_proximite():
    """calcul l'indice de proximité et renvoie toutes les valeurs 
    nécessaires pour le code django dans indice.html"""
    sequences = {}
    if 'upload_fasta' not in request.files:
        for i in range(8):
            if f'sequence_{i + 1}' in request.form: #arrère les itérations jusqu'a ce qu'on retrouve pas 
                nom_seq = request.form[f'nom_seq_{i + 1}']
                nom_seq_sans_espace = nom_seq.replace(" ", "")
                sequences[nom_seq_sans_espace] = request.form[f'sequence_{i + 1}']
                
            else:
                break #arrère l'itération jusqu'à ce qu'on retrouve plus de valeur dans le dictionnaire
        fichier_fasta = creer_fichier_fasta(sequences)
    else:
        fichier_fasta = request.files['upload_fasta']
        fichier_fasta.save("sequences.fasta")


    if platform.system() == "Windows": #utilise clustal pour windows
        clustalw_exe = r"ClustalW2_windows\clustalw2.exe"

        # Execution de clustal où l'on aligne les séquences
        runClustal = ClustalwCommandline(clustalw_exe, infile = r"sequences.fasta") 
        assert os.path.isfile(clustalw_exe), "Clustal_W executable is missing or not found"
        stdout, stderr = runClustal()

        align = AlignIO.read('sequences.aln', 'clustal')

        #Création de l'arbre phylogénétique avec le nom des séquences
        tree = Phylo.read("sequences.dnd", "newick")
        tree.ladderize()

        tree_file = "static/tree_image.png"
        Phylo.draw(tree, do_show=False)
        plt.savefig(tree_file)

    elif platform.system() == "Darwin": # mafft pour mac
        mafft_exe = "./dossier_mafft/bin/mafft"
        input_file = "sequences.fasta"
        output_file = "aln_sequences.fasta"
        assert os.path.isfile(mafft_exe), "Mafft executable is missing or not found"

        mafft_cmd = [mafft_exe, '--auto', input_file]
        with open(output_file, 'w') as output:
            subprocess.run(mafft_cmd, stdout=output, text=True, check=True)
            
        align = AlignIO.read(output_file, 'fasta')

        constructor = DistanceTreeConstructor()
        calculator = DistanceCalculator('identity')
        dm = calculator.get_distance(align)
        tree = constructor.upgma(dm)

    """
    tree_file = "static/tree_image.png"
    Phylo.draw(tree, do_show=False)
    plt.savefig(tree_file)
    """
        
    #Dictionnaire où les valeurs s'ont les séquences mais alignés(avec les tirets)
    sequences_alignes = {adn.id: str(adn.seq) for adn in align}

    #Longueur des séquences alignés
    alignement_len = align.get_alignment_length()
    


    sequences_id = list(sequences_alignes.keys())
    sequence_str = list(sequences_alignes.values())
    #sequences_alignes = dict(zip(sequences_id, sequence_str))


    #Longueur du nom de séquence le plus grand
    max_len_nom = len(max(sequences_id, key=len))




    indice_identiques = [] #liste ou l'on met les indices de proximités i
    indice_1ou0 = [] #liste où l'on met 1 si c'est un indice de proximité, 0 sinon

    for i in range(alignement_len):
        #Ajoute chaque nucléotide d'indice i, si elle n'est pas déja dans la liste
        char_indice = set(adn.seq[i] for adn in align) 
        if len(char_indice) == 1: #S'il y a que une valeur, c'est un indice de proximité
            indice_identiques.append(i)
            indice_1ou0.append(1)
        else:
            indice_1ou0.append(0)

    #Calcul de l'indice de proximité
    proximite = round(len(indice_identiques) / alignement_len * 100, 2) 

    #Renvoie chaque varible nécessaire pour indice.html
    return render_template("indice.html", indice=f"Indice de proximité: {proximite} %", ali=sequences_alignes, indice_prox = indice_1ou0, len=len(sequences_alignes),  max_len_nom=max_len_nom)
if __name__ == "__main__":
    app.run(debug=True, port = 8000)