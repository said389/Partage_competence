const Publication = require("../models/Publication");

exports.create = async (req, res) => {
  try {
    const pub = new Publication({
      ...req.body,
      user: req.user.id
    });

    await pub.save();
    res.json({ message: "Publication envoyée, en attente de validation Admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listApproved = async (req, res) => {
  const pubs = await Publication.find({ status: "acceptee" })
    .populate("user", "nom email");
  res.json(pubs);
};

exports.getPending = async (req, res) => {
  const pubs = await Publication.find({ status: "en_attente" })
    .populate("user", "nom email");
  res.json(pubs);
};

exports.getOne = async (req, res) => {
  const pub = await Publication.findById(req.params.id)
    .populate("user", "nom email");
  res.json(pub);
};

exports.accept = async (req, res) => {
  await Publication.findByIdAndUpdate(req.params.id, {
    status: "acceptee"
  });
  res.json({ message: "Compétence acceptée" });
};

exports.refuse = async (req, res) => {
  await Publication.findByIdAndUpdate(req.params.id, {
    status: "refusee"
  });
  res.json({ message: "Compétence refusée" });
};



exports.deleteCompetence = async (req, res) => {
    try {
        const pub = await Publication.findById(req.params.id);

        if (!pub) {
            return res.status(404).json({ message: "Compétence non trouvée" });
        }

        await pub.deleteOne();
        res.json({ message: "Compétence supprimée avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};
