require ('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 7777;
const logsRouter = require('./routes/logs');
const usersRouter = require('./routes/users');
const uesRouter = require('./routes/ues');
const forumsRouter = require('./routes/forums');
const notesRouter = require('./routes/notes');
const fichiersRouter = require('./routes/fichiers'); // Ajout du router pour les fichiers

app.use(express.json())

//database connection
require('./config/database');

// Configuration avancée de CORS pour résoudre les problèmes d'affichage d'images
app.use(cors({
  origin: '*', // Permet toutes les origines
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Disposition', 'Content-Length', 'Content-Type'],
  credentials: true,
  maxAge: 86400 // 24 heures en secondes
}));

// Middleware pour ajouter les en-têtes CORS sur toutes les réponses
app.use((req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

app.use('/api/logs', logsRouter);
app.use('/api/users', usersRouter);
app.use('/api/ues', uesRouter);
app.use('/api/forums', forumsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/files', fichiersRouter); // Ajout des routes pour les fichiers

// Rendre le dossier uploads accessible publiquement
// Configuration spéciale pour servir les fichiers statiques avec les bons en-têtes CORS
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static('uploads'));

//server running status
app.listen(PORT, () => {
    console.log(`The app is listening at http://localhost: ${PORT}`);
});
