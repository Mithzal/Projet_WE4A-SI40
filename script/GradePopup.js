const initialContent2 = document.getElementById("gradePopup").innerHTML;//on récupère le contenu initial de la popup pour pouvoir l'utiliser plus tard

const grades = [
    { ue: "Mathématique", notes: ["15/20", "16/20","17/20", "5/20", "80/100"] },
    { ue: "Physique", notes: ["12/20"] },
    { ue: "Anglais", notes: ["18/20", "17/20", "19/20"] },
    // Ajoutez d'autres notes ici
];

function calculateAverage(notes) {
    let total = 0;
    let count = 0;
    notes.forEach(note => {
        const [value, max] = note.split('/').map(Number);
        total += (value / max) * 20; // Convertit la note en base 20
        count++;
    });
    return (total / count).toFixed(2); // Retourne la moyenne arrondie à 2 décimales
}

function openGradePopup() {
    const gradePopup = document.getElementById("gradePopup");
    const tableHead = gradePopup.querySelector("table thead tr");
    const tableBody = gradePopup.querySelector("table tbody");
    tableHead.innerHTML = "<th>UE</th>"; // Réinitialise les en-têtes de colonnes
    tableBody.innerHTML = ""; // Réinitialise le contenu du tableau

    // Détermine le nombre maximum de notes
    const maxNotes = Math.max(...grades.map(grade => grade.notes.length));

    // Génère dynamiquement les en-têtes de colonnes pour les notes
    for (let i = 1; i <= maxNotes; i++) {
        const th = document.createElement("th");
        th.textContent = `Note ${i}`;
        tableHead.appendChild(th);
    }

    // Ajoute l'en-tête de la colonne "Moyenne"
    const thAverage = document.createElement("th");
    thAverage.textContent = "Moyenne";
    tableHead.appendChild(thAverage);

    // Génère dynamiquement les lignes du tableau
    grades.forEach(grade => {
        const row = document.createElement("tr");
        const ueCell = document.createElement("td");
        ueCell.textContent = grade.ue;
        row.appendChild(ueCell);

        grade.notes.forEach(note => {
            const noteCell = document.createElement("td");
            noteCell.textContent = note;
            row.appendChild(noteCell);
        });

        // Ajoute des cellules vides si le nombre de notes est inférieur au maximum
        for (let i = grade.notes.length; i < maxNotes; i++) {
            const emptyCell = document.createElement("td");
            row.appendChild(emptyCell);
        }

        const averageCell = document.createElement("td");
        averageCell.textContent = calculateAverage(grade.notes);
        row.appendChild(averageCell);

        tableBody.appendChild(row);
    });

    gradePopup.style.display = "block";
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