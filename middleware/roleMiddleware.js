module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Utilisateur non authentifié" });
    const userRole = req.user.role;
    const userDroits = req.user.droits || [];
    if (!allowedRoles.includes(userRole) && !userDroits.some(d => allowedRoles.includes(d))) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    next();
  };
};