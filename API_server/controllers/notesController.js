const note = require('../models/notes');

// Afficher toutes les notes
exports.index = async (req, res) => {
  try {
    const notes = await note.find({});
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Ajouter une nouvelle note
exports.insert = async (req, res) => {
  const newNote = new note({
    studentId: req.body.studentId,
    ueId: req.body.ueId,
    value: req.body.value,
    teacherId: req.body.teacherId,
    comments: req.body.comments
  });

  try {
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Mettre à jour une note
exports.update = async (req, res) => {
  try {
    const updatedNote = await note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Supprimer une note
exports.delete = async (req, res) => {
  try {
    const deletedNote = await note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    res.json({ message: 'Note supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Rechercher des notes par étudiant
exports.findByStudent = async (req, res) => {
  try {
    const notes = await note.find({ studentId: req.params.studentId });
    if (notes.length === 0) {
      return res.status(404).json({ message: 'Aucune note trouvée pour cet étudiant' });
    }
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Rechercher des notes par cours
exports.findByCourse = async (req, res) => {
  try {
    const notes = await note.find({ ueId: req.params.ueId });
    if (notes.length === 0) {
      return res.status(404).json({ message: 'Aucune note trouvée pour ce cours' });
    }
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
