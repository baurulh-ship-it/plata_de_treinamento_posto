const fs=require('node:fs');
const crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const path=require('node:path');
process.chdir(path.join(__dirname,'..'));
if(!fs.existsSync('.env')) {
  fs.writeFileSync('.env',`DATABASE_URL="file:./training.db"\nJWT_SECRET="${crypto.randomBytes(48).toString('hex')}"\nPORT=3000\n`);
  console.log('Configuração local criada com uma chave de sessão exclusiva.');
}
require('dotenv').config();
// Prisma on Windows requires the SQLite file to exist before migrate deploy.
const databaseUrl=process.env.DATABASE_URL||'';
if(databaseUrl.startsWith('file:')){
  const filename=databaseUrl.slice(5);
  const target=path.isAbsolute(filename)?filename:path.resolve('prisma',filename);
  if(!fs.existsSync(target)){fs.mkdirSync(path.dirname(target),{recursive:true});fs.closeSync(fs.openSync(target,'wx'));}
}
function run(file,args) {const result=spawnSync(process.execPath,[file,...args],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);}
const prisma=require.resolve('prisma/build/index.js');
run(prisma,['generate']);
run(prisma,['migrate','deploy']);
run(path.join('prisma','seed.js'),[]);
console.log('Pronto. Execute npm start e abra http://localhost:3000');
