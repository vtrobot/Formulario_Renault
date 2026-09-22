# SPECS.md — Especificação Técnica: Formulário de Envio de Pedido por E-mail

Documento derivado do PRD. Fonte de verdade para implementação. Versão: MVP.

## 1. Objetivo

Aplicação de página única onde o usuário preenche 10 campos de um pedido e, ao enviar,
o backend envia um e-mail (via Resend) para um destinatário fixo configurado por
variável de ambiente. Sem persistência, login ou histórico.

## 2. Escopo

**Incluído**: formulário de 10 campos, validação (front + back), endpoint
`POST /api/pedidos`, envio de e-mail via Resend, mensagens de sucesso/erro, layout
responsivo, e-mail de destino configurável via `.env`.

**Excluído**: cadastro/login, banco de dados, histórico de pedidos, área
administrativa, edição de pedidos enviados, upload de arquivos, integrações externas.

## 3. Arquitetura

```
Frontend (React + Vite + Tailwind)
        | HTTP POST /api/pedidos
        v
Backend (Node.js + Fastify + TypeScript)
        | API Resend
        v
Serviço de e-mail (Resend) → E-mail de destino (MAIL_TO)
```

- Frontend: interface e validação básica de UX.
- Backend: validação definitiva, sanitização, montagem do e-mail, envio via Resend,
  retorno de resultado padronizado ao frontend.

## 4. Modelo de dados do pedido

Nomes de campos **provisórios**, substituíveis futuramente. Manter em um único tipo
compartilhado (duplicado em front e back até que haja um pacote compartilhado).

| # | Campo (label)         | Chave (payload)   | Tipo   | Obrigatório | Observações                          |
|---|------------------------|--------------------|--------|--------------|----------------------------------------|
| 1 | Código do Pedido       | `codigoPedido`     | string | Sim          | usado também no assunto do e-mail     |
| 2 | Cliente                | `cliente`          | string | Sim          |                                        |
| 3 | Produto                | `produto`          | string | Sim          |                                        |
| 4 | Quantidade             | `quantidade`       | string | Sim          | validar como numérico (> 0)           |
| 5 | Data do Pedido         | `dataPedido`       | string | Sim          | formato `DD/MM/AAAA`                  |
| 6 | Centro de Custo        | `centroCusto`      | string | Não          |                                        |
| 7 | Responsável            | `responsavel`      | string | Sim          |                                        |
| 8 | Unidade                | `unidade`          | string | Não          |                                        |
| 9 | Valor do Pedido        | `valorPedido`      | string | Não          | formato monetário, ex.: `1500.00`     |
| 10| Observação do Pedido   | `observacao`       | string | Não          | texto livre, limitar tamanho máximo   |

### Limites sugeridos de caracteres

- Campos curtos (código, cliente, produto, responsável, centro de custo, unidade,
  quantidade, valor): máx. 100 caracteres.
- Data do Pedido: 10 caracteres (`DD/MM/AAAA`).
- Observação: máx. 500 caracteres.

## 5. Requisitos Funcionais (RF)

| ID   | Descrição |
|------|-----------|
| RF01 | Exibir formulário com os 10 campos. |
| RF02 | Permitir preenchimento de todos os campos. |
| RF03 | Bloquear envio se campo obrigatório estiver vazio; exibir mensagem indicando os campos pendentes. |
| RF04 | Ao clicar em "Enviar Pedido", enviar POST para `/api/pedidos`. |
| RF05 | Backend recebe e revalida todos os dados recebidos. |
| RF06 | Backend envia e-mail via Resend após validação bem-sucedida. |
| RF07 | Destinatário do e-mail configurado via variável de ambiente `MAIL_TO`, nunca exposto no frontend. |
| RF08 | Exibir "Pedido enviado com sucesso!" após envio bem-sucedido. |
| RF09 | Exibir "Não foi possível enviar o pedido. Tente novamente." em caso de erro. |
| RF10 | Limpar o formulário após envio bem-sucedido. |

## 6. Validações

### Frontend (UX, não confiável isoladamente)

- Campo obrigatório vazio → bloquear envio e destacar o campo.
- Quantidade → aceitar apenas valores numéricos válidos (inteiro positivo).
- Valor do Pedido → aceitar apenas formato monetário válido (quando preenchido).
- Data do Pedido → formato `DD/MM/AAAA` válido.
- Respeitar limite máximo de caracteres por campo (ver seção 4).
- (Preparar campo de e-mail, se adicionado futuramente, para validar formato válido.)

### Backend (autoritativa)

- Repetir todas as validações acima.
- Sanitizar entradas (trim, remoção de caracteres de controle, escaping antes de
  montar o HTML do e-mail para evitar injeção de conteúdo).
- Rejeitar payload com campos faltando/tipo incorreto retornando erro 400 com
  mensagem genérica.
- Nunca repassar detalhes internos (stack trace, erro do Resend) na resposta ao
  cliente.

## 7. API

### `POST /api/pedidos`

**Request body**

