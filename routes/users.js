const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {auth,isActiveUser}=require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware');
const historique = require('../models/historique');

router.get('/', auth, roleMiddleware('ADM'), async (req, res) => {
  try {
    const users = await User.find().select('-password'); // نمنع عرض password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/change-password", auth, isActiveUser, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });

    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match)
      return res.status(400).json({ message: "Ancien mot de passe incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
 

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Mot de passe modifié avec succès" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', auth, roleMiddleware('ADM'), async (req, res) => {
  try {
    const { utilisateur, nom, prenom, cnie, password, droits, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      utilisateur,
      nom,
      prenom,
      cnie,
      password: hashedPassword,
      droits: droits || [],
      role: role || 'employe',
      isActive: true
    });

    const savedUser = await newUser.save();
    const { password: pw, ...userWithoutPassword } = savedUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, roleMiddleware('ADM'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/status', auth, roleMiddleware('ADM'), async (req, res) => {
  try {
    const { isActive } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { isActive}, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;