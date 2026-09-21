const prisma=require('../lib/prisma');
function view(row){return {courseId:row.courseId,lessonsCompleted:row.lessonsCompleted,nota:row.nota,percentual:row.percentual,status:row.status};}
async function saveProgress(req,res){
  const {courseId,lessonIndex,answers}=req.body||{};
  if(!Number.isSafeInteger(courseId)||courseId<1||((lessonIndex===undefined)===(answers===undefined))||req.body.nota!==undefined||req.body.percentual!==undefined)
    return res.status(400).json({erro:'Informe o curso e uma aula ou as respostas da avaliação. Notas são calculadas pelo servidor.'});
  const course=await prisma.course.findUnique({where:{id:courseId}});
  if(!course?.slug)return res.status(404).json({erro:'Curso não encontrado.'});
  const data=JSON.parse(course.conteudo);
  if(lessonIndex!==undefined&&(!Number.isInteger(lessonIndex)||lessonIndex<0||lessonIndex>=data.lessons.length))return res.status(400).json({erro:'Aula inválida.'});
  if(answers!==undefined&&(!Array.isArray(answers)||answers.length!==data.quiz.length||answers.some((v,i)=>!Number.isInteger(v)||v<0||v>=data.quiz[i][1].length)))return res.status(400).json({erro:'Responda a todas as questões com opções válidas.'});
  const score=answers===undefined?null:Math.round(answers.filter((v,i)=>v===data.quiz[i][2]).length/data.quiz.length*100);
  const progress=await prisma.$transaction(async tx=>{
    const where={userId_courseId:{userId:req.user.id,courseId}};
    const previous=await tx.progress.findUnique({where});
    const read=previous?.lessonsCompleted||0;
    if(lessonIndex!==undefined&&lessonIndex>read){const error=new Error('Leia as aulas em sequência.');error.status=409;throw error;}
    const lessonsCompleted=lessonIndex===undefined?read:Math.max(read,lessonIndex+1);
    const nota=score===null?(previous?.nota??null):Math.max(previous?.nota??0,score/10);
    const percentual=Math.round((lessonsCompleted+(nota!==null&&nota>=7?1:0))/(data.lessons.length+1)*100);
    const fields={lessonsCompleted,nota,percentual,status:percentual===100?'CONCLUIDO':'EM_ANDAMENTO'};
    return tx.progress.upsert({where,update:fields,create:{userId:req.user.id,courseId,...fields}});
  });
  res.json({progresso:view(progress),...(score===null?{}:{score,correct:answers.filter((v,i)=>v===data.quiz[i][2]).length,feedback:data.quiz.map((q,i)=>({correct:answers[i]===q[2],explanation:q[3]}))})});
}
async function getMyProgress(req,res){const rows=await prisma.progress.findMany({where:{userId:req.user.id,course:{slug:{not:null}}}});res.json(rows.map(view));}
async function getUserProgress(req,res){const userId=Number(req.params.userId);if(!Number.isSafeInteger(userId)||userId<1)return res.status(400).json({erro:'Usuário inválido.'});const rows=await prisma.progress.findMany({where:{userId,course:{slug:{not:null}}}});res.json(rows.map(view));}
module.exports={saveProgress,getMyProgress,getUserProgress};
