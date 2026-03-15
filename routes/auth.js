const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {auth, isAdmin, isResponsableOrAdmin, isActiveUser, logAction}=require("../middleware/authMiddleware")

router.post("/login", async (req, res) => {
  try {
    const { utilisateur, password } = req.body;

    if (!utilisateur || !password) {
      return res.status(400).json({ message: "utilisateur et password obligatoires" });
    }

    // البحث بدون تغيير الحالة
    const user = await User.findOne({ utilisateur });

    if (!user)
      return res.status(400).json({ message: "Utilisateur introuvable" });

    if (!user.isActive)
      return res.status(403).json({ message: "Utilisateur désactivé" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Mot de passe incorrect" });

    // أهم تصحيح هنا 👇
    const token = jwt.sign(
      {
        id: user._id,
        utilisateur: user.utilisateur,
        role: user.role,
        droits: user.droits,
        isActive: user.isActive
      },
      "SECRET123",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      utilisateur: user.utilisateur,
      role: user.role,
      droits: user.droits,
      isActive: user.isActive
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
router.post("/change-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    // ناخدو user من التوكن
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
      return res.status(400).json({ message: "Ancien mot de passe incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const oldData={password:"*****"};
    const newData={password:"*****"};

    user.password = hashedPassword;
    await user.save();
    await logAction({
      user:req.user,
      action:"PASSWORD_CHANGE",
      oldData,
      newData
    });

    res.status(200).json({ message: "Mot de passe modifié avec succès" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;