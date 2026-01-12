# 🌐 ACESSO AO APP WEB - Grupo ONE

**Data:** 08/01/2025

---

## 📋 RESUMO

Este documento explica como acessar o app web do Grupo ONE em diferentes cenários (desenvolvimento, produção).

---

## 🚀 DESENVOLVIMENTO LOCAL

### 1. Iniciar o Servidor

Execute o comando para iniciar o app em modo desenvolvimento:

```bash
pnpm dev
```

Ou apenas o servidor web:

```bash
pnpm dev:metro:web
```

### 2. Acessar Localmente

O app estará disponível em:

```
http://localhost:8081
```

**Nota:** Certifique-se de que a porta 8081 está disponível.

---

## 🌍 ACESSO EM REDE LOCAL (LAN)

### 1. Iniciar com Acesso de Rede

```bash
npx expo start --web --lan
```

### 2. Acessar de Outros Dispositivos

O Expo mostrará no terminal algo como:

```
Web is waiting on http://192.168.1.100:8081
```

Acesse de qualquer dispositivo na mesma rede usando:
```
http://192.168.1.100:8081
```

**Importante:** Substitua `192.168.1.100` pelo IP mostrado no seu terminal.

---

## 📦 BUILD PARA PRODUÇÃO (ESTÁTICO)

### 1. Build Estático do App Web

Para gerar uma versão estática do app que pode ser hospedada em qualquer servidor:

```bash
npx expo export:web
```

Isso criará uma pasta `web-build/` com os arquivos estáticos.

### 2. Opções de Hospedagem

#### Opção A: Deploy Manual
1. Faça upload da pasta `web-build/` para seu servidor web
2. Configure o servidor para servir os arquivos estáticos
3. Acesse via URL do servidor

#### Opção B: Vercel (Recomendado)
```bash
npx vercel --prod
```

#### Opção C: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=web-build
```

#### Opção D: GitHub Pages
1. Faça push da pasta `web-build/` para branch `gh-pages`
2. Ative GitHub Pages nas configurações do repositório

---

## 🔗 LINK PÚBLICO COM EXPO (TUNNEL)

### 1. Usar Tunnel do Expo

Para gerar um link público temporário (útil para testes rápidos):

```bash
npx expo start --web --tunnel
```

O Expo gerará um link público como:
```
https://exp.host/@seu-usuario/grupo-one-app
```

**Limitações:**
- Link temporário (válido enquanto o servidor estiver rodando)
- Pode ser mais lento que acesso direto
- Ideal apenas para testes

---

## 🌐 DEPLOY EM PRODUÇÃO

### Configuração Recomendada

1. **Backend:**
   - Deploy do servidor backend (porta 3000)
   - Configurar variável `EXPO_PUBLIC_API_URL` apontando para o backend

2. **Frontend:**
   - Build estático: `npx expo export:web`
   - Deploy em servidor estático (Vercel, Netlify, etc.)
   - Configurar domínio personalizado

### Exemplo de Deploy Completo

#### Backend (servidor Node.js)
```bash
# Build do servidor
pnpm build

# Iniciar servidor
NODE_ENV=production pnpm start
```

#### Frontend (Vercel)
```bash
# Build estático
npx expo export:web

# Deploy
npx vercel --prod
```

---

## 🔧 CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE

### Para Produção

Crie um arquivo `.env.production` ou configure no serviço de deploy:

```env
EXPO_PUBLIC_API_URL=https://api.grupoone.com
```

### Para Desenvolvimento

O app detecta automaticamente a URL do backend baseado no hostname atual.

---

## 📱 ACESSO VIA QR CODE (MOBILE)

Para acesso rápido no celular durante desenvolvimento:

1. Execute: `npx expo start --web --lan`
2. Abra o QR code no terminal
3. Escaneie com a câmera do celular
4. O link abrirá no navegador mobile

---

## ✅ CHECKLIST PARA PRODUÇÃO

Antes de fazer deploy em produção, verifique:

- [ ] Build estático gerado (`npx expo export:web`)
- [ ] Variável `EXPO_PUBLIC_API_URL` configurada
- [ ] Backend rodando e acessível
- [ ] Domínio configurado (se necessário)
- [ ] HTTPS habilitado (recomendado)
- [ ] Testado em diferentes navegadores
- [ ] Testado em diferentes dispositivos

---

## 🆘 SOLUÇÃO DE PROBLEMAS

### App não carrega
- Verifique se o servidor está rodando
- Verifique se a porta está correta (8081 para web)
- Verifique firewall/antivírus

### Backend não conecta
- Verifique se o backend está rodando
- Verifique `EXPO_PUBLIC_API_URL` se em produção
- Verifique CORS no backend

### Imagens não carregam
- Verifique se Cloudinary está configurado
- Verifique URLs das imagens no console do navegador

---

## 📝 NOTAS IMPORTANTES

1. **Desenvolvimento:** Use `pnpm dev` para desenvolvimento completo (frontend + backend)

2. **Produção:** Use build estático + servidor backend separado

3. **Segurança:** Sempre use HTTPS em produção

4. **Performance:** Build estático é mais rápido que desenvolvimento server

---

**Desenvolvido por:** Cursor AI Assistant  
**Data:** 08/01/2025
