# Rego Treina

Demonstração de capacitação do Auto Posto Rego & CIA, com HTML, CSS e JavaScript sem dependências para apresentação.

## Apresentar

Abra `index.html` no Edge, Chrome ou Firefox. A demonstração funciona sem iniciar a API. A fonte online é opcional; sem internet, utiliza a fonte do sistema.

1. Na tela inicial, confira os indicadores zerados e clique em **Começar minha jornada**.
2. Leia e avance pelas três aulas de Segurança e prevenção.
3. Responda às três questões; com pelo menos 70%, a avaliação é aprovada.
4. Volte ao início: o módulo estará concluído e o progresso geral em 25%.
5. Abra **Meu progresso** para imprimir o relatório e **Avaliações** para repetir uma atividade.
6. Recarregue a página para mostrar a persistência. No celular, utilize o menu superior.
7. Para uma nova apresentação, use **Recomeçar demonstração** e confirme a exclusão do histórico local.

## Funcionalidades

- Quatro módulos, 12 aulas introdutórias e 12 questões com feedback.
- Conclusão condicionada à leitura e aprovação, com melhor nota preservada.
- Indicadores calculados a partir do histórico, sem números de desempenho fictícios.
- Progresso salvo neste navegador, recuperação de armazenamento inválido e aviso quando não é possível salvar.
- Navegação responsiva, diálogos acessíveis por teclado e relatório para impressão.
- Ajuda com orientações reais, sem simular envio de solicitações de suporte.

## Limites da demonstração

O perfil é de visitante e os dados ficam apenas neste navegador. Não há login ou sincronização com a API nesta interface. Os materiais são introdutórios, precisam de validação pelo responsável do posto e não substituem capacitação obrigatória nem certificação profissional. Os tempos são estimativas de conteúdo, não medição de estudo.

## API existente (separada)

O projeto também contém uma API Express/Prisma em `src/`, ainda não integrada à demonstração. Para desenvolvimento local: instale as dependências com `npm install`, configure `DATABASE_URL` e `JWT_SECRET` em `.env`, execute `npm run prisma:generate`, as migrações e então `npm start`. Não use o banco incluído ou as credenciais de exemplo em produção. O seed original cria cursos a cada execução.

Antes de colocar a API em produção, revise autenticação, cadastro de gestores, validações e proteção das avaliações. A demonstração não deve ser utilizada como registro oficial de qualificação.

## Verificação

O roteiro automatizado `tests/presentation.cjs` usa Playwright. Instale Playwright separadamente para desenvolvimento e execute `node tests/presentation.cjs` com Edge disponível. Verifica estado inicial, leitura, avaliação, conclusão, persistência ao recarregar, navegação, largura de celular e recuperação de armazenamento inválido. Imagens de conferência ficam em `work/`.
