# Instruções para Gerar APK Android via EAS Build

## ✅ Preparação Completa

O projeto está completamente configurado e pronto para gerar o APK via EAS Build.

### Configurações Aplicadas:
- ✅ `app.config.ts` criado e configurado corretamente
- ✅ `eas.json` configurado para Development Build
- ✅ `expo-dev-client` instalado e configurado
- ✅ Referências do Manus removidas
- ✅ Bundle ID limpo: `com.grupoone.app`
- ✅ Scheme de deep link: `grupo-one-app`
- ✅ `EAS_NO_VCS=1` configurado (ignora Git)

---

## 📱 Passos para Gerar o APK

### 1. Login no Expo/EAS

```bash
npx expo login
# OU
npx eas login
```

**Quando solicitado, forneça suas credenciais do Expo.**

---

### 2. Configurar o Projeto EAS (apenas primeira vez)

```bash
npx eas build:configure
```

**Quando solicitado, confirme as configurações.**

---

### 3. Gerar o APK Development Build

```bash
npx eas build --platform android --profile development
```

**Aguarde o build na nuvem (pode levar 10-20 minutos na primeira vez).**

---

### 4. Download do APK

Após o build concluir:

1. O EAS mostrará um link para download
2. Baixe o APK no celular
3. Instale diretamente (habilite "Instalar apps de fontes desconhecidas" se necessário)

---

## 🔄 Hot Reload e Desenvolvimento

### Após instalar o APK no celular:

1. **Inicie o servidor Metro:**
   ```bash
   pnpm dev:metro
   ```
   OU
   ```bash
   npx expo start --dev-client
   ```

2. **Conecte o celular:**
   - Certifique-se de que o celular está na mesma rede Wi-Fi
   - Escaneie o QR code mostrado no terminal
   - OU digite manualmente o endereço IP mostrado no terminal

3. **Hot Reload Ativo:**
   - Alterações no código serão refletidas automaticamente
   - Não precisa gerar novo APK a cada alteração

---

## 📝 Notas Importantes

### Development Build vs Production Build

- **Development Build** (perfil `development`):
  - Inclui `expo-dev-client`
  - Permite hot reload
  - Usa para desenvolvimento e testes
  - Build mais rápido

- **Production Build** (perfil `production`):
  - Otimizado para produção
  - Sem dev tools
  - Gera AAB (App Bundle) para Google Play

### EAS_NO_VCS

O projeto está configurado com `EAS_NO_VCS=1`, então o EAS Build **não usa Git**. Todas as alterações locais serão incluídas no build.

### Custos

- **Plano gratuito do Expo/EAS** permite builds suficientes para desenvolvimento
- Development builds são gratuitos no plano free

---

## 🐛 Solução de Problemas

### Build falha

1. Verifique se está logado: `npx expo whoami`
2. Verifique conexão com internet
3. Tente novamente após alguns minutos

### App não conecta ao Metro

1. Verifique se celular e computador estão na mesma rede Wi-Fi
2. Desabilite firewall temporariamente
3. Use `--lan` flag: `npx expo start --dev-client --lan`

### APK não instala

1. Habilite "Instalar apps de fontes desconhecidas" nas configurações do Android
2. Verifique se há espaço suficiente no celular
3. Desinstale versão anterior se existir

---

## ✅ Checklist Final

- [ ] Login no Expo/EAS realizado
- [ ] `npx eas build:configure` executado (primeira vez)
- [ ] Build iniciado: `npx eas build --platform android --profile development`
- [ ] APK baixado e instalado no celular
- [ ] Servidor Metro rodando: `pnpm dev:metro`
- [ ] App conectado ao Metro e hot reload funcionando

---

## 🎯 Próximos Passos

Após validar que o app funciona:
- Login ✅
- Navegação ✅
- Upload de imagem ✅

Você pode gerar um **Production Build** quando necessário:
```bash
npx eas build --platform android --profile production
```

---

**Status:** Projeto 100% pronto para EAS Build ✅
