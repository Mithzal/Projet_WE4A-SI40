<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mes Cours - Moodle</title>
    <link rel="stylesheet" href="../Styles/MesCours.css">
    <script src="../script/MesCours.js" defer></script>
</head>

<?php
include("../PageParts/Header.php");
?>

 <body>
 <div class="container">
     <main class="main-content">
         <h1>Mes Cours</h1>
         <div class="course-controls">
             <input type="text" id="search-bar" placeholder="Rechercher un cours...">
             <select id="sort-courses">
                 <option value="name">Trier par nom</option>
                 <option value="date">Trier par dernier accès</option>
             </select>
         </div>
         <div class="courses">
             <div class="course-card" data-last-access="5">
                 <img src="../Image/math.jpg" alt="Mathématiques">
                 <h3>Mathématiques</h3>
                 <p>Introduction aux fonctions et aux dérivées.</p>
                 <div class="course-footer">
                     <a href="#">Accéder</a>
                     <span class="progress">Progression : 75%</span>
                 </div>
             </div>
             <div class="course-card" data-last-access="3">
                 <h3>Informatique</h3>
                 <p>Développement web et algorithmique.</p>
                 <div class="course-footer">
                     <a href="#">Accéder</a>
                     <span class="progress">Progression : 0%</span>
                 </div>
             </div>
             <div class="course-card" data-last-access="1">
                 <h3>Physique</h3>
                 <p>Mécanique et thermodynamique.</p>
                 <div class="course-footer">
                     <a href="#">Accéder</a>
                     <span class="progress">Progression : 30%</span>
                 </div>
             </div>

             <div class="course-card" data-last-access="7">
                 <h3>Chimie</h3>
                 <p>Equations chimiques et lois de conservation.</p>
                 <div class="course-footer">
                     <a href="#">Accéder</a>
                     <span class="progress">Progression : 0%</span>
                 </div>
             </div>
             <div class="course-card" data-last-access="2">
                 <h3>Design</h3>
                 <p>Exploration des principes de conception et du processus créatif.</p>
                 <div class="course-footer">
                     <a href="#">Accéder</a>
                     <span class="progress">Progression : 7%</span>
                 </div>
             </div>
             <div class="course-card" data-last-access="4">
                 <h3>Electronique analogique</h3>
                 <p>Introduction aux amplificateurs opérationnels.</p>
                 <div class="course-footer">
                     <a href="#">Accéder</a>
                     <span class="progress">Progression : 62%</span>
                 </div>
             </div>

         </div>
     </main>
     <aside class="newsfeed">
         <h2>Fil d'actualité</h2>
         <ul>
             <li>Nouveau devoir en Mathématiques</li>
             <li>Webinaire en Informatique demain</li>
             <li>Résultats du test de Physique disponibles</li>
         </ul>
     </aside>
 </div>
 </body>
</html>