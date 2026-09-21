# Rego Treina — plataforma integrada

Capacitação do Auto Posto Rego & CIA com cadastro, login, quatro módulos, 12 aulas, avaliações corrigidas no servidor e progresso associado à conta em SQLite.

## Iniciar no Windows

Instale Node.js 22 ou superior. Extraia todos os arquivos em uma pasta e execute **iniciar.cmd**. Na primeira execução, é necessária internet para baixar as dependências. Quando aparecer a mensagem do servidor, abra **http://localhost:3000** no navegador. Mantenha a janela aberta durante a apresentação.

Alternativa pelo terminal, na pasta do projeto:

```sh
npm ci
npm run setup
npm start
```

O comando de configuração cria `.env` com uma chave de sessão aleatória, prepara `prisma/training.db`, aplica as migrações e cadastra os quatro módulos. Repetir a configuração não duplica cursos nem apaga usuários ou progresso. Não são criadas contas ou senhas padrão.

**Não abra index.html diretamente:** esta versão precisa do servidor para autenticar e salvar os dados.

## Roteiro para sexta

1. Abra a plataforma e clique em **Criar minha conta**.
2. Informe nome, email e senha com pelo menos oito caracteres.
3. Em **Começar minha jornada**, leia as três aulas do primeiro módulo.
4. Responda às três questões e envie a avaliação. O servidor calcula a nota e mostra o feedback.
5. Confira o progresso: leitura completa e pelo menos 70% na avaliação concluem o módulo.
6. Abra **Meu progresso** para imprimir o relatório com nome e resultados.
7. Saia da conta e entre novamente; o avanço será recuperado do banco de dados.
8. Para demonstrar a recuperação em outro navegador, abra o mesmo endereço e entre com a mesma conta.

## O que está integrado

- Cadastro normalizado por email, senha protegida com bcrypt e perfil de colaborador.
- Sessão de oito horas em cookie HttpOnly e SameSite=Strict; sair remove o cookie.
- Nome e perfil da conta na interface.
- Treinamentos carregados da API, sem enviar o gabarito junto das questões.
- Leitura em sequência; progresso e melhor nota calculados pelo servidor.
- Isolamento dos registros por usuário; um colaborador não consulta dados de outros.
- Falhas de conexão não são exibidas como sucesso: é possível tentar salvar novamente.
- Retorno ao login quando a sessão expira.
- Nenhum progresso local da antiga demonstração é importado automaticamente, pois não possui dono autenticado.

## Dados e acesso em outros dispositivos

O histórico está no arquivo `prisma/training.db` do computador que executa o servidor. Faça backup desse arquivo com o servidor parado. Não o apague para atualizar a interface. O arquivo `prisma/dev.db` da versão original não é utilizado na configuração nova.

Para acessar de outro dispositivo, a plataforma precisa estar disponível na rede ou em um serviço de hospedagem com Node.js e armazenamento persistente. `localhost` identifica o próprio computador; não é um endereço público. Esta entrega não publica o sistema na internet. GitHub Pages sozinho não executa esta API.

## Configuração de ambiente

Veja `.env.example`. O `.env` não deve ser enviado ao GitHub. Em produção, configure HTTPS, `NODE_ENV=production` (cookie Secure), uma chave `JWT_SECRET` exclusiva com pelo menos 32 caracteres, `DATABASE_URL` apontando para armazenamento persistente e `PORT` conforme o serviço. A interface e a API devem compartilhar a mesma origem. Atrás de proxy, preserve o Host e a origem da requisição ou ajuste explicitamente a política de origem do servidor para o domínio de publicação.

O cadastro público sempre cria COLABORADOR; não há criação pública de gestores. Recuperação de senha, confirmação de email e painel de gestão ainda não fazem parte desta entrega. O conteúdo é introdutório, precisa de validação do responsável do posto e não substitui capacitação obrigatória ou certificação profissional.

## API

Todas as respostas da API evitam cache. Rotas protegidas usam o cookie de sessão; enviar notas ou percentuais arbitrários não é aceito.

| Rota | Uso |
| --- | --- |
| POST /api/auth/register | Nome, email e senha |
| POST /api/auth/login | Email e senha; grava cookie |
| POST /api/auth/logout | Remove cookie |
| GET /api/auth/me | Perfil autenticado |
| GET /api/courses | Aulas e perguntas sem gabarito |
| GET /api/progress/me | Histórico da própria conta |
| POST /api/progress | courseId e lessonIndex, ou courseId e answers |

`lessonIndex` e os índices em `answers` começam em zero. O campo `nota` retornado usa escala de 0 a 10, e `score` da tentativa usa 0 a 100. O frontend converte a melhor nota em percentual.

## Testes

```sh
npm test
npm run test:browser
```

Os testes criam bancos isolados em `work/`, aplicam migrações e executam o seed duas vezes para verificar idempotência. Não alteram o banco de uso normal. O teste de navegador usa Edge instalado; para Chrome, defina `BROWSER_CHANNEL=chrome`. Capturas de conferência ficam em `work/`.

Cobertura: cadastro, login, cookies, duplicidade de email, proteção de gestor, isolamento de contas, validação de respostas, cálculo de notas, melhor nota, sequência de aulas, persistência em novo login e outro contexto de navegador, saída, sessão expirada, falha de rede com nova tentativa e layout de celular.

A auditoria de dependências reporta um aviso alto transitivo em `deepmerge-ts`, utilizado pela configuração do Prisma 6. A correção sugerida pelo npm altera a versão principal/regride o Prisma; não foi aplicada automaticamente. Revise a dependência antes de publicar em produção.
