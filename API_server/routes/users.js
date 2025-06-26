const express = require ('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userController = require('../controllers/userController');

// Public routes
router.post('/login', userController.login);

// Protected routes - require authentication
router.get('/', auth, userController.index);
router.post('/', auth, userController.insert);
router.put('/:id', auth, userController.update);
router.delete('/:id', auth, userController.delete);
router.put('/enroll/:id/:courseId', auth, userController.addCourse);
router.get('/teachers', auth, userController.getTeachers);
router.get('/students', auth, userController.getStudents);
router.get('/:id/courses', auth, userController.getCourseFromUserId);
router.get('/:id/name', auth, userController.getNameById);

module.exports = router;
