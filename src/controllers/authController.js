const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

async function register(req, res) {
  try {
    const { nome, email, senha, funcao } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });
    }

    const existente = await prisma.user.findUnique({ where: { email } });
    if (existente) {
      return res.status(409).json({ erro: "Email já cadastrado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        funcao: funcao === "GESTOR" ? "GESTOR" : "COLABORADOR"
      },
      select: { id: true, nome: true, email: true, funcao: true }
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao cadastrar usuário." });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ erro: "Email ou senha inválidos." });
    }

    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email, funcao: user.funcao },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        funcao: user.funcao
      }
    });
  } catch {
    res.status(500).json({ erro: "Erro ao realizar login." });
  }
}

module.exports = { register, login };