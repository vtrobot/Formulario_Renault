# Análise Completa — Formulário de Pedidos Renault (LCPU)

## 1. Objetivo e Propósito

O projeto é uma **aplicação web industrial para entrada e envio de pedidos de produção**, voltada à equipe de logística da Renault. O conceito central é o **LCPU (Labor Cost Per Unit)** — cálculo do custo de mão de obra por unidade de componentes industriais.

**Fluxo principal:**
1. O usuário preenche os campos de um pedido (item, modelo, versão, nome da peça, GFPG, quantidade)
2. Adiciona um ou mais itens a uma lista acumuladora
3. Ao clicar em **"Enviar Pedido"** — o backend dispara um e-mail via **Resend** para um destinatário fixo configurado em variável de ambiente

Não há banco de dados, autenticação ou persistência. É um MVP de envio por e-mail.

---

## 2. Stack Tecnológico Completo

### Frontend
| Tecnologia | Versão | Papel |
|---|---|---|
| React | 19.3.0 | UI framework |
| TypeScript | 6.0.2 | Tipagem estrita |
| Vite | 8.3.0 | Bundler/dev server |
| react-hook-form | 7.88.0 | Gerenciamento de estado do formulário |
| Zod | 4.6.5 | Validação client-side |
| @hookform/resolvers | 5.9.1 | Integração RHF + Zod |
| lucide-react | 1.47.0 | Ícones (stroke 1.75px) |
| framer-motion | 13.4.2 | (instalado, não utilizado no código atual) |
| CSS Vanilla | — | Design system próprio |

> **Nota importante**: o `README.md` e o `agent.md` descrevem Tailwind CSS na stack, mas a implementação real usa **CSS Vanilla puro** com design tokens via variáveis CSS. Tailwind não aparece em nenhum arquivo `.css` ou `package.json`.

### Backend
| Tecnologia | Versão | Papel |
|---|---|---|
| Node.js | — | Runtime |
| TypeScript | 7.0.2 | Tipagem estrita |
| Fastify | 5.12.5 | Framework HTTP |
| @fastify/cors | 11.3.0 | CORS middleware |
| Zod | 4.6.5 | Validação server-side |
| Resend | 6.28.1 | Serviço de envio de e-mail |
| dotenv | 18.0.2 | Variáveis de ambiente |
| tsx | 4.23.15 | Execução TypeScript em dev |
| @vercel/node | 15.0.0 | Adaptador Serverless para Vercel |

### Deploy
- **Backend e Frontend ambos na Vercel** (serverless)
- URL de produção: `https://sixnineuninter-7dfz.vercel.app`
- CORS configurado como `origin: '*'` (aberto para MVP)

---

## 3. Arquitetura e Fluxo de Dados

### Diagrama de Fluxo
```
Usuário
  └─▶ PedidoForm.tsx ──▶ App.tsx (estado items[])
                              └─▶ ItemsTable.tsx
                                      │  (clique "Enviar Pedido")
                                      ▼
                              api.ts: POST /api/pedidos/lote
                                      │
                              backend/api/index.ts  ← serverless handler (Vercel)
                                      │
                              backend/src/app.ts  ← Fastify app + CORS
                                      │
                              backend/src/routes/pedidoRoutes.ts
                                      │ (Zod safeParse)
                              backend/src/schemas/pedidoSchema.ts
                                      │ (se válido)
                              backend/src/services/emailService.ts
                                      │
                              Resend API ──▶ MAIL_TO (e-mail fixo)
```

### Modelo de Dados
```typescript
// frontend/src/types/pedido.ts
type PedidoInput = {
  item: string;
  modelo: string;
  versao: string;
  nomePeca: string;
  gfpg: string;
  quantidade: string; // string numérica, validada como > 0
};

type PedidoItem = PedidoInput & {
  id: string;          // crypto.randomUUID() — só existe no frontend
  subtotalLcpu: number; // placeholder calculado aleatoriamente — não enviado ao backend
};
```

### Validação
- Schema Zod **idêntico** no frontend (`PedidoForm.tsx`) e no backend (`pedidoSchema.ts`)
- Validação dupla garantida: client-side para feedback imediato, server-side para segurança

