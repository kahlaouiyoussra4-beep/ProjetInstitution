module.exports = (...allowed) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const roleMatch = allowed.includes(req.user.role);
    const droitsMatch = (req.user.droits || []).some(d => allowed.includes(d));

    if (!roleMatch && !droitsMatch) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    next();
  };
};