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
      // Convertir le chemin absolu en chemin relatif
      const absolutePath = req.file.path;
      const relativePath = path.basename(absolutePath);

      // Créer l'objet fichier après que multer ait traité la requête
      const fichier = new Fichier({
        nom: req.file.originalname,
        chemin: relativePath,
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
  console.log("req", req.method)

  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    // Configurer les en-têtes CORS pour les requêtes préalables (preflight)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');  // 24 heures
    return res.status(204).end();  // Réponse vide avec statut 204 No Content
  }

  try {
    const fichier = await Fichier.findById(fileId);

    if (!fichier) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }

    // Construire le chemin complet à partir du chemin relatif stocké
    const uploadDir = path.join(__dirname, '../uploads');
    const fullPath = path.join(uploadDir, fichier.chemin);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: 'Fichier physique non trouvé sur le serveur' });
    }

    // S'assurer que le nom du fichier est bien défini
    const fileName = fichier.nom || path.basename(fichier.chemin);

    // Ajouter des en-têtes CORS complets
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Pour répondre aux navigateurs qui bloquent les ressources opaques
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    // Modifier l'en-tête Content-Disposition pour afficher l'image dans le navigateur au lieu de la télécharger
    // Si c'est une image, on utilise 'inline' au lieu de 'attachment'
    const isImage = fichier.type?.startsWith('image/');
    const disposition = isImage ? 'inline' : 'attachment';

    const encodedFilename = encodeURIComponent(fileName);
    res.setHeader('Content-Disposition',
      `${disposition}; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
    res.setHeader('Content-Type', fichier.type || 'application/octet-stream');

    // Ajouter Cache-Control avec des valeurs qui permettent la mise en cache côté client pour les images
    if (isImage) {
      // Permettre la mise en cache pendant 1 heure pour les images
      res.setHeader('Cache-Control', 'public, max-age=3600');
    } else {
      // Pas de mise en cache pour les autres types de fichiers
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    // Utiliser createReadStream
    const fileStream = fs.createReadStream(fullPath);
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

    // Construire le chemin complet à partir du chemin relatif stocké
    const uploadDir = path.join(__dirname, '../uploads');
    const fullPath = path.join(uploadDir, fichier.chemin);

    // Supprimer le fichier physique du serveur
    fs.unlink(fullPath, async (err) => {
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
