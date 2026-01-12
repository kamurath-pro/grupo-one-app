# 🔴 DECISÕES NECESSÁRIAS DO GESTOR

Este documento lista as decisões que **EXIGEM** atenção e aprovação do gestor antes de prosseguir com a publicação do aplicativo.

---

## 1. 🔴 MIGRAÇÃO DE DADOS: AsyncStorage vs MySQL

### Situação Atual
- ✅ Todos os dados estão armazenados **localmente** no dispositivo (AsyncStorage)
- ❌ Backend MySQL existe mas **não está sendo usado**
- ❌ Schema do banco de dados está definido mas **desconectado** do frontend

### Problemas
- Dados **não sincronizam** entre dispositivos
- Dados **perdidos** se o usuário desinstalar o app
- **Sem backup** de dados
- **Sem histórico** centralizado

### Opções

#### Opção A: Manter AsyncStorage (Status Quo)
- ✅ **Prós:**
  - Funciona imediatamente
  - Sem necessidade de servidor/banco de dados
  - Menor custo de infraestrutura
  - Dados privados no dispositivo
- ❌ **Contras:**
  - Dados não sincronizam entre dispositivos
  - Dados perdidos ao desinstalar
  - Sem backup
  - Não escalável

#### Opção B: Migrar para MySQL (Recomendado)
- ✅ **Prós:**
  - Dados sincronizam entre dispositivos
  - Backup automático
  - Histórico centralizado
  - Escalável
  - Análises e relatórios possíveis
- ❌ **Contras:**
  - Requer servidor/banco de dados em produção
  - Requer desenvolvimento (migração de código)
  - Custo de infraestrutura
  - Requer tempo de desenvolvimento (estimado: 2-4 semanas)

### ⚠️ RECOMENDAÇÃO
**Migrar para MySQL** para garantir sincronização e backup dos dados.

### ❓ DECISÃO NECESSÁRIA
- [ ] Manter AsyncStorage (local apenas)
- [ ] Migrar para MySQL (sincronização)

---

## 2. 🔴 LOGIN COM GOOGLE OAUTH

### Situação Atual
- ✅ Login com email/senha **local** funciona
- ❌ Login com Google OAuth **não implementado**
- 📝 TODO no código: "Implementar cadastro/login com Google OAuth"

### Problemas
- Usuários precisam criar senha manualmente
- Não aproveita integração com Google Workspace
- Experiência menos fluida

### Opções

#### Opção A: Manter Apenas Email/Senha
- ✅ **Prós:**
  - Já funciona
  - Sem dependência externa
  - Controle total
- ❌ **Contras:**
  - Menos conveniente para usuários
  - Gerenciamento de senhas manual

#### Opção B: Implementar Google OAuth
- ✅ **Prós:**
  - Login mais rápido/conveniente
  - Integração com Google Workspace
  - Sem necessidade de gerenciar senhas
  - Melhor experiência do usuário
- ❌ **Contras:**
  - Requer configuração Google Cloud Console
  - Requer desenvolvimento (estimado: 1 semana)
  - Dependência externa

### ⚠️ RECOMENDAÇÃO
**Implementar Google OAuth** para melhorar a experiência do usuário.

### ❓ DECISÃO NECESSÁRIA
- [ ] Manter apenas email/senha
- [ ] Implementar Google OAuth (tempo estimado: 1 semana)

---

## 3. 🔴 CONFIGURAÇÃO FORGE API (STORAGE DE IMAGENS)

### Situação Atual
- ✅ Upload de imagens **implementado** no código
- ❌ Configuração **não está definida** (variáveis de ambiente faltando)
- ⚠️ Upload **falhará** se não configurado

### Variáveis Necessárias
```env
BUILT_IN_FORGE_API_URL=https://...
BUILT_IN_FORGE_API_KEY=...
```

### Problemas
- Upload de imagens **não funcionará** sem configuração
- Posts com imagens **falharão** em produção

### Opções

#### Opção A: Configurar Forge API
- ✅ **Prós:**
  - Upload de imagens funcionará
  - Storage escalável
  - URLs públicas
- ❌ **Contras:**
  - Requer conta/serviço Forge API
  - Custo do serviço
  - Configuração necessária

#### Opção B: Usar Storage Alternativo
- ✅ **Prós:**
  - Pode ser mais barato
  - Mais controle
- ❌ **Contras:**
  - Requer desenvolvimento
  - Requer infraestrutura própria

#### Opção C: Desabilitar Upload de Imagens
- ✅ **Prós:**
  - Sem custos adicionais
  - Simplifica deploy
- ❌ **Contras:**
  - Funcionalidade reduzida
  - Pior experiência do usuário

### ⚠️ RECOMENDAÇÃO
**Configurar Forge API** para habilitar upload de imagens (já está implementado no código).

### ❓ DECISÃO NECESSÁRIA
- [ ] Configurar Forge API (fornecer URL e API Key)
- [ ] Usar storage alternativo (especificar qual)
- [ ] Desabilitar upload de imagens (temporariamente)

---

## 4. 🔴 VERSÃO DO APP PARA PRODUÇÃO

### Situação Atual
- ✅ Versão atual: **1.0.1** (acabou de ser incrementada de 1.0.0)
- 📱 App Store: Requer versão definida
- 📱 Play Store: Requer versão definida

