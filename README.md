# 🌱 ReUse - Plataforma de Reutilização

Uma plataforma web moderna para conectar pessoas e promover a reutilização de itens, reduzindo o desperdício e criando uma comunidade mais sustentável.

## ✨ Funcionalidades

- 🔐 **Autenticação completa** - Login e cadastro de usuários
- 📦 **Catálogo de produtos** - Visualize e pesquise itens disponíveis
- ➕ **Anúncio de produtos** - Publique seus itens para reutilização
- 💬 **Sistema de mensagens** - Converse com outros usuários sobre produtos
- 📱 **Interface responsiva** - Funciona perfeitamente em desktop e mobile
- 🎨 **Design moderno** - Interface limpa e intuitiva

## 🚀 Como Testar a Aplicação

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** (vem com o Node.js)
- **Git** (para clonar o repositório)

### Passo 1: Clonar o Repositório

```bash
# Clone o repositório
git clone https://github.com/anam3lo/ReUseWeb.git

# Entre na pasta do projeto
cd reuse-web
```

### Passo 2: Instalar Dependências

```bash
# Instalar todas as dependências
npm install
```

### Passo 3: Configurar Variáveis de Ambiente

```bash
# Copiar o arquivo de exemplo
copy env.example .env
```

**Importante**: O arquivo `.env` já está configurado com um banco de dados de exemplo. Se quiser usar seu próprio banco, edite as variáveis no arquivo `.env`.

### Passo 4: Configurar o Banco de Dados

```bash
# Gerar o cliente Prisma
npx prisma generate

# Sincronizar o banco de dados
npx prisma db push

# (Opcional) Popular com dados de exemplo
npm run db:seed
```

### Passo 5: Iniciar a Aplicação

```bash
# Iniciar em modo de desenvolvimento
npm run dev
```

### Passo 6: Acessar a Aplicação

Abra seu navegador e acesse: **http://localhost:3000**

## 🎯 Como Testar as Funcionalidades

### 1. **Criar uma Conta**
- Clique em "Cadastrar" no canto superior direito
- Preencha seus dados (nome, email, senha)
- Após criar a conta, você será redirecionado para o login

### 2. **Fazer Login**
- Use o email e senha que você criou
- Após o login, você será redirecionado automaticamente para a página inicial

### 3. **Explorar Produtos**
- Na página inicial, veja os "Produtos Recentes"
- Clique em "Ver Produtos" para ver todos os itens disponíveis
- Use a barra de pesquisa e filtros para encontrar produtos específicos

### 4. **Anunciar um Produto**
- Clique em "Anunciar Produto" (disponível após login)
- Preencha as informações do produto:
  - Título
  - Descrição
  - Categoria
  - Imagem (URL ou upload)
- Clique em "Criar Produto"

### 5. **Testar o Sistema de Mensagens**
- Vá para a página "Chat" no menu
- Clique em um produto para iniciar uma conversa
- Envie mensagens para o dono do produto

### 6. **Acessar o Dashboard**
- Clique em "Dashboard" para ver:
  - Seus produtos anunciados
  - Mensagens recebidas
  - Estatísticas da sua conta

## 🛠️ Comandos Disponíveis

```bash
# Configuração inicial
npm run setup        # Instalar dependências + configurar banco (TUDO EM UM!)

# Desenvolvimento
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Compilar para produção
npm run start        # Iniciar servidor de produção
npm run lint         # Verificar código
npm run type-check   # Verificar tipos TypeScript

# Banco de dados
npm run db:generate  # Gerar cliente Prisma
npm run db:push      # Sincronizar banco
npm run db:migrate   # Executar migrações
npm run db:studio    # Abrir Prisma Studio
npm run db:seed      # Popular com dados de exemplo
npm run reset        # Resetar banco + popular com dados
```

### 🚀 Instalação Super Rápida

```bash
git clone https://github.com/seu-usuario/reuse-web.git
cd reuse-web
npm run setup  # Faz tudo automaticamente!
npm run dev    # Inicia a aplicação
```

