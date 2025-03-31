function openProfilePopup() {
    document.getElementById("profilePopup").style.display = "block";
}

function closeProfilePopup() {
    document.getElementById("profilePopup").style.display = "none";
}

function editProfile() {
// Ajoutez ici le code pour modifier les informations de l'utilisateur
    document.getElementById("profilePopup").innerHTML = `
        <div class="popup-content">
            <span class="close" onclick="closeProfilePopup()">&times;</span>
            <h2>Modifier les informations de l'utilisateur</h2>
            <form id="editProfileForm">
                <label for="Firstname">Nom:</label>
                <input type="text" id="Firstname" name="Firstname" value="John"><br><br><!-- Il faudra modifier les values pour que ce soit celle de la bdd -->
                <label for="Lastname">Prénom</label>
                <input type="text" id="Lastname" name="Lastname" value="Doe"><br><br>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" value="john.doe@example.com"><br><br>
                <button type="button" class="popup-button" onclick="submitProfileForm()">Enregistrer</button>
            </form>
        </div>
    `;
}
function submitProfileForm() {
    var Fname = document.getElementById("Firstname").value;
    var Lname = document.getElementById("Lastname").value;
    var email = document.getElementById("email").value;
    // Ajoutez ici le code pour enregistrer les nouvelles informations dans la bdd
    alert("Nom: " + Fname + "\nPrénom : "+Lname+ "\nEmail: " + email);
    closeProfilePopup();
}


window.onclick = function(event) {
    var popup = document.getElementById("profilePopup");
    if (event.target == popup) {
        popup.style.display = "none";
    }
}