const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware

// Require controller module
const notesController = require('../controllers/notesController');

// All routes are protected
router.get('/', auth, notesController.index);
router.post('/', auth, notesController.insert);
router.put('/:id', auth, notesController.update);
router.delete('/:id', auth, notesController.delete);
router.get('/course/:ueId', auth, notesController.findByCourse);
router.get('/student/:studentId', auth, notesController.findByStudent);

module.exports = router;
