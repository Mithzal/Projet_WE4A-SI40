const express = require('express');
const router = express.Router();

// Require controller module
const notesController = require('../controllers/notesController');

router.get('/', notesController.index);
router.post('/', notesController.insert);
router.put('/:id', notesController.update);
router.delete('/:id', notesController.delete);
router.get('/course/:ueId', notesController.findByCourse);
router.get('/student/:studentId', notesController.findByStudent);

module.exports = router;