### Próximas Versões Sugeridas
- **1.0.1** - Versão inicial de produção (atual)
- **1.0.2** - Correções de bugs menores
- **1.1.0** - Novas funcionalidades menores
- **2.0.0** - Mudanças significativas

### ⚠️ RECOMENDAÇÃO
**1.0.1** está adequada para primeira versão de produção.

### ❓ DECISÃO NECESSÁRIA
- [ ] Manter versão 1.0.1 (atual)
- [ ] Alterar para: ________

---

## 5. 🔴 LINKS E INTEGRAÇÕES PENDENTES

### 5.1. Arquivos Úteis (Pasta Drive)
- **Status:** 🟡 Pendente (TODO no código)
- **Localização:** `app/(tabs)/index.tsx` (card "Arquivos Úteis")
- **Problema:** Card não funciona até ter o link da pasta do Google Drive
- **Ação Necessária:** Fornecer link da pasta do Google Drive

### 5.2. Métricas (Google Sheets)
- **Status:** 🟡 Integração parcial
- **Localização:** `lib/sheets-service.ts`, `app/(tabs)/metricas.tsx`
- **Problema:** Requer configuração de API do Google Sheets
- **Ação Necessária:** 
  - Configurar Google Sheets API
  - Fornecer credenciais/access tokens

### 5.3. Aniversários (Monday.com)
- **Status:** 🟡 Dados estáticos
- **Localização:** `lib/data-context.tsx`, `lib/monday-service.ts`
- **Problema:** Dados não atualizam automaticamente
- **Ação Necessária:**
  - Implementar endpoint no servidor para atualização diária
  - Configurar cron job (tempo estimado: 1 semana)

### ❓ DECISÕES NECESSÁRIAS
- [ ] **Arquivos Úteis:** Fornecer link da pasta Drive: _______________
- [ ] **Métricas:** Configurar Google Sheets API (sim/não)
- [ ] **Aniversários:** Implementar atualização automática (sim/não)

---

## 6. 🔴 CREDENCIAIS DE BUILD (APP STORE / PLAY STORE)

### 6.1. App Store Connect (iOS)
- **Status:** ❌ Não configurado
- **Arquivo:** `eas.json` (criado, mas precisa credenciais)
- **Ações Necessárias:**
  - Criar conta App Store Connect
  - Criar App ID
  - Configurar certificados de desenvolvimento/produção
  - Configurar perfis de provisionamento
  - Atualizar `eas.json` com credenciais

### 6.2. Google Play Console (Android)
- **Status:** ❌ Não configurado
- **Arquivo:** `eas.json` (criado, mas precisa credenciais)
- **Ações Necessárias:**
  - Criar conta Google Play Console
  - Criar aplicativo
  - Gerar chave de assinatura
  - Configurar Service Account (para upload automático)
  - Atualizar `eas.json` com credenciais

### ❓ DECISÕES NECESSÁRIAS
- [ ] **iOS:** Configurar App Store Connect
  - Apple ID: _______________
  - App ID: _______________
  - Team ID: _______________
- [ ] **Android:** Configurar Google Play Console
  - Service Account Key: _______________
  - Track inicial: internal / production

---

## 7. 🔴 DEPENDÊNCIAS NÃO UTILIZADAS

### 7.1. expo-audio (~1.1.0)
- **Status:** ⚠️ Configurado mas **não encontrado uso no código**
- **Problema:** Solicita permissão de microfone mas pode não ser usado
- **Risco:** App Store pode rejeitar se permissão não for justificada
- **Localização:** `app.config.ts` (linhas 70-75)

### 7.2. expo-video (~3.0.15)
- **Status:** ⚠️ Configurado mas **não encontrado uso no código**
- **Problema:** Ocupa espaço no bundle sem necessidade
- **Risco:** Baixo (apenas aumenta tamanho do app)
- **Localização:** `app.config.ts` (linhas 76-82)

### Opções
- **Opção A:** Remover se não for usar (recomendado)
- **Opção B:** Manter para uso futuro

### ❓ DECISÃO NECESSÁRIA
- [ ] **expo-audio:** Remover (não usado) / Manter (uso futuro)
- [ ] **expo-video:** Remover (não usado) / Manter (uso futuro)

---

## 📋 RESUMO DAS DECISÕES

| # | Decisão | Prioridade | Tempo Estimado |
|---|---------|------------|----------------|
| 1 | Migração de dados (AsyncStorage vs MySQL) | 🔴 Alta | 2-4 semanas |
| 2 | Login Google OAuth | 🟡 Média | 1 semana |
| 3 | Configuração Forge API | 🔴 Alta | Imediato |
| 4 | Versão do app | 🟢 Baixa | - |
| 5 | Links/Integrações pendentes | 🟡 Média | Varia |
| 6 | Credenciais de build | 🔴 Alta | 1-2 dias |
| 7 | Dependências não usadas | 🟢 Baixa | 1 hora |

---

## ✅ DECISÕES JÁ CORRIGIDAS AUTOMATICAMENTE

1. ✅ **Versão do Zod corrigida** (4.2.1 → 3.23.8)
2. ✅ **EAS config criado** (`eas.json`)
3. ✅ **Versão do app incrementada** (1.0.0 → 1.0.1)

---

**Data:** 08/01/2025  
**Próxima Revisão:** Após decisões do gestor
