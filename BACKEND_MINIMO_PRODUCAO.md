# Backend Mínimo para Produção

Este documento identifica os componentes mínimos necessários do backend para o app funcionar em produção.

## 📊 Análise do Estado Atual

O app atualmente **NÃO usa o backend** para funcionalidades principais:
- ✅ Autenticação: Usa `AsyncStorage` local (`lib/auth-context.tsx`)
- ✅ Dados: Usa `AsyncStorage` local (`lib/data-context.tsx`)
- ✅ Chat/Mensagens: Armazenamento local
- ✅ Reconhecimentos: Armazenamento local
- ✅ Posts/Feed: Armazenamento local

O backend existe mas está **desconectado** do app frontend.

---

## 🎯 Mínimo Absoluto para Produção

### ✅ **ESSENCIAL** (Deve estar presente)

#### 1. Servidor Express Básico
**Arquivo:** `server/_core/index.ts`
- **Por quê:** Necessário para o servidor HTTP rodar
- **Função:** Inicia o servidor Express na porta configurada
- **Dependências:** Express, CORS, body parser

#### 2. Rota de Health Check
**Arquivo:** `server/_core/index.ts` (linha 59-61)
- **Endpoint:** `GET /api/health`
- **Por quê:** Verificação básica de saúde do servidor
- **Retorna:** `{ ok: true, timestamp: Date.now() }`

#### 3. Rotas tRPC Básicas
**Arquivo:** `server/routers.ts`
- **Router:** `system.health` (já existe)
- **Router:** `auth.me` (já existe, retorna usuário ou null)
- **Router:** `auth.logout` (já existe)
- **Por quê:** Estrutura mínima do tRPC para o cliente funcionar

#### 4. Context do tRPC
**Arquivo:** `server/_core/context.ts`
- **Por quê:** Necessário para criar o contexto das requisições tRPC
- **Função:** Autentica requisições (opcional) e cria contexto

#### 5. Configuração tRPC
**Arquivo:** `server/_core/trpc.ts`
- **Por quê:** Inicializa o tRPC com procedures (public, protected, admin)
- **Função:** Define a estrutura base do tRPC

#### 6. Variáveis de Ambiente
**Arquivo:** `server/_core/env.ts`
- **Por quê:** Centraliza configurações de ambiente
- **Variáveis mínimas necessárias:**
  - `PORT` (opcional, padrão 3000)
  - `EXPO_PUBLIC_API_BASE_URL` (URL do backend)

---

## ⚠️ **OPCIONAL** (Pode remover se não usar)

### Se **NÃO** usar OAuth/Manus Auth:
- ❌ `server/_core/oauth.ts` - Rotas OAuth
- ❌ `server/_core/sdk.ts` - SDK Manus
- ❌ `server/_core/cookies.ts` - Gerenciamento de cookies
- ❌ `server/db.ts` - Funções de banco de dados
- ❌ `drizzle/` - Schema e migrations do banco
- ❌ `server/_core/systemRouter.ts` - Router do sistema (usa notificações)

### Se **NÃO** usar Banco de Dados:
- ❌ `server/db.ts`
- ❌ `drizzle/schema.ts`
- ❌ `drizzle/relations.ts`
- ❌ `drizzle/migrations/`
- ❌ Dependência `mysql2` e `drizzle-orm`

### Se **NÃO** usar Storage (S3):
- ❌ `server/storage.ts`
- ❌ Variáveis: `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`

### Se **NÃO** usar IA/LLM:
- ❌ `server/_core/llm.ts`
- ❌ Variáveis relacionadas a LLM

### Se **NÃO** usar Geração de Imagens:
- ❌ `server/_core/imageGeneration.ts`

### Se **NÃO** usar Transcrição de Voz:
- ❌ `server/_core/voiceTranscription.ts`

### Se **NÃO** usar Data API:
- ❌ `server/_core/dataApi.ts`
- ❌ Variáveis: `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`

