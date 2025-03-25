<!DOCTYPE html>
<html lang="fr">

<!-- La "tête" sert à définir des propriétés globales de la page -->
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="../Styles/Accueil.css"/>
    <link rel="icon" type="image/x-icon" href="../Image/Moodle.ico"/>

    <?php
    $title = "Je suis le titre de la page";
    switch (basename($_SERVER['PHP_SELF'])) {
        case "RechercheCours.php":
            $title = "Recherche de Cours";
            break;
        case "MesCours.php":
            $title = "Mes Cours";
            break;
        case "TableauBord.php":
            $title = "Tableau de bord";
            break;
        case "Accueil.php":
            $title = "Moodle";
            break;
    }



    ?>
    <title><?php echo $title;?></title>
</head>

<body>
<div class="menu">
    <a href="../Pages/Accueil.php">
        <button class="logo-button">
            <img src="../Image/logo_utbm.png" alt="Logo" class="logo">
        </button>
    </a>
    <a href="../Pages/RechercheCours.php"><button>Recherche de Cours</button></a>
    <a href="../Pages/MesCours.php"><button>Mes cours</button></a>
    <a href="../Pages/TableauBord.php"><button>Tableau de bord</button></a>
    <div class="dropdown">
        <button class="dropbtn">Sites de l'UTBM</button>
        <div class="dropdown-content">
            <a href="https://outlook.office.com/mail/">Outlook</a>
            <a href="https://utbm.sharepoint.com/sites/Portail?sw=auth">My UTBM</a>
            <a href="https://bibliotheque.utbm.fr/">Bibliotheque</a>
            <a href="https://ae.utbm.fr/">AE</a>
        </div>
    </div>
    <button class="profile-button right">AS</button>
</div>

</body>

</html>
