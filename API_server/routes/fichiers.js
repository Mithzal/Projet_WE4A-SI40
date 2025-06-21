// routes/fichierRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware
const fichierController = require('../controllers/fichierController');

// All routes are protected
router.post('/upload', auth, fichierController.uploadFile);
router.get('/', auth, fichierController.listerFichiers);
router.get('/download/:id', auth, fichierController.downloadFile);
router.delete('/delete/:id', auth, fichierController.deleteFile);

module.exports = router;
