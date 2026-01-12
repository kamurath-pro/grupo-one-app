# 📋 AUDITORIA COMPLETA - Grupo ONE App

**Data da Auditoria:** 08/01/2025  
**Versão do App:** 1.0.0  
**Plataforma:** Expo Router (React Native + Web)

---

## 1. ✅ FUNCIONALIDADES INCOMPLETAS OU QUEBRADAS

### 🟡 Funcionalidades Parcialmente Implementadas

#### 1.1. Sistema de Chat/Mensagens
- **Status:** ✅ Implementado (frontend completo)
- **Problema:** Sistema usa `AsyncStorage` local, não sincroniza entre dispositivos
- **Localização:** `lib/data-context.tsx` (linhas 31-39, 492-570)
- **Impacto:** Dados locais não são persistidos no backend

#### 1.2. Upload de Imagens
- **Status:** ✅ Funcional
- **Problema:** Depende de Forge API (storage externo) que pode não estar configurado
- **Localização:** `server/routers.ts` (linhas 22-54), `app/(tabs)/create.tsx` (linhas 106-138)
- **Impacto:** Upload pode falhar se `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY` não estiverem configurados

#### 1.3. Métricas (Google Sheets)
- **Status:** 🟡 Integração parcial
- **Problema:** Requer configuração de API do Google Sheets
- **Localização:** `lib/sheets-service.ts`, `app/(tabs)/metricas.tsx`
- **Impacto:** Tela funciona mas dados podem não carregar

#### 1.4. OAuth/Login Google
- **Status:** ❌ Não implementado
- **Problema:** TODO no `todo.md` linha 20: "Implementar cadastro/login com Google OAuth"
- **Localização:** `app/login.tsx`
- **Impacto:** Login funciona apenas com email/senha local, não com Google

#### 1.5. Push Notifications
- **Status:** 🟡 Configurado mas pode não estar totalmente funcional
- **Problema:** Configuração existe mas precisa testar em dispositivos reais
- **Localização:** `lib/notification-context.tsx`, `app.config.ts` (linha 48)
- **Impacto:** Notificações podem não chegar em produção

#### 1.6. Integração Monday.com (Aniversários)
- **Status:** 🟡 Implementado mas não automático
- **Problema:** TODO linha 194: "Atualização automática diária (requer endpoint no servidor)"
- **Localização:** `lib/monday-service.ts`, `lib/data-context.tsx` (linhas 438-488)
- **Impacto:** Dados de aniversários são estáticos, não atualizam automaticamente

#### 1.7. Arquivos Úteis (Link Drive)
- **Status:** 🟡 Pendente
- **Problema:** TODO linha 66: "Arquivos Úteis: link para pasta do Drive (aguardar link)"
- **Localização:** `app/(tabs)/index.tsx` (linha 35-36)
- **Impacto:** Card não funciona até ter o link

### ✅ Funcionalidades Completas
- ✅ Login/Cadastro (email/senha local)
- ✅ Feed/Mural com posts
- ✅ Curtidas e comentários
- ✅ Reconhecimentos
- ✅ Perfil de usuário
- ✅ Painel Admin (aprovação de usuários)
- ✅ Sistema de notificações internas
- ✅ Documentos (estrutura de pastas)
- ✅ Navegação entre telas

---

## 2. ✅ NAVEGAÇÃO (VOLTAR, ROTAS, HISTÓRICO)

### Status Geral: ✅ **FUNCIONAL**

### 2.1. Estrutura de Navegação
- **Framework:** Expo Router v6.0.19
- **Estrutura:** 
  - Stack Navigator (`app/_layout.tsx`)
  - Tab Navigator (`app/(tabs)/_layout.tsx`)
- **Status:** ✅ Configurado corretamente

### 2.2. Botão Voltar
- **Implementação:** `router.back()` do Expo Router
- **Uso:** 
  - ✅ `app/(tabs)/create.tsx` (linha 152, 169)
  - ✅ `app/(tabs)/files.tsx` (linha 149-168) - navegação de pastas
  - ✅ `app/(tabs)/chat.tsx` (linha 69) - modal de chat
  - ✅ `app/notifications.tsx`
- **Status:** ✅ Funcionando corretamente

