const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fixture=require('./fixture.cjs');
(async()=>{
 const f=await fixture();let browser;
 try{
  browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'msedge'});
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(f.url);await page.getByRole('heading',{name:'Entre para continuar'}).waitFor();
  await page.screenshot({path:'work/login-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Criar minha conta'}).click();
  await page.getByLabel('Nome completo').fill('Ana Silva');await page.getByLabel('Email',{exact:true}).fill('ana@example.test');await page.getByLabel('Senha',{exact:true}).fill('test-password-123');await page.getByRole('button',{name:'Criar conta e entrar'}).click();
  await page.getByRole('button',{name:'Começar minha jornada'}).waitFor();assert.equal(await page.locator('.stat-value').first().textContent(),'0%');assert.equal(await page.locator('.mini-profile strong').textContent(),'Ana Silva');
  await page.getByRole('button',{name:'Começar minha jornada'}).click();
  await page.route('**/api/progress',route=>route.abort());await page.getByRole('button',{name:'Marcar como lida e avançar'}).click();await page.locator('.request-error').waitFor();assert.equal(await page.locator('.stat-value').first().textContent(),'0%');await page.unroute('**/api/progress');
  for(let i=0;i<2;i++){await page.getByRole('button',{name:'Marcar como lida e avançar'}).click();await page.getByRole('heading',{name:i===0?'Respeite seus limites':'Comunique ocorrências'}).waitFor();}
  await page.getByRole('button',{name:'Concluir leitura e avaliar'}).click();
  for(const answer of [1,2,0]){await page.locator('.quiz-option').nth(answer).click();await page.locator('#quizNext button').click();}
  await page.locator('.result-score').waitFor();assert.equal(await page.locator('.result-score').textContent(),'100%');await page.getByRole('button',{name:'Voltar à plataforma'}).click();assert.equal(await page.locator('.stat-value').first().textContent(),'25%');
  await page.reload();await page.locator('.stat-value').first().waitFor();assert.equal(await page.locator('.stat-value').first().textContent(),'25%');
  await page.getByRole('button',{name:'Sair da conta'}).click();await page.getByRole('heading',{name:'Entre para continuar'}).waitFor();assert.equal((await context.cookies()).some(c=>c.name==='rego_session'),false);
  // A second browser context has no local storage or cookies from the first.
  const context2=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const other=await context2.newPage();other.on('pageerror',error=>errors.push(error.message));await other.goto(f.url);await other.getByLabel('Email',{exact:true}).fill('ana@example.test');await other.getByLabel('Senha',{exact:true}).fill('test-password-123');await other.getByRole('button',{name:'Entrar',exact:true}).click();await other.locator('.stat-value').first().waitFor();assert.equal(await other.locator('.stat-value').first().textContent(),'25%');
  await other.screenshot({path:'work/integrated-desktop.png',fullPage:true});
  await other.setViewportSize({width:390,height:844});await other.screenshot({path:'work/integrated-mobile.png',fullPage:true});assert(await other.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await other.getByRole('button',{name:'Abrir menu'}).click();await other.locator('[data-page="progresso"]').click();assert.equal(await other.locator('#pageTitle').textContent(),'Meu progresso');
  await other.getByRole('button',{name:'Abrir menu'}).click();await other.locator('[data-page="treinamentos"]').click();await other.getByRole('button',{name:'Revisar módulo'}).first().click();
  await context2.clearCookies();await other.getByRole('button',{name:'Concluir leitura e avaliar'}).click();await other.getByRole('heading',{name:'Entre para continuar'}).waitFor();
  await other.screenshot({path:'work/login-mobile.png',fullPage:true});assert.deepEqual(errors,[]);
  console.log('PASS: registration, login, database progress, network failure retry, quiz, reload, logout, independent browser login, mobile, expired session; no browser errors');
 }finally{if(browser)await browser.close();await f.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
