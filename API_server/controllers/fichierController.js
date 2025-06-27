// fichierController.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Fichier = require('../models/fichier'); // Importez votre modèle

// Configuration du stockage
const createUploadDirectory = () => {
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = createUploadDirectory();
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté'), false);
    }
  }
}).single('file');

exports.uploadFile = (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      console.error("Erreur Multer:", err);
      return res.status(400).json({ message: `Erreur d'upload: ${err.message}` });
    } else if (err) {
      console.error("Erreur inconnue:", err);
      return res.status(400).json({ message: err.message });
    }


    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    try {
      // Créer l'objet fichier après que multer ait traité la requête
      const fichier = new Fichier({
        nom: req.file.originalname,
        chemin: req.file.path,
        taille: req.file.size,
        uploadedBy : req.body.uploadedBy,
        type: req.file.mimetype,
        coursId: req.body.coursId,
        description: req.body.description,
        dateUpload: new Date()
      });

      // Sauvegarder dans la base de données
      const savedFile = await fichier.save();

      res.status(201).json({
        success: true,
        message: 'Fichier téléchargé avec succès',
        fichier: savedFile
      });
    } catch (dbError) {
      console.error("Erreur DB:", dbError);
      res.status(500).json({ message: 'Erreur lors de l\'enregistrement du fichier' });
    }
  });
};

exports.listerFichiers = async (req, res) => {
  try {
    const fichiers = await Fichier.find();
    res.status(200).json({
      success: true,
      message: 'Liste des fichiers récupérée avec succès',
      fichiers: fichiers
    });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: 'Erreur lors de la récupération des fichiers' });
  }
};

exports.downloadFile = async (req, res) => {
  const fileId = req.params.id;
  console.log("req",req)

  try {
    const fichier = await Fichier.findById(fileId);

    if (!fichier) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }

    if (!fs.existsSync(fichier.chemin)) {
      return res.status(404).json({ message: 'Fichier physique non trouvé sur le serveur' });
    }

    // S'assurer que le nom du fichier est bien défini
    const fileName = fichier.nom || path.basename(fichier.chemin);

    // Configurer les en-têtes avec deux formats pour une meilleure compatibilité
    const encodedFilename = encodeURIComponent(fileName);
    res.setHeader('Content-Disposition',
      `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
    res.setHeader('Content-Type', fichier.type || 'application/octet-stream');

    // Ajouter Cache-Control pour éviter la mise en cache
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    // Utiliser createReadStream
    const fileStream = fs.createReadStream(fichier.chemin);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      console.error("Erreur de stream:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Erreur lors du téléchargement du fichier' });
      }
    });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
  }
};

exports.deleteFile = async (req, res) => {
  const fileId = req.params.id;

  try {
    const fichier = await Fichier.findById(fileId);

    if (!fichier) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }

    // Supprimer le fichier physique du serveur
    fs.unlink(fichier.chemin, async (err) => {
      if (err) {
        console.error("Erreur de suppression du fichier physique:", err);
        return res.status(500).json({ message: 'Erreur lors de la suppression du fichier physique' });
      }

      // Supprimer l'entrée de la base de données
      await Fichier.findByIdAndDelete(fileId);
      res.status(200).json({ success: true, message: 'Fichier supprimé avec succès' });
    });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: 'Erreur lors de la suppression du fichier' });
  }
}

exports.getNameById = async (req, res) => {
  try {
    const fichier = await Fichier.findById(req.params.id);
    if (!fichier) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }
    res.json({ nom: fichier.nom });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
