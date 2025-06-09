// controllers/logController.js
const Log = require('../models/log');

// Afficher tous les logs
exports.index = async (req, res) => {
  try {
    const logs = await Log.find({});
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajouter un nouveau log
exports.insert = async (req, res) => {
  const log = new Log({
    level: req.body.level,
    message: req.body.message,
    source: req.body.source,
    metadata: req.body.metadata
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
