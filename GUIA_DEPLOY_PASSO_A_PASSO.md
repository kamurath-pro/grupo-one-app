# 🚀 GUIA PRÁTICO - DEPLOY DO APP WEB

**Data:** 08/01/2025

---

## 📋 PASSO A PASSO COMPLETO

### PASSO 1: Gerar Build (JÁ FEITO ✅)

```bash
pnpm export:web
```

**Resultado:** Arquivos em `dist/`

---

### PASSO 2: Escolher Plataforma de Hospedagem

Escolha uma das opções abaixo:

---

## 🌐 OPÇÃO A: VERCEL (Recomendado - Mais Fácil)

### 2.1. Criar Conta
1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Faça login com GitHub (recomendado)

### 2.2. Conectar Repositório
1. No painel do Vercel, clique em "Add New Project"
2. Selecione seu repositório GitHub (`grupo-one-app`)
3. Clique em "Import"

### 2.3. Configurar Build
Na tela de configuração do projeto:

**Framework Preset:** 
- Selecione "Other" ou "Expo"

**Build Command:**
```
npx expo export --platform web
```

**Output Directory:**
```
dist
```

**Install Command:**
```
pnpm install
```

### 2.4. Configurar Variáveis de Ambiente (Opcional)
Na seção "Environment Variables", adicione:

```
EXPO_PUBLIC_API_URL = https://sua-api.com
```

(Substitua pela URL real do seu backend)

### 2.5. Deploy
1. Clique em "Deploy"
2. Aguarde 2-5 minutos
3. Pronto! ✅

### 2.6. Acessar App
- URL será: `https://grupo-one-app.vercel.app`
- Ou domínio personalizado (se configurado)

---

## 🌐 OPÇÃO B: NETLIFY

### 2.1. Criar Conta
1. Acesse: https://netlify.com
2. Clique em "Sign up"
3. Faça login com GitHub

### 2.2. Conectar Repositório
1. No painel, clique em "Add new site" → "Import an existing project"
2. Selecione seu repositório GitHub
3. Clique em "Import"

### 2.3. Configurar Build
**Build command:**
```
npx expo export --platform web
```

**Publish directory:**
```
dist
```

### 2.4. Configurar Variáveis de Ambiente
Em "Site settings" → "Environment variables":
```
EXPO_PUBLIC_API_URL = https://sua-api.com
```

### 2.5. Deploy
1. Clique em "Deploy site"
2. Aguarde o build
3. Pronto! ✅

### 2.6. Acessar App
- URL será: `https://grupo-one-app.netlify.app`
- Ou domínio personalizado

---

## 🌐 OPÇÃO C: SERVIDOR PRÓPRIO (Nginx/Apache)

### 2.1. Preparar Arquivos
```bash
# No seu computador
cd c:\Users\kamur\Downloads\grupo-one-app
pnpm export:web

# Os arquivos estão em: dist/
```

### 2.2. Enviar para Servidor
Opções:

**Opção A: FTP/SFTP**
- Use FileZilla, WinSCP ou similar
- Conecte no servidor
- Envie todo conteúdo de `dist/` para pasta do servidor (ex: `/var/www/html/`)

**Opção B: SCP (Linux/Mac)**
```bash
scp -r dist/* usuario@servidor.com:/var/www/html/
```

**Opção C: Git + Pull**
- Faça commit dos arquivos em `dist/`
- No servidor: `git pull` e copie arquivos

### 2.3. Configurar Nginx

Criar arquivo `/etc/nginx/sites-available/grupo-one-app`:

```nginx
server {
    listen 80;
    server_name app.grupoone.com;  # Seu domínio
    
    root /var/www/html;  # Caminho dos arquivos
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /_expo/static {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Ativar:
```bash
sudo ln -s /etc/nginx/sites-available/grupo-one-app /etc/nginx/sites-enabled/
sudo nginx -t  # Testar configuração
sudo systemctl reload nginx
```

### 2.4. Configurar Apache

Criar arquivo `/etc/apache2/sites-available/grupo-one-app.conf`:

```apache
<VirtualHost *:80>
    ServerName app.grupoone.com
    DocumentRoot /var/www/html
    
    <Directory /var/www/html>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Para React Router
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </IfModule>
</VirtualHost>
```

Ativar:
```bash
sudo a2ensite grupo-one-app.conf
sudo systemctl reload apache2
```

### 2.5. Configurar HTTPS (Opcional mas Recomendado)

**Com Let's Encrypt (Certbot):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d app.grupoone.com
```

---

## 📱 PASSO 3: Testar o App

### 3.1. Verificar URL
- Acesse a URL fornecida pela plataforma
- Exemplo: `https://grupo-one-app.vercel.app`

### 3.2. Testar Funcionalidades
- [ ] Login funciona?
- [ ] Feed carrega?
- [ ] Navegação entre telas?
- [ ] Imagens aparecem?
- [ ] Chat funciona?

### 3.3. Verificar Console (F12)
- Abrir DevTools (F12)
- Verificar se há erros no Console
- Verificar se API está conectada

---

## ⚙️ PASSO 4: Configurar Backend (Importante!)

### 4.1. Backend Deve Estar Acessível
Seu backend precisa estar rodando e acessível publicamente.

### 4.2. Configurar CORS no Backend
O backend precisa permitir requisições do domínio do app web.

### 4.3. Variável de Ambiente
No app web (Vercel/Netlify), configure:
```
EXPO_PUBLIC_API_URL = https://api.grupoone.com
```

---

## 🔄 PASSO 5: Atualizações Futuras

### Para Vercel/Netlify:
1. Faça alterações no código
2. Commit e push para GitHub
3. Deploy automático! ✅

### Para Servidor Próprio:
1. `pnpm export:web`
2. Enviar arquivos atualizados para servidor
3. Recarregar servidor (se necessário)

---

## 📋 CHECKLIST RÁPIDO

- [ ] Build gerado (`dist/` existe)
- [ ] Plataforma escolhida (Vercel/Netlify/Servidor)
- [ ] Repositório conectado (se Vercel/Netlify)
- [ ] Build command configurado
- [ ] Output directory configurado (`dist`)
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy executado
- [ ] URL de acesso obtida
- [ ] App testado no navegador
- [ ] Backend conectado e funcionando

---

## 🆘 PROBLEMAS COMUNS

### Build Falha
- Verifique se todas as dependências estão instaladas
- Execute `pnpm install` antes do build

### 404 nas Rotas
- Verifique configuração de rewrite (Nginx/Apache)
- Vercel/Netlify: deve configurar automaticamente

### Erro de API
- Verifique `EXPO_PUBLIC_API_URL`
- Verifique CORS no backend
- Verifique se backend está acessível

### Imagens Não Aparecem
- Verifique se assets foram copiados
- Verifique caminhos relativos

---

## 📞 PRÓXIMOS PASSOS

1. ✅ Escolher plataforma (recomendo Vercel)
2. ✅ Fazer deploy
3. ✅ Testar app
4. ✅ Compartilhar link com usuários

---

**Desenvolvido por:** Cursor AI Assistant  
**Data:** 08/01/2025