### Se **NÃO** usar Notificações:
- ❌ `server/_core/notification.ts`
- ❌ `server/_core/systemRouter.ts` (ou remover apenas `notifyOwner`)

---

## 📦 Backend Mínimo Simplificado

### Estrutura de Arquivos Mínima:

```
server/
  _core/
    index.ts          ✅ ESSENCIAL - Servidor Express
    context.ts        ✅ ESSENCIAL - Context tRPC
    trpc.ts          ✅ ESSENCIAL - Config tRPC
    env.ts           ✅ ESSENCIAL - Variáveis de ambiente
  routers.ts         ✅ ESSENCIAL - Rotas tRPC básicas
```

### Código Mínimo do `server/_core/index.ts`:

```typescript
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // CORS básico
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  // tRPC
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  const port = parseInt(process.env.PORT || "3000");
  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}

startServer().catch(console.error);
```

### Código Mínimo do `server/routers.ts`:

```typescript
import { router, publicProcedure } from "./_core/trpc";

export const appRouter = router({
  system: router({
    health: publicProcedure.query(() => ({ ok: true })),
  }),
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(() => ({ success: true })),
  }),
});

export type AppRouter = typeof appRouter;
```

### Código Mínimo do `server/_core/context.ts`:

```typescript
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: null; // Sem autenticação por padrão
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  return {
    req: opts.req,
    res: opts.res,
    user: null, // Sem autenticação
  };
}
```

### Código Mínimo do `server/_core/trpc.ts`:

```typescript
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
```

---

## 🚀 Deploy Mínimo

### Variáveis de Ambiente Necessárias:

```env
# Mínimo absoluto
PORT=3000
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Dependências do package.json (mínimas):

```json
{
  "dependencies": {
    "@trpc/server": "11.7.2",
    "express": "^4.22.1",
    "superjson": "^1.13.3",
    "dotenv": "^16.6.1"
  }
}
```

### Scripts Necessários:

```json
{
  "scripts": {
    "dev:server": "tsx watch server/_core/index.ts",
    "build": "esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

---

## 📝 Recomendações

### Para o App Atual (100% Local):

1. **Opção 1: Remover backend completamente**
   - O app funciona 100% com AsyncStorage
   - Backend não é necessário
   - Simplifica deploy e manutenção

2. **Opção 2: Manter backend mínimo**
   - Manter apenas health check e estrutura tRPC básica
   - Permite adicionar funcionalidades futuras sem refatoração
   - Custo baixo de manutenção

### Para Migração Futura (Backend Real):

Se planeja migrar para backend real no futuro, mantenha:
- ✅ Estrutura tRPC completa
- ✅ Sistema de autenticação (mesmo que não usado)
- ✅ Database schema (mesmo que vazio)
- ✅ Storage helpers (mesmo que não usado)

Isso facilita a migração gradual dos dados locais para o backend.

---

## ✅ Checklist de Produção

- [ ] Servidor Express rodando
- [ ] Health check respondendo (`/api/health`)
- [ ] tRPC endpoint funcionando (`/api/trpc`)
- [ ] CORS configurado corretamente
- [ ] Variáveis de ambiente configuradas
- [ ] Build de produção funcionando
- [ ] Porta configurável via `PORT`
- [ ] Logs básicos para debugging

---

## 🔍 Como Verificar

1. **Testar health check:**
   ```bash
   curl http://localhost:3000/api/health
   # Deve retornar: {"ok":true,"timestamp":...}
   ```

2. **Testar tRPC:**
   ```bash
   curl -X POST http://localhost:3000/api/trpc/system.health \
     -H "Content-Type: application/json" \
     -d '{}'
   ```

3. **Verificar logs:**
   - Servidor deve iniciar sem erros
   - Porta deve ser exibida nos logs

---

**Última atualização:** Baseado na análise do código em `lib/auth-context.tsx` e `lib/data-context.tsx` que mostram uso 100% local.
