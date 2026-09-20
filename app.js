const state = {
  progress: Number(localStorage.getItem("regoProgress") || 68),
  completed: JSON.parse(localStorage.getItem("regoCompleted") || "[]")
};

const modules = [
  {id:"seguranca", icon:"!", title:"Segurança e prevenção", desc:"Procedimentos básicos para uma operação segura no posto.", duration:"12 min", progress:100, status:"Concluído"},
  {id:"atendimento", icon:"♡", title:"Atendimento ao cliente", desc:"Boas práticas para oferecer um atendimento rápido e padronizado.", duration:"18 min", progress:72, status:"Em andamento"},
  {id:"bombas", icon:"⛽", title:"Operação das bombas", desc:"Conheça a rotina de abastecimento e os cuidados durante a operação.", duration:"15 min", progress:40, status:"Em andamento"},
  {id:"caixa", icon:"$", title:"Operação de caixa", desc:"Fluxo de pagamentos, conferência e encerramento do atendimento.", duration:"20 min", progress:0, status:"Não iniciado"}
];

const pageNames = {inicio:"Início", treinamentos:"Treinamentos", progresso:"Meu progresso", avaliacoes:"Avaliações", ajuda:"Ajuda"};

const content = document.getElementById("content");
const pageTitle = document.getElementById("pageTitle");
const toast = document.getElementById("toast");

function save() {
  localStorage.setItem("regoProgress", state.progress);
  localStorage.setItem("regoCompleted", JSON.stringify(state.completed));
}
function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2600);
}
function progressBar(value) {
  return `<div class="progress"><div style="width:${value}%"></div></div>`;
}

