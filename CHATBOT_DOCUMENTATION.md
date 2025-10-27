# 🤖 Chatbot ReUse - Documentação Completa

## 📋 Visão Geral

O chatbot ReUse é um assistente conversacional desenvolvido em Node-RED que orienta usuários no processo de cadastro de produtos na plataforma ReUse. O sistema é modular, expansível e integrado diretamente com a aplicação web Next.js.

## 🏗️ Arquitetura do Sistema

### Componentes Principais

1. **Node-RED Flow** (`node-red-chatbot-flow.json`)
   - Fluxo conversacional estruturado
   - Lógica de navegação entre passos
   - Sistema de logs e monitoramento

2. **API Next.js** (`src/app/api/chatbot/help/route.ts`)
   - Endpoint para integração com Node-RED
   - Fallback local quando Node-RED não disponível
   - Proxy para requisições externas

3. **Componente React** (`src/components/Chatbot.tsx`)
   - Interface de usuário do chatbot
   - Integração com a aplicação web
   - Suporte a botões interativos

4. **Integração na Página** (`src/app/products/new/page.tsx`)
   - Botão para abrir o assistente
   - Contexto específico para cadastro de produtos

## 🔄 Fluxo Conversacional

### Estrutura dos Passos

```
1. Boas-vindas (welcome)
   ↓
2. Passo 1: Título (step_1)
   ↓
3. Passo 2: Categoria (step_2)
   ↓
4. Passo 3: Descrição (step_3)
   ↓
5. Passo 4: Imagem (step_4)
   ↓
6. Passo 5: Finalização (step_5)
```

### Ações Disponíveis

- **Próximo passo** (`next_step`) - Avança para o próximo passo
- **Voltar** (`go_back`) - Retorna ao passo anterior
- **Repetir** (`repeat_step`) - Repete o passo atual
- **Finalizar** (`finish`) - Encerra o tutorial
- **Ajuda geral** (`general_help`) - Informações sobre a plataforma

## 🛠️ Configuração e Instalação

### Pré-requisitos

1. **Node-RED** instalado e configurado
2. **Node.js** (versão 18+)
3. **Aplicação ReUse** rodando

### Passo 1: Configurar Node-RED

1. Instale o Node-RED:
```bash
npm install -g node-red
```

2. Inicie o Node-RED:
```bash
node-red
```

3. Acesse: `http://localhost:1880`

### Passo 2: Importar o Fluxo

1. No Node-RED, vá em **Menu > Import**
2. Cole o conteúdo do arquivo `node-red-chatbot-flow.json`
3. Clique em **Import**
4. Clique em **Deploy** para ativar o fluxo

### Passo 3: Configurar Variáveis de Ambiente

Adicione ao arquivo `.env.local`:

```env
# Node-RED Configuration
NODE_RED_URL=http://localhost:1880
```

### Passo 4: Testar a Integração

1. Inicie a aplicação Next.js:
```bash
npm run dev
```

2. Acesse: `http://localhost:3000/products/new`
3. Clique no botão "Assistente"
4. Teste o fluxo conversacional

## 📡 Endpoints da API

### GET `/api/chatbot/help`

Retorna informações sobre o chatbot e suas capacidades.

**Resposta:**
```json
{
  "chatbot": {
    "name": "ReUse Assistant",
    "version": "1.0.0",
    "description": "Assistente para orientação de cadastro de produtos",
    "capabilities": [...],
    "endpoints": {...},
    "steps": [...]
  },
  "platform": {...},
  "integration": {...}
}
```

### POST `/api/chatbot/help`

Processa mensagens do usuário e retorna respostas do chatbot.

