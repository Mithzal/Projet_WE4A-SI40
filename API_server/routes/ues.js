const express = require('express');
const router = express.Router();

const ueController = require('../controllers/uesController');

router.get('/', ueController.index);
router.post('/', ueController.insert);
router.put('/:id', ueController.update);
router.delete('/:id', ueController.delete);
router.get('/name/:id', ueController.getNameById);

module.exports = router;
