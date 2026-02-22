const express = require("express");
const router = express.Router();
const Projet = require("../models/Projet"); // model ديال المشاريع
const User = require("../models/user");     // model ديال المستخدمين

// عدد المشاريع
router.get("/projects-count", async (req, res) => {
  try {
    const count = await Projet.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// عدد المستخدمين
router.get("/users-count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// آخر المشاريع (مثلاً آخر 10 مشاريع)
router.get("/reports", async (req, res) => {
  try {
    const projets = await Projet.find().sort({ createdAt: -1 }).limit(10);
    res.json(projets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;