<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tableau de Bord</title>
    <link rel="stylesheet" href="../Styles/TableauBord.css">
</head>
<?php
include("../PageParts/Header.php");
?>
<body>
<div class="container">
    <h1><strong>Tableau de bord</strong></h1>

    <div class="section">
        <h2>Cours consultés récemment</h2>
        <div class="arrows">
            <button class="prev" onclick="changeSlide(-1)">&#10094;</button>
            <button class="next" onclick="changeSlide(1)">&#10095;</button>
        </div>
        <div class="course-grid">
            <div class="course-card">Cours 1</div>
            <div class="course-card">Cours 2</div>
            <div class="course-card">Cours 3</div>
            <div class="course-card">Cours 4</div>
            <div class="course-card">Cours 5</div>
            <div class="course-card">Cours 6</div>
            <div class="course-card">Cours 7</div>
            <div class="course-card">Cours 8</div>
        </div>
    </div>

    <div class="section">
        <h2>Cours favoris</h2>
        <div class="favorites">Aucun cours marqué comme favori</div>
    </div>
    <div class="calendar-section">
        <h2>Calendar</h2>
        <div id="calendar"></div>
    </div>
</div>
</body>
</html>