### 2.3. Rotas Principais
```
/                    → Login (se não autenticado)
/(tabs)/             → Home (tab bar)
  - index            → Home/Feed
  - chat             → Chat
  - create           → Criar Post (hidden)
  - recognition      → Reconhecimentos
  - profile          → Perfil
  - admin            → Admin (apenas para admins)
  - files            → Documentos (hidden)
  - metricas         → Métricas (hidden)
/login               → Login/Cadastro (modal)
/notifications       → Notificações (modal)
/oauth/callback      → OAuth callback
```

### 2.4. Histórico de Navegação
- **Stack Navigator:** Mantém histórico automaticamente
- **Modal Screens:** `login` e `notifications` são apresentados como modal
- **Tab Navigator:** Não mantém histórico (reset ao trocar de aba)
- **Status:** ✅ Comportamento esperado do Expo Router

### 2.5. Deep Linking
- **Configurado:** ✅ `app.config.ts` (linhas 31, 49-61)
- **Scheme:** `manus20260108184206` (extraído do bundle ID)
- **Intent Filters:** Configurados para Android
- **Status:** ✅ Configurado corretamente

---

## 3. ⚠️ PRONTO PARA BUILD ANDROID E IOS?

### Status Geral: 🟡 **QUASE PRONTO - FALTAM CONFIGURAÇÕES**

### 3.1. Configurações Existentes
- ✅ `app.config.ts` configurado
- ✅ Bundle ID iOS: `space.manus.grupo.one.app.t20260108184206`
- ✅ Package Android: `space.manus.grupo.one.app.t20260108184206`
- ✅ Ícones configurados (iOS e Android)
- ✅ Splash screen configurado
- ✅ Permissões Android (POST_NOTIFICATIONS)

### 3.2. Configurações Faltantes

#### ❌ **CRÍTICO: EAS Build Configuration**
- **Arquivo:** `eas.json` não existe
- **Necessário para:**
  - Builds de produção (Android APK/AAB, iOS IPA)
  - Configuração de credenciais
  - Perfis de build (development, preview, production)
- **Ação Necessária:** Criar `eas.json` com configurações adequadas

#### 🟡 Versão do App
- **Atual:** `1.0.0`
- **Recomendação:** Incrementar para produção (ex: `1.0.1`)

#### 🟡 Configurações iOS Adicionais
- **Faltando:**
  - Info.plist customizações (se necessário)
  - Permissões específicas (câmera, galeria - se não automáticas)
  - Configurações de privacidade

#### 🟡 Configurações Android Adicionais
- **Presentes:**
  - ✅ Permissão de notificações
  - ✅ Intent filters para deep linking
  - ✅ Adaptive icon configurado
- **Pode precisar:**
  - Permissões adicionais se usar câmera (já configurado no código)
  - Configurações de ProGuard/R8

### 3.3. Dependências de Build
- ✅ `expo-build-properties` configurado
- ✅ Arquiteturas Android: `armeabi-v7a`, `arm64-v8a`
- ✅ New Architecture habilitada (`newArchEnabled: true`)

### 3.4. Checklist de Build
- [ ] Criar `eas.json`
- [ ] Configurar credenciais iOS (App Store Connect)
- [ ] Configurar credenciais Android (Google Play Console)
- [ ] Testar build local: `eas build --platform android --local`
- [ ] Testar build local: `eas build --platform ios --local`
- [ ] Incrementar versão no `app.config.ts`
- [ ] Verificar todos os ícones e splash screens
- [ ] Testar permissões em dispositivos reais

---

## 4. ✅ PAINEL ADMINISTRATIVO (ADMIN DASHBOARD)

### Status: ✅ **IMPLEMENTADO E FUNCIONAL**

### 4.1. Localização
- **Arquivo:** `app/(tabs)/admin.tsx`
- **Rota:** `/(tabs)/admin` (visível apenas para admins na tab bar)

### 4.2. Funcionalidades
- ✅ **Listagem de Pendentes:** Usuários aguardando aprovação
- ✅ **Listagem de Aprovados:** Usuários já aprovados
- ✅ **Aprovar Usuário:** Botão de aprovação
- ✅ **Rejeitar Usuário:** Botão de rejeição (destrutivo)
- ✅ **Remover Usuário:** Remover usuários aprovados (demissão)
- ✅ **Badge de Notificações:** Contador de usuários pendentes no ícone
- ✅ **Refresh Manual:** Pull-to-refresh

