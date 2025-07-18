const user = require('../models/user');
const Ues = require("../models/ue");
const jwt = require('jsonwebtoken');

// Afficher tous les utilisateurs
exports.index = async (req, res) => {
  try {
    const users = await user.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

//ajouter un nouvel utilisateur
exports.insert = async (req, res) => {
  const newUser = new user({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    courses: req.body.courses,
    password: req.body.password
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Mettre à jour un utilisateur
exports.update = async (req, res) => {
  try {
    const updatedUser = await user.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Supprimer un utilisateur
exports.delete = async (req, res) => {
  try {
    const deletedUser = await user.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.addCourse = async (req, res) => {
  try {
    const userId = req.params.id;
    const courseId = req.params.courseId;

    const existingUser = await user.findById(userId)
    if (!existingUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const courseExists = existingUser.courses.some(course =>
      course.courseId ? course.courseId.toString() === courseId : course.toString() === courseId
    );
    // Vérifier si le cours existe déjà
    if (courseExists) {
      return res.status(400).json({ message: 'Ce cours est déjà assigné à l\'utilisateur' });
    }

    const updatedUser = await user.findByIdAndUpdate(
      userId,
      { $push: { courses: { courseId: courseId } } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

exports.getCourseFromUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const userWithCourses = await user.findById(userId).populate('courses.courseId');

    if (!userWithCourses) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create an array of courses with lastAccess information
    const coursesWithAccess = [];

    for (const course of userWithCourses.courses) {
      if (course.courseId) {
        // Create a course object with both UE details and lastAccess information
        const courseData = course.courseId.toObject();
        courseData.lastAccess = course.lastAccess;
        coursesWithAccess.push(courseData);
      }
    }

    res.json(coursesWithAccess);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.getUsersEnrolement = async (req, res) => {
  try {
    const users = await user.find({}).populate('courses.courseId');
    const usersWithCourses = users.map(user => ({
      ...user.toObject(),
      courses: user.courses.map(course => ({
        ...course.toObject(),
        courseId: course.courseId ? course.courseId._id : null
      }))
    }));
    res.json(usersWithCourses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await user.find({ role: 'Teacher' });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.getStudents = async (req, res) => {
  try {
    const students = await user.find({ role: 'Student' });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.getNameById = async (req, res) => {
  try {
    const userId = req.params.id;
    const foundUser = await user.findById(userId);
    if (!foundUser) {
      return res.status(404).json({message: 'Utilisateur non trouvé'});
    }
    res.json({name: foundUser.name});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const foundUser = await user.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate password (in production, use bcrypt to compare hashed passwords)
    if (foundUser.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: foundUser._id, role: foundUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Log the login action
    const loginLog = require('../models/log');
    await loginLog.create({
      type: 'logging',
      message: `Utilisateur connecté : ${foundUser.name || foundUser.email || 'inconnu'} à ${new Date().toLocaleString()}`,
      userId: foundUser._id,
      timestamp: new Date()
    });


    // Return user data and token
    res.json({
      token,
      user: {
        _id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        courses : foundUser.courses
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const Log = require('../models/log');
    await Log.create({
      type: 'disconnect',
      message: `Utilisateur déconnecté : ${req.userData.name || req.userData.userId || 'inconnu'} à ${new Date().toLocaleString()}`,
      userId: req.userData.userId,
      timestamp: new Date()
    });
    res.json({ message: 'Déconnexion réussie' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Obtenir les utilisateurs inscrits à une UE
exports.getUsersByUe = async (req, res) => {
  try {
    const users = await user.find({ 'courses.courseId': req.params.ueId }, 'name email role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update lastAccess for a course
exports.updateLastAccess = async (req, res) => {
  try {
    const userId = req.params.id;
    const courseId = req.params.courseId;
    const currentTime = new Date();

    // Find the user and update the lastAccess date for the specific course
    const updatedUser = await user.findOneAndUpdate(
      {
        _id: userId,
        'courses.courseId': courseId
      },
      {
        $set: { 'courses.$.lastAccess': currentTime }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User or course not found' });
    }

    res.json({
      message: 'Last access updated successfully',
      lastAccess: currentTime
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

