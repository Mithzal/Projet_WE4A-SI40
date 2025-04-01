<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration</title>
    <link rel="stylesheet" href="../Styles/Admin.css"> <!-- Lien vers un fichier CSS -->
    <link rel="stylesheet" href="../Styles/Accueil.css">
    <script src="../script/AdminScript.js" defer></script> <!-- Lien vers un fichier JS -->
</head>
<body>
    <div class="menu">
        <a href="Accueil.php">
           <button class="logo-button">
               <img src="../Image/logo_utbm.png" alt="Logo" class="logo">
           </button>
        </a>
        <a href="RechercheCours.php"><button>Recherche de Cours</button></a>
        <a href="MesCours.php"><button>Mes cours</button></a>
        <a href="TableauBord.php"><button>Tableau de bord</button></a>
        <button class="profile-button right">AS</button>
      </div>

    <h1 style="padding-top: 50px;">Page d'administration</h1>
    
    <main>
        <section id="catalogue">
            <h2>Catalogue</h2>
            <div class="tabs">
                <button class="tab-button" data-tab="users">Utilisateurs</button>
                <button class="tab-button" data-tab="ues">UE</button>
            </div>
            <div class="tab-content" id="users-tab">
                <h3>Liste des utilisateurs</h3>
                <button class="tab-button" id="create-user">Créer un utilisateur</button>
                <ul id="user-list">
                    <!-- Liste des utilisateurs générée dynamiquement -->
                </ul>
            </div>
            <div class="tab-content" id="ues-tab" style="display: none;">
                <h3>Liste des UE</h3>
                <button class="tab-button" id="create-ue">Créer une UE</button>
                <ul id="ue-list">
                    <!-- Liste des UE générée dynamiquement -->
                </ul>
            </div>
        </section>
    </main> 
</body>
</html>