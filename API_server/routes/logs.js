const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware

// Require controller module
const logController = require('../controllers/logController');

// All routes are protected
router.get('/', auth, logController.index);
router.post('/', auth, logController.insert);
router.put('/:id', auth, logController.update);
router.delete('/:id', auth, logController.delete);

module.exports = router;
