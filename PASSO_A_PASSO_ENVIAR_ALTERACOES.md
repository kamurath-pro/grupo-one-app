# 📤 PASSO A PASSO COMPLETO - ENVIAR ALTERAÇÕES PARA GITHUB

**Data:** 08/01/2025

---

## 🎯 OBJETIVO

Enviar as correções (`vercel.json` e `metro.config.js`) para o GitHub, para que o Vercel possa fazer o deploy corrigido.

---

## ✅ PASSO 1: ABRIR SOURCE CONTROL NO CURSOR

### Opção A: Pelo Atalho de Teclado
1. Pressione: `Ctrl + Shift + G`
2. A barra lateral do Source Control abrirá

### Opção B: Pelo Menu
1. Clique no ícone de **Git** na barra lateral esquerda (terceiro ícone de cima para baixo)
2. É o ícone que parece uma "ramificação" ou "Y" invertido

### Opção C: Pelo Menu Superior
1. Clique em **View** no menu superior
2. Selecione **Source Control**

---

## ✅ PASSO 2: VERIFICAR ARQUIVOS MODIFICADOS

Você verá uma lista de arquivos na seção **"Changes"** ou **"Alterações"**:

Arquivos que devem aparecer:
- ✅ `vercel.json` (modificado)
- ✅ `metro.config.js` (modificado)
- ✅ Arquivos de documentação (novos ou modificados)

---

## ✅ PASSO 3: ADICIONAR ARQUIVOS AO STAGE

### Método 1: Adicionar Todos os Arquivos (Mais Rápido)
1. Você verá um botão **"+ Stage All Changes"** ou **"Stage All"**
2. Clique nele
3. Todos os arquivos serão movidos para a seção "Staged Changes"

### Método 2: Adicionar Arquivos Individualmente (Recomendado)
1. Para cada arquivo na lista:
   - `vercel.json`
   - `metro.config.js`
2. Clique no **"+"** ao lado de cada arquivo
3. O arquivo será movido para "Staged Changes"

### Verificação
- Os arquivos em "Staged Changes" aparecerão em **verde**
- Os arquivos em "Changes" aparecerão em **branco/cinza**

---

## ✅ PASSO 4: ESCREVER MENSAGEM DO COMMIT

1. No campo de texto no topo (onde diz **"Message"** ou **"Mensagem"**)
2. Digite a seguinte mensagem:

```
fix: adiciona limpeza de cache e blockList no metro config
```

Ou uma mensagem mais simples:
```
fix: corrige erro de cache no build do Vercel
```

---

## ✅ PASSO 5: FAZER COMMIT

### Opção A: Pelo Botão
1. Clique no botão **"Commit"** (ícone de ✓ ou "Commit")
2. Está localizado ao lado do campo de mensagem

### Opção B: Pelo Atalho
1. Pressione: `Ctrl + Enter`
2. O commit será feito automaticamente

### Verificação
- Você verá uma mensagem de confirmação
- Os arquivos sumirão da lista "Staged Changes"
- Aparecerá uma mensagem como: "✓ Committed" ou "Commit realizado"

---

## ✅ PASSO 6: FAZER PUSH (ENVIAR PARA GITHUB)

### Método 1: Pelo Ícone de Sincronização (Recomendado)
1. No canto **inferior esquerdo** da tela, você verá:
   - Um ícone de **setas circulares** (sincronização)
   - Ou um ícone com números (ex: "↑ 1" indicando 1 commit para enviar)
2. Clique nesse ícone
3. Aguarde alguns segundos
4. Você verá uma mensagem de confirmação

### Método 2: Pelo Menu Source Control
1. Clique nos **"..."** (três pontos) no topo da barra Source Control
2. Selecione **"Push"** no menu
3. Aguarde alguns segundos

### Método 3: Pelo Command Palette
1. Pressione: `Ctrl + Shift + P`
2. Digite: `Git: Push`
3. Pressione: `Enter`
4. Aguarde alguns segundos

---

## ✅ PASSO 7: VERIFICAR SE DEU CERTO

### No Cursor
- O ícone de sincronização deve desaparecer ou mostrar "✓"
- Você verá uma notificação de sucesso no canto inferior direito
- Aparecerá algo como: "✓ Pushed to origin/main"

### No GitHub (Opcional)
1. Acesse seu repositório no GitHub:
   - `https://github.com/kamurath-pro/grupo-one-app-2026`
2. Você verá:
   - O commit mais recente com sua mensagem
   - Os arquivos `vercel.json` e `metro.config.js` atualizados

---

## ✅ PASSO 8: AGUARDAR DEPLOY NO VERCEL

1. O Vercel detecta automaticamente mudanças no GitHub
2. Um novo deploy iniciará automaticamente (em 1-2 minutos)
3. Você pode acompanhar:
   - No painel do Vercel
   - Ou pela notificação (se tiver integração)

---

## 🎯 RESUMO VISUAL

```
1. Ctrl + Shift + G          → Abre Source Control
2. Clicar em "+"              → Adiciona arquivos ao stage
3. Escrever mensagem          → "fix: corrige erro de cache no build do Vercel"
4. Clicar em "Commit" (✓)     → Faz commit
5. Clicar em ícone de sync    → Faz push
6. Aguardar confirmação       → "✓ Pushed"
7. Aguardar deploy no Vercel  → Build automático
```

---

## ⚠️ SOLUÇÃO DE PROBLEMAS

### Problema: "Commit" está desabilitado/cinza
**Solução:** Adicione arquivos ao stage primeiro (Passo 3)

### Problema: "Push" não funciona / Erro de autenticação
**Solução:** 
1. O Cursor pode pedir autenticação
2. Siga as instruções na tela
3. Ou configure Git no terminal primeiro:
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu.email@example.com"
   ```

### Problema: Não vejo o Source Control
**Solução:**
1. Verifique se está em um repositório Git
2. Verifique se há arquivos modificados
3. Tente recarregar a janela: `Ctrl + Shift + P` → "Reload Window"

### Problema: Arquivos não aparecem
**Solução:**
1. Verifique se os arquivos foram salvos
2. Tente: `Ctrl + S` para salvar todos
3. Recarregue o Source Control

---

## ✅ CHECKLIST FINAL

- [ ] Source Control aberto (`Ctrl + Shift + G`)
- [ ] Arquivos visíveis em "Changes"
- [ ] Arquivos adicionados ao stage (clicar em "+")
- [ ] Mensagem do commit escrita
- [ ] Commit feito (✓)
- [ ] Push feito (ícone de sincronização)
- [ ] Confirmação de sucesso vista
- [ ] Deploy iniciado no Vercel (aguardar)

---

## 🎉 RESULTADO ESPERADO

Após completar todos os passos:
- ✅ Arquivos enviados para o GitHub
- ✅ Vercel detecta mudanças automaticamente
- ✅ Novo deploy inicia com as correções
- ✅ Build deve funcionar agora! 🚀

---

**Desenvolvido por:** Cursor AI Assistant  
**Data:** 08/01/2025
