const express = require('express');
const router = express.Router();
const Projet = require('../models/Projet');
const User = require('../models/user'); // نموذج المستخدمين
const { auth } = require('../middleware/authMiddleware');



// عدد المشاريع
router.get('/projects-count', auth, async (req, res) => {
  try {
    const filter = req.user.role === "ADM" ? {} : { utilisateur: req.user.utilisateur };
    const count = await Projet.countDocuments(filter);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
router.get('/projects', auth, async (req, res) => {
  try {
    const filter = req.user.role === "ADM" ? {} : { utilisateur: req.user.utilisateur };
    const projets = await Projet.find(filter).sort({ createdAt: -1 });

    // تحويل المشاريع لتحتوي على progress و dueDate و manager
    const projetsFormatted = projets.map(p => ({
      title: p.intitule,
      manager: p.manager || "Non défini",
      status: p.status, // "En cours", "Terminée", "En retard"
      dueDate: p.dueDate, 
      progress: p.progress || 0
    }));

    res.json(projetsFormatted);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



// عدد المستخدمين (غير ADM)
router.get('/users-count', auth, async (req, res) => {
  try {
    if (req.user.role !== "ADM") return res.status(403).json({ message: "Accès interdit" });
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// التقارير / المشاريع
router.get('/reports', auth, async (req, res) => {
  try {
    const filter = req.user.role === "ADM" ? {} : { utilisateur: req.user.utilisateur };
    const projets = await Projet.find(filter).sort({ createdAt: -1 });
    res.json(projets);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;