**Request:**
```json
{
  "message": "texto da mensagem",
  "buttonValue": "valor do botão clicado",
  "sessionId": "id da sessão",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "type": "message",
  "content": "Conteúdo da resposta",
  "buttons": [
    { "text": "Texto do botão", "value": "valor" }
  ],
  "step": "step_1",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Funcionalidades Detalhadas

### 1. Sistema de Navegação

O chatbot utiliza um sistema de estados para controlar o fluxo conversacional:

- **Estado atual** armazenado em `msg.payload.step`
- **Ações** determinadas por `msg.payload.action`
- **Roteamento** baseado em switches condicionais

### 2. Botões Interativos

Cada mensagem pode incluir botões que permitem:

- Navegação rápida entre passos
- Ações específicas (repetir, voltar, finalizar)
- Integração com a interface web

### 3. Sistema de Logs

Todas as interações são registradas com:

- **Timestamp** preciso
- **Session ID** único
- **Passo atual** do tutorial
- **Tipo de mensagem**
- **Informações do usuário** (IP, User-Agent)

### 4. Fallback Local

Quando o Node-RED não está disponível, a API Next.js fornece:

- Respostas básicas do chatbot
- Informações sobre a plataforma
- Orientação para configuração

## 🎨 Personalização e Expansão

### Adicionando Novos Passos

1. **No Node-RED:**
   - Crie um novo nó de função para o passo
   - Adicione regras no switch de roteamento
   - Configure botões de navegação

2. **Na API Next.js:**
   - Atualize a lista de steps no endpoint GET
   - Adicione lógica de fallback se necessário

### Adicionando Novas Funcionalidades

1. **Criar novo fluxo** no Node-RED
2. **Adicionar endpoint** na API Next.js
3. **Integrar componente** React se necessário

### Personalizando Mensagens

As mensagens são definidas nos nós de função do Node-RED. Para personalizar:

1. Edite o conteúdo em `msg.payload.content`
2. Ajuste os botões em `msg.payload.buttons`
3. Configure o step em `msg.payload.step`

## 📊 Monitoramento e Logs

### Logs do Node-RED

Os logs são exibidos no console do Node-RED com formato:

```
🤖 CHATBOT INTERACTION: {
  "timestamp": "2024-01-01T00:00:00.000Z",
  "sessionId": "session_1234567890_abc123",
  "step": "step_1",
  "message": "Conteúdo da mensagem",
  "type": "message",
  "userAgent": "Mozilla/5.0...",
  "ip": "127.0.0.1"
}
```

### Logs da Aplicação

A aplicação Next.js registra:

- Erros de integração com Node-RED
- Requisições para a API do chatbot
- Fallbacks utilizados

## 🚀 Deploy e Produção

### Configuração de Produção

1. **Node-RED:**
   - Configure autenticação
   - Use HTTPS
   - Configure logs persistentes

2. **Next.js:**
   - Configure variáveis de ambiente
   - Use proxy reverso se necessário
   - Configure monitoramento

### Variáveis de Ambiente

```env
# Produção
NODE_RED_URL=https://node-red.yourdomain.com
NODE_RED_API_KEY=your-api-key
CHATBOT_ENABLED=true
```

## 🔒 Segurança

### Considerações de Segurança

1. **Validação de entrada** em todos os endpoints
2. **Rate limiting** para prevenir spam
3. **Sanitização** de mensagens do usuário
4. **Logs seguros** sem dados sensíveis

### Autenticação

- Integração com sistema de autenticação da ReUse
- Sessões seguras com IDs únicos
- Validação de origem das requisições

## 🐛 Troubleshooting

### Problemas Comuns

1. **Node-RED não responde:**
   - Verifique se está rodando na porta 1880
   - Confirme se o fluxo foi deployado
   - Verifique logs do Node-RED

2. **API não conecta:**
   - Verifique variável `NODE_RED_URL`
   - Teste conectividade manual
   - Verifique CORS se necessário

3. **Chatbot não abre:**
   - Verifique se o componente foi importado
   - Confirme se o estado está sendo gerenciado
   - Verifique console do navegador

### Logs de Debug

Para debug detalhado, adicione logs nos nós do Node-RED:

```javascript
console.log('Debug:', JSON.stringify(msg.payload, null, 2));
```

## 📈 Métricas e Analytics

### Métricas Disponíveis

- **Sessões iniciadas** por dia
- **Passos completados** por usuário
- **Taxa de abandono** por passo
- **Tempo médio** de interação
- **Botões mais clicados**

### Implementação de Analytics

1. **No Node-RED:** Adicione nós de analytics
2. **Na API:** Implemente tracking de eventos
3. **No Frontend:** Configure Google Analytics

## 🔮 Roadmap e Melhorias

### Funcionalidades Futuras

1. **IA Integrada:**
   - Respostas mais inteligentes
   - Aprendizado com interações
   - Sugestões personalizadas

2. **Multilíngue:**
   - Suporte a múltiplos idiomas
   - Tradução automática
   - Localização cultural

3. **Integração Avançada:**
   - Webhooks para eventos
   - API GraphQL
   - Real-time com WebSockets

4. **Analytics Avançados:**
   - Dashboard de métricas
   - Relatórios automáticos
   - Insights de comportamento

---

## 📞 Suporte

Para dúvidas ou problemas:

- **Documentação:** Este arquivo
- **Issues:** GitHub da ReUse
- **Email:** suporte@reuse.com.br

---

**Desenvolvido com ❤️ para a plataforma ReUse**
