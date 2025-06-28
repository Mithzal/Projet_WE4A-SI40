const Ues = require('../models/ue');
const Log = require('../models/log');
const User = require('../models/user'); // Ensuring we use the correct model reference

exports.index = async (req, res) => {
  try {
    // Find all courses but select only the required fields
    const ues = await Ues.find({}, 'code name description credits instructorId');

    // Transform the result to replace instructorId with instructor name
    const uesToSend = await Promise.all(ues.map(async (ue) => {
      try {
        // Find the instructor by ID to get their name
        const instructor = await User.findById(ue.instructorId, 'name');

        // Convert the document to a plain object so we can modify it
        const ueObject = ue.toObject();

        // Replace instructorId value with instructor name, but keep the field name
        if (instructor) {
          ueObject.instructorId = instructor.name;
        } else {
          ueObject.instructorId = "Unknown";
        }

        return ueObject;
      } catch (error) {
        // Handle any errors during instructor lookup
        console.error(`Error processing UE ${ue._id}: ${error.message}`);
        const ueObject = ue.toObject();
        ueObject.instructorId = "Error retrieving instructor";
        return ueObject;
      }
    }));

    res.json(uesToSend);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.insert = async (req, res) => {
  const ue = new Ues({
    code: req.body.code,
    name: req.body.name,
    credits: req.body.credits,
    description: req.body.description,
    instructorId: req.body.instructorId
  });

  try {
    const newUe = await ue.save();
    res.status(201).json(newUe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const ue = await Ues.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );
    if (!ue) {
      return res.status(404).json({message: 'UE non trouvée'});
    }
    res.json(ue);
  }catch (err) {
    res.status(400).json({message: err.message});
  }
}

exports.delete = async (req, res) => {
  try {
    const ue = await Ues.findByIdAndDelete(req.params.id);
    if (!ue) {
      return res.status(404).json({message: 'UE non trouvée'});
    }
    res.json({message: 'UE supprimée'});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};

exports.getNameById = async (req, res) => {
  try {
    const ue = await Ues.findById(req.params.id);
    if (!ue) {
      return res.status(404).json({message: 'UE non trouvée'});
    }
    res.json({name: ue.name});
  } catch (err) {
    res.status(500).json({message: err.message});
  }

}

exports.getDataById = async (req, res) => {
  try {
    const ue = await Ues.findById(req.params.id);
    if (!ue) {
      return res.status(404).json({message: 'UE non trouvée'});
    }
    res.json({
      code: ue.code,
      name: ue.name,
      credits: ue.credits,
      description: ue.description,
      instructorId: ue.instructorId,
      content: ue.content
    });
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

exports.addContent = async (req, res) => {
  try {
    const ue = await Ues.findById(req.params.id);
    if (!ue) {
      return res.status(404).json({message: 'UE non trouvée'});
    }

    const newContent = {
      type: req.body.type,
      title: req.body.title,
      text: req.body.text,
      fileId: req.body.fileId
    };

    // Add returnDate if it's an assignment type
    if (req.body.type === 'assignement') {
      newContent.returnDate = req.body.returnDate;
      // Initialize empty returns array for assignments
      newContent.returns = [];
    }

    ue.content.push(newContent);
    await ue.save();

    // Ajout du log ici
    try {
      const Log = require('../models/log');
      const user = req.userData.name || req.userData.userId;
      const ueCode = ue.code;
      const type = req.body.type;
      await Log.create({
        type: 'post',
        message: `Contenu ajouté par ${user} dans le cours ${ueCode} (type: ${type}) à ${new Date().toLocaleString()}`,
        userId: req.userData.userId,
        timestamp: new Date()
      });
    } catch (e) { /* ignore log error */ }

    res.status(201).json(newContent);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
}

// Assignment submission methods
exports.submitAssignment = async (req, res) => {
  try {
    const { ueId, contentId } = req.params;
    const { userId, fileId, fileName } = req.body;

    // Find the UE
    const ue = await Ues.findById(ueId);
    if (!ue) {
      return res.status(404).json({ message: 'UE non trouvée' });
    }

    // Find the specific content item
    const content = ue.content.id(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Contenu non trouvé' });
    }

    // Check if it's an assignment
    if (content.type !== 'assignement') {
      return res.status(400).json({ message: 'Ce contenu n\'est pas un devoir' });
    }

    // Check return date if it exists
    if (content.returnDate && new Date() > new Date(content.returnDate)) {
      return res.status(400).json({ message: 'La date limite de rendu est dépassée' });
    }

    // Check if user already submitted
    const existingSubmission = content.returns && content.returns.find(
      ret => ret.userId.toString() === userId
    );

    if (existingSubmission) {
      // Update existing submission
      existingSubmission.fileId = fileId;
      existingSubmission.fileName = fileName;
      existingSubmission.submissionDate = new Date();
    } else {
      // Create returns array if it doesn't exist
      if (!content.returns) {
        content.returns = [];
      }

      // Add new submission
      content.returns.push({
        userId,
        fileId,
        fileName,
        submissionDate: new Date()
      });
    }

    await ue.save();

    // Création du log de dépôt
    let userName = req.userData?.name || userId;
    let ueCode = ue.code || ueId;
    await Log.create({
      type: 'submission',
      message: `Dépôt par ${userName} pour ${ueCode} le ${new Date().toLocaleString('fr-FR')}`,
      userId: userId,
      timestamp: new Date()
    });

    res.status(201).json({
      message: 'Devoir soumis avec succès',
      submission: existingSubmission || content.returns[content.returns.length - 1]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getUserAssignment = async (req, res) => {
  try {
    const { ueId, contentId, userId } = req.params;

    // Authorization check: Only allow users to access their own submissions
    if (userId !== req.userData.userId && req.userData.role !== 'instructor' && req.userData.role !== 'admin') {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à accéder à cette soumission" });
    }

    // Find the UE
    const ue = await Ues.findById(ueId);
    if (!ue) {
      return res.status(404).json({ message: 'UE non trouvée' });
    }

    // Find the content
    const content = ue.content.id(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Contenu non trouvé' });
    }

    // Check if user has a submission
    if (!content.returns || content.returns.length === 0) {
      return res.status(404).json({ message: 'Aucun devoir soumis par cet utilisateur' });
    }

    const userSubmission = content.returns.find(
      ret => ret.userId.toString() === userId
    );

    if (!userSubmission) {
      return res.status(404).json({ message: 'Aucun devoir soumis par cet utilisateur' });
    }

    res.json(userSubmission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { ueId, contentId, returnId } = req.params;

    // Find the UE
    const ue = await Ues.findById(ueId);
    if (!ue) {
      return res.status(404).json({ message: 'UE non trouvée' });
    }

    // Find the content
    const content = ue.content.id(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Contenu non trouvé' });
    }

    // Check if returns exists
    if (!content.returns || content.returns.length === 0) {
      return res.status(404).json({ message: 'Aucun devoir à supprimer' });
    }

    // Find submission index
    const submissionIndex = content.returns.findIndex(
      ret => ret._id.toString() === returnId
    );

    if (submissionIndex === -1) {
      return res.status(404).json({ message: 'Soumission non trouvée' });
    }

    // Get submission for response
    const submission = content.returns[submissionIndex];

    // Authorization check: Only allow users to delete their own submissions
    if (submission.userId.toString() !== req.userData.userId &&
        req.userData.role !== 'instructor' &&
        req.userData.role !== 'admin') {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette soumission" });
    }

    // Remove the submission
    content.returns.splice(submissionIndex, 1);

    await ue.save();
    res.json({
      message: 'Soumission supprimée avec succès',
      deletedSubmission: submission
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
