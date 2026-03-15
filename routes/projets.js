const express = require('express');
const router = express.Router();
const Projet = require('../models/Projet');
const { auth } = require('../middleware/authMiddleware');
const Historique=require("../models/historique")


// إنشاء مشروع جديد
router.post('/', auth, async (req, res) => {
  try {
    const newProjet = new Projet({ ...req.body, utilisateur: req.user.utilisateur });
    const savedProjet = await newProjet.save();
    await Historique.create({
      action:"CREATE",
      projetId:savedProjet._id,
      utilisateur:req.user.utilisateur,
      newData:savedProjet
    });
     res.status(201).json(savedProjet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// البحث حسب الاسم → خاص يكون قبل /:id
router.get('/search', auth, async (req, res) => {
  try {
    const { name } = req.query;
    const filter = req.user.role === "ADM" ? {} : { utilisateur: req.user.utilisateur };
    if (name) filter.intitule = { $regex: `${name}`, $options: "i" }; // insensitive search
    console.log("Recherche:", name, "Filter:", filter); // debug
    const projets = await Projet.find(filter);
    res.json(projets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
router.get('/user/:username', auth, async (req, res) => {
  try {
    const { username } = req.params;

    if (req.user.role === "ADM") {
      const projets = await Projet.find({ utilisateur: username });
      return res.json(projets);
    }

    if (req.user.utilisateur !== username) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const projets = await Projet.find({ utilisateur: username });
    res.json(projets);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// جميع المشاريع (فلترة حسب role)
router.get('/', auth, async (req, res) => {
  try {
    const filter = req.user.role === "ADM" ? {} : { utilisateur: req.user.utilisateur };
    const projets = await Projet.find(filter);
 
    res.status(200).json(projets);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/historique', auth, async (req, res) => {
  try {
    const data = await Historique
      .find()
      .populate("projetId", "intitule")
      .sort({ date: -1 });

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
// مشروع بالـ id
router.get('/:id', auth, async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id);
    if (!projet) return res.status(404).json({ message: "Projet introuvable" });

    if (req.user.role !== "ADM" && projet.utilisateur !== req.user.utilisateur) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    res.json(projet);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});
router.put('/:id', auth, async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id);
    if (!projet)
      return res.status(404).json({ message: "Projet introuvable" });

   
    // حماية الصلاحيات
    if (req.user.role !== "ADM" && projet.utilisateur !== req.user.utilisateur) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const oldData=projet.toObject();
    const updatedProjet = await Projet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    await Historique.create({
      action:"UPDATE",
      projetId:updatedProjet._id,
      utilisateur:req.user.utilisateur,
      oldData,
      newData:updatedProjet.toObject(),
    })

    res.json(updatedProjet);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:id', auth, async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id);

    if (!projet)
      return res.status(404).json({ message: "Projet introuvable" });

    // حماية الصلاحيات
    if (req.user.role !== "ADM" && projet.utilisateur !== req.user.utilisateur) {
      return res.status(403).json({ message: "Accès interdit" });
    }
   
    await Historique.create({
      action:"DELETE",
      projetId:projet._id,
      utilisateur:req.user.utilisateur,
      oldData:projet.toObject(),
    });

    await Projet.findByIdAndDelete(req.params.id);

    res.json({ message: "Projet supprimé avec succès" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;