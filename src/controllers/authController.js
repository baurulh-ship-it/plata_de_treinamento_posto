const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const prisma=require('../lib/prisma');
const select={id:true,nome:true,email:true,funcao:true};
const cookieOptions=()=>({httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/'});
function credentials(body={}) {
  body=body||{};
  const email=typeof body.email==='string'?body.email.trim().toLowerCase():'';
  const senha=typeof body.senha==='string'?body.senha:'';
  return {email,senha};
}
async function register(req,res,next){
  const {email,senha}=credentials(req.body);
  const nome=typeof req.body?.nome==='string'?req.body.nome.trim():'';
  if(nome.length<2||nome.length>100||email.length>254||!/^\S+@\S+\.\S+$/.test(email)||senha.length<8||Buffer.byteLength(senha)>72)
    return res.status(400).json({erro:'Informe um nome de 2 a 100 caracteres, email válido e senha de 8 a 72 bytes.'});
  try {
    const user=await prisma.user.create({data:{nome,email,senha:await bcrypt.hash(senha,12),funcao:'COLABORADOR'},select});
    res.status(201).json(user);
  }catch(error){if(error.code==='P2002')return res.status(409).json({erro:'Este email já está cadastrado. Entre na sua conta.'});next(error);}
}
async function login(req,res,next){
  const {email,senha}=credentials(req.body);
  if(!email||!senha||email.length>254||Buffer.byteLength(senha)>72)return res.status(400).json({erro:'Informe email e senha válidos.'});
  try {
    const user=await prisma.user.findUnique({where:{email}});
    if(!user||!await bcrypt.compare(senha,user.senha))return res.status(401).json({erro:'Email ou senha inválidos.'});
    const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'8h',algorithm:'HS256'});
    res.cookie('rego_session',token,{...cookieOptions(),maxAge:8*60*60*1000});
    res.json({usuario:{id:user.id,nome:user.nome,email:user.email,funcao:user.funcao}});
  }catch(error){next(error);}
}
function logout(req,res){res.clearCookie('rego_session',cookieOptions());res.json({mensagem:'Sessão encerrada.'});}
module.exports={register,login,logout};
