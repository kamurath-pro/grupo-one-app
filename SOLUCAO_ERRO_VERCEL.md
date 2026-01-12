# 🔧 SOLUÇÃO: Erro de Build no Vercel

**Erro:** `Failed to get the SHA-1 for: react-native-css-interop/.cache/web.css`

---

## ✅ SOLUÇÃO 1: Configurar vercel.json (RECOMENDADO)

Crie o arquivo `vercel.json` na raiz do projeto com:

```json
{
  "buildCommand": "rm -rf .metro node_modules/.cache && pnpm install && npx expo export --platform web",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "framework": null
}
```

Isso limpa o cache antes do build.

---

## ✅ SOLUÇÃO 2: Adicionar Script no package.json

Já adicionado! Use:

```bash
pnpm build:web:clean
```

Ou no Vercel, configure:
- **Build Command:** `pnpm build:web:clean`

---

## ✅ SOLUÇÃO 3: Limpar Cache Manualmente (Local)

Se o erro ocorrer localmente:

```bash
# Limpar todos os caches
rm -rf .metro
rm -rf node_modules/.cache
rm -rf .expo
rm -rf dist

# Reinstalar dependências (opcional)
pnpm install

# Build limpo
pnpm export:web
```

---

## ✅ SOLUÇÃO 4: Configurar no Vercel (Via UI)

No painel do Vercel:

1. Vá em **Settings** → **Build & Development Settings**
2. **Build Command:** 
   ```
   rm -rf .metro node_modules/.cache && pnpm install && npx expo export --platform web
   ```
3. **Output Directory:** `dist`
4. **Install Command:** `pnpm install`
5. Salvar

---

## ✅ SOLUÇÃO 5: Adicionar .vercelignore (Opcional)

Crie `.vercelignore` para ignorar cache:

```
.metro
node_modules/.cache
.expo
*.log
```

---

## 🎯 RECOMENDAÇÃO FINAL

**Use a Solução 1** (vercel.json) - É a mais simples e funciona automaticamente.

O arquivo `vercel.json` já foi criado no projeto! ✅

---

## 📋 PRÓXIMOS PASSOS

1. ✅ Commit o arquivo `vercel.json`
2. ✅ Push para GitHub
3. ✅ Vercel vai fazer redeploy automaticamente
4. ✅ Build deve funcionar agora!

---

**Desenvolvido por:** Cursor AI Assistant  
**Data:** 08/01/2025
