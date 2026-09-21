require('dotenv').config();
const express=require('express');
const path=require('node:path');
const app=express();
app.disable('x-powered-by');
app.use(express.json({limit:'16kb'}));
app.use('/api',(req,res,next)=>{
  res.set('Cache-Control','no-store');
  if(!['GET','HEAD','OPTIONS'].includes(req.method)){
    const origin=req.headers.origin;
    if(origin&&origin!==`${req.protocol}://${req.get('host')}`)return res.status(403).json({erro:'Origem não autorizada.'});
    if(!req.is('application/json'))return res.status(415).json({erro:'Envie dados JSON.'});
  }
  next();
});
app.get('/api/health',(req,res)=>res.json({status:'online',sistema:'Rego Treina'}));
app.use('/api/auth',require('./routes/authRoutes'));
app.use('/api/courses',require('./routes/courseRoutes'));
app.use('/api/progress',require('./routes/progressRoutes'));
// Only the interface files are public; never expose the database, environment or answer key.
for(const file of ['index.html','style.css','app.js'])app.get(file==='index.html'?'/':`/${file}`,(req,res)=>res.sendFile(path.join(__dirname,'..',file)));
app.use((req,res)=>res.status(404).json({erro:'Página não encontrada.'}));
app.use((error,req,res,next)=>{
  if(res.headersSent)return next(error);
  const status=error.status>=400&&error.status<500?error.status:500;
  res.status(status).json({erro:status===500?'Não foi possível concluir a operação. Tente novamente.':status===400?'Dados inválidos. Verifique e tente novamente.':error.message});
});
if(require.main===module){
  if(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32){console.error('Configure JWT_SECRET com pelo menos 32 caracteres. Execute npm run setup.');process.exit(1);}
  app.listen(process.env.PORT||3000,()=>console.log(`Rego Treina: http://localhost:${process.env.PORT||3000}`));
}
module.exports=app;
