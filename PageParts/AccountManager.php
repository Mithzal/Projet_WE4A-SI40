<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../Styles/Accueil.css">
    <title>Account Manager</title>
</head>
<body>
    <div class="dropdown_account">
        <button class="profile-button right" onclick="toggleDropdown()">AC</button>
        <div class="dropdown-content_account" id="profileDropdown">
            <a href="#" id="profile">Profil</a>
            <a href="#" id="settings">Paramètres</a>
            <a href="#" id="logout">Déconnexion</a>
        </div>
    </div>
    <div id="content"></div>

    <script>
        function toggleDropdown() {
            var dropdown = document.getElementById("profileDropdown");
            if (dropdown.style.display === "none") {
                dropdown.style.display = "block";
            } else {
                dropdown.style.display = "none";
            }
        }

        $(document).ready(function() {
            $('#profile').click(function(e) {
                e.preventDefault();
                $('#content').load('profile.php');
            });

            $('#settings').click(function(e) {
                e.preventDefault();
                $('#content').load('settings.php');
            });

            $('#logout').click(function(e) {
                e.preventDefault();
                $('#content').load('logout.php');
            });
        });
    </script>
</body>
