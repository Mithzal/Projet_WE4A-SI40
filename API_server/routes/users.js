const express = require ('express');
const router = express.Router();
const auth = require('../middleware/auth');
const createLog = require('../middleware/logs'); // Import logging middleware

const userController = require('../controllers/userController');

// Public routes
router.post('/login', userController.login);

// Protected routes - require authentication
router.get('/', auth, userController.index);

// Add logging for user creation
router.post('/', auth,
    createLog('creation', (req, data) =>
        `Utilisateur créé : ${data.name} par ${req.userData.name || req.userData.userId} ${new Date().toLocaleString()}`
    ),
    userController.insert
);

// Add logging for user updates
router.put('/:id', auth,
    createLog('update', (req, data) =>
        `Utilisateur modifié : ${data.name} par ${req.userData.name || req.userData.userId} ${new Date().toLocaleString()}`
    ),
    userController.update
);

router.delete('/:id', auth, userController.delete);

// Add logging for course assignments
router.put('/enroll/:id/:courseId', auth,
    createLog('assign', (req, data) => {
        const userName = data.name || req.params.id;
        return `UE ${req.params.courseId} assignée à ${userName} par ${req.userData.name || req.userData.userId} ${new Date().toLocaleString()}`;
    }),
    userController.addCourse
);

router.get('/teachers', auth, userController.getTeachers);
router.get('/students', auth, userController.getStudents);
router.get('/:id/courses', auth, userController.getCourseFromUserId);
router.get('/:id/name', auth, userController.getNameById);

module.exports = router;
