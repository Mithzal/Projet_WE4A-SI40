const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware
const createLog = require('../middleware/logs'); // Import logging middleware

const ueController = require('../controllers/uesController');

// Public route - no authentication required for listing courses
router.get('/', ueController.index);
router.get('/admin/',auth, ueController.index2)

// All other routes are protected
// Add logging for UE creation
router.post('/', auth,
    createLog('creation', (req, data) =>
        `UE créée ${data.code} par ${req.userData.name || req.userData.userId} ${new Date().toLocaleString()}`
    ),
    ueController.insert
);

// Add logging for UE updates
router.put('/:id', auth,
    createLog('update', (req, data) =>
        `UE ${data.code} mise à jour par ${req.userData.name || req.userData.userId} ${new Date().toLocaleString()}`
    ),
    ueController.update
);

// Add logging for UE deletion
router.delete('/:id', auth,
    createLog('delete', (req, data) =>
        `UE supprimée par ${req.userData.name || req.userData.userId} ${new Date().toLocaleString()}`
    ),
    ueController.delete
);

// Assignment submission routes
router.post('/assignement/submit/:ueId/:contentId', auth, ueController.submitAssignment);
router.get('/assignement/user/:ueId/:contentId/:userId', auth, ueController.getUserAssignment);
router.delete('/assignement/delete/:ueId/:contentId/:returnId', auth, ueController.deleteAssignment);

router.get('/name/:id', auth, ueController.getNameById);
router.get('/:id', auth, ueController.getDataById);
router.post('/content/:id', auth, ueController.addContent);

// Supprimer un contenu d'une UE
router.delete('/content/:ueId/:contentId', auth,
  async (req, res, next) => {
    // Préparer le code de l'UE pour le log et vérifier l'autorisation
    const ueId = req.params.ueId;
    let ueCode = ueId;
    let instructorId = null;
    try {
      const Ues = require('../models/ue');
      const ue = await Ues.findById(ueId);
      if (ue && ue.code) ueCode = ue.code;
      if (ue && ue.instructorId) instructorId = ue.instructorId.toString();
      // Vérification : seul le prof responsable peut supprimer
      if (!req.userData || req.userData.userId !== instructorId) {
        return res.status(403).json({ message: "Seul l'enseignant responsable de l'UE peut supprimer ce contenu." });
      }
    } catch (e) { return res.status(500).json({ message: 'Erreur lors de la vérification des droits', error: e }); }
    res.locals.ueCode = ueCode;
    next();
  },
  createLog('delete', (req, data) => {
    const user = req.userData.name || req.userData.userId;
    const ueCode = data.ueCode || res.locals.ueCode || req.params.ueId;
    return `Contenu supprimé de l'UE ${ueCode} par ${user} à ${new Date().toLocaleString()}`;
  }),
  async (req, res) => {
    const { ueId, contentId } = req.params;
    try {
      const ue = await require('../models/ue').findById(ueId);
      if (!ue) return res.status(404).json({ message: 'UE not found' });
      const initialLength = ue.content.length;
      ue.content = ue.content.filter(c => c._id.toString() !== contentId);
      if (ue.content.length === initialLength) {
        return res.status(404).json({ message: 'Contenu non trouvé' });
      }
      await ue.save();
      // Inclure le code de l'UE dans la réponse pour le log
      res.json({ ...ue.toObject(), ueCode: res.locals.ueCode });
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la suppression du contenu', error: err });
    }
  }
);

// Log de consultation d'une UE
router.post('/consult/:id', auth, async (req, res) => {
    try {
        const ueId = req.params.id;
        const userId = req.userData.userId;
        const userName = req.userData.name || userId;
        const now = new Date();
        const formattedDate = now.toLocaleDateString('fr-FR') + ' à ' + now.toLocaleTimeString('fr-FR');
        const ueController = require('../controllers/uesController');
        // Récupérer le code de l'UE pour le log
        const Ues = require('../models/ue');
        const ue = await Ues.findById(ueId);
        const ueCode = ue ? ue.code : ueId;
        const log = {
            type: 'reading',
            message: `Consultation du cours ${ueCode} par ${userName} le ${formattedDate}`,
            userId: userId,
            timestamp: now.toISOString()
        };
        // Création du log
        const Log = require('../models/log');
        await Log.create(log);
        res.status(201).json({ message: 'Log de consultation créé' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
