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
            <a href="#" id="logout" onclick="setLoggin(false)">Déconnexion</a>
        </div>
    </div>
    <?php else : ?>
    <div>
        <button class="profile-button_right" onclick="toggleDropdown()"><img class="profile_picture" src="../Image/no_image.webp" alt="Profile Icon"></button>
        <div class="dropdown-content_account" id="profileDropdown">
            <a href="#" onclick="setLoggin(true)">Connexion</a> <!-- Il va falloir modifier ce bouton pour amener sur la page de connexion -->
        </div>
    </div>
    <?php
        $_SESSION['loggedin'] = true;
    endif;

    ?>
    <div id="content"></div>

    <script src="../script/AccountManagerDropdown.js"></script>

    <div id="profilePopup" class="popup">
        <div class="popup-box">
            <span class="close" onclick="closeProfilePopup()">&times;</span>
            <div class="popup-content">
                <div class="profile">
                    <h2>Informations de l'utilisateur</h2>
                    <p>Photo de profile : </p>
                    <img class="profile_picture" src="../Image/no_image.webp" alt="Profile Icon">
                    <p>Nom: John Doe</p>
                    <p>Email: john.doe@example.com</p>

                </div>

                <div class="popup-UE">
                    <h2>Mes UEs</h2>
                    <ul>
                        <li>UE1</li>
                        <li>UE2</li>
                        <li>UE3</li>
                        <li>UE4</li>
                        <li>UE5</li>
                    </ul>


                </div>
            </div>
            <button onclick="editProfile()" class="popup-button">Modifier</button>
            <button onclick="editPassWord()" class="popup-button">Changer le mot de passe</button>
        </div>
    </div>

    <script src="../script/ProfileMenu.js"></script>


</body>
