<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../Styles/AccountManagerStyle.css">
    <title>Account Manager</title>
</head>
<body>
    <?php
    $_SESSION['loggedin'] = true;#cette variable est à changer, en fonction de si on est connecté ou pas

    if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true): ?>
    <div class="dropdown_account">
        <button class="profile-button_right" onclick="toggleDropdown()">
            <img class="profile_picture" src="../Image/no_image.webp" alt="Profile Icon">
        </button>
        <div class="dropdown-content_account" id="profileDropdown">
            <a href="#" id="profile" onclick="openProfilePopup()">Profil</a>
            <a href="#" id="settings">Notes</a>
            <a href="#" id="logout">Déconnexion</a>
        </div>
    </div>
    <?php else : ?>
    <div>
        <button class="profile-button right" onclick="toggleDropdown()"><img class="profile_picture" src="../Image/no_image.webp" alt="Profile Icon"></button>
        <div class="dropdown-content_account" id="profileDropdown">
            <a href="../Pages/Connexion.php">Connexion</a> <!-- Il va falloir modifier ce bouton pour amener sur la page de connexion -->
        </div>
    </div>
    <?php endif; ?>
    <div id="content"></div>

    <script src="../script/AccountManagerDropdown.js"></script>

    <div id="profilePopup" class="popup">
        <div class="popup-content">
            <span class="close" onclick="closeProfilePopup()">&times;</span>
            <h2>Informations de l'utilisateur</h2>
            <p>Nom: John Doe</p>
            <p>Email: john.doe@example.com</p>
            <button onclick="editProfile()">Modifier</button>
        </div>
    </div>

    <script src="../script/ProfileMenu.js"></script>


</body>