```json
{
  "codigoPedido": "123456",
  "cliente": "Empresa XYZ",
  "produto": "Produto Exemplo",
  "quantidade": "100",
  "dataPedido": "21/09/2026",
  "centroCusto": "CC001",
  "responsavel": "João da Silva",
  "unidade": "Curitiba",
  "valorPedido": "1500.00",
  "observacao": "Pedido prioritário."
}
```

**Resposta — sucesso (200)**

```json
{ "success": true, "message": "Pedido enviado com sucesso." }
```

**Resposta — erro de validação (400) ou falha de envio (500)**

```json
{ "success": false, "message": "Não foi possível enviar o pedido." }
```

Recomendações adicionais (não descritas no PRD, mas coerentes com boas práticas):
- Content-Type: `application/json` em request e response.
- CORS restrito à origem do frontend.
- Tratar erros do Resend (timeout, chave inválida, limite de envio) sempre convertendo
  para a mesma mensagem genérica de erro ao cliente, registrando o detalhe apenas em
  log do servidor.

## 8. Formato do e-mail

**Assunto**

```
Novo Pedido - {codigoPedido}
```

**Corpo (texto simples ou HTML equivalente)**

```
NOVO PEDIDO

Código do Pedido:
{codigoPedido}

Cliente:
{cliente}

Produto:
{produto}

Quantidade:
{quantidade}

Data do Pedido:
{dataPedido}

Centro de Custo:
{centroCusto}

Responsável:
{responsavel}

Unidade:
{unidade}

Valor do Pedido:
{valorPedido}

Observação:
{observacao}
```

- Campos opcionais não preenchidos devem aparecer com um marcador (ex.: "—" ou
  "Não informado") em vez de ficarem em branco.
- `MAIL_FROM` é o remetente configurado; `MAIL_TO` é o destinatário fixo.

## 9. Variáveis de ambiente (backend)

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
MAIL_TO=destinatario@empresa.com.br
MAIL_FROM=pedidos@empresa.com.br
PORT=3000
```

- `.env` deve estar no `.gitignore`.
- Manter `.env.example` com as mesmas chaves, sem valores reais.
- `RESEND_API_KEY` e `MAIL_TO` nunca podem ser lidos ou expostos pelo frontend.

## 10. Segurança

- API key do Resend somente no backend.
- Variáveis sensíveis apenas em `.env`, nunca versionadas.
- Validação e sanitização obrigatórias no backend, independente do frontend.
- Limitação de tamanho de campos (evitar payloads excessivos).
- Respostas de erro não devem vazar informação sensível.
- Melhoria futura (fora do MVP): rate limiting e/ou CAPTCHA contra spam.

## 11. Interface (layout sugerido)

Página única, formulário vertical, responsivo (mobile-first com Tailwind):

```
ENVIO DE PEDIDO
Código do Pedido    [________________]
Cliente              [________________]
Produto              [________________]
Quantidade           [________________]
Data do Pedido       [________________]
Centro de Custo      [________________]
Responsável          [________________]
Unidade              [________________]
Valor do Pedido      [________________]
Observação           [________________]
        [ ENVIAR PEDIDO ]
```

- Estado de carregamento no botão durante o envio (evitar duplo clique).
- Mensagens de sucesso/erro visíveis próximas ao botão, com destaque visual
  (ex.: verde para sucesso, vermelho para erro).

## 12. Critérios de Aceitação (CA)

| ID   | Dado / Quando / Então |
|------|------------------------|
| CA01 | Dado que o usuário acessa a aplicação, quando a página carrega, então os 10 campos são exibidos. |
| CA02 | Dado um campo obrigatório vazio, quando o usuário clica em "Enviar Pedido", então o envio é bloqueado e o campo pendente é indicado. |
| CA03 | Dado que todos os obrigatórios estão preenchidos, quando o usuário envia, então os dados são enviados à API. |
| CA04 | Dado que a API recebeu dados válidos, quando o processamento termina, então o backend envia o e-mail via Resend. |
| CA05 | Dado que o e-mail foi enviado, quando o backend retorna sucesso, então o frontend exibe "Pedido enviado com sucesso!". |
| CA06 | Dado um erro de processamento, quando a API retorna erro, então o frontend exibe mensagem informando a falha. |

## 13. Estrutura inicial do projeto

```
pedido-form/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── server.ts
│   ├── .env
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## 14. Definição de pronto (MVP)

- [ ] Formulário com os 10 campos e validação client-side.
- [ ] Endpoint `POST /api/pedidos` com validação server-side espelhando o frontend.
- [ ] Envio de e-mail funcional via Resend, com assunto e corpo conforme seção 8.
- [ ] Mensagens de sucesso e erro exibidas corretamente (RF08/RF09).
- [ ] Formulário limpo após sucesso (RF10).
- [ ] Layout responsivo (mobile e desktop).
- [ ] `.env` configurado e no `.gitignore`; `.env.example` presente.
- [ ] Todos os CAs (01–06) validados manualmente.

## 15. Melhorias futuras (fora do MVP)

Banco de dados, histórico de pedidos, numeração automática, login/autenticação,
dashboard administrativo, pesquisa de pedidos, status do pedido, exportação para
Excel, anexos, templates de e-mail avançados, logs de envio, reenvio de pedidos,
CAPTCHA, rate limiting, auditoria, integrações externas.
