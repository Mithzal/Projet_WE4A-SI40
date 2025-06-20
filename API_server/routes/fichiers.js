// routes/fichierRoutes.js
const express = require('express');
const router = express.Router();
const fichierController = require('../controllers/fichierController');

router.post('/upload', fichierController.uploadFile);
router.get('/', fichierController.listerFichiers);
router.get('/download/:id', fichierController.downloadFile);
router.delete('/delete/:id', fichierController.deleteFile);

module.exports = router;