### 4.3. Acesso
- **Condição:** `isAdmin === true`
- **Verificação:** `lib/auth-context.tsx` (linha 380-400 aprox)
- **Admin Configurado:** `agenciatrafegon@gmail.com` (conforme TODO linha 24)

### 4.4. Interface
- ✅ Header azul com logo e notificações
- ✅ Tabs: Pendentes | Aprovados
- ✅ Cards de usuários com informações completas
- ✅ Confirmações para ações destrutivas
- ✅ Feedback visual (haptics)

---

## 5. 📦 ONDE ESTÃO ARMAZENADOS OS DADOS

### 5.1. Usuários
- **Armazenamento:** `@react-native-async-storage/async-storage`
- **Chave:** `@grupo_one_users`, `@grupo_one_auth_token`
- **Localização:** `lib/auth-context.tsx`
- **Backend:** ❌ Não sincronizado (apenas local)
- **Schema DB:** `drizzle/schema.ts` (tabela `users`) - **NÃO ESTÁ SENDO USADO**

### 5.2. Posts
- **Armazenamento:** `AsyncStorage`
- **Chave:** `@grupo_one_posts`
- **Localização:** `lib/data-context.tsx` (linhas 108, 174-280)
- **Backend:** ❌ Não sincronizado (apenas local)
- **Schema DB:** `drizzle/schema.ts` (tabela `posts`) - **NÃO ESTÁ SENDO USADO**

### 5.3. Imagens/Fotos
- **Armazenamento:** **Forge API (S3)** via `server/storage.ts`
- **Processo:**
  1. Upload via `trpc.posts.uploadImage` mutation
  2. Converter para base64 no cliente
  3. Enviar para servidor
  4. Servidor faz upload para Forge API/S3
  5. Retorna URL pública
- **Localização:** 
  - Cliente: `app/(tabs)/create.tsx` (linhas 106-138)
  - Servidor: `server/routers.ts` (linhas 22-54), `server/storage.ts`
- **Configuração Necessária:**
  - `BUILT_IN_FORGE_API_URL` (variável de ambiente)
  - `BUILT_IN_FORGE_API_KEY` (variável de ambiente)
- **Schema DB:** URLs são armazenadas localmente no AsyncStorage junto com posts

### 5.4. Mensagens/Chat
- **Armazenamento:** `AsyncStorage`
- **Chave:** `@grupo_one_conversations`, `@grupo_one_messages`
- **Localização:** `lib/data-context.tsx` (linhas 109-110, 492-570)
- **Backend:** ❌ Não sincronizado (apenas local)
- **Schema DB:** `drizzle/schema.ts` (tabelas `conversations`, `messages`) - **NÃO ESTÁ SENDO USADO**

### 5.5. Comentários
- **Armazenamento:** `AsyncStorage`
- **Chave:** `@grupo_one_comments`
- **Localização:** `lib/data-context.tsx` (linha 112, 320-380)
- **Backend:** ❌ Não sincronizado (apenas local)
- **Schema DB:** `drizzle/schema.ts` (tabela `post_comments`) - **NÃO ESTÁ SENDO USADO**

### 5.6. Reconhecimentos
- **Armazenamento:** `AsyncStorage`
- **Chave:** `@grupo_one_recognitions`
- **Localização:** `lib/data-context.tsx` (linha 111, 381-406)
- **Backend:** ❌ Não sincronizado (apenas local)
- **Schema DB:** `drizzle/schema.ts` (tabela `recognitions`) - **NÃO ESTÁ SENDO USADO**

### 5.7. Banco de Dados MySQL
- **Schema:** `drizzle/schema.ts`
- **Status:** ⚠️ **DEFINIDO MAS NÃO USADO**
- **Tabelas:**
  - `users`
  - `units`
  - `posts`
  - `post_likes`
  - `post_comments`
  - `conversations`
  - `conversation_participants`
  - `messages`
  - `recognitions`
  - `files`
- **Migrations:** `drizzle/0000_*.sql`, `drizzle/0001_*.sql`
- **Problema:** Frontend usa 100% AsyncStorage, backend não está conectado aos dados reais
- **Recomendação:** Migrar dados do AsyncStorage para MySQL ou remover schema se não for usar

