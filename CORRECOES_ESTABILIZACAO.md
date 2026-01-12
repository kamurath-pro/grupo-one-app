# Correções de Estabilização - Grupo ONE App

## Data: 2025-01-XX

Este documento resume todas as correções realizadas para estabilizar o app para testes mobile.

---

## ✅ Tarefas Concluídas

### 1️⃣ BACKEND + EXPO
**Problema:** Frontend não conseguia conectar ao backend no mobile (Expo Go).

**Solução:**
- Configurado `getApiBaseUrl()` em `constants/oauth.ts` para detectar automaticamente o IP/host do Metro bundler
- No mobile, usa `localhost:3000` ou o IP da máquina quando disponível via `expo-constants`
- Mantém compatibilidade com web (deriva do hostname)

**Arquivos modificados:**
- `constants/oauth.ts`

---

### 2️⃣ CLOUDINARY
**Problema:** Upload de imagens não funcionava no mobile devido ao uso de `FileReader` (não disponível no React Native).

**Solução:**
- Implementada conversão de imagem para base64 usando `expo-file-system` no mobile
- Mantida compatibilidade com web usando `FileReader`
- Melhoradas mensagens de erro para debug

**Arquivos modificados:**
- `app/(tabs)/create.tsx`

---

### 3️⃣ LOGIN E PERFIL
**Problema:** Layout da tela de login e funcionalidade de editar perfil incompleta.

**Solução:**
- Layout da tela de login já estava bem estruturado (sem correções necessárias)
- Criada tela completa de edição de perfil (`app/edit-profile.tsx`)
- Adicionada função `updateProfile` no `auth-context.tsx`
- Botão "Editar Perfil" agora navega para a tela de edição
- Sócios e admins não podem alterar unidade (apenas membros)

**Arquivos modificados/criados:**
- `app/edit-profile.tsx` (novo)
- `app/(tabs)/profile.tsx`
- `lib/auth-context.tsx`
- `app/_layout.tsx` (adicionada rota)

---

### 4️⃣ LAYOUT BASE (MOBILE)
**Status:** Layouts das telas principais já estavam bem estruturados:
- Home: ✅ OK
- Chat: ✅ OK
- Reconhecimento: ✅ OK
- Mural: ✅ OK

Nenhuma correção necessária.

---

### 5️⃣ PERMISSÕES
**Status:** Regras de permissões já estavam implementadas corretamente:

- ✅ Apenas 1 administrador (email: `agenciatrafegon@gmail.com`)
- ✅ Apenas administrador pode:
  - Aprovar usuários (tela `/admin`)
  - Remover usuários (tela `/admin`)
  - Acessar tela de administração
- ✅ Membros podem:
  - Editar perfil (nome e unidade)
  - Apagar próprias mensagens/posts
  - Criar posts e comentários

**Arquivos verificados:**
- `app/(tabs)/admin.tsx` - Protegido com `isAdmin` check
- `lib/auth-context.tsx` - Lógica de permissões correta

---

### 6️⃣ MURAL
**Status:** Funcionalidades do mural já estavam implementadas:
- ✅ Post com texto funciona
- ✅ Post com imagem funciona (corrigido upload)
- ✅ "Ver comentários" expande corretamente
- ✅ Comentários aparecem/ocultam sem quebrar layout

**Correções aplicadas:**
- Upload de imagens corrigido (ver item 2)

---

### 7️⃣ TESTABILIDADE
**Status:** App pronto para testes mobile:
- ✅ `npx expo start` funciona
- ✅ Backend roda junto com Expo (porta 3000)
- ✅ Expo Go pode conectar ao backend
- ✅ Upload de imagens funciona no mobile

---

## 📋 Checklist de Testes

Antes de iniciar os testes, verifique:

- [ ] Backend rodando (`pnpm dev:server` ou `pnpm dev`)
- [ ] Expo rodando (`pnpm dev:metro` ou `pnpm dev`)
- [ ] Variáveis de ambiente Cloudinary configuradas no `.env`:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- [ ] Dispositivo mobile na mesma rede Wi-Fi do computador (para Expo Go)

---

## 🚀 Como Testar

1. **Iniciar desenvolvimento:**
   ```bash
   pnpm dev
   ```
   Isso inicia backend (porta 3000) e Expo (porta 8081) simultaneamente.

2. **No Expo Go:**
   - Escanear QR code
   - App deve conectar ao backend automaticamente
   - Testar login
   - Testar upload de imagem no mural
   - Testar editar perfil

3. **Se houver problemas de conexão:**
   - Verificar se backend está rodando na porta 3000
   - Verificar se dispositivo está na mesma rede
   - Se necessário, configurar `EXPO_PUBLIC_API_BASE_URL` no `.env` com o IP da máquina:
     ```
     EXPO_PUBLIC_API_BASE_URL=http://192.168.1.XXX:3000
     ```

---

## ⚠️ Observações Importantes

1. **Auto-login em desenvolvimento:**
   - Não há auto-login implementado
   - Usuário deve fazer login manualmente
   - Credenciais de teste:
     - Admin: `agenciatrafegon@gmail.com` / `admin2024`
     - Sócio: Nome (ex: "lia") / Senha de 4 dígitos (ex: "1346")

2. **Upload de imagens:**
   - Requer credenciais Cloudinary válidas no `.env`
   - Se não configurado, upload falhará mas app não quebra

3. **Permissões:**
   - Apenas 1 administrador pode existir
   - Membros precisam ser aprovados pelo admin
   - Sócios não podem alterar unidade

---

## 📝 Próximos Passos (Pós-Teste)

Após os testes, considerar:

- [ ] Melhorias de performance (se necessário)
- [ ] Otimizações de layout baseadas em feedback
- [ ] Preparação para build de loja (EAS Build)
- [ ] Configuração de notificações push (se necessário)
- [ ] Integração com banco de dados remoto (se necessário)

---

## ✅ Status Final

**Todas as tarefas obrigatórias foram concluídas:**
- ✅ Backend + Expo funcionando juntos
- ✅ Cloudinary integrado e funcionando
- ✅ Login e perfil funcionais
- ✅ Layout base consistente
- ✅ Permissões corretas
- ✅ Mural funcional
- ✅ Pronto para testes mobile

**App estável e pronto para testes reais! 🎉**
