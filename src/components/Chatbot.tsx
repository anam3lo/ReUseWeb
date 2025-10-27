'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Bot, User, X } from 'lucide-react'

interface ChatMessage {
  type: string
  content: string
  buttons?: Array<{ text: string; value: string }>
  step?: string
  timestamp: string
}

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
}

export default function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Inicializar conversa quando o chatbot abrir
      const welcomeMessage: ChatMessage = {
        type: 'message',
        content: '👋 Olá! Sou o assistente da ReUse. Vou te ajudar a cadastrar um produto!\n\nVamos começar?',
        buttons: [
          { text: 'Iniciar Tutorial 🚀', value: 'start_tutorial' },
          { text: 'Ajuda Geral ❓', value: 'general_help' }
        ],
        step: 'welcome',
        timestamp: new Date().toISOString()
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen])

  const sendMessage = async (buttonValue: string) => {
    if (!buttonValue) return

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/chatbot/help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: '',
          buttonValue: buttonValue,
          sessionId: sessionId,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, data])
      } else {
        throw new Error('Erro na resposta do servidor')
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
        timestamp: new Date().toISOString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleButtonClick = (buttonValue: string) => {
    if (buttonValue === 'go_to_form') {
      // Fechar o assistente quando clicar em "Ir para cadastro de produto"
      onClose()
    } else {
      sendMessage(buttonValue)
    }
  }

  const formatMessage = (content: string) => {
    // Converter markdown básico para HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/✅/g, '<span class="text-green-600">✅</span>')
      .replace(/❌/g, '<span class="text-red-600">❌</span>')
      .replace(/📝/g, '<span class="text-blue-600">📝</span>')
      .replace(/🏷️/g, '<span class="text-purple-600">🏷️</span>')
      .replace(/📄/g, '<span class="text-orange-600">📄</span>')
      .replace(/📸/g, '<span class="text-pink-600">📸</span>')
      .replace(/🎉/g, '<span class="text-yellow-600">🎉</span>')
      .replace(/🤖/g, '<span class="text-indigo-600">🤖</span>')
      .replace(/👋/g, '<span class="text-green-500">👋</span>')
      .replace(/❓/g, '<span class="text-blue-500">❓</span>')
      .replace(/🚀/g, '<span class="text-red-500">🚀</span>')
      .replace(/🔄/g, '<span class="text-purple-500">🔄</span>')
      .replace(/⬅️/g, '<span class="text-gray-500">⬅️</span>')
      .replace(/➡️/g, '<span class="text-gray-500">➡️</span>')
      .replace(/✅/g, '<span class="text-green-500">✅</span>')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[80vh] max-h-[700px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-green-600" />
            Assistente ReUse
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          {/* Área de mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((message, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {message.type === 'error' ? (
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="h-4 w-4 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div 
                      className="bg-gray-50 rounded-lg p-3 text-sm whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ 
                        __html: formatMessage(message.content) 
                      }}
                    />
                    {message.buttons && message.buttons.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.buttons.map((button, btnIndex) => (
                          <Button
                            key={btnIndex}
                            variant="outline"
                            size="sm"
                            onClick={() => handleButtonClick(button.value)}
                            className="text-xs whitespace-nowrap"
                          >
                            {button.text}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-green-600" />
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    Pensando...
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
