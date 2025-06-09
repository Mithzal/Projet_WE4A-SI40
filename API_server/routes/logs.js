const express = require('express');
const router = express.Router();

// Require controller module
const logController = require('../controllers/logController');

router.get('/', logController.index);

router.post('/', logController.insert);

router.put('/:id', logController.update);

router.delete('/:id', logController.delete);

module.exports = router;
