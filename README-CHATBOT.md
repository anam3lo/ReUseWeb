# 🤖 Chatbot ReUse - Guia Rápido

## 🚀 Início Rápido

### 1. Configuração Automática
```bash
# Execute o script de setup
chmod +x setup-chatbot.sh
./setup-chatbot.sh
```

### 2. Iniciar o Sistema
```bash
# Terminal 1: Iniciar Node-RED
./start-chatbot.sh

# Terminal 2: Iniciar aplicação Next.js
npm run dev

# Terminal 3: Importar fluxo (após Node-RED iniciar)
./import-flow.sh
```

### 3. Acessar e Testar
- **Node-RED:** http://localhost:1880 (admin/admin123)
- **Aplicação:** http://localhost:3000/products/new
- **Chatbot:** Clique no botão "Assistente" na página de cadastro

## 📋 Funcionalidades Implementadas

### ✅ Fluxo Conversacional Completo
- **5 passos estruturados** para cadastro de produtos
- **Navegação intuitiva** com botões interativos
- **Sistema de logs** com timestamp e sessão

### ✅ Integração Web
- **API REST** em Next.js (`/api/chatbot/help`)
- **Componente React** responsivo e moderno
- **Fallback local** quando Node-RED não disponível

### ✅ Recursos Avançados
- **Botões interativos** (Próximo, Voltar, Repetir, Finalizar)
- **Sistema de sessões** únicas por usuário
- **Logs detalhados** de todas as interações
- **Design responsivo** para mobile e desktop

## 🎯 Passos do Tutorial

1. **📝 Título** - Orientações sobre nomes descritivos
2. **🏷️ Categoria** - Explicação das 8 categorias disponíveis
3. **📄 Descrição** - Dicas para descrições detalhadas
4. **📸 Imagem** - Orientações sobre upload e qualidade
5. **🎉 Finalização** - Resumo e próximos passos

## 🔧 Arquivos Criados

```
├── node-red-chatbot-flow.json     # Fluxo completo do Node-RED
├── src/app/api/chatbot/help/      # API endpoint
├── src/components/Chatbot.tsx     # Componente React
├── setup-chatbot.sh               # Script de configuração
├── package-node-red.json           # Configuração Node-RED
├── CHATBOT_DOCUMENTATION.md       # Documentação completa
└── README-CHATBOT.md              # Este arquivo
```

## 🛠️ Configuração Manual

### Node-RED
1. Instalar: `npm install -g node-red`
2. Iniciar: `node-red`
3. Acessar: http://localhost:1880
4. Importar: `node-red-chatbot-flow.json`

### Next.js
1. Adicionar ao `.env.local`:
```env
NODE_RED_URL=http://localhost:1880
```

2. O endpoint `/api/chatbot/help` já está configurado
3. O componente `Chatbot` já está integrado na página de produtos

## 📊 Monitoramento

### Logs do Node-RED
```bash
# Ver logs em tempo real
tail -f node-red-data/node-red.log
```

### Logs da Aplicação
```bash
# Ver logs do Next.js
npm run dev
```

## 🔍 Testando o Sistema

### Teste Manual
1. Abra http://localhost:3000/products/new
2. Clique em "Assistente"
3. Siga o tutorial passo a passo
4. Teste todos os botões de navegação

### Teste via API
```bash
# Testar endpoint
curl -X GET http://localhost:3000/api/chatbot/help

# Testar chatbot
curl -X POST http://localhost:3000/api/chatbot/help \
  -H "Content-Type: application/json" \
  -d '{"message": "iniciar", "sessionId": "test123"}'
```

## 🚨 Troubleshooting

### Node-RED não inicia
```bash
# Verificar se porta 1880 está livre
netstat -tulpn | grep 1880

# Iniciar com debug
DEBUG=* node-red
```

### API não conecta
```bash
# Verificar variável de ambiente
echo $NODE_RED_URL

# Testar conectividade
curl http://localhost:1880
```

### Chatbot não abre
- Verificar console do navegador (F12)
- Confirmar se componente foi importado
- Verificar se estado está sendo gerenciado

## 🔮 Próximas Melhorias

- [ ] **IA Integrada** - Respostas mais inteligentes
- [ ] **Multilíngue** - Suporte a múltiplos idiomas  
- [ ] **Analytics** - Dashboard de métricas
- [ ] **Webhooks** - Integração com eventos externos
- [ ] **Mobile App** - Versão para aplicativo

## 📞 Suporte

- **Documentação:** `CHATBOT_DOCUMENTATION.md`
- **Issues:** GitHub da ReUse
- **Email:** suporte@reuse.com.br

---

**🎉 Chatbot ReUse implementado com sucesso!**

*Desenvolvido com ❤️ para promover sustentabilidade e facilitar o uso da plataforma ReUse.*
