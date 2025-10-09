# 🔧 Sistema de Modo de Manutenção - ReUseWeb

## Visão Geral

Este sistema permite controlar o modo de manutenção da aplicação ReUseWeb através de um painel externo (Node-RED) ou interface web, redirecionando usuários para uma página personalizada durante manutenções.

## 🏗️ Arquitetura

### Banco de Dados
- **Modelo Config**: Armazena configurações do sistema
  - `maintenanceMode`: Boolean (ativo/inativo)
  - `maintenanceMessage`: Mensagem personalizada para usuários
  - `createdAt/updatedAt`: Timestamps

### Middleware
- Intercepta todas as requisições
- Verifica status do modo de manutenção
- Redireciona para `/maintenance` quando ativo
- Exceções: APIs, páginas de auth, assets estáticos

### APIs
- `GET /api/maintenance`: Status atual
- `PUT /api/maintenance`: Atualizar configuração
- `POST /api/maintenance/control`: Controle externo (Node-RED)
- `GET /api/maintenance/panel`: Interface web de controle

## 🚀 Como Usar

### 1. Configuração Inicial

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npm run db:generate

# Aplicar migrações
npm run db:push

# Executar seed (cria configuração inicial)
npm run db:seed
```

### 2. Variáveis de Ambiente

Adicione ao `.env`:

```env
# API Key para controle externo (opcional)
MAINTENANCE_API_KEY=sua-chave-secreta-aqui
```

### 3. Controle via API

#### Ativar Modo de Manutenção
```bash
curl -X POST http://localhost:3000/api/maintenance/control \
  -H "Content-Type: application/json" \
  -d '{
    "maintenanceMode": true,
    "maintenanceMessage": "Sistema em manutenção. Voltaremos em 2 horas!",
    "apiKey": "sua-chave-secreta-aqui"
  }'
```

#### Desativar Modo de Manutenção
```bash
curl -X POST http://localhost:3000/api/maintenance/control \
  -H "Content-Type: application/json" \
  -d '{
    "maintenanceMode": false,
    "apiKey": "sua-chave-secreta-aqui"
  }'
```

#### Verificar Status
```bash
curl http://localhost:3000/api/maintenance
```

### 4. Interface Web de Controle

Acesse: `http://localhost:3000/api/maintenance/panel`

**Funcionalidades:**
- ✅ Visualizar status atual
- 🔴 Ativar/Desativar manutenção
- ✏️ Editar mensagem personalizada
- 📊 Log de atividades
- 🔄 Auto-refresh a cada 30s

### 5. Integração com Node-RED

#### Fluxo HTTP Request
```json
{
  "method": "POST",
  "url": "http://localhost:3000/api/maintenance/control",
  "headers": {
    "Content-Type": "application/json"
  },
  "payload": {
    "maintenanceMode": true,
    "maintenanceMessage": "{{msg.message}}",
    "apiKey": "sua-chave-secreta-aqui"
  }
}
```

#### Exemplo de Flow Node-RED
```json
[
  {
    "id": "maintenance-toggle",
    "type": "http request",
    "method": "POST",
    "url": "http://localhost:3000/api/maintenance/control",
    "headers": {
      "Content-Type": "application/json"
    },
    "payload": "{\"maintenanceMode\":{{msg.payload}},\"apiKey\":\"sua-chave\"}"
  }
]
```

## 🎨 Personalização

### Página de Manutenção
Edite `src/app/maintenance/page.tsx` para personalizar:
- Design e cores
- Mensagens
- Ícones e imagens
- Comportamento de auto-refresh

### Mensagens Personalizadas
- Suporte a HTML básico
- Emojis e formatação
- Mensagens multilíngues

## 🔒 Segurança

### API Key (Recomendado)
```env
MAINTENANCE_API_KEY=chave-super-secreta-123
```

### Controle de Acesso
- APIs protegidas por chave
- Logs de auditoria
- Validação de dados

## 📊 Monitoramento

### Logs
- Todas as alterações são logadas
- Timestamps automáticos
- Rastreamento de origem (API/Web)

### Status em Tempo Real
- Auto-refresh na interface
- WebSocket (futuro)
- Notificações push (futuro)

## 🚨 Troubleshooting

### Problemas Comuns

1. **Middleware não funciona**
   - Verificar se `src/middleware.ts` está correto
   - Reiniciar servidor Next.js

2. **API retorna erro 500**
   - Verificar conexão com banco
   - Executar `npm run db:generate`

3. **Página de manutenção não carrega**
   - Verificar se `/maintenance` está acessível
   - Checar console do navegador

### Debug

```bash
# Verificar status do banco
npm run db:studio

# Logs detalhados
DEBUG=* npm run dev

# Testar API
curl -v http://localhost:3000/api/maintenance
```

## 🔄 Fluxo de Funcionamento

1. **Usuário acessa site** → Middleware verifica status
2. **Modo ativo** → Redireciona para `/maintenance`
3. **Modo inativo** → Continua normalmente
4. **Admin ativa manutenção** → Todos usuários redirecionados
5. **Admin desativa** → Sistema volta ao normal

## 📈 Próximas Funcionalidades

- [ ] Agendamento automático de manutenção
- [ ] Notificações por email/SMS
- [ ] Métricas de uso durante manutenção
- [ ] Modo de manutenção por seções
- [ ] Integração com Slack/Discord
- [ ] Dashboard avançado com gráficos

## 🤝 Contribuição

Para contribuir com melhorias:
1. Fork o projeto
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste thoroughly
5. Submeta um PR

---

**Desenvolvido para ReUseWeb** - Sistema de Reutilização Sustentável
