<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tableau de Bord</title>
    <link rel="stylesheet" href="../Styles/TableauBord.css">

    <script src="../script/TableauBord.js" defer></script>
</head>

<?php
include("../PageParts/Header.php");
?>

<body>
<div class="container">
    <main class="main-content">
    <h1>Tableau de bord</h1>

    <div class="section">
        <div class ="course-controls">
        <div class="title">Cours consultés récemment</div>
        <div class="arrows">
            <button class="prev" onclick="updateShownCourse()"><</button>
            <button class="next" onclick="updateShownCourse()">></button>
        </div>
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
            <div class="course-card" data-last-access="5">
                <img src="../Image/math.jpg" alt="Mathématiques">
                <h3>Mathématiques</h3>
                <p>Introduction aux fonctions et aux dérivées.</p>
                <div class="course-footer">
                    <a href="#">Accéder</a>
                    <span class="progress">Progression : 75%</span>
                </div>
            </div>
            <div class="course-card" data-last-access="5">
                <img src="../Image/math.jpg" alt="Mathématiques">
                <h3>Mathématiques</h3>
                <p>Introduction aux fonctions et aux dérivées.</p>
                <div class="course-footer">
                    <a href="#">Accéder</a>
                    <span class="progress">Progression : 75%</span>
                </div>
            </div>
            <div class="course-card" data-last-access="5">
                <img src="../Image/math.jpg" alt="Mathématiques">
                <h3>Mathématiques</h3>
                <p>Introduction aux fonctions et aux dérivées.</p>
                <div class="course-footer">
                    <a href="#">Accéder</a>
                    <span class="progress">Progression : 75%</span>
                </div>
            </div>
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
    </main>
</div>
</body>
</html>