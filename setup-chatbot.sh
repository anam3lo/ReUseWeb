#!/bin/bash

# 🤖 ReUse Chatbot Setup Script
# Script para configurar o chatbot Node-RED na plataforma ReUse

echo "🤖 Configurando Chatbot ReUse..."
echo "=================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar Node.js
echo -e "${BLUE}📋 Verificando pré-requisitos...${NC}"
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js encontrado: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js não encontrado. Instale Node.js 18+ primeiro.${NC}"
    exit 1
fi

# Verificar npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm encontrado: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm não encontrado.${NC}"
    exit 1
fi

# Instalar Node-RED globalmente
echo -e "${BLUE}📦 Instalando Node-RED...${NC}"
if command_exists node-red; then
    echo -e "${GREEN}✅ Node-RED já está instalado${NC}"
else
    echo -e "${YELLOW}⏳ Instalando Node-RED...${NC}"
    npm install -g node-red
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Node-RED instalado com sucesso${NC}"
    else
        echo -e "${RED}❌ Erro ao instalar Node-RED${NC}"
        exit 1
    fi
fi

# Instalar node-red-admin (opcional)
echo -e "${BLUE}📦 Instalando node-red-admin...${NC}"
npm install -g node-red-admin 2>/dev/null || echo -e "${YELLOW}⚠️  node-red-admin não instalado (opcional)${NC}"

# Criar diretório para dados do Node-RED
echo -e "${BLUE}📁 Criando estrutura de diretórios...${NC}"
mkdir -p node-red-data
mkdir -p logs

# Copiar arquivo de configuração
if [ -f "package-node-red.json" ]; then
    cp package-node-red.json node-red-data/package.json
    echo -e "${GREEN}✅ Configuração copiada${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo package-node-red.json não encontrado${NC}"
fi

# Verificar se o fluxo existe
if [ -f "node-red-chatbot-flow.json" ]; then
    echo -e "${GREEN}✅ Fluxo do chatbot encontrado${NC}"
else
    echo -e "${RED}❌ Arquivo node-red-chatbot-flow.json não encontrado${NC}"
    exit 1
fi

# Criar script de inicialização
echo -e "${BLUE}📝 Criando script de inicialização...${NC}"
cat > start-chatbot.sh << 'EOF'
#!/bin/bash

echo "🤖 Iniciando Chatbot ReUse..."
echo "=============================="

# Verificar se Node-RED está rodando
if pgrep -f "node-red" > /dev/null; then
    echo "⚠️  Node-RED já está rodando"
    echo "Acesse: http://localhost:1880"
    exit 0
fi

# Iniciar Node-RED
echo "🚀 Iniciando Node-RED..."
node-red --userDir ./node-red-data

EOF

chmod +x start-chatbot.sh
echo -e "${GREEN}✅ Script de inicialização criado${NC}"

# Criar script de importação do fluxo
echo -e "${BLUE}📝 Criando script de importação...${NC}"
cat > import-flow.sh << 'EOF'
#!/bin/bash

echo "📥 Importando fluxo do chatbot..."

# Verificar se Node-RED está rodando
if ! pgrep -f "node-red" > /dev/null; then
    echo "❌ Node-RED não está rodando. Execute: ./start-chatbot.sh"
    exit 1
fi

# Aguardar Node-RED inicializar
echo "⏳ Aguardando Node-RED inicializar..."
sleep 5

# Importar fluxo via API
echo "📥 Importando fluxo..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d @node-red-chatbot-flow.json \
  http://localhost:1880/flows 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Fluxo importado com sucesso!"
    echo "🌐 Acesse: http://localhost:1880"
    echo "🤖 Teste o chatbot em: http://localhost:3000/products/new"
else
    echo "❌ Erro ao importar fluxo"
    echo "💡 Importe manualmente em: http://localhost:1880"
fi

EOF

chmod +x import-flow.sh
echo -e "${GREEN}✅ Script de importação criado${NC}"

# Criar arquivo de configuração de ambiente
echo -e "${BLUE}📝 Criando configuração de ambiente...${NC}"
cat > .env.chatbot << 'EOF'
# Configuração do Chatbot ReUse
NODE_RED_URL=http://localhost:1880
NODE_RED_ADMIN_USER=admin
NODE_RED_ADMIN_PASSWORD=admin123
CHATBOT_ENABLED=true
CHATBOT_LOG_LEVEL=info
EOF

echo -e "${GREEN}✅ Configuração de ambiente criada${NC}"

# Instruções finais
echo ""
echo -e "${GREEN}🎉 Configuração concluída!${NC}"
echo "================================"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo ""
echo "1. ${YELLOW}Iniciar Node-RED:${NC}"
echo "   ./start-chatbot.sh"
echo ""
echo "2. ${YELLOW}Importar fluxo do chatbot:${NC}"
echo "   ./import-flow.sh"
echo ""
echo "3. ${YELLOW}Acessar Node-RED:${NC}"
echo "   http://localhost:1880"
echo "   Usuário: admin"
echo "   Senha: admin123"
echo ""
echo "4. ${YELLOW}Testar chatbot:${NC}"
echo "   http://localhost:3000/products/new"
echo "   Clique no botão 'Assistente'"
echo ""
echo -e "${BLUE}📚 Documentação:${NC}"
echo "   CHATBOT_DOCUMENTATION.md"
echo ""
echo -e "${GREEN}✅ Setup concluído!${NC}"
echo ""
