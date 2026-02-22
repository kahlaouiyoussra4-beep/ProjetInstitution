const express = require("express");
const router = express.Router();
const Projet = require("../models/projet");
const authMiddleware = require("../middleware/authMiddleware");

// إنشاء مشروع
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newProjet = new Projet(req.body);
    const savedProjet = await newProjet.save();
    res.status(201).json(savedProjet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// جلب كل المشاريع
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projets = await Projet.find();
    res.json(projets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// جلب مشروع واحد
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id);
    res.json(projet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;