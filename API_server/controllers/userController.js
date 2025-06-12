const user = require('../models/user');

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
      { push: { courses: { courseId: courseId } } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

