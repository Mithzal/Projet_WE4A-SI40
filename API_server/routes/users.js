const express = require ('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.index);

router.post('/', userController.insert);

router.put('/:id', userController.update);

router.delete('/:id', userController.delete);

router.put('/enroll/:id/:courseId', userController.addCourse);

router.get('/teachers', userController.getTeachers);

router.get('/students', userController.getStudents);

router.get('/:id/courses', userController.getCourseFromUserId);

router.post('/login', userController.login);

module.exports = router;
