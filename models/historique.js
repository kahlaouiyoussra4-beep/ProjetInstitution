const mongoose = require("mongoose");

const historiqueSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ["CREATE", "UPDATE", "DELETE"],
    required: true
  },

  projetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Projet"
  },

  utilisateur: {
    type: String,
    required: true
  },

  oldData: Object,
  newData: Object,

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("historique", historiqueSchema);