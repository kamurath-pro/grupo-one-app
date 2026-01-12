# 📤 PASSO A PASSO - ENVIAR ALTERAÇÕES PARA GIT

**Data:** 08/01/2025

---

## 🚀 PASSO A PASSO COMPLETO

### PASSO 1: Verificar Alterações

```bash
git status
```

Isso mostra todos os arquivos modificados/criados.

---

### PASSO 2: Adicionar Arquivos ao Stage

**Opção A: Adicionar todos os arquivos:**
```bash
git add .
```

**Opção B: Adicionar arquivo específico:**
```bash
git add vercel.json
git add package.json
git add SOLUCAO_ERRO_VERCEL.md
```

---

### PASSO 3: Verificar o que será commitado

```bash
git status
```

Deve mostrar os arquivos em verde (prontos para commit).

---

### PASSO 4: Fazer Commit

```bash
git commit -m "fix: adiciona vercel.json e scripts para resolver erro de cache no build"
```

Ou use uma mensagem mais simples:
```bash
git commit -m "fix: corrige erro de build no Vercel"
```

---

### PASSO 5: Enviar para GitHub (Push)

**Se for a primeira vez:**
```bash
git push -u origin main
```

**Ou se já configurou antes:**
```bash
git push
```

**Se sua branch for `master` em vez de `main`:**
```bash
git push -u origin master
```

---

## 📋 COMANDOS RÁPIDOS (Copiar e Colar)

```bash
# 1. Ver o que mudou
git status

# 2. Adicionar tudo
git add .

# 3. Fazer commit
git commit -m "fix: corrige erro de build no Vercel"

# 4. Enviar para GitHub
git push
```

---

## ⚠️ SE DER ERRO

### Erro: "fatal: not a git repository"

Significa que você não está em um repositório Git.

**Solução:**
```bash
# Verificar se há .git na pasta
ls -la
# Ou no Windows
dir /a

# Se não houver, precisa inicializar:
git init
git remote add origin https://github.com/SEU_USUARIO/grupo-one-app.git
```

### Erro: "fatal: no upstream branch"

**Solução:**
```bash
git push -u origin main
# ou
git push -u origin master
```

### Erro: "fatal: remote origin already exists"

Tudo certo! O repositório já está configurado. Continue com `git push`.

---

## 🔍 VERIFICAR SE DEU CERTO

Após o push:

1. Acesse seu repositório no GitHub
2. Verifique se o arquivo `vercel.json` aparece
3. Se estiver conectado ao Vercel, o deploy iniciará automaticamente

---

## ✅ CHECKLIST RÁPIDO

- [ ] `git status` - Ver alterações
- [ ] `git add .` - Adicionar arquivos
- [ ] `git commit -m "mensagem"` - Fazer commit
- [ ] `git push` - Enviar para GitHub
- [ ] Verificar no GitHub se arquivos foram enviados
- [ ] Aguardar deploy no Vercel (se conectado)

---

## 🎯 RESULTADO ESPERADO

Após o push bem-sucedido:
- ✅ Arquivos no GitHub
- ✅ Vercel detecta mudanças
- ✅ Build inicia automaticamente
- ✅ Build deve funcionar agora (com vercel.json)

---

**Desenvolvido por:** Cursor AI Assistant  
**Data:** 08/01/2025
