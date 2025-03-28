// JE DOIS ENCORE ARRANGER LA PAGE POUR QU'ELLE FONCTIONNE




<!DOCTYPE html>
<html lang="fr">


 <?php
    include("../PageParts/Header.php");
 ?>

 <body>

   <div class="content">
    <p>Accueil en construction</p>
  </div>


<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Accueil</title>
    <link rel="stylesheet" href="./Styles/style.css">
    <link rel="stylesheet" href="./Styles/login_style.css">
</head>


<body>

<header class="topbar">


<!-- Bouton pour ouvrir le menu -->
<button class="menu-button" onclick="toggleMenu()">Connexion</button>

<!-- Menu latéral -->
<div id="side-menu" class="side-menu">
    <!-- bouton x pour fermer le menu latéral -->
    <button class="close-button" onclick="toggleMenu()">×</button>
    <!-- contenu du menu latéral -->

    <form id="formulaire_login" action="#" method="POST">
        <h1>Connexion</h1>
        <div class="error" id="errorMessage"></div>
        <div>
            <label for="username">Nom d'utilisateur</label>
            <br>
            <input autofocus type="text" id="username" name="username" placeholder="Nom d'utilisateur" required>
        </div>
        <br>
        <div class="password-container">
            <label for="password">Mot de passe</label>
            <br>
            <input type="password" id="password" name="password" placeholder="Mot de passe" required>
            <span class="toggle-password" id="togglePassword">👁️</span>
        </div>
        <br>
        <div>
            <button type="submit" style="width:50%;">Se Connecter</button>
        </div>
    </form>
    <script src="./scripts/verif_form.js"></script>

    <br>
    <div style="text-align: center;">
        <a href="creation_compte.php">Pas encore de compte ?</a>
    </div>

</div>

<!-- script qui ouvre et ferme le menu latéral -->
<script src="./scripts/login_menu.js"></script>

</header>




<div class="main-content">

    <h1>Plateforme pédagogique</h1>

<!-- affichage des infos dans des div en grid -->
    <div class="grid-container">

        <div>
            <img src="./ressources/architecture.webp" alt="architecture" class="grid-container-img">
            <h4>Read me</h4>
        </div>

        <div>
            <a href="https://www.utbm.fr/"><img src="./ressources/utbm_montbe.webp" alt="batiment de l'utbm" class="grid-container-img"></a>
            <h4><a href="https://www.utbm.fr/">Découvrir l'UTBM</a></h4>
        </div>

        <div>
            <a href="https://bibliotheque.utbm.fr/"><img src="./ressources/semafort.jpg" alt="logo semafort" class="grid-container-img"></a>
            <h4><a href="https://bibliotheque.utbm.fr/">Bibliothèque</a></h4>
        </div>

    </div>


</div>








  
 </body>
</html>
