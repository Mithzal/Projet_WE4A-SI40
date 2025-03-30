function openProfilePopup() {
    document.getElementById("profilePopup").style.display = "block";
}

function closeProfilePopup() {
    document.getElementById("profilePopup").style.display = "none";
}

function editProfile() {
    // Ajoutez ici le code pour modifier les informations de l'utilisateur
    alert("Modifier les informations de l'utilisateur");
}

window.onclick = function(event) {
    var popup = document.getElementById("profilePopup");
    if (event.target == popup) {
        popup.style.display = "none";
    }
}