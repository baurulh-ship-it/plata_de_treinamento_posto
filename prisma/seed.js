const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const senha = await bcrypt.hash("123456", 10);

  const gestor = await prisma.user.upsert({
    where: { email: "gestor@posto.com" },
    update: {},
    create: {
      nome: "Gestor do Posto",
      email: "gestor@posto.com",
      senha,
      funcao: "GESTOR"
    }
  });

  const cursos = [
    {
      titulo: "Atendimento ao Cliente",
      descricao: "Boas práticas de atendimento e comunicação com clientes.",
      conteudo: "Apresentação, abordagem, comunicação, resolução de dúvidas e encerramento do atendimento.",
      duracaoMin: 30
    },
    {
      titulo: "Segurança no Posto",
      descricao: "Procedimentos básicos de segurança e prevenção de acidentes.",
      conteudo: "Uso correto dos equipamentos, prevenção de incêndios, condutas de segurança e procedimentos operacionais.",
      duracaoMin: 45
    },
    {
      titulo: "Operação de Bombas",
      descricao: "Orientações sobre operação das bombas e rotina de abastecimento.",
      conteudo: "Identificação do combustível, abastecimento, conferência e procedimentos de encerramento.",
      duracaoMin: 35
    }
  ];

  for (const curso of cursos) {
    await prisma.course.create({ data: curso });
  }

  console.log("Seed concluído.");
  console.log("Gestor:", gestor.email);
  console.log("Senha:", "123456");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());