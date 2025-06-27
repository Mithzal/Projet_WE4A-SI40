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

    ue.content.push(newContent);
    await ue.save();
    res.status(201).json(newContent);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
}

