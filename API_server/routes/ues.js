const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware

const ueController = require('../controllers/uesController');

// All routes are protected
router.get('/', auth, ueController.index);
router.post('/', auth, ueController.insert);
router.put('/:id', auth, ueController.update);
router.delete('/:id', auth, ueController.delete);
router.get('/name/:id', auth, ueController.getNameById);
router.get('/:id', auth, ueController.getDataById);
router.post('/content/:id', auth, ueController.addContent);

module.exports = router;
