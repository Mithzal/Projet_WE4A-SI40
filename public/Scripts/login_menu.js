// Fonction pour ouvrir/fermer le menu
function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    sideMenu.classList.toggle('active');
}

function openForgotPasswordPopup() {
    document.getElementById("forgotPasswordPopup").style.display = "block";
}

function closeForgotPasswordPopup() {
    document.getElementById("forgotPasswordPopup").style.display = "none";
    openSecondPopup();
}

function openSecondPopup() {
    document.getElementById("secondPopup").style.display = "block";
}

function closeSecondPopup() {
    document.getElementById("secondPopup").style.display = "none";
}