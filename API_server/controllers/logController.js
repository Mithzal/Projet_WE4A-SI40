// controllers/logController.js
const Log = require('../models/log');

// Afficher tous les logs ou ceux d'un utilisateur
exports.index = async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    const logs = await Log.find(filter);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajouter un nouveau log
exports.insert = async (req, res) => {
  const log = new Log({
    type: req.body.type,
    message: req.body.message,
    userId: req.body.userId,
  });

  try {
    const newLog = await log.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mettre à jour un log
exports.update = async (req, res) => {
  try {
    const log = await Log.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!log) {
      return res.status(404).json({ message: 'Log non trouvé' });
    }

    res.json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un log
exports.delete = async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);

    if (!log) {
      return res.status(404).json({ message: 'Log non trouvé' });
    }

    res.json({ message: 'Log supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Consultation d'un cours (création automatique du log)
exports.consultCourse = async (req, res) => {
  try {
    const { userId, courseCode, userName } = req.body;
    if (!userId || !courseCode) {
      return res.status(400).json({ message: 'userId et courseCode sont requis' });
    }
    const log = new Log({
      type: 'reading',
      message: userName ? `Consultation du cours ${courseCode} par ${userName}` : `Consultation du cours ${courseCode}`,
      userId: userId,
      timestamp: new Date().toISOString()
    });
    const newLog = await log.save();
    res.status(201).json({ message: 'Consultation enregistrée', log: newLog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
