router.post("/login", async (req, res) => {
try {
console.log("BODY:", req.body);

const { utilisateur, password } = req.body;  

const user = await User.findOne({ utilisateur });  
console.log("USER:", user);  

if (!user) return res.status(400).json({ message: "Utilisateur introuvable" });  

if (!user.actif)  
  return res.status(403).json({ message: "Utilisateur désactivé" });  

console.log("PASSWORD FROM DB:", user.password);  

const match = await bcrypt.compare(password, user.password);  
console.log("MATCH:", match);  

if (!match) return res.status(400).json({ message: "Mot de passe incorrect" });  

const token = jwt.sign({ id: user._id }, "SECRET123", { expiresIn: "1d" });  

res.json({  
  token,  
  utilisateur: user.utilisateur,  
  droits: user.droits  
});

} catch (err) {
console.error("LOGIN ERROR =", err);
res.status(500).json({ message: err.message });
}
});const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST — Ajouter utilisateur
router.post("/", async (req, res) => {
try {
const { utilisateur, nom, prenom, cnie, password, droits } = req.body;

// vérifier si utilisateur déjà existe  
const exists = await User.findOne({ utilisateur });  
if (exists) return res.status(400).json({ message: "Utilisateur déjà existant" });  

// hasher le mot de passe  
const hashedPassword = await bcrypt.hash(password, 10);  

const newUser = new User({  
  utilisateur,  
  nom,  
  prenom,  
  cnie,  
  password: hashedPassword,  
  droits,  
});  

const savedUser = await newUser.save();  
res.status(201).json(savedUser);

} catch (err) {
res.status(500).json({ message: err.message });
}
});

// GET — liste utilisateurs
router.get("/", async (req, res) => {
try {
const users = await User.find().select("-password"); // ne pas renvoyer le mot de passe
res.json(users);
} catch (err) {
res.status(500).json({ message: err.message });
}
});

module.exports = router;