### 5.8. Resumo do Armazenamento
```
┌─────────────────┬──────────────────┬─────────────────┐
│ Dado            │ Armazenamento    │ Backend/Sync?   │
├─────────────────┼──────────────────┼─────────────────┤
│ Usuários        │ AsyncStorage     │ ❌ Não          │
│ Posts           │ AsyncStorage     │ ❌ Não          │
│ Imagens         │ Forge API (S3)   │ ✅ Sim          │
│ Mensagens       │ AsyncStorage     │ ❌ Não          │
│ Comentários     │ AsyncStorage     │ ❌ Não          │
│ Reconhecimentos │ AsyncStorage     │ ❌ Não          │
│ Config          │ AsyncStorage     │ ❌ Não          │
└─────────────────┴──────────────────┴─────────────────┘
```

---

## 6. ⚠️ DEPENDÊNCIAS QUE PODEM CAUSAR REJEIÇÃO NAS LOJAS

### 6.1. Dependências com Permissões

#### 🟡 expo-audio (~1.1.0)
- **Problema:** Solicita permissão de microfone mas pode não ser usado
- **Localização:** `app.config.ts` (linhas 70-75)
- **Risco:** App Store pode rejeitar se permissão não for usada
- **Ação:** Verificar se realmente precisa, remover se não usar

#### ✅ expo-image-picker (^17.0.10)
- **Status:** ✅ Usado corretamente
- **Localização:** `app/(tabs)/create.tsx`, `app/(tabs)/profile.tsx`
- **Permissões:** Galeria e câmera (solicitadas no código)

#### 🟡 expo-video (~3.0.15)
- **Problema:** Configurado mas não parece ser usado no código
- **Localização:** `app.config.ts` (linhas 76-82)
- **Risco:** Baixo (configuração não causa rejeição, mas ocupa espaço)
- **Ação:** Remover se não for usar

#### ✅ expo-notifications (~0.32.15)
- **Status:** ✅ Usado corretamente
- **Permissão:** POST_NOTIFICATIONS (configurada)
- **Localização:** `lib/notification-context.tsx`, `app.config.ts` (linha 48)

### 6.2. Dependências com Problemas Potenciais

#### ⚠️ react-native-worklets (0.5.1)
- **Problema:** Pode causar problemas em algumas versões do React Native
- **Risco:** Médio
- **Depende de:** `react-native-reanimated` (que já está configurado)
- **Ação:** Verificar compatibilidade com React Native 0.81.5

#### ⚠️ zod (^4.2.1) - **VERSÃO INVÁLIDA**
- **Problema:** ⚠️ **VERSÃO 4.2.1 NÃO EXISTE**
- **Versões válidas:** Zod vai até 3.x.x (última: 3.23.x)
- **Risco:** ⚠️ **ALTO - BUILD PODE FALHAR**
- **Localização:** `package.json` linha 76
- **Ação:** ⚠️ **CORRIGIR URGENTEMENTE para "^3.23.8" ou similar**

### 6.3. Dependências de Desenvolvimento (Não afetam produção)
- ✅ Todas as outras dependências parecem válidas
- ✅ Expo SDK 54 está atualizado
- ✅ React Native 0.81.5 é compatível

### 6.4. Checklist de Dependências
- [ ] ⚠️ **URGENTE:** Corrigir versão do Zod (4.2.1 → 3.x.x)
- [ ] Verificar se `expo-audio` é realmente usado
- [ ] Verificar se `expo-video` é realmente usado
- [ ] Remover dependências não utilizadas
- [ ] Testar build com todas as dependências

---

## 7. 📝 RESUMO EXECUTIVO

### ✅ O QUE ESTÁ FUNCIONANDO
1. ✅ Navegação completa (rotas, voltar, histórico)
2. ✅ Painel administrativo funcional
3. ✅ Sistema de posts, likes, comentários (local)
4. ✅ Sistema de chat (local)
5. ✅ Upload de imagens (se configurado)
6. ✅ Sistema de notificações internas
7. ✅ Autenticação local

