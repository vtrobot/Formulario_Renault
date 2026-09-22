# AGENT.md — Guia para Agentes de IA no Projeto "Envio de Pedido por E-mail"

Este arquivo orienta qualquer agente de IA (Claude Code, Copilot, Cursor, etc.) que for
trabalhar neste repositório. Leia-o antes de gerar ou alterar qualquer código.

## 1. Visão geral do projeto

Aplicação web simples composta por:

- **Frontend**: formulário de pedido (10 campos) construído em React + Vite + TypeScript + Tailwind CSS.
- **Backend**: API em Node.js + Fastify + TypeScript que valida os dados e envia um
  e-mail via Resend para um destinatário configurado por variável de ambiente.

Não há banco de dados, autenticação ou persistência nesta versão (MVP). O detalhamento
funcional completo está em `specs.md` — consulte-o sempre que precisar confirmar regras
de negócio, contrato de API ou critérios de aceitação.

## 2. Stack e versões

| Camada    | Tecnologia                              |
|-----------|------------------------------------------|
| Frontend  | React, Vite, TypeScript, Tailwind CSS    |
| Backend   | Node.js, Fastify, TypeScript             |
| E-mail    | Resend (API)                             |
| Validação | Zod (recomendado, front e back)          |

Use TypeScript estrito (`strict: true`) em ambos os projetos. Evite `any`.

## 3. Estrutura de pastas

```
pedido-form/
├── frontend/
│   └── src/{components,pages,services,types}/, App.tsx
├── backend/
│   └── src/{routes,services,schemas,types}/, server.ts
├── .gitignore
└── README.md
```

Novos arquivos devem seguir esta organização. Não crie pastas paralelas
(ex.: `utils/` genérico) sem necessidade clara.

## 4. Convenções de código

- **Nomenclatura**: `camelCase` para variáveis/funções, `PascalCase` para componentes
  React e tipos/interfaces.
- **Campos do pedido**: os nomes usados no PRD (código do pedido, cliente, produto...)
  são **provisórios**. Centralize os labels em um único local (ex.:
  `frontend/src/types/pedido.ts` e um schema compartilhado de validação) para facilitar
  a troca futura dos nomes reais sem tocar em múltiplos arquivos.
- **Commits**: mensagens curtas e descritivas, em português, no imperativo
  (ex.: "adiciona validação de quantidade").
- **Comentários**: apenas quando o código não for autoexplicativo. Não comente o óbvio.

## 5. Regras de negócio inegociáveis

- O e-mail de destino (`MAIL_TO`) e a API key do Resend (`RESEND_API_KEY`) **nunca**
  podem aparecer no frontend nem em código versionado.
- Toda validação feita no frontend deve ser **repetida no backend**. Nunca confiar
  apenas na validação client-side.
- Campos obrigatórios: Código do Pedido, Cliente, Produto, Quantidade, Data do Pedido,
  Responsável. Os demais (Centro de Custo, Unidade, Valor do Pedido, Observação) são
  opcionais — confirme sempre em `specs.md` caso o PRD seja atualizado.
- Toda resposta de erro da API deve ser genérica para o usuário final (nunca expor
  stack traces, detalhes do Resend ou dados internos).

## 6. Variáveis de ambiente

Definidas em `backend/.env` (nunca commitado; deve estar no `.gitignore`).
Sempre manter `backend/.env.example` atualizado quando uma nova variável for criada.

```
RESEND_API_KEY=
MAIL_TO=
MAIL_FROM=
PORT=
```

## 7. Comandos esperados

Ajuste conforme os `package.json` reais, mas como padrão:

```bash
# Frontend
cd frontend && npm install && npm run dev
cd frontend && npm run build

# Backend
cd backend && npm install && npm run dev
cd backend && npm run build && npm start
```

Antes de finalizar uma tarefa, rode lint/build de ambos os pacotes quando existirem
scripts configurados, e corrija erros de tipo do TypeScript.

## 8. O que NÃO fazer nesta fase (fora de escopo do MVP)

- Não implementar login, cadastro de usuários ou banco de dados.
- Não criar histórico/listagem de pedidos nem área administrativa.
- Não adicionar upload de arquivos ou integrações externas além do Resend.
- Não adicionar CAPTCHA/rate limiting a menos que explicitamente solicitado (está
  listado como melhoria futura).

## 9. Segurança — checklist rápido

- [ ] `.env` no `.gitignore`
- [ ] API key do Resend usada somente no backend
- [ ] Validação e sanitização de todos os campos no backend
- [ ] Limite de tamanho máximo de caracteres por campo
- [ ] Mensagens de erro genéricas para o cliente
- [ ] CORS configurado apenas para a origem do frontend

## 10. Ao terminar uma tarefa

1. Confirme que o comportamento implementado bate com o requisito funcional (RFxx) e o
   critério de aceitação (CAxx) correspondente em `specs.md`.
2. Verifique se o `.env.example` foi atualizado, se necessário.
3. Rode build/lint/testes disponíveis.
4. Resuma, na entrega, quais RFs/CAs foram cobertos.

## 11. Referência

O documento fonte de verdade para requisitos, contrato de API, formato do e-mail e
critérios de aceitação é o `specs.md` (derivado do PRD original). Em caso de dúvida ou
conflito, `specs.md` prevalece sobre suposições do agente.
