import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Informações sobre o chatbot para consultas externas
    const chatbotInfo = {
      chatbot: {
        name: "ReUse Assistant",
        version: "1.0.0",
        description: "Assistente para orientação de cadastro de produtos na plataforma ReUse",
        capabilities: [
          "Tutorial passo a passo para cadastro de produtos",
          "Orientações sobre título, categoria, descrição e imagem",
          "Dicas de boas práticas",
          "Ajuda geral sobre a plataforma"
        ],
        endpoints: {
          "start": "/chatbot/input - POST - Iniciar conversa",
          "help": "/api/chatbot/help - GET - Informações sobre o chatbot"
        },
        steps: [
          {
            step: 1,
            title: "Título do Produto",
            description: "Orientações sobre como criar um título claro e descritivo"
          },
          {
            step: 2,
            title: "Categoria",
            description: "Explicação das categorias disponíveis"
          },
          {
            step: 3,
            title: "Descrição",
            description: "Dicas para escrever uma boa descrição"
          },
          {
            step: 4,
            title: "Imagem",
            description: "Orientações sobre upload e qualidade de imagens"
          },
          {
            step: 5,
            title: "Finalização",
            description: "Resumo e próximos passos"
          }
        ]
      },
      platform: {
        name: "ReUse",
        description: "Plataforma de reutilização de itens para promover sustentabilidade",
        features: [
          "Cadastro de produtos para troca",
          "Sistema de mensagens entre usuários",
          "Categorização de produtos",
          "Sistema de autenticação"
        ],
        categories: [
          "Eletrônicos",
          "Roupas", 
          "Livros",
          "Móveis",
          "Casa e Jardim",
          "Esportes",
          "Brinquedos",
          "Outros"
        ]
      },
      integration: {
        nodeRed: {
          enabled: true,
          flowFile: "node-red-chatbot-flow.json",
          endpoints: {
            input: "http://localhost:1880/chatbot/input",
            help: "http://localhost:1880/api/chatbot/help"
          }
        }
      }
    }

    return NextResponse.json(chatbotInfo, { status: 200 })
  } catch (error) {
    console.error('Erro ao obter informações do chatbot:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, buttonValue, sessionId } = body
    
    // Respostas locais do chatbot
    let response = {}
    
    if (buttonValue === 'start_tutorial') {
      response = {
        type: "message",
        content: "📝 **PASSO 1: TÍTULO DO PRODUTO**\n\nO título deve ser claro e descritivo.\n\n**Exemplos bons:**\n• iPhone 12 em ótimo estado\n• Mesa de escritório de madeira\n• Livros de programação React\n\n**Exemplos ruins:**\n• Vendo\n• Item usado\n• Produto",
        buttons: [
          { text: "Próximo Passo ➡️", value: "step_2" },
          { text: "Ver exemplo novamente 🔄", value: "repeat_step_1" },
          { text: "Voltar ⬅️", value: "welcome" }
        ],
        step: "step_1",
        timestamp: new Date().toISOString()
      }
    } else if (buttonValue === 'step_2') {
      response = {
        type: "message",
        content: "🏷️ **PASSO 2: CATEGORIA DO PRODUTO**\n\nA categoria ajuda outros usuários a encontrar seu produto.\n\n**Categorias disponíveis:**\n\n📱 **Eletrônicos** - Celulares, computadores, tablets\n👕 **Roupas** - Vestuário, calçados, acessórios\n📚 **Livros** - Livros físicos e digitais\n🪑 **Móveis** - Mesas, cadeiras, armários\n🏠 **Casa e Jardim** - Decoração, plantas, utensílios\n⚽ **Esportes** - Equipamentos esportivos\n🧸 **Brinquedos** - Brinquedos para crianças\n📦 **Outros** - Itens que não se encaixam nas categorias acima",
        buttons: [
          { text: "Próximo Passo ➡️", value: "step_3" },
          { text: "Ver categorias novamente 🔄", value: "repeat_step_2" },
          { text: "Voltar ⬅️", value: "step_1" }
        ],
        step: "step_2",
        timestamp: new Date().toISOString()
      }
    } else if (buttonValue === 'step_3') {
      response = {
        type: "message",
        content: "📄 **PASSO 3: DESCRIÇÃO DO PRODUTO**\n\nA descrição é opcional, mas **altamente recomendada**!\n\n**O que incluir na descrição:**\n\n✅ **Estado do produto** (novo, usado, seminovo)\n✅ **Detalhes técnicos** (especificações, modelo)\n✅ **Acessórios incluídos** (carregador, caixa, etc.)\n✅ **Motivo da troca** (opcional)\n✅ **Defeitos menores** (se houver)\n\n**Exemplo de boa descrição:**\n\n*\"iPhone 12 com 128GB, sem riscos na tela, bateria com 85% de saúde. Inclui carregador original, cabo USB-C e película de vidro. Troco porque comprei um modelo mais novo.\"*\n\n**Dica:** Seja honesto sobre o estado do produto!",
        buttons: [
          { text: "Próximo Passo ➡️", value: "step_4" },
          { text: "Ver exemplos novamente 🔄", value: "repeat_step_3" },
          { text: "Voltar ⬅️", value: "step_2" }
        ],
        step: "step_3",
        timestamp: new Date().toISOString()
      }
    } else if (buttonValue === 'step_4') {
      response = {
        type: "message",
        content: "📸 **PASSO 4: IMAGEM DO PRODUTO**\n\nUma boa imagem aumenta muito as chances de troca!\n\n**Como adicionar imagem:**\n\n**Opção 1 - Upload de arquivo:**\n• Clique em 'Upload de Arquivo'\n• Selecione uma foto do seu dispositivo\n• Formatos aceitos: JPG, PNG, GIF\n\n**Opção 2 - URL da imagem:**\n• Cole o link de uma imagem da internet\n• Certifique-se que a URL está funcionando\n\n**Dicas para uma boa foto:**\n\n✅ **Boa iluminação** - Evite fotos escuras\n✅ **Produto em destaque** - Evite fundos bagunçados\n✅ **Múltiplos ângulos** - Se possível, várias fotos\n✅ **Mostre detalhes** - Especialmente se houver defeitos\n\n**Lembre-se:** A imagem é opcional, mas produtos com foto têm 3x mais visualizações!",
        buttons: [
          { text: "Próximo Passo ➡️", value: "step_5" },
          { text: "Ver dicas novamente 🔄", value: "repeat_step_4" },
          { text: "Voltar ⬅️", value: "step_3" }
        ],
        step: "step_4",
        timestamp: new Date().toISOString()
      }
    } else if (buttonValue === 'step_5') {
      response = {
        type: "message",
        content: "🎉 **PARABÉNS! Você aprendeu como cadastrar um produto!**\n\n**📋 RESUMO DO QUE APRENDEMOS:**\n\n1️⃣ **Título** - Claro e descritivo\n2️⃣ **Categoria** - Escolha a mais adequada\n3️⃣ **Descrição** - Detalhe o estado e características\n4️⃣ **Imagem** - Foto de qualidade (opcional)\n\n**🚀 PRÓXIMOS PASSOS:**\n\n1. Acesse a página 'Anunciar Produto'\n2. Preencha os campos seguindo nossas dicas\n3. Revise todas as informações\n4. Clique em 'Anunciar Produto'\n5. Aguarde a aprovação (se necessário)\n\n**💡 DICAS EXTRAS:**\n\n• Seja honesto sobre o estado do produto\n• Responda mensagens de interessados rapidamente\n• Mantenha suas informações de contato atualizadas\n• Considere trocar por produtos de valor similar\n\n**Precisa de mais ajuda?** Estou sempre aqui! 😊",
        buttons: [
          { text: "Ir para cadastro de produto 🚀", value: "go_to_form" },
          { text: "Revisar tutorial 🔄", value: "start_tutorial" },
          { text: "Preciso de mais ajuda ❓", value: "general_help" },
          { text: "Finalizar ✅", value: "finish" }
        ],
        step: "step_5",
        timestamp: new Date().toISOString()
      }
    } else if (buttonValue === 'general_help') {
      response = {
        type: "message",
        content: "❓ **AJUDA GERAL - PLATAFORMA REUSE**\n\n**🌱 O que é a ReUse?**\nA ReUse é uma plataforma que conecta pessoas para trocar itens usados, promovendo sustentabilidade e economia circular.\n\n**🔍 COMO FUNCIONA:**\n\n1️⃣ **Cadastre-se** - Crie sua conta gratuitamente\n2️⃣ **Anuncie produtos** - Publique itens que você não usa mais\n3️⃣ **Procure produtos** - Encontre itens que você precisa\n4️⃣ **Troque** - Negocie trocas com outros usuários\n\n**💬 SISTEMA DE MENSAGENS:**\n• Converse diretamente com outros usuários\n• Negocie detalhes da troca\n• Combine local e forma de entrega\n\n**🛡️ SEGURANÇA:**\n• Todos os usuários são verificados\n• Sistema de avaliações\n• Suporte ao cliente disponível\n\n**📞 CONTATO:**\n• Email: suporte@reuse.com.br\n• WhatsApp: (11) 99999-9999\n• Horário: Segunda a Sexta, 9h às 18h",
        buttons: [
          { text: "Voltar ao tutorial 📝", value: "start_tutorial" },
          { text: "Preciso de suporte técnico 🔧", value: "tech_support" },
          { text: "Finalizar ✅", value: "finish" }
        ],
        step: "general_help",
        timestamp: new Date().toISOString()
      }
    } else if (buttonValue === 'finish') {
      response = {
        type: "message",
        content: "✅ **Tutorial finalizado!**\n\nObrigado por usar o assistente da ReUse!\n\n**Lembre-se:**\n• Seja honesto sobre o estado dos produtos\n• Responda mensagens rapidamente\n• Mantenha suas informações atualizadas\n\n**Precisa de ajuda?** Estou sempre aqui! 😊\n\n**Boa sorte com suas trocas!** 🌱♻️",
        buttons: [
          { text: "Iniciar novo tutorial 🔄", value: "start_tutorial" },
          { text: "Ir para a plataforma 🚀", value: "go_to_platform" }
        ],
        step: "finished",
        timestamp: new Date().toISOString()
      }
    } else {
      // Resposta padrão para mensagens de texto
      response = {
        type: "message",
        content: "🤖 Olá! Sou o assistente da ReUse. Para começar, clique em um dos botões abaixo:",
        buttons: [
          { text: "Iniciar Tutorial 🚀", value: "start_tutorial" },
          { text: "Ajuda Geral ❓", value: "general_help" }
        ],
        step: "welcome",
        timestamp: new Date().toISOString()
      }
    }
    
    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    console.error('Erro ao processar requisição do chatbot:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
