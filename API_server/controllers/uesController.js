const Ues = require('../models/ue');

exports.index = async (req, res) => {
  try {
    const ues = await Ues.find({});
    res.json(ues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.insert = async (req, res) => {
  const ue = new Ues({
    id: req.body.id,
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
      req.body.id,
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
