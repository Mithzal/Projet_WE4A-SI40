const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware
const createLog = require('../middleware/logs'); // Import logging middleware

const ueController = require('../controllers/uesController');

// All routes are protected
router.get('/', ueController.index); // <- accès public à la liste des cours

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
router.get('/assignement/all/:ueId/:contentId', auth, ueController.getAllSubmissions);
router.delete('/assignement/delete/:ueId/:contentId/:returnId', auth, ueController.deleteAssignment);

router.get('/name/:id', auth, ueController.getNameById);
router.get('/:id', auth, ueController.getDataById);
router.post('/content/:id', auth, ueController.addContent);

module.exports = router;
