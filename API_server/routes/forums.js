const express = require('express');
const router = express.Router();

// Require controller module
const forumController = require('../controllers/forumController');

router.get('/', forumController.index);
router.post('/', forumController.insert);
router.put('/:id', forumController.update);
router.delete('/:id', forumController.delete);
router.put('/:id/addMessages', forumController.addMessage);
router.get('/:id/messages', forumController.getMessages);
module.exports = router;
