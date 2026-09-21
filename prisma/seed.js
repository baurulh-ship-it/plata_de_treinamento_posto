require('dotenv').config();
const prisma = require('../src/lib/prisma');
const catalog = require('../src/data/catalog');
async function seed() {
  for (const m of catalog) {
    const data = {titulo:m.title, descricao:m.desc, conteudo:JSON.stringify({icon:m.icon,lessons:m.lessons,quiz:m.quiz}), duracaoMin:m.duration};
    await prisma.course.upsert({where:{slug:m.id},update:data,create:{slug:m.id,...data}});
  }
  console.log('Quatro módulos preparados. Nenhuma conta padrão foi criada.');
}
if(require.main===module) seed().catch(error=>{console.error(error.message);process.exitCode=1;}).finally(()=>prisma.$disconnect());
module.exports=seed;
