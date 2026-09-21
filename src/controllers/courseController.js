const prisma=require('../lib/prisma');
function publicCourse(course){
  const data=JSON.parse(course.conteudo);
  return {id:course.slug,courseId:course.id,title:course.titulo,desc:course.descricao,duration:course.duracaoMin,icon:data.icon,lessons:data.lessons,quiz:data.quiz.map(q=>[q[0],q[1]])};
}
async function listCourses(req,res){const rows=await prisma.course.findMany({where:{slug:{not:null}},orderBy:{id:'asc'}});res.json(rows.map(publicCourse));}
async function getCourse(req,res){const id=Number(req.params.id);if(!Number.isSafeInteger(id)||id<1)return res.status(400).json({erro:'Curso inválido.'});const course=await prisma.course.findUnique({where:{id}});if(!course?.slug)return res.status(404).json({erro:'Curso não encontrado.'});res.json(publicCourse(course));}
module.exports={listCourses,getCourse};
