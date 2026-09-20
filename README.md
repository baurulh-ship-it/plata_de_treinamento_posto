# Rego Treina — Protótipo Frontend

Protótipo baseado na proposta do projeto extensionista da disciplina "Projeto Desenvolvimento de um protótipo de sistema web na nuvem - projeto 1".

## Funcionalidades demonstradas
- Dashboard inicial do colaborador
- Módulos de treinamento
- Progresso por módulo
- Avaliações interativas
- Central de ajuda
- Menu responsivo para celular
- Modal de conteúdo de treinamento
- Quiz com feedback
- Persistência local do progresso usando localStorage
- Estrutura preparada para futura integração com API REST

## Tecnologias
- HTML5
- CSS3
- JavaScript puro (ES6)
- localStorage para persistência local

## Como executar
Abra `index.html` no navegador.

## Próxima etapa: integração com backend
O documento prevê React/Next.js + Tailwind no frontend, Node.js/Express na API e PostgreSQL/SQLite com Prisma. Este protótipo usa HTML/CSS/JS para facilitar a execução imediata; a lógica de navegação e estado pode ser migrada para React/Next.js.

Exemplos de endpoints que podem substituir o localStorage:
- `POST /api/auth/login`
- `GET /api/modules`
- `GET /api/progress/:userId`
- `PUT /api/progress/:userId/:moduleId`
- `GET /api/evaluations/:moduleId`
- `POST /api/evaluations/:moduleId/submit`
