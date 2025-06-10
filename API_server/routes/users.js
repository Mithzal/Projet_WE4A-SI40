const express = require ('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.index);

router.post('/', userController.insert);

router.put('/:id', userController.update);

router.delete('/:id', userController.delete);

module.exports = router;
