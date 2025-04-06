<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Recherche de Cours</title>
    <link rel="stylesheet" href="../Styles/style-accueil.css">
</head>

<?php
include("../PageParts/Header.php");
?>

<body>
<div class="container">
    <div class="main-content">
        <h1>Recherche de Cours</h1>
        <div class="course-controls">
            <input type="text" id="search-bar" placeholder="Rechercher un cours...">
            <label for="sort-courses"></label><select id="sort-courses">
                <option value="name">Trier par nom</option>
                <option value="date">Trier par date</option>
            </select>
        </div>
        <div class="courses" id="course-list">
            <!-- Les cours seront affichés ici -->
        </div>
    </div>
</div>
</body>
</html>