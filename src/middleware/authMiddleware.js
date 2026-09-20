const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não informado." });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

function gestorOnly(req, res, next) {
  if (req.user.funcao !== "GESTOR") {
    return res.status(403).json({ erro: "Acesso permitido somente para gestores." });
  }
  next();
}

module.exports = { authMiddleware, gestorOnly };