const jwt = require("jsonwebtoken");
const Historique=require("../models/historique")

const logAction = async ({ user, action, oldData = null, newData = null, projetId = null }) => {
  try {
    if (!user || !user.utilisateur){
      console.log("logAction: utilisateur manquant")
      return;
    }
    await Historique.create({
      utilisateur: user.utilisateur,
      action,
      oldData,
      newData,
      projetId,
      date: new Date()
    });
  } catch (err) {
    console.error("Erreur logAction:", err.message);
  }
};
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Accès refusé : Token manquant" });

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "SECRET123";

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};


const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Accès refusé" });
  if (req.user.role !== "ADM")
    return res.status(403).json({ message: "Accès réservé aux administrateurs" });
  next();
};


const isResponsableOrAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Accès refusé" });
  if (req.user.role === "employe")
    return res.status(403).json({ message: "Accès réservé aux responsables ou administrateurs" });
  next();
};


const isActiveUser = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Accès refusé" });
  if (!req.user.isActive)
    return res.status(403).json({ message: "Compte désactivé, accès refusé" });
  next();
};

module.exports = { auth, isAdmin, isResponsableOrAdmin, isActiveUser, logAction };