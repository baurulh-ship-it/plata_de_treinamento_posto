const {test}=require('node:test');const assert=require('node:assert/strict');const jwt=require('jsonwebtoken');const fixture=require('./fixture.cjs');
test('account integration and server-owned learning state',async()=>{
 const f=await fixture();
 async function request(path,body,cookie='',extra={}){const response=await fetch(f.url+path,{method:body===undefined?'GET':'POST',headers:{...(body===undefined?{}:{'Content-Type':'application/json'}),...(cookie?{Cookie:cookie}:{}),...extra},body:body===undefined?undefined:JSON.stringify(body)});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')};}
 try {
  assert.equal(await f.prisma.course.count(),4,'seed is idempotent');
  assert.equal((await request('/api/courses')).status,401);
  assert.equal((await request('/api/auth/register',{nome:'Ana Silva',email:' ANA@EXAMPLE.TEST ',senha:'example-pass-123',funcao:'GESTOR'})).status,201);
  assert.equal((await request('/api/auth/register',{nome:'Ana',email:'ana@example.test',senha:'example-pass-123'})).status,409);
  assert.equal((await request('/api/auth/register',{nome:'A',email:'invalid',senha:'123'})).status,400);
  assert.equal((await request('/api/auth/login',{email:'ana@example.test',senha:'wrong'})).status,401);
  const login=await request('/api/auth/login',{email:'ANA@EXAMPLE.TEST',senha:'example-pass-123'});assert.equal(login.status,200);assert.equal(login.data.usuario.funcao,'COLABORADOR');assert.match(login.cookie,/HttpOnly/);assert.match(login.cookie,/SameSite=Strict/);assert.equal(login.data.token,undefined);
  const cookie=login.cookie.split(';')[0];
  assert.equal((await request('/api/auth/me',undefined,cookie)).data.usuario.nome,'Ana Silva');
  assert.equal((await request('/api/progress/user/1',undefined,cookie)).status,403);
  const courses=(await request('/api/courses',undefined,cookie)).data;assert.equal(courses.length,4);assert.equal(courses[0].quiz[0].length,2,'answer key omitted');
  const courseId=courses.find(c=>c.id==='seguranca').courseId;
  assert.equal((await request('/api/progress',{courseId,nota:10,percentual:100},cookie)).status,400);
  assert.equal((await request('/api/progress',{courseId,lessonIndex:2},cookie)).status,409);
  assert.equal((await request('/api/progress',{courseId,answers:[0]},cookie)).status,400);
  assert.equal((await request('/api/progress',{courseId,answers:[99,2,0]},cookie)).status,400);
  assert.equal((await request('/api/progress',{courseId,lessonIndex:0},cookie,{Origin:'https://evil.example'})).status,403);
  const firstQuiz=await request('/api/progress',{courseId,answers:[1,2,0]},cookie);assert.equal(firstQuiz.data.score,100);assert.equal(firstQuiz.data.progresso.percentual,25,'quiz alone cannot complete course');
  for(let lessonIndex=0;lessonIndex<3;lessonIndex++)assert.equal((await request('/api/progress',{courseId,lessonIndex},cookie)).status,200);
  const retry=await request('/api/progress',{courseId,answers:[0,0,1]},cookie);assert.equal(retry.data.score,0);assert.equal(retry.data.progresso.nota,10,'best grade preserved');assert.equal(retry.data.progresso.percentual,100);assert.equal(retry.data.progresso.status,'CONCLUIDO');
  const replay=await request('/api/progress',{courseId,lessonIndex:0},cookie);assert.equal(replay.data.progresso.lessonsCompleted,3,'replay does not regress progress');
  const again=await request('/api/auth/login',{email:'ana@example.test',senha:'example-pass-123'});assert.equal((await request('/api/progress/me',undefined,again.cookie.split(';')[0])).data[0].percentual,100);
  await request('/api/auth/register',{nome:'Bruno',email:'bruno@example.test',senha:'example-pass-123'});const other=await request('/api/auth/login',{email:'bruno@example.test',senha:'example-pass-123'});assert.deepEqual((await request('/api/progress/me',undefined,other.cookie.split(';')[0])).data,[]);
  const expired=jwt.sign({id:login.data.usuario.id},process.env.JWT_SECRET,{expiresIn:-1});assert.equal((await request('/api/auth/me',undefined,'rego_session='+expired)).status,401);
  const logout=await request('/api/auth/logout',{},cookie);assert.match(logout.cookie,/Expires=Thu, 01 Jan 1970/);
  for(const path of ['/.env','/prisma/training.db','/src/data/catalog.js','/courses.js'])assert.equal((await request(path)).status,404);
  assert.equal((await request('/api/courses/nope',undefined,cookie)).status,400);
 } finally {await f.close();}
});
