const initialContent2 = document.getElementById("gradePopup").innerHTML;//on récupère le contenu initial de la popup pour pouvoir l'utiliser plus tard

function openGradePopup(notesData) {
    console.log("Données de notes reçues:", notesData);

    const popup = document.getElementById("gradePopup");
    const tbody = popup.querySelector("table tbody");
    tbody.innerHTML = '';

    if (notesData && notesData.length > 0) {
        notesData.forEach(ue => {
            const row = document.createElement('tr');

            // Cellule pour le nom de l'UE
            const ueCell = document.createElement('td');
            ueCell.textContent = ue.ue;
            row.appendChild(ueCell);

            // Créer une cellule pour chaque note
            const notesCell = document.createElement('td');
            if (ue.notes.length > 0) {
                const notesContainer = document.createElement('div');
                notesContainer.className = 'notes-container';

                ue.notes.forEach(note => {
                    const noteElem = document.createElement('td');
                    noteElem.className = 'note-badge';
                    noteElem.textContent = note;
                    notesContainer.appendChild(noteElem);
                });

                notesCell.appendChild(notesContainer);
            } else {
                notesCell.textContent = "Aucune note";
            }
            row.appendChild(notesCell);

            // Calcul de la moyenne
            let moyenne = "N/A";
            if (ue.notes.length > 0) {
                const sum = ue.notes.reduce((total, note) => total + parseFloat(note), 0);
                moyenne = (sum / ue.notes.length).toFixed(2);
            }

            // Cellule pour la moyenne
            const moyenneCell = document.createElement('td');
            moyenneCell.textContent = moyenne;
            row.appendChild(moyenneCell);

            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.textContent = "Aucune note disponible";
        cell.style.textAlign = "center";
        row.appendChild(cell);
        tbody.appendChild(row);
    }

    popup.style.display = "block";
}

function closeGradePopup() {
    document.getElementById("gradePopup").style.display = "none";
}


window.onclick = function(event) {// permet de fermer la popup si on clique en dehors de celle-ci
    var popup = document.getElementById("gradePopup");//on récupère la popup
    if (event.target === popup) {//si on clique pas  sur la popup
        popup.style.display = "none";//on la ferme
    }
}