### Formato do E-mail
- Subject fixo: `"PedidosRenault"`
- Body em texto plano, formato CSV-like:
  ```
  Item;Modelo;Versao;NomePeca;GfPg;Quantidade|IT-9604;Rotor Turbo;v3.2;...
  ```
- Pipe (`|`) como separador de linhas
- Ponto-vírgula (`;`) como separador de campos

---

## 4. Design System "NINE SIX — LCPU"

Implementado em `frontend/src/index.css` com tokens definidos em `specs/DESIGN.md`:

- **Paleta**: Navy profundo (`#003366`) como cor primária, âmbar (`#F29F05`) como CTA
- **Grid de 8pt**: espaçamentos em múltiplos de 4px/8px
- **Tipografia**: Inter com `font-feature-settings: "tnum"` para números tabulares
- **Elevação em 4 níveis**: sombras progressivas baseadas em `rgba(0, 51, 102, ...)`
- **Animações**: `fadeIn`, `slideUp`, `slideDown`, `spin`, `pulse`, `scaleIn`
- **Responsividade**: breakpoints em 768px e 1024px

---

## 5. Componentes Principais

| Componente | Responsabilidade |
|---|---|
| `App.tsx` | Estado global `items[]`, orquestração dos três componentes principais |
| `PedidoForm.tsx` | Entrada de dados, validação Zod, cálculo placeholder do LCPU |
| `ItemsTable.tsx` | Exibição da lista acumulada, envio em lote, feedback visual |
| `FormHeader.tsx` | Cabeçalho com logo e título (lógica de `onFillExample` não utilizada) |
| `api.ts` | Cliente HTTP com `fetch` para backend |
| `pedidoRoutes.ts` | Rotas Fastify POST `/pedidos` e POST `/pedidos/lote` |
| `emailService.ts` | Formatação e envio via Resend |

---

## 6. Divergência entre Specs e Implementação

**Diferenças significativas:**

| Aspecto | specs.md | Implementação atual |
|---|---|---|
| Campos do formulário | 10 campos (codigoPedido, cliente, produto, ...) | 6 campos (item, modelo, versao, nomePeca, gfpg, quantidade) |
| Fluxo de envio | Um pedido por envio (`POST /pedidos`) | Lote de pedidos (`POST /pedidos/lote`) |
| Subject do e-mail | `"Novo Pedido - {codigoPedido}"` | `"PedidosRenault"` (fixo) |
| Corpo do e-mail | Formato de carta estruturada | CSV com separador `|` e `;` |

O código implementado claramente representa uma **evolução/pivot do domínio** em relação à spec original — passou de um formulário genérico de pedidos comerciais para um formulário específico de parametrização de componentes de produção industrial com cálculo LCPU.

---

## 7. Pontos Fortes

1. **Validação dupla consistente** — schema Zod idêntico no frontend e no backend
2. **Separação de responsabilidades clara** — cada componente tem uma única responsabilidade bem definida
3. **Design system robusto** — tokens CSS bem definidos, sistema de elevação completo
4. **Segurança básica respeitada** — variáveis sensíveis apenas no backend, mensagens de erro genéricas ao cliente
5. **Deploy serverless bem arquitetado** — adaptador Vercel isola o Fastify do modelo serverless
6. **UX de lote prático** — acumular múltiplos itens antes de enviar melhora a experiência
7. **Responsividade completa** — CSS com media queries cobrindo mobile, tablet e desktop
8. **TypeScript strict em ambos os projetos** — tipagem segura em todo o código

---

## 8. Débitos Técnicos e Melhorias Pendentes

### Críticos (impactam funcionalidade)

| Item | Descrição | Impacto |
|---|---|---|
| `subtotalLcpu` aleatório | Calculado com `Math.random()`: `qty * (14.5 + Math.random() * 3)` | Lógica real de cálculo LCPU não implementada — core feature do projeto |
| Botão "Exportar" | Existe na `ItemsTable` mas sem handler | Funcionalidade prometida na UI não funciona |
| Botão "Editar item" | Renderizado mas sem `onClick` | Usuário não pode editar itens já adicionados |

### Importantes (impactam segurança/qualidade)

