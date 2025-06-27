const forum = require('../models/forums');

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
    // Vérifier que le titre est fourni
    if (!req.body.title) {
      return res.status(400).json({ message: 'Le titre du forum est requis' });
    }

    // Rechercher et mettre à jour uniquement le titre du forum
    const updatedForum = await forum.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true } // Pour retourner le document mis à jour
    );

    if (!updatedForum) {
      return res.status(404).json({ message: 'Forum non trouvé' });
    }

    res.json(updatedForum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
