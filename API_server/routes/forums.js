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
router.get('/:courseId', auth, forumController.getForumById);
router.put('/:id/updateTitle', auth, forumController.updateTitle);
// Nouvelle route pour obtenir tous les forums d'une UE (par courseId)
router.get('/byCourse/:courseId', auth, forumController.getForumsByCourseId);
router.delete('/:forumId/messages/:messageIndex', auth, forumController.deleteMessage);

module.exports = router;
