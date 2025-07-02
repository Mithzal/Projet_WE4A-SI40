const note = require('../models/notes');
const Ues = require('../models/ue'); // Add UE model to access submissions

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
  try {
    const newNote = new note({
      studentId: req.body.studentId,
      ueId: req.body.ueId,
      value: req.body.value,
      teacherId: req.body.teacherId,
      comments: req.body.comments,
      assignmentId: req.body.assignmentId,
      submissionId: req.body.submissionId
    });

    const savedNote = await newNote.save();

    // If this grade is linked to a submission, update the submission with the grade ID
    if (savedNote.assignmentId && savedNote.submissionId) {
      try {
        // Find the UE that contains this assignment
        const ue = await Ues.findById(savedNote.ueId);

        if (ue) {
          // Find the assignment content
          const assignment = ue.content.id(savedNote.assignmentId);

          if (assignment && assignment.returns) {
            // Find the specific submission and add the grade reference
            const submission = assignment.returns.id(savedNote.submissionId);

            if (submission) {
              submission.gradeId = savedNote._id;
              await ue.save();
              console.log(`Updated submission ${savedNote.submissionId} with grade reference ${savedNote._id}`);
            }
          }
        }
      } catch (error) {
        console.error('Error updating submission with grade reference:', error);
        // We still continue even if linking fails, as the grade itself was saved successfully
      }
    }

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

    // No need to update the submission when updating an existing grade
    // as the link has already been established when the grade was created

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

    // If this grade was linked to a submission, remove the grade reference
    if (deletedNote.assignmentId && deletedNote.submissionId) {
      try {
        // Find the UE that contains this assignment
        const ue = await Ues.findById(deletedNote.ueId);

        if (ue) {
          // Find the assignment content
          const assignment = ue.content.id(deletedNote.assignmentId);

          if (assignment && assignment.returns) {
            // Find the specific submission and remove the grade reference
            const submission = assignment.returns.id(deletedNote.submissionId);

            if (submission) {
              submission.gradeId = undefined;
              await ue.save();
              console.log(`Removed grade reference from submission ${deletedNote.submissionId}`);
            }
          }
        }
      } catch (error) {
        console.error('Error removing grade reference from submission:', error);
        // Continue with grade deletion even if unlinking fails
      }
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
// Rechercher une note par devoir et étudiant
exports.findByAssignmentAndStudent = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    const foundNote = await note.findOne({
      assignmentId: assignmentId,
      studentId: studentId
    });

    if (!foundNote) {
      return res.status(404).json({ message: 'Aucune note trouvée pour cette combinaison étudiant/devoir' });
    }

    res.json(foundNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rechercher une note par ID de soumission
exports.findBySubmissionId = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const foundNote = await note.findOne({ submissionId: submissionId });

    if (!foundNote) {
      return res.status(404).json({ message: 'Aucune note trouvée pour cette soumission' });
    }

    res.json(foundNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
