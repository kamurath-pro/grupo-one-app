# 🔐 CREDENCIAIS DO PAINEL ADMINISTRATIVO

## 👤 ADMINISTRADOR PRINCIPAL (Fritz/Kamurath)

### Credenciais de Acesso
- **Email:** `agenciatrafegon@gmail.com`
- **Senha:** `admin2024`
- **Nome:** Kamurath
- **Papel:** Administrador (admin)
- **Acesso:** Total (aprovar/rejeitar usuários, gerenciar sistema)

---

## 📍 ONDE USAR

### Login no App
1. Abrir app
2. Selecionar "Colaborador(a)" no tipo de acesso
3. Inserir email: `agenciatrafegon@gmail.com`
4. Inserir senha: `admin2024`
5. Clicar em "Entrar"

### Funcionalidades Disponíveis
- ✅ Aprovar/rejeitar novos cadastros
- ✅ Gerenciar usuários aprovados
- ✅ Remover usuários do sistema
- ✅ Ver todos os cadastros pendentes
- ✅ Acesso completo ao sistema

---

## 🔒 SEGURANÇA

### ⚠️ IMPORTANTE
- **NÃO compartilhar** estas credenciais publicamente
- **NÃO commitar** no Git
- **Alterar senha** antes de produção se necessário
- **Usar apenas** para testes e administração

### Recomendações
- Manter senha segura
- Não usar em ambientes públicos
- Considerar autenticação de dois fatores no futuro

---

## 📝 NOTAS

### Localização no Código
- **Arquivo:** `lib/auth-context.tsx`
- **Linha:** ~232-236
- **Constante:** `ADMIN_CONFIG`

### Alteração de Senha
Para alterar a senha do admin, editar `lib/auth-context.tsx`:
```typescript
const ADMIN_CONFIG = {
  email: "agenciatrafegon@gmail.com",
  password: "admin2024", // Alterar aqui
  name: "Kamurath",
};
```

---

## ✅ STATUS

- ✅ Credenciais configuradas
- ✅ Login funcionando
- ✅ Painel admin acessível
- ✅ Todas as funcionalidades ativas
