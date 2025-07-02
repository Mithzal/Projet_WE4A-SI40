const forum = require('../models/forums');
const Log = require('../models/log');
const Ue = require('../models/ue');

// Afficher tous les forums
exports.index = async (req, res) => {
  try {
    const forums = await forum.find({});
    res.json(forums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Ajouter un nouveau forum
exports.insert = async (req, res) => {
  const newForum = new forum({
    courseId: req.body.courseId,
    title: req.body.title,
    messages : req.body.messages
  });

  try {
    const savedForum = await newForum.save();
    // Récupérer le code de l'UE
    let ueCode = '';
    try {
      const ue = await Ue.findById(savedForum.courseId);
      ueCode = ue ? ue.code : savedForum.courseId;
    } catch (e) { ueCode = savedForum.courseId; }
    // Log de création
    try {
      const now = new Date();
      const dateStr = now.toLocaleString('fr-FR');
      await Log.create({
        type: 'creation',
        message: `Forum créé: ${savedForum.title} dans l'UE: ${ueCode} par ${req.userData?.name || req.userData?.userId} le ${dateStr}`,
        userId: req.userData.userId,
        timestamp: now
      });
    } catch (e) { /* ignore log error */ }
    res.status(201).json(savedForum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mettre à jour un forum
exports.update = async (req, res) => {
  try {
    const updatedForum = await forum.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedForum) {
      return res.status(404).json({ message: 'Forum non trouvé' });
    }

    res.json(updatedForum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un forum
exports.delete = async (req, res) => {
  try {
    const deletedForum = await forum.findByIdAndDelete(req.params.id);
    if (!deletedForum) {
      return res.status(404).json({ message: 'Forum non trouvé' });
    }
    // Récupérer le code de l'UE
    let ueCode = '';
    try {
      const ue = await Ue.findById(deletedForum.courseId);
      ueCode = ue ? ue.code : deletedForum.courseId;
    } catch (e) { ueCode = deletedForum.courseId; }
    // Log de suppression
    try {
      const now = new Date();
      const dateStr = now.toLocaleString('fr-FR');
      await Log.create({
        type: 'delete',
        message: `Forum supprimé: ${deletedForum.title} dans l'UE: ${ueCode} par ${req.userData?.name || req.userData?.userId} le ${dateStr}`,
        userId: req.userData.userId,
        timestamp: now
      });
    } catch (e) { /* ignore log error */ }
    res.json({ message: 'Forum supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajouter un message à un forum
exports.addMessage = async (req, res) => {
  try {
    const forumToUpdate = await forum.findById(req.params.id);

    if (!forumToUpdate) {
      return res.status(404).json({message: 'Forum non trouvé'});
    }

    const newMessage = {
      content: req.body.content,
      type: req.body.type,
      timestamp: new Date(),
      author: req.body.author
    };
    forumToUpdate.messages.push(newMessage);
    await forumToUpdate.save();
    res.status(201).json(forumToUpdate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
// Obtenir les messages d'un forum
exports.getMessages = async (req, res) => {
  try {
    const forumToGetMessages = await forum.findById(req.params.id);

    if (!forumToGetMessages) {
      return res.status(404).json({ message: 'Forum non trouvé' });
    }

    res.json(forumToGetMessages.messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//obtenir un forum par l'id du cours
exports.getForumById = async (req, res) => {
  try {
    const forumByCourseId = await forum.findOne({ courseId: req.params.courseId });

    if (!forumByCourseId) {
      return res.status(404).json({ message: 'Forum non trouvé pour ce cours' });
    }

    res.json(forumByCourseId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}

// Mettre à jour le titre d'un forum
exports.updateTitle = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: 'Le titre du forum est requis' });
    }
    const updatedForum = await forum.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );
    if (!updatedForum) {
      return res.status(404).json({ message: 'Forum non trouvé' });
    }
    // Récupérer le code de l'UE
    let ueCode = '';
    try {
      const ue = await Ue.findById(updatedForum.courseId);
      ueCode = ue ? ue.code : updatedForum.courseId;
    } catch (e) { ueCode = updatedForum.courseId; }
    // Log de modification
    try {
      const now = new Date();
      const dateStr = now.toLocaleString('fr-FR');
      await Log.create({
        type: 'update',
        message: `Titre du forum modifié: ${updatedForum.title} dans l'UE: ${ueCode} par ${req.userData?.name || req.userData?.userId} le ${dateStr}`,
        userId: req.userData.userId,
        timestamp: now
      });
    } catch (e) { /* ignore log error */ }
    res.json(updatedForum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obtenir tous les forums d'une UE (par courseId)
exports.getForumsByCourseId = async (req, res) => {
  try {
    const forums = await forum.find({ courseId: req.params.courseId });
    if (!forums || forums.length === 0) {
      return res.status(404).json({ message: 'Aucun forum trouvé pour ce cours' });
    }
    res.json(forums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un message d'un forum
exports.deleteMessage = async (req, res) => {
  try {
    const forumId = req.params.forumId;
    const messageIndex = parseInt(req.params.messageIndex, 10);
    const userId = req.userData.userId;
    const userRole = req.userData.role;

    const forumDoc = await forum.findById(forumId);
    if (!forumDoc) {
      return res.status(404).json({ message: 'Forum non trouvé' });
    }
    // Vérifier si l'utilisateur est admin ou prof lié à l'UE
    if (userRole !== 'Admin' && userRole !== 'Teacher') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    // Optionnel: vérifier que le prof est bien lié à l'UE
    if (userRole === 'Teacher') {
      const User = require('../models/user');
      const teacher = await User.findById(userId);
      const isLinked = teacher.courses.some(c => c.courseId && c.courseId.toString() === forumDoc.courseId.toString());
      if (!isLinked) {
        return res.status(403).json({ message: 'Accès refusé: vous n\'êtes pas lié à cette UE' });
      }
    }
    if (!forumDoc.messages || messageIndex < 0 || messageIndex >= forumDoc.messages.length) {
      return res.status(400).json({ message: 'Index de message invalide' });
    }
    const deletedMsg = forumDoc.messages[messageIndex];
    forumDoc.messages.splice(messageIndex, 1);
    await forumDoc.save();
    // Log de suppression de message
    try {
      const now = new Date();
      const Log = require('../models/log');
      await Log.create({
        type: 'delete',
        message: `Message supprimé dans le forum ${forumDoc.title} (UE: ${forumDoc.courseId}) par ${req.userData?.name || req.userData?.userId} le ${now.toLocaleString('fr-FR')}`,
        userId: req.userData.userId,
        timestamp: now
      });
    } catch (e) { /* ignore log error */ }
    res.json({ message: 'Message supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};