function home() {
  content.innerHTML = `
    <section class="hero">
      <div>
        <div class="eyebrow">Auto Posto Rego & CIA • Pederneiras</div>
        <h1>Olá, Rafael! 👋</h1>
        <p>Continue sua capacitação e aprenda as rotinas do posto de forma simples, organizada e no seu ritmo.</p>
        <div style="margin-top:20px"><button class="btn btn-primary" onclick="openCourse('atendimento')">Continuar treinamento →</button></div>
      </div>
      <div class="hero-art"><div class="pump"></div></div>
    </section>

    <div class="stats">
      <div class="card stat"><div><div class="stat-label">Progresso geral</div><div class="stat-value">${state.progress}%</div></div><div class="stat-icon">◔</div></div>
      <div class="card stat"><div><div class="stat-label">Módulos concluídos</div><div class="stat-value">${state.completed.length || 1}/4</div></div><div class="stat-icon">✓</div></div>
      <div class="card stat"><div><div class="stat-label">Tempo de estudo</div><div class="stat-value">1h 12m</div></div><div class="stat-icon">◷</div></div>
      <div class="card stat"><div><div class="stat-label">Avaliações</div><div class="stat-value">2/3</div></div><div class="stat-icon">★</div></div>
    </div>

    <div class="section-head"><h2>Continue aprendendo</h2><span>4 módulos disponíveis</span></div>
    <div class="grid">
      <div class="modules">${modules.slice(0,4).map(m=>moduleCard(m)).join("")}</div>
      <div class="card side-card">
        <h3>Seu desempenho</h3>
        <div class="donut"></div>
        <div class="legend">
          <span><b>Concluído</b><strong>68%</strong></span>
          <span><b>Em andamento</b><strong>22%</strong></span>
          <span><b>Pendente</b><strong>10%</strong></span>
        </div>
        <button class="btn btn-light" style="width:100%;margin-top:17px" onclick="navigate('progresso')">Ver relatório completo</button>
      </div>
    </div>
  `;
}
function moduleCard(m) {
  return `<article class="card module" onclick="openCourse('${m.id}')">
    <div class="module-top"><div class="module-icon">${m.icon}</div><span class="tag">${m.status}</span></div>
    <h3>${m.title}</h3><p>${m.desc}</p>${progressBar(m.progress)}
    <div class="progress-row"><span>${m.duration}</span><b>${m.progress}%</b></div>
  </article>`;
}
function trainings() {
  content.innerHTML = `<div class="page-title"><h1>Treinamentos</h1><p>Aprenda as principais rotinas do posto por módulos curtos e interativos.</p></div>
  <div class="course-grid">${modules.map(m=>`<div class="card course"><div class="cover">${m.icon}</div><h3>${m.title}</h3><p>${m.desc}</p><div class="meta"><span>${m.duration}</span><b>${m.progress}%</b></div>${progressBar(m.progress)}<button class="btn btn-primary" style="margin-top:14px;width:100%" onclick="openCourse('${m.id}')">${m.progress===100?'Revisar módulo':'Acessar módulo'}</button></div>`).join("")}</div>`;
}
function progressPage() {
  content.innerHTML = `<div class="page-title"><h1>Meu progresso</h1><p>Acompanhe sua evolução e veja quais conteúdos precisam de atenção.</p></div>
  <div class="grid"><div class="card table-card"><h3 style="margin:0 0 12px">Progresso por módulo</h3>
  <table><thead><tr><th>Módulo</th><th>Progresso</th><th>Status</th></tr></thead><tbody>
  ${modules.map(m=>`<tr><td><strong>${m.title}</strong></td><td style="min-width:170px">${progressBar(m.progress)}<small style="color:var(--muted)">${m.progress}%</small></td><td><span class="status ${m.progress===100?'done':'pending'}">${m.status}</span></td></tr>`).join("")}
  </tbody></table></div>
  <div class="card side-card"><h3>Resumo</h3><div class="donut"></div><p style="font-size:11px;color:var(--muted);line-height:1.6;text-align:center">Seu progresso é salvo automaticamente neste dispositivo. Na versão com backend, esses dados poderão ser sincronizados pela API.</p></div></div>`;
}
function evaluations() {
  content.innerHTML = `<div class="page-title"><h1>Avaliações</h1><p>Teste seus conhecimentos e acompanhe seu desempenho.</p></div>
  <div class="card table-card"><table><thead><tr><th>Avaliação</th><th>Questões</th><th>Nota</th><th>Status</th><th></th></tr></thead><tbody>
  <tr><td><strong>Segurança e prevenção</strong></td><td>10</td><td>9,0</td><td><span class="status done">Concluída</span></td><td><button class="btn btn-light" onclick="openQuiz()">Refazer</button></td></tr>
  <tr><td><strong>Atendimento ao cliente</strong></td><td>8</td><td>—</td><td><span class="status pending">Pendente</span></td><td><button class="btn btn-primary" onclick="openQuiz()">Iniciar</button></td></tr>
  </tbody></table></div>`;
}
function help() {
  content.innerHTML = `<div class="page-title"><h1>Central de ajuda</h1><p>Encontre orientações rápidas para usar a plataforma.</p></div>
  <div class="grid"><div class="card side-card"><h3>Como funciona?</h3><div class="list">
  <div class="list-item"><div class="bullet">1</div><div><strong>Escolha um módulo</strong><small>Acesse um dos treinamentos disponíveis.</small></div></div>
  <div class="list-item"><div class="bullet">2</div><div><strong>Estude o conteúdo</strong><small>Leia as instruções e avance pelo material.</small></div></div>
  <div class="list-item"><div class="bullet">3</div><div><strong>Faça a avaliação</strong><small>Responda ao questionário para fixar o conteúdo.</small></div></div>
  <div class="list-item"><div class="bullet">4</div><div><strong>Acompanhe seu progresso</strong><small>Seu percentual é atualizado automaticamente.</small></div></div>
  </div></div>
  <div class="card side-card"><h3>Precisa de suporte?</h3><p style="font-size:12px;line-height:1.6;color:var(--muted)">Em uma versão integrada ao backend, este espaço pode receber abertura de chamados e contato com gestores.</p><button class="btn btn-primary" onclick="notify('Solicitação de suporte registrada!')">Solicitar suporte</button></div></div>`;
}

