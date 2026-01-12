# 🌐 ACESSO AO APP WEB - GRUPO ONE

**Data:** 08/01/2025

---

## 📋 INFORMAÇÕES RÁPIDAS

### Desenvolvimento Local
```bash
# Iniciar servidor
pnpm dev:metro:web

# URL de acesso
http://localhost:8081
```

### Obter URL (Script)
```bash
pnpm web:url dev
```

---

## 🚀 BUILD DE PRODUÇÃO

### Gerar Build
```bash
pnpm export:web
# ou
npx expo export:web
```

**Arquivos gerados:** `web-build/`

### Deploy

**1. Vercel (Recomendado)**
- Conectar repositório GitHub
- Build command: `npx expo export --platform web`
- Output directory: `dist`
- Deploy automático

**2. Netlify**
- Conectar repositório
- Build command: `npx expo export --platform web`
- Publish directory: `dist`
- Deploy automático

**3. Servidor Próprio**
- Copiar conteúdo de `dist/` para servidor
- Configurar Nginx/Apache para servir arquivos estáticos

---

## ⚙️ CONFIGURAÇÃO

### Variável de Ambiente

Configure `EXPO_PUBLIC_API_URL` no ambiente de produção:

```bash
EXPO_PUBLIC_API_URL=https://api.grupoone.com
```

---

## 📱 URL FINAL

Após deploy, o app estará acessível em:

- **Vercel:** `https://grupo-one-app.vercel.app`
- **Netlify:** `https://grupo-one-app.netlify.app`
- **Domínio próprio:** `https://app.grupoone.com`

---

## ✅ CHECKLIST DE DEPLOY

- [ ] Fazer build: `pnpm export:web`
- [ ] Escolher plataforma (Vercel/Netlify/Servidor)
- [ ] Configurar `EXPO_PUBLIC_API_URL`
- [ ] Fazer deploy dos arquivos `web-build/`
- [ ] Testar URL de acesso
- [ ] Compartilhar link com usuários

---

**Desenvolvido por:** Cursor AI Assistant  
**Data:** 08/01/2025
