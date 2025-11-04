'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Phone, Video, MoreVertical } from 'lucide-react'
import Image from 'next/image'

/**
 * Tipagem das conversas (compatível com o page.tsx)
 */
export interface ConversationData {
  id: string
  otherUser: {
    id: string
    name: string
  }
  product: {
    id: string
    title: string
    image: string | null
  }
  lastMessage: {
    id: string
    content: string
    timestamp: string
  }
  unreadCount: number
}

interface ChatInterfaceProps {
  conversations: ConversationData[]
  currentUserId: string
}

/**
 * Componente principal do Chat
 */
export default function ChatInterface({
  conversations,
  currentUserId,
}: ChatInterfaceProps): JSX.Element {
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  /**
   * Escuta o evento de seleção de conversa (vindo do page.tsx)
   */
  useEffect(() => {
    const handleSelectConversation = (event: CustomEvent) => {
      setSelectedConversation(event.detail)
    }

    window.addEventListener('selectConversation', handleSelectConversation as EventListener)
    return () => {
      window.removeEventListener('selectConversation', handleSelectConversation as EventListener)
    }
  }, [])

  /**
   * Carrega as mensagens da conversa selecionada
   */
  useEffect(() => {
    const loadMessages = async () => {
      if (selectedConversation) {
        try {
          const response = await fetch(
            `/api/messages?productId=${selectedConversation.product.id}&otherUserId=${selectedConversation.otherUser.id}`
          )
          if (response.ok) {
            const data = await response.json()
            setMessages(data.messages || [])
          }
        } catch (error) {
          console.error('Erro ao carregar mensagens:', error)
          setMessages([])
        }
      }
    }

    loadMessages()
  }, [selectedConversation, currentUserId])

  /**
   * Scroll automático para a última mensagem
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /**
   * Envio de mensagem
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage.trim(),
          receiverId: selectedConversation.otherUser.id,
          productId: selectedConversation.product.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages((prev) => [...prev, data.data])
        setNewMessage('')
      } else {
        console.error('Erro ao enviar mensagem')
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Formata a hora das mensagens
   */
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  /**
   * Caso nenhuma conversa esteja selecionada
   */
  if (!selectedConversation) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">💬</div>
            <p>Selecione uma conversa para começar a conversar</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  /**
   * Renderização principal da conversa
   */
  return (
    <Card className="h-96 flex flex-col">
      {/* Header da Conversa */}
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedConversation.product.image && (
              <Image
                src={selectedConversation.product.image}
                alt={selectedConversation.product.title}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            )}
            <div>
              <CardTitle className="text-lg">{selectedConversation.otherUser.name}</CardTitle>
              <p className="text-sm text-gray-500">{selectedConversation.product.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Phone className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Video className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Mensagens */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.senderId === currentUserId
          return (
            <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwn ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwn ? 'text-green-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Campo de envio */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
