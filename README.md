# Formulário de Pedido (MVP)

Sistema simples para envio de pedidos por e-mail utilizando React (Frontend) e Node.js + Fastify (Backend).

## Estrutura

- `frontend/`: Aplicação React com Vite e Tailwind CSS.
- `backend/`: API Node.js com Fastify, validando dados e enviando e-mail via Resend.

## Como rodar localmente

### Backend

1. Entre na pasta `backend`.
2. Instale as dependências: `npm install`
3. Crie um arquivo `.env` baseado no `.env.example` e adicione sua chave do Resend e e-mails.
4. Execute em desenvolvimento: `npm run dev`

### Frontend

1. Entre na pasta `frontend`.
2. Instale as dependências: `npm install`
3. Execute em desenvolvimento: `npm run dev`
