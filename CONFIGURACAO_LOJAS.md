# 🏪 CONFIGURAÇÃO PARA APP STORE E PLAY STORE

## ✅ CORREÇÕES APLICADAS PARA EVITAR REJEIÇÃO

### 1. ✅ Permissões Não Utilizadas Removidas

**Problema Identificado:**
- `expo-audio` estava configurado mas **não é usado** no código
- `expo-video` estava configurado mas **não é usado** no código
- Isso pode causar **rejeição nas lojas** se permissões forem solicitadas sem uso

**Correção Aplicada:**
- ✅ Removidos plugins `expo-audio` e `expo-video` do `app.config.ts`
- ✅ Dependências mantidas no `package.json` (podem ser usadas no futuro)
- ✅ Sem permissões desnecessárias sendo solicitadas

**Status:** ✅ **CORRIGIDO - Pronto para publicação**

---

### 2. ✅ Cloudinary - Sem Conflitos

**Configuração Atual:**
- ✅ Cloudinary configurado apenas no **backend** (`server/cloudinary-storage.ts`)
- ✅ **Não interfere** com configurações do app
- ✅ **Não adiciona permissões** ao app
- ✅ **Não afeta** publicação nas lojas
- ✅ Usa apenas variáveis de ambiente no servidor

**Variáveis Necessárias (apenas no servidor):**
```env
CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret
```

**Status:** ✅ **SEM CONFLITOS - Pronto para uso**

---

### 3. ✅ Permissões Configuradas Corretamente

**Permissões Ativas:**
- ✅ `POST_NOTIFICATIONS` (Android) - **Justificada** (app usa notificações)
- ✅ Câmera/Galeria - **Solicitadas dinamicamente** quando necessário (ImagePicker)
- ✅ Internet - **Automática** (não precisa declarar)

**Permissões Removidas:**
- ✅ Microfone - **Removida** (expo-audio não usado)
- ✅ Vídeo em background - **Removida** (expo-video não usado)

**Status:** ✅ **OTIMIZADO - Apenas permissões necessárias**

---

## 📋 CHECKLIST PARA PUBLICAÇÃO

### Apple App Store
- ✅ Bundle ID configurado: `com.grupoone.app`
- ✅ Ícones configurados
- ✅ Splash screen configurado
- ✅ Permissões justificadas
- ✅ Sem permissões não utilizadas
- ⏳ Credenciais de publicação (App Store Connect)

### Google Play Store
- ✅ Package name configurado: `com.grupoone.app`
- ✅ Ícones adaptativos configurados
- ✅ Permissões justificadas
- ✅ Intent filters configurados
- ✅ Sem permissões não utilizadas
- ⏳ Credenciais de publicação (Google Play Console)

---

## 🔒 CREDENCIAIS DO ADMIN

### Login do Painel Administrativo
- **Email:** `agenciatrafegon@gmail.com`
- **Senha:** `admin2024`
- **Nome:** Kamurath
- **Papel:** Administrador

**Documento completo:** Ver `CREDENCIAIS_ADMIN.md`

---

## ⚠️ IMPORTANTE - ANTES DE PUBLICAR

### 1. Verificar Permissões
- ✅ Apenas `POST_NOTIFICATIONS` declarada (justificada)
- ✅ Câmera/Galeria solicitadas dinamicamente (OK)
- ✅ Sem permissões não utilizadas

### 2. Verificar Cloudinary
- ✅ Configurado apenas no backend
- ✅ Não adiciona permissões ao app
- ✅ Não interfere com publicação
- ✅ Variáveis de ambiente no servidor apenas

### 3. Verificar Dependências
- ✅ `expo-audio` e `expo-video` no package.json mas **sem plugins ativos**
- ✅ Não solicitam permissões desnecessárias
- ✅ Podem ser removidas do package.json se não forem usadas no futuro

### 4. Configurações de Build
- ✅ `eas.json` configurado
- ✅ Bundle IDs únicos
- ✅ Versão: 1.0.1
- ⏳ Credenciais de publicação necessárias

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ **Concluído:** Remover permissões não utilizadas
2. ✅ **Concluído:** Verificar conflitos com Cloudinary
3. ⏳ **Pendente:** Configurar credenciais de publicação (App Store/Play Store)
4. ⏳ **Pendente:** Testar build de produção
5. ⏳ **Pendente:** Submeter para revisão

---

## ✅ CONCLUSÃO

- ✅ **Sem conflitos** com Cloudinary
- ✅ **Sem permissões** não utilizadas
- ✅ **Pronto para publicação** nas lojas
- ✅ **Credenciais do admin** documentadas

O app está configurado corretamente e não deve ter problemas de rejeição relacionados a permissões ou conflitos com Cloudinary.
