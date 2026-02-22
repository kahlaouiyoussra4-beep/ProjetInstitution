const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const { utilisateur, password } = req.body;

    const user = await User.findOne({ utilisateur });
    if (!user)
      return res.status(400).json({ message: "Utilisateur introuvable" });

    if (!user.actif)
      return res.status(403).json({ message: "Utilisateur désactivé" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user._id }, "SECRET123", {
      expiresIn: "1d",
    });

    res.json({
      token,
      utilisateur: user.utilisateur
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;