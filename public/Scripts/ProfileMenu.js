const initialContent = document.getElementById("profilePopup").innerHTML;//on récupère le contenu initial de la popup pour pouvoir l'utiliser plus tard

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


function editProfile() {//cette fonction vient écraser le contenu de la div avec l'id profilePopup
    document.getElementById("profilePopup").innerHTML = `
        <div class="popup-box">
            <span class="close" onclick="closeProfilePopup()">&times;</span>
            <h2>Modifier les informations de l'utilisateur</h2>
            <form id="editProfileForm">
                <label for="ProfilePicture">Photo de profil:</label>
                <input type="file" id="ProfilePicture" name="ProfilePicture"><br><br>
                <label for="Firstname">Nom:</label>
                <input type="text" id="Firstname" name="Firstname" value="John"><br><br><!-- Il faudra modifier les values pour que ce soit celle de la bdd -->
                <label for="Lastname">Prénom</label>
                <input type="text" id="Lastname" name="Lastname" value="Doe"><br><br>
                 <button type="button" class="popup-button" onclick="submitProfileForm()">Enregistrer</button>
            </form>
        </div>
    `;
}
function submitProfileForm() {
    var ProfilePicture = document.getElementById("ProfilePicture").value;
    var Fname = document.getElementById("Firstname").value;
    var Lname = document.getElementById("Lastname").value;
    // Ajoutez ici le code pour enregistrer les nouvelles informations dans la bdd
    alert("Nom: " + Fname + "\nPrénom : "+Lname+ "\nPhoto de profil: " + ProfilePicture);
    closeProfilePopup();
}

function editPassWord(){
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
    var oldPassword = document.getElementById("oldPassword").value;
    var newPassword = document.getElementById("newPassword").value;
    if (oldPassword === "" || newPassword === "") {
        alert("Veuillez remplir tous les champs.");
        return;
    }
    if (oldPassword === newPassword) {
        alert("Le nouveau mot de passe doit être différent de l'ancien.");
        return;
    }
    if (newPassword.length < 8) {
        alert("Le mot de passe doit contenir au moins 8 caractères.");
        return;
    }
    if (!/[A-Z]/.test(newPassword)) {
        alert("Le mot de passe doit contenir au moins une lettre majuscule.");
        return;
    }
    if (!/[a-z]/.test(newPassword)) {
        alert("Le mot de passe doit contenir au moins une lettre minuscule.");
        return;
    }
    // if (oldPassword == bdd ) // vérification du mot de passe
    // {
    //     alert("Le mot de passe est incorrect.");
    //     return;
    // }


    // Ajoutez ici le code pour enregistrer les nouvelles informations dans la bdd
    alert("Ancien mot de passe: " + oldPassword + "\nNouveau mot de passe: " + newPassword);
    closeProfilePopup();
}

window.onclick = function(event) {// permet de fermer la popup si on clique en dehors de celle-ci
    var popup = document.getElementById("profilePopup");//on récupère la popup
    if (event.target === popup) {//si on clique pas  sur la popup
        popup.style.display = "none";//on la ferme
    }
}