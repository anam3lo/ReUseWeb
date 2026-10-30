'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, X } from 'lucide-react'

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
      .replace(/✅/g, '<span class="text-primary">✅</span>')
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
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="chatbot-title"
        className="flex h-[88vh] max-h-[720px] w-full max-w-2xl animate-slide-up flex-col overflow-hidden rounded-b-none shadow-float sm:h-[80vh] sm:animate-scale-in sm:rounded-b-3xl"
      >
        <CardHeader className="flex flex-shrink-0 flex-row items-center justify-between gap-3 space-y-0 border-b px-5 py-4">
          <CardTitle id="chatbot-title" className="flex items-center gap-3 text-lg">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
              <Bot className="h-5 w-5 text-accent" aria-hidden="true" />
            </span>
            <span className="flex flex-col">
              Assistente ReUse
              <span className="font-sans text-xs font-normal text-muted-foreground">Ajuda para cadastrar produtos</span>
            </span>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Fechar assistente"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex min-h-0 flex-1 flex-col bg-surface p-0">
          {/* Área de mensagens */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5" aria-live="polite">
            {messages.map((message, index) => (
              <div key={index} className="animate-message-in space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {message.type === 'error' ? (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                        <X className="h-4 w-4 text-destructive" aria-hidden="true" />
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mint">
                        <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div 
                      className="whitespace-pre-wrap break-words rounded-2xl rounded-tl-md border bg-card p-3.5 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: formatMessage(message.content) 
                      }}
                    />
                    {message.buttons && message.buttons.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {message.buttons.map((button, btnIndex) => (
                          <Button
                            key={btnIndex}
                            variant="outline"
                            size="sm"
                            onClick={() => handleButtonClick(button.value)}
                            className="whitespace-nowrap hover:border-primary hover:bg-mint"
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
              <div className="flex animate-message-in items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mint">
                  <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <div className="rounded-2xl rounded-tl-md border bg-card px-4 py-3.5 text-sm" role="status" aria-label="Pensando">
                  <TypingDots />
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

function TypingDots() {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-2 w-2 animate-bounce rounded-full bg-primary/60"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}
