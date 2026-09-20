const prisma = require("../lib/prisma");

async function saveProgress(req, res) {
  try {
    const userId = Number(req.user.id);
    const { courseId, nota, percentual } = req.body;

    if (!courseId || percentual === undefined) {
      return res.status(400).json({
        erro: "courseId e percentual são obrigatórios."
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) }
    });

    if (!course) {
      return res.status(404).json({ erro: "Curso não encontrado." });
    }

    const percentualNumber = Number(percentual);
    const notaNumber = nota === undefined || nota === null ? null : Number(nota);

    if (
      Number.isNaN(percentualNumber) ||
      percentualNumber < 0 ||
      percentualNumber > 100
    ) {
      return res.status(400).json({ erro: "Percentual deve estar entre 0 e 100." });
    }

    if (notaNumber !== null && (Number.isNaN(notaNumber) || notaNumber < 0 || notaNumber > 10)) {
      return res.status(400).json({ erro: "Nota deve estar entre 0 e 10." });
    }

    const status = percentualNumber >= 100 ? "CONCLUIDO" : "EM_ANDAMENTO";

    const progress = await prisma.progress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: Number(courseId)
        }
      },
      update: {
        nota: notaNumber,
        percentual: percentualNumber,
        status
      },
      create: {
        userId,
        courseId: Number(courseId),
        nota: notaNumber,
        percentual: percentualNumber,
        status
      },
      include: { course: true }
    });

    res.json({
      mensagem: "Progresso salvo com sucesso.",
      progresso: progress
    });
  } catch {
    res.status(500).json({ erro: "Erro ao salvar progresso." });
  }
}

async function getMyProgress(req, res) {
  try {
    const progress = await prisma.progress.findMany({
      where: { userId: Number(req.user.id) },
      include: { course: true },
      orderBy: { updatedAt: "desc" }
    });

    res.json(progress);
  } catch {
    res.status(500).json({ erro: "Erro ao consultar progresso." });
  }
}

async function getUserProgress(req, res) {
  try {
    const userId = Number(req.params.userId);

    const progress = await prisma.progress.findMany({
      where: { userId },
      include: {
        course: true,
        user: {
          select: { id: true, nome: true, email: true, funcao: true }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    res.json(progress);
  } catch {
    res.status(500).json({ erro: "Erro ao consultar progresso." });
  }
}

module.exports = { saveProgress, getMyProgress, getUserProgress };