| Item | Descrição | Recomendação |
|---|---|---|
| CORS aberto | `origin: '*'` em produção | Restringir à origem exata do frontend: `process.env.FRONTEND_URL` |
| `debug` no erro 500 | Expõe `errorMessage` no payload | Remover em produção ou logar apenas internamente |
| Rate limiting ausente | Endpoint público sem proteção contra abuso | Implementar `@fastify/rate-limit` |
| Subject do e-mail fixo | `"PedidosRenault"` não identifica conteúdo | Incluir data/hora ou número de itens |

### Menores (melhorias de código/UX)

| Item | Descrição | Recomendação |
|---|---|---|
| `framer-motion` não utilizado | Dependência de 13MB no bundle | Remover do `package.json` |
| `FormHeader.onFillExample` nunca chamado | Prop existe mas `App.tsx` passa `() => {}` | Remover prop ou implementar handler |
| `tsconfig.json` comentado | `rootDir`/`outDir` comentados no backend | Definir diretórios de saída claros |
| Specs desatualizadas | `specs.md` e `agent.md` divergem completamente | Atualizar para refletir modelo atual |

---

## 9. Configuração de Ambiente

### Frontend
```
VITE_API_URL=http://localhost:3000/api  (desenvolvimento)
VITE_API_URL=https://sixnineuninter-7dfz.vercel.app/api  (produção)
```

### Backend
```
PORT=3000
RESEND_API_KEY= (obrigatório)
MAIL_TO= (obrigatório)
MAIL_FROM= (obrigatório)
```

---

## 10. Estado de Qualidade do Código

**Pontuação geral: 7/10**

### ✅ Pontos Positivos
- TypeScript com `strict: true` em ambos os projetos
- Componentes bem nomeados e com responsabilidades claras
- Nenhum `any` explícito encontrado no código
- Tratamento de erros consistente (try/catch + feedback visual)
- Estrutura de pastas organizada (frontend/backend separados)
- Deploy funcional na Vercel

### ⚠️ Pontos de Atenção
- Divergência specs↔implementação cria confusão
- Placeholders não finalizados (`subtotalLcpu`, botões sem handler)
- Dependências não utilizadas (`framer-motion`)
- Configurações de build comentadas

### 🚨 Riscos de Produção
- CORS totalmente aberto
- Erros internos potencialmente expostos
- Sem rate limiting
- Falta de logs estruturados

---

## 11. Próximos Passos Recomendados

### Prioridade Alta (MVP funcional)
1. **Implementar lógica real de cálculo LCPU** — remover `Math.random()`
2. **Implementar handler para "Exportar"** — CSV/Excel download
3. **Implementar edição de itens** — botão "Editar" funcional
4. **Restringir CORS** — `origin: process.env.FRONTEND_URL`

### Prioridade Média (Qualidade/segurança)
5. **Remover `framer-motion`** — dependência não utilizada
6. **Implementar rate limiting** — `@fastify/rate-limit`
7. **Atualizar specs** — sincronizar `specs.md` com implementação atual
8. **Melhorar subject do e-mail** — incluir timestamp ou ID

### Prioridade Baixa (Refinamento)
9. **Implementar `FormHeader.onFillExample`** ou remover prop
10. **Limpar `tsconfig.json`** — descomentar `rootDir`/`outDir`
11. **Adicionar logs estruturados** — JSON logging para monitoramento
12. **Testes unitários** — Jest/Vitest para componentes críticos

---

## 12. Conclusão

O projeto está em **bom estado para um MVP** com deploy funcional na Vercel. A arquitetura é sólida, a separação de responsabilidades é clara e o design system está bem implementado.

Os principais gaps são:
1. **Lógica de cálculo LCPU** — core feature do projeto ainda em placeholder
2. **Funcionalidades de UI não implementadas** (exportar, editar)
3. **Configurações de segurança básicas** (CORS, rate limiting)

Uma vez resolvidos esses três pontos, o projeto estará pronto para uso em produção com qualidade adequada.

---

*Análise gerada em: 29 de setembro de 2026*  
*Baseada no código em: c:\ProjetosJR10T\Formulario_Renault\**