function navigate(page) {
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active", b.dataset.page===page));
  pageTitle.textContent = pageNames[page];
  ({inicio:home, treinamentos:trainings, progresso:progressPage, avaliacoes:evaluations, ajuda:help}[page] || home)();
  document.getElementById("sidebar").classList.remove("open");
}
document.querySelectorAll(".nav-item").forEach(btn=>btn.addEventListener("click",()=>navigate(btn.dataset.page)));

function openCourse(id) {
  const m = modules.find(x=>x.id===id);
  const overlay = document.createElement("div");
  overlay.className="modal-backdrop show";
  overlay.id="courseModal";
  overlay.innerHTML=`<div class="modal">
    <div class="modal-head"><div><div class="eyebrow" style="color:var(--primary)">MÓDULO DE TREINAMENTO</div><h2 style="margin:6px 0;font-size:20px">${m.title}</h2></div><button class="close" onclick="document.getElementById('courseModal').remove()">×</button></div>
    <p style="font-size:12px;line-height:1.7;color:var(--muted)">Este protótipo demonstra o fluxo de aprendizagem. O conteúdo pode ser substituído pelos materiais oficiais do posto e posteriormente carregado pela API REST.</p>
    <div class="card" style="padding:15px;margin:16px 0;background:#f7faff"><strong style="font-size:12px">Conteúdo da aula</strong><p style="font-size:11px;color:var(--muted);line-height:1.6;margin-bottom:0">1. Introdução à rotina<br>2. Procedimentos passo a passo<br>3. Cuidados e boas práticas<br>4. Checklist de conclusão</p></div>
    <div style="display:flex;gap:10px;justify-content:flex-end"><button class="btn btn-light" onclick="document.getElementById('courseModal').remove()">Fechar</button><button class="btn btn-primary" onclick="completeModule('${id}')">Marcar como concluído</button></div>
  </div>`;
  document.body.appendChild(overlay);
}
function completeModule(id) {
  if(!state.completed.includes(id)) state.completed.push(id);
  const m=modules.find(x=>x.id===id); m.progress=100; m.status="Concluído";
  state.progress=Math.min(100, Math.round(modules.reduce((a,x)=>a+x.progress,0)/modules.length));
  save(); document.getElementById("courseModal").remove(); notify("Módulo concluído! Seu progresso foi atualizado."); home();
}
function openQuiz() {
  const overlay=document.createElement("div"); overlay.className="modal-backdrop show"; overlay.id="quizModal";
  overlay.innerHTML=`<div class="modal"><div class="modal-head"><div><div class="eyebrow" style="color:var(--primary)">AVALIAÇÃO</div><h2 style="margin:6px 0;font-size:20px">Atendimento ao cliente</h2></div><button class="close" onclick="document.getElementById('quizModal').remove()">×</button></div>
  <p style="font-size:12px;color:var(--muted)">Qual atitude melhor contribui para um atendimento padronizado?</p>
  <button class="quiz-option" onclick="answer(this,false)">Ignorar a solicitação para agilizar a fila.</button>
  <button class="quiz-option" onclick="answer(this,true)">Ouvir o cliente, seguir o procedimento e confirmar a solicitação.</button>
  <button class="quiz-option" onclick="answer(this,false)">Fazer o atendimento sem conferir as informações.</button>
  <div id="quizResult" style="margin-top:15px;font-size:12px;font-weight:700"></div></div>`;
  document.body.appendChild(overlay);
}
function answer(el, correct) {
  document.querySelectorAll(".quiz-option").forEach(b=>b.disabled=true);
  el.classList.add(correct?"correct":"wrong");
  document.getElementById("quizResult").textContent=correct?"Resposta correta! Muito bem.":"Resposta incorreta. Revise o módulo e tente novamente.";
  if(correct) notify("Avaliação concluída com sucesso!");
}
document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("notificationBtn").addEventListener("click",()=>notify("Você não possui novas notificações."));
document.getElementById("logoutBtn").addEventListener("click",()=>notify("Sessão encerrada (simulação)."));
navigate("inicio");
