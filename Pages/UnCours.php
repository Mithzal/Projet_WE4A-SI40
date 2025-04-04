<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cours - Moodle</title>
    <link rel="stylesheet" href="../Styles/UnCours.css">
    <script src="../script/UnCours.js" defer></script>
</head>

<?php
include("../PageParts/Header.php");
?>

<body>
<div class="container">
    <button class="toggle-btn" onclick="toggleSidebar()">☰</button>
    <aside class="sidebar hidden">
        <h2>Menu du Cours</h2>
        <ul>
            <li><a href="#introduction">Introduction</a></li>
            <li><a href="#messageimportant">Message important</a></li>
            <li><a href="#messageinfo">Message information</a></li>
            <li><a href="#download">Fichier</a></li>
            <li><a href="#quiz">Quiz Final</a></li>
        </ul>
    </aside>
    <main class="main-content">
        <h1>Bienvenue au Cours</h1>
        <div class="navbar">
            <button>Cours</button>
            <button>Participants</button>
            <button>Notes</button>
        </div>
        <section id="introduction">
            <h2>Introduction</h2>
            <p>Bienvenue dans ce cours. Vous apprendrez les bases essentielles.</p>
        </section>
        <section id="messageimportant" class="post message important">
            <div class="alert-icon">
                <div class="circle"></div>
                <div class="exclamation">!</div>
            </div>
            <div class="important text-content">
                <h2>Message important</h2>
                <p>Ceci est très important</p>
            </div>
        </section>
        <section id="messageinfo" class="post message information">
            <h2>Message information</h2>
            <p>Ceci est une information</p>
        </section>
        <section id="download" class="post depot">
            <div class="download-icon">
                <div class="arrow-head"></div>
                <div class="bar"></div>
            </div>
            <div class="depot text-content">
                <h2>Fichiers</h2>
                <p>Contenu du troisième module...</p>
                <a href="#" class="download">Télécharger le fichier ZIP</a>
            </div>
        </section>
        <section id="quiz">
            <h2>Quiz Final</h2>
            <p>Testez vos connaissances en passant le quiz final.</p>
        </section>
    </main>
</div>
</body>
</html>
