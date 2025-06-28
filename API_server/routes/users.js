const express = require ('express');
const router = express.Router();
const auth = require('../middleware/auth');
const createLog = require('../middleware/logs'); // Import logging middleware

const userController = require('../controllers/userController');

// Public routes
router.post('/login', userController.login);

// Protected routes
router.get('/', auth, userController.index);

router.post('/', auth,
    createLog('creation', (req, data) =>
        `Utilisateur créé : ${data.name} par ${req.userData.name || req.userData.userId} ${new Date().toLocaleString()}`
    ),
    userController.insert
);

router.put('/:id', auth,
    createLog('update', (req, data) =>
        `Utilisateur modifié : ${data.name} par ${req.userData.name || req.userData.userId} ${new Date().toLocaleString()}`
    ),
    userController.update
);

router.delete('/:id', auth,
  createLog( 'delete', (req, data) =>
        `Utilisateur supprimé : ${data.name} par ${req.userData.name || req.userData.userId} ${new Date().toLocaleString()}`
  ),
  userController.delete
);

router.put('/enroll/:id/:courseId', auth,
    async (req, res, next) => {
        const Ues = require('../models/ue');
        let ueCode = req.params.courseId;
        try {
            const ue = await Ues.findById(req.params.courseId);
            if (ue && ue.code) ueCode = ue.code;
        } catch (e) {}
        req.ueCodeForLog = ueCode;
        next();
    },
    createLog('assign', (req, data) => {
        const userName = data.name || req.params.id;
        return `UE ${req.ueCodeForLog} assignée à ${userName} par ${req.userData.name || req.userData.userId} ${new Date().toLocaleString()}`;
    }),
    userController.addCourse
);

router.get('/teachers', auth, userController.getTeachers);
router.get('/students', auth, userController.getStudents);
router.get('/:id/courses', auth, userController.getCourseFromUserId);
router.get('/:id/name', auth, userController.getNameById);

// Route pour obtenir les utilisateurs d'une UE
router.get('/byUe/:ueId', auth, userController.getUsersByUe);

// Déconnexion utilisateur
router.post('/logout', auth, userController.logout);

module.exports = router;
