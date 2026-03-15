const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  utilisateur: { type: String, required: true, unique: true },
  nom: String,
  prenom: String,
  cnie: String,
  password: { type: String, required: true },
  droits: [String], 
  isActive: { type: Boolean, default: true },
  role:{
    type:String,
    enum:["ADM","responsable","employe"],
    default:"employe",
  }
});



module.exports = mongoose.models.User || mongoose.model("User", userSchema);
