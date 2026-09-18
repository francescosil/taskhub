const jwt = require("jsonwebtoken");
//confronto tra token ricevuto da frontend e jwt
module.exports = function(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token mancante" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token invalido" });
  }
};