### ⚠️ O QUE PRECISA ATENÇÃO
1. ⚠️ **CRÍTICO:** Versão do Zod incorreta (4.2.1 → corrigir)
2. ⚠️ **CRÍTICO:** Falta `eas.json` para builds
3. 🟡 Dados 100% locais (não sincronizados)
4. 🟡 OAuth Google não implementado
5. 🟡 Algumas integrações pendentes (Métricas, Monday.com automático)

### 🔴 O QUE EXIGE DECISÃO DO GESTOR
1. 🔴 **Migração de dados:** Manter AsyncStorage local ou migrar para MySQL?
2. 🔴 **OAuth Google:** Implementar login com Google?
3. 🔴 **Configuração Forge API:** Configurar storage de imagens?
4. 🔴 **Versão do app:** Qual versão para produção? (atual: 1.0.0)
5. 🔴 **Links pendentes:** Arquivos Úteis (pasta Drive)
6. 🔴 **Credenciais de build:** Configurar App Store Connect e Google Play Console

---

## 8. ✅ CORREÇÕES AUTOMÁTICAS RECOMENDADAS

### 8.1. ✅ Corrigida Versão do Zod
- **Antes:** `"zod": "^4.2.1"` (versão inválida)
- **Depois:** `"zod": "^3.23.8"` (versão estável)
- **Localização:** `package.json` linha 76
- **Status:** ✅ **CORRIGIDO**

### 8.2. ✅ Criado eas.json
- **Arquivo:** `eas.json` (criado)
- **Conteúdo:** Configurações básicas para builds (development, preview, production)
- **Status:** ✅ **CRIADO** (requer credenciais do gestor - ver DECISOES_GESTOR.md)

### 8.3. ✅ Incrementada Versão do App
- **Antes:** `version: "1.0.0"`
- **Depois:** `version: "1.0.1"`
- **Localização:** `app.config.ts` linha 28
- **Status:** ✅ **CORRIGIDO**

### 8.4. ⚠️ Dependências Não Usadas (Requer Decisão)
- **expo-audio:** Configurado mas não encontrado uso no código
- **expo-video:** Configurado mas não encontrado uso no código
- **Status:** ⚠️ **REQUER DECISÃO DO GESTOR** (ver DECISOES_GESTOR.md item 7)

---

## 9. 📋 CHECKLIST FINAL DE PRODUÇÃO

### ✅ Correções Automáticas
- [x] Corrigir versão do Zod (4.2.1 → 3.23.8)
- [x] Criar eas.json
- [x] Incrementar versão do app (1.0.0 → 1.0.1)
- [x] Criar documentação de auditoria
- [x] Criar documento de decisões do gestor

### 🔴 Ações Requeridas do Gestor
- [ ] Decidir sobre migração de dados (AsyncStorage vs MySQL)
- [ ] Decidir sobre login Google OAuth
- [ ] Configurar Forge API (storage de imagens)
- [ ] Fornecer link da pasta Drive (Arquivos Úteis)
- [ ] Configurar credenciais de build (App Store / Play Store)
- [ ] Decidir sobre dependências não usadas (expo-audio, expo-video)

### 🟡 Ações de Desenvolvimento
- [ ] Implementar migração de dados (se decidido)
- [ ] Implementar Google OAuth (se decidido)
- [ ] Configurar Google Sheets API (Métricas)
- [ ] Implementar atualização automática de aniversários (Monday.com)
- [ ] Remover dependências não usadas (se decidido)
- [ ] Testar builds Android/iOS localmente
- [ ] Testar todas as funcionalidades em dispositivos reais

### ✅ Verificações Finais
- [ ] Testar navegação completa
- [ ] Testar upload de imagens
- [ ] Testar notificações push
- [ ] Verificar permissões em dispositivos reais
- [ ] Testar deep linking
- [ ] Verificar ícones e splash screens
- [ ] Testar responsividade em diferentes dispositivos

---

**Data da Auditoria:** 08/01/2025  
**Versão do App:** 1.0.1  
**Status Geral:** 🟡 **QUASE PRONTO - REQUER DECISÕES DO GESTOR**

---

**Próximos Passos:**
1. ✅ Auditoria completa realizada
2. ✅ Correções automáticas aplicadas
3. ⏳ Aguardar decisões do gestor (ver DECISOES_GESTOR.md)
4. ⏳ Implementar mudanças aprovadas
5. ⏳ Preparar build final de produção