## 🏗️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilização**: Tailwind CSS, Radix UI
- **Autenticação**: NextAuth.js
- **Banco de Dados**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Validação**: Zod
- **Ícones**: Lucide React

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas da aplicação
│   ├── api/               # Rotas da API
│   ├── auth/              # Páginas de autenticação
│   ├── products/          # Páginas de produtos
│   └── dashboard/         # Dashboard do usuário
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de interface
│   └── ...               # Outros componentes
├── lib/                  # Utilitários e configurações
└── types/                # Definições de tipos TypeScript
```

## 🔧 Configuração Avançada

### Usar seu Próprio Banco de Dados

1. Crie uma conta no [Supabase](https://supabase.com) ou use outro provedor PostgreSQL
2. Copie a URL de conexão
3. Edite o arquivo `.env` e substitua a `DATABASE_URL`

### Personalizar a Aplicação

- **Cores**: Edite `src/app/globals.css` e `tailwind.config.js`
- **Componentes**: Modifique os arquivos em `src/components/`
- **Páginas**: Edite os arquivos em `src/app/`

## 🐛 Solução de Problemas

### Erro: "Cannot find module"
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Database connection failed"
- Verifique se a `DATABASE_URL` no `.env` está correta
- Execute `npx prisma db push` novamente

### Erro: "Images not loading"
- A aplicação usa `picsum.photos` para imagens de exemplo
- Se houver problemas, verifique sua conexão com a internet

### Erro: "Port already in use"
```bash
# Parar processos na porta 3000
npx kill-port 3000
# Ou usar outra porta
npm run dev -- -p 3001
```

## 📞 Suporte

Se encontrar algum problema:

1. Verifique se seguiu todos os passos corretamente
2. Confirme que todas as dependências foram instaladas
3. Verifique se o banco de dados está configurado
4. Consulte a seção "Solução de Problemas" acima

## 🔧 Sistema de Manutenção

### **Controle Rápido via API**

#### **1. Ativar Modo de Manutenção**
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/maintenance/control" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"maintenanceMode":true,"maintenanceMessage":"Sistema em manutencao. Voltaremos em breve!","apiKey":"reuse-web-2024-secret-key"}'

# Curl
curl -X POST http://localhost:3000/api/maintenance/control \
  -H "Content-Type: application/json" \
  -d '{
    "maintenanceMode": true,
    "maintenanceMessage": "Sistema em manutencao. Voltaremos em breve!",
    "apiKey": "reuse-web-2024-secret-key"
  }'
```

#### **2. Desativar Modo de Manutenção**
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/maintenance/control" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"maintenanceMode":false,"apiKey":"reuse-web-2024-secret-key"}'

# Curl
curl -X POST http://localhost:3000/api/maintenance/control \
  -H "Content-Type: application/json" \
  -d '{
    "maintenanceMode": false,
    "apiKey": "reuse-web-2024-secret-key"
  }'
```

#### **3. Verificar Status**
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/maintenance" -Method GET

# Curl
curl http://localhost:3000/api/maintenance
```

### **Painel Web de Controle**
- Acesse: `http://localhost:3000/api/maintenance/panel`
- Use os botões para ativar/desativar
- Edite mensagens personalizadas

### **Como Funciona**
- **ATIVO**: Todas as rotas bloqueadas → Redireciona para `/maintenance`
- **INATIVO**: Todas as rotas funcionam normalmente

### **Configuração Inicial**
```bash
# Executar seed para criar configuração inicial
npm run db:seed
```

## 🎉 Pronto!

Agora você pode testar todas as funcionalidades da aplicação ReUse! 

**Dica**: Use a conta de exemplo `admin@reuse.com` com senha `123456` para testar rapidamente, ou crie sua própria conta.

---

**Desenvolvido com ❤️ para promover a sustentabilidade e reutilização de recursos.**
