const { chromium } = require('playwright');
const assert=require('node:assert/strict');require('node:fs').mkdirSync('work',{recursive:true});
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:"msedge"});const page=await browser.newPage({viewport:{width:1440,height:1100}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.emulateMedia({reducedMotion:"reduce"}); const url='file:///'+path.resolve('index.html').replaceAll('\\','/');await page.goto(url);
 assert.equal(await page.locator('.stat-value').first().textContent(),'0%');
 await page.getByRole('button',{name:'Começar minha jornada'}).click();
 await page.getByRole('button',{name:'Marcar como lida e avançar'}).click();await page.getByRole('button',{name:'Marcar como lida e avançar'}).click();await page.getByRole('button',{name:'Concluir leitura e avaliar'}).click();
 for(const index of [1,2,0]){await page.locator('.quiz-option').nth(index).click();await page.locator('#quizNext button').click();}
 assert.equal(await page.locator('.result-score').textContent(),'100%');await page.getByRole('button',{name:'Voltar à plataforma'}).click();
 assert.equal(await page.locator('.stat-value').first().textContent(),'25%');await page.reload();assert.equal(await page.locator('.stat-value').first().textContent(),'25%');
 await page.screenshot({path:'work/desktop.png',fullPage:true});
 for(const name of ['Treinamentos','Meu progresso','Avaliações','Ajuda','Início'])await page.locator(`.nav-item[data-page="${({Treinamentos:'treinamentos','Meu progresso':'progresso',Avaliações:'avaliacoes',Ajuda:'ajuda',Início:'inicio'})[name]}"]`).click();
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'work/mobile.png',fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.getByRole('button',{name:'Abrir menu'}).click();await page.locator('[data-page="avaliacoes"]').click();assert.equal(await page.locator('#menuBtn').getAttribute('aria-expanded'),'false');
 await page.evaluate(()=>localStorage.setItem('regoTraining.v2','broken'));await page.reload();assert.equal(await page.locator('.stat-value').first().textContent(),'0%');assert.deepEqual(errors,[]);
 await browser.close();console.log('PASS: fresh state, lessons, quiz, completion, reload, navigation, mobile, corrupt storage; no browser errors');
})().catch(e=>{console.error(e);process.exit(1)});



