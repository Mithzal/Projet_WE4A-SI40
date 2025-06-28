const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware
const createLog = require('../middleware/logs'); // Import logging middleware

const ueController = require('../controllers/uesController');

// All routes are protected
router.get('/', auth, ueController.index);

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


router.get('/', auth, async (req, res) => {
  if (req.query.code) {
    try {
      const ue = await require('../models/ue').findOne({ code: req.query.code });
      if (!ue) {
        return res.status(404).json({ message: 'UE non trouvée' });
      }
      res.json(ue);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    // Appel du contrôleur standard pour la liste
    return require('../controllers/uesController').index(req, res);
  }
});

module.exports = router;
