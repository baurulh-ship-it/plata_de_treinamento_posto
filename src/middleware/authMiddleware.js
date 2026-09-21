const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
async function authMiddleware(req,res,next) {
  const cookie=(req.headers.cookie||'').split(';').map(c=>c.trim()).find(c=>c.startsWith('rego_session='));
  if(!cookie)return res.status(401).json({erro:'Entre na sua conta para continuar.'});
  try {
    const decoded=jwt.verify(cookie.slice('rego_session='.length),process.env.JWT_SECRET,{algorithms:['HS256']});
    const user=await prisma.user.findUnique({where:{id:decoded.id},select:{id:true,nome:true,email:true,funcao:true}});
    if(!user)return res.status(401).json({erro:'Sua sessão terminou. Entre novamente.'});
    req.user=user;
    next();
  } catch(error) {
    if(error.name==='JsonWebTokenError'||error.name==='TokenExpiredError'||error.name==='NotBeforeError')return res.status(401).json({erro:'Sua sessão terminou. Entre novamente.'});
    next(error);
  }
}
function gestorOnly(req,res,next){if(req.user.funcao!=='GESTOR')return res.status(403).json({erro:'Acesso permitido somente para gestores.'});next();}
module.exports={authMiddleware,gestorOnly};
