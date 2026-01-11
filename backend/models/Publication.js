const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema({
  titre: String,
  description: String,
  technologie: String,
  niveau: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["en_attente", "acceptee", "refusee"],
    default: "en_attente"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Publication", publicationSchema);
