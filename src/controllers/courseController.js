const prisma = require("../lib/prisma");

async function listCourses(req, res) {
  const courses = await prisma.course.findMany({
    orderBy: { id: "asc" }
  });
  res.json(courses);
}

async function getCourse(req, res) {
  const id = Number(req.params.id);

  const course = await prisma.course.findUnique({ where: { id } });

  if (!course) {
    return res.status(404).json({ erro: "Curso não encontrado." });
  }

  res.json(course);
}

module.exports = { listCourses, getCourse };