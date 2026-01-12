# 📤 ENVIAR ALTERAÇÕES - PASSO A PASSO COMPLETO

**Data:** 08/01/2025

---

## ⚠️ PRIMEIRO: INSTALAR GIT (SE NECESSÁRIO)

### Como Saber se Git Está Instalado?

Abra o PowerShell ou Terminal e digite:
```bash
git --version
```

**Se aparecer um erro:** Git não está instalado.

### Instalar Git no Windows

1. **Baixar Git:**
   - Acesse: https://git-scm.com/download/win
   - Baixe e instale (próximo, próximo, finalizar)

2. **Reabrir o Terminal:**
   - Feche e abra o PowerShell/Terminal novamente
   - Digite: `git --version`
   - Deve aparecer: `git version 2.x.x`

---

## 🚀 PASSO A PASSO - ENVIAR ALTERAÇÕES

### OPÇÃO 1: Usando PowerShell/Terminal (Recomendado)

#### 1️⃣ Abrir Terminal
- Pressione `Win + X` → PowerShell
- OU abra o Terminal no VS Code/Cursor (Ctrl + `)

#### 2️⃣ Navegar até a Pasta do Projeto
```bash
cd "c:\Users\kamur\Downloads\grupo-one-app"
```

#### 3️⃣ Verificar Status
```bash
git status
```

#### 4️⃣ Adicionar Arquivos
```bash
git add .
```

#### 5️⃣ Fazer Commit
```bash
git commit -m "fix: corrige erro de build no Vercel"
```

#### 6️⃣ Enviar para GitHub
```bash
git push
```

Se for a primeira vez:
```bash
git push -u origin main
```
Ou se sua branch for `master`:
```bash
git push -u origin master
```

---

### OPÇÃO 2: Usando GitHub Desktop (Mais Fácil)

#### 1️⃣ Instalar GitHub Desktop
- Baixe: https://desktop.github.com/
- Instale e faça login com sua conta GitHub

#### 2️⃣ Adicionar Repositório
- File → Add Local Repository
- Selecione a pasta: `c:\Users\kamur\Downloads\grupo-one-app`
- Clique em "Add repository"

#### 3️⃣ Fazer Commit e Push
- No GitHub Desktop, você verá os arquivos modificados
- Escreva uma mensagem: "fix: corrige erro de build no Vercel"
- Clique em "Commit to main" (ou master)
- Clique em "Push origin"

**Pronto!** ✅

---

### OPÇÃO 3: Usando VS Code / Cursor

#### 1️⃣ Abrir o Projeto
- File → Open Folder
- Selecione: `c:\Users\kamur\Downloads\grupo-one-app`

#### 2️⃣ Abrir Source Control
- Clique no ícone de Git na barra lateral (ou Ctrl + Shift + G)

#### 3️⃣ Fazer Commit
- Você verá os arquivos modificados
- Clique no "+" ao lado de cada arquivo (ou "Stage All Changes")
- Escreva mensagem: "fix: corrige erro de build no Vercel"
- Clique em "Commit" (ícone de ✓)

#### 4️⃣ Fazer Push
- Clique nos "..." no topo da barra Source Control
- Selecione "Push"
- Ou use o ícone de sincronização (circular com setas)

---

## 📋 COMANDOS RÁPIDOS (Copiar e Colar)

Se você tem Git instalado, use estes comandos:

```bash
cd "c:\Users\kamur\Downloads\grupo-one-app"
git status
git add .
git commit -m "fix: corrige erro de build no Vercel"
git push
```

---

## 🔍 VERIFICAR SE DEU CERTO

1. Acesse seu repositório no GitHub: `https://github.com/SEU_USUARIO/grupo-one-app`
2. Verifique se o arquivo `vercel.json` aparece nos arquivos
3. Se estiver conectado ao Vercel, o deploy iniciará automaticamente

---

## ⚠️ ERROS COMUNS E SOLUÇÕES

### Erro: "git: comando não encontrado"
**Solução:** Instale o Git (veja instruções acima)

### Erro: "fatal: not a git repository"
**Solução:** 
```bash
git init
git remote add origin https://github.com/SEU_USUARIO/grupo-one-app.git
```

### Erro: "fatal: no upstream branch"
**Solução:**
```bash
git push -u origin main
```

### Erro: "Please tell me who you are"
**Solução:**
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@example.com"
```

---

## ✅ CHECKLIST FINAL

- [ ] Git instalado?
- [ ] Repositório Git inicializado?
- [ ] Arquivos adicionados (`git add .`)
- [ ] Commit feito (`git commit`)
- [ ] Push enviado (`git push`)
- [ ] Arquivos aparecem no GitHub?
- [ ] Vercel iniciou deploy automático?

---

## 🎯 RECOMENDAÇÃO

**Para iniciantes:** Use **GitHub Desktop** - É mais fácil e visual!

**Para desenvolvedores:** Use **PowerShell/Terminal** - Mais rápido!

---

**Desenvolvido por:** Cursor AI Assistant  
**Data:** 08/01/2025
