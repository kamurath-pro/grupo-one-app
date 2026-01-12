# Implementações: MySQL, Notificações e Termos

## ✅ IMPLEMENTAÇÕES CONCLUÍDAS

### 1. Termos de Uso e Política de Privacidade
- ✅ Tela de Termos de Uso criada (`app/terms.tsx`)
- ✅ Tela de Política de Privacidade criada (`app/privacy.tsx`)
- ✅ Links adicionados no perfil do usuário
- ✅ Design consistente com o app
- ✅ Conteúdo completo e profissional

### 2. Notificações de Novo Cadastro
- ✅ Sistema implementado em `lib/auth-context.tsx`
- ✅ Notificação criada automaticamente quando novo usuário se cadastra
- ✅ Notificação aparece para admin/sócios
- ✅ Prevenção de duplicatas (uma notificação por cadastro por dia)
- ✅ Tipo: "system" com título "🔔 Novo cadastro pendente"

### 3. Integração com MySQL - Estrutura Criada

#### Schema Atualizado
- ✅ Campo `password` adicionado à tabela `users`
- ✅ Campo `approvalStatus` adicionado à tabela `users`
- ✅ Campo `registeredAt` adicionado à tabela `users`
- ✅ Campo `category` adicionado à tabela `posts`
- ✅ `appRole` agora inclui "admin"
- ✅ `email` marcado como único

#### Funções de Banco de Dados (`server/db.ts`)
- ✅ `createUser()` - Criar novo usuário
- ✅ `getUserByEmail()` - Buscar usuário por email
- ✅ `verifyPassword()` - Verificar senha
- ✅ `getPendingUsers()` - Listar usuários pendentes
- ✅ `approveUser()` - Aprovar usuário
- ✅ `rejectUser()` - Rejeitar usuário
- ✅ `getApprovedUsers()` - Listar usuários aprovados
- ✅ `createPost()` - Criar post
- ✅ `getPosts()` - Listar posts (com filtro por categoria)
- ✅ `likePost()` - Curtir/descurtir post
- ✅ `addPostComment()` - Adicionar comentário
- ✅ `getPostComments()` - Listar comentários de um post
- ✅ `createMessage()` - Criar mensagem
- ✅ `getConversationMessages()` - Listar mensagens de uma conversa
- ✅ `createRecognition()` - Criar reconhecimento
- ✅ `getRecognitions()` - Listar reconhecimentos

#### Rotas tRPC (`server/routers.ts`)
- ✅ `auth.register` - Cadastro de usuário
- ✅ `auth.login` - Login de usuário
- ✅ `auth.getPendingUsers` - Listar pendentes (admin/sócios)
- ✅ `auth.approveUser` - Aprovar usuário (admin/sócios)
- ✅ `auth.rejectUser` - Rejeitar usuário (admin/sócios)
- ✅ `auth.getApprovedUsers` - Listar aprovados
- ✅ `posts.create` - Criar post
- ✅ `posts.list` - Listar posts
- ✅ `posts.like` - Curtir post
- ✅ `posts.addComment` - Adicionar comentário
- ✅ `posts.getComments` - Listar comentários
- ✅ `messages.create` - Criar mensagem
- ✅ `messages.getConversation` - Listar mensagens
- ✅ `recognitions.create` - Criar reconhecimento
- ✅ `recognitions.list` - Listar reconhecimentos

## ⚠️ PRÓXIMOS PASSOS PARA ATIVAR MYSQL

### 1. Executar Migrações
```bash
pnpm db:push
```
Isso criará/atualizará as tabelas no banco de dados MySQL.

### 2. Configurar Variáveis de Ambiente
Criar arquivo `.env` ou configurar no servidor:
```env
DATABASE_URL=mysql://usuario:senha@host:porta/database
```

### 3. Migrar Dados do AsyncStorage para MySQL
- Criar script de migração
- Migrar usuários existentes
- Migrar posts existentes
- Migrar mensagens existentes
- Migrar reconhecimentos existentes

### 4. Atualizar Frontend para Usar tRPC
- Atualizar `lib/auth-context.tsx` para usar rotas tRPC
- Atualizar `lib/data-context.tsx` para usar rotas tRPC
- Manter fallback para AsyncStorage durante transição

### 5. Implementar Hash de Senhas
- Instalar `bcryptjs`: `pnpm add bcryptjs @types/bcryptjs`
- Atualizar `createUser()` para usar bcrypt
- Atualizar `verifyPassword()` para usar bcrypt
- Migrar senhas existentes

## 📝 NOTAS IMPORTANTES

### Segurança
- ⚠️ Senhas estão sendo armazenadas em texto plano temporariamente
- ⚠️ Implementar bcrypt antes de produção
- ⚠️ Validar inputs no backend
- ⚠️ Implementar rate limiting

### Compatibilidade
- ✅ Sistema funciona com AsyncStorage (atual)
- ✅ Sistema preparado para MySQL (futuro)
- ✅ Migração pode ser feita gradualmente

### Notificações
- ✅ Funcionam com AsyncStorage
- ✅ Preparadas para integração com push notifications
- ✅ Sistema de duplicatas implementado

## 🚀 COMO USAR

### Para Testar Notificações de Novo Cadastro
1. Fazer um novo cadastro
2. Login como admin ou sócio
3. Verificar notificações - deve aparecer "🔔 Novo cadastro pendente"

### Para Testar Termos e Política
1. Ir em Perfil
2. Clicar em "Termos de Uso" ou "Política de Privacidade"
3. Ver conteúdo completo

### Para Ativar MySQL
1. Configurar `DATABASE_URL`
2. Executar `pnpm db:push`
3. Atualizar frontend para usar rotas tRPC
4. Testar todas as funcionalidades

## 📊 STATUS

| Funcionalidade | Status | Observações |
|----------------|--------|-------------|
| Termos de Uso | ✅ Completo | Pronto para uso |
| Política de Privacidade | ✅ Completo | Pronto para uso |
| Notificações de Cadastro | ✅ Completo | Funcionando |
| Schema MySQL | ✅ Atualizado | Pronto para migração |
| Funções DB | ✅ Criadas | Prontas para uso |
| Rotas tRPC | ✅ Criadas | Prontas para uso |
| Frontend MySQL | ⏳ Pendente | Usa AsyncStorage ainda |
| Hash de Senhas | ⏳ Pendente | Texto plano temporário |
