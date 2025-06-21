const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware

// Require controller module
const forumController = require('../controllers/forumController');

// All routes are protected
router.get('/', auth, forumController.index);
router.post('/', auth, forumController.insert);
router.put('/:id', auth, forumController.update);
router.delete('/:id', auth, forumController.delete);
router.put('/:id/addMessages', auth, forumController.addMessage);
router.get('/:id/messages', auth, forumController.getMessages);

module.exports = router;
