const initialContent = document.getElementById("profilePopup").innerHTML; // Contenu initial de la popup

function openProfilePopup() {
    document.getElementById("profilePopup").innerHTML = initialContent;

    const popup = document.getElementById('profilePopup');
    if (popup) {
        popup.style.display = 'block';
    } else {
        console.error("L'élément avec l'ID 'profilePopup' est introuvable.");
    }
}

function closeProfilePopup() {
    document.getElementById("profilePopup").innerHTML = initialContent; // Réinitialise le contenu de la popup

    const popup = document.getElementById('profilePopup');
    if (popup) {
        popup.style.display = 'none';
    } else {
        console.error("L'élément avec l'ID 'profilePopup' est introuvable.");
    }
}

function editProfile() {
    document.getElementById("profilePopup").innerHTML = `
        <div class="popup-box">
            <span class="close" onclick="closeProfilePopup()">&times;</span>
            <h2>Modifier les informations de l'utilisateur</h2>
            <form id="editProfileForm">
                <label for="Firstname">Nom:</label>
                <input type="text" id="Firstname" name="Firstname"><br><br>
                <label for="Lastname">Prénom:</label>
                <input type="text" id="Lastname" name="Lastname"><br><br>
                
                <button type="button" class="popup-button" onclick="submitProfileForm()">Enregistrer</button>
            </form>
        </div>
    `;
}

function submitProfileForm() {
    const Fname = document.getElementById("Firstname").value;
    const Lname = document.getElementById("Lastname").value;

    fetch('/profile/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prenom: Lname, nom: Fname }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                location.reload(); // Recharge la page directement sans afficher de popup
            } else {
                alert(data.error || "Une erreur est survenue.");
            }
        })
        .catch(error => console.error("Erreur :", error));
}

function editPassWord() {
    document.getElementById("profilePopup").innerHTML = `
        <div class="popup-box">
            <span class="close" onclick="closeProfilePopup()">&times;</span>
            <h2>Modifier le mot de passe</h2>
            <form id="editPassWordForm">
                <label for="oldPassword">Ancien mot de passe:</label>
                <input type="password" id="oldPassword" name="oldPassword"><br><br>
                <label for="newPassword">Nouveau mot de passe:</label>
                <input type="password" id="newPassword" name="newPassword"><br><br>
                <button type="button" class="popup-button" onclick="submitPassWordForm()">Enregistrer</button>
            </form>
        </div>
    `;
}

function submitPassWordForm() {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;



    fetch('/profile/edit-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword: oldPassword, password: newPassword }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                closeProfilePopup();
            } else {
                alert(data.error || "Une erreur est survenue.");
            }
        })
        .catch(error => console.error("Erreur :", error));
}