'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessagesSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import ProductImage from '@/components/ProductImage'
import { cn } from '@/lib/utils'

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
  /** Voltar para a lista de conversas (usado no celular) */
  onBack?: () => void
  className?: string
}

/**
 * Componente principal do Chat
 */
export default function ChatInterface({
  conversations,
  currentUserId,
  onBack,
  className,
}: ChatInterfaceProps): JSX.Element {
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
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
        setIsLoadingMessages(true)
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
        } finally {
          setIsLoadingMessages(false)
        }
      }
    }

    loadMessages()
  }, [selectedConversation, currentUserId])

  /**
   * Scroll automático para a última mensagem
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
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
      <div className={cn('flex h-full flex-col items-center justify-center gap-4 bg-surface p-8 text-center', className)}>
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-mint">
          <MessagesSquare className="h-8 w-8 text-primary" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <p className="font-display text-lg font-semibold">Suas conversas</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Selecione uma conversa para começar a conversar
          </p>
        </div>
        <span className="sr-only">{conversations.length} conversas disponíveis</span>
      </div>
    )
  }

  /**
   * Renderização principal da conversa
   */
  return (
    <div className={cn('flex h-full min-h-0 flex-col bg-surface', className)}>
      {/* Header da Conversa */}
      <div className="flex shrink-0 items-center gap-3 border-b bg-card px-3 py-3 sm:px-5">
        {onBack && (
          <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="Voltar para conversas" className="lg:hidden">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Button>
        )}
        <div className="relative">
          <div className="h-11 w-11 overflow-hidden rounded-2xl">
            <ProductImage
              src={selectedConversation.product.image}
              alt={selectedConversation.product.title}
              iconSize="sm"
              sizes="44px"
            />
          </div>
          <Avatar
            name={selectedConversation.otherUser.name}
            size="sm"
            className="absolute -bottom-1.5 -right-1.5 h-6 w-6 border-2 border-card text-[10px]"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{selectedConversation.otherUser.name}</p>
          <p className="truncate text-[13px] text-muted-foreground">{selectedConversation.product.title}</p>
        </div>
        <Button variant="outline" size="sm" asChild className="max-sm:hidden">
          <Link href={`/products/${selectedConversation.product.id}`}>Ver produto</Link>
        </Button>
      </div>

      {/* Mensagens */}
      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3 py-5 sm:px-6" aria-live="polite">
        {isLoadingMessages && messages.length === 0 ? (
          <div className="space-y-3" aria-label="Carregando mensagens">
            <Skeleton className="h-12 w-2/3 rounded-2xl" />
            <Skeleton className="ml-auto h-12 w-1/2 rounded-2xl" />
            <Skeleton className="h-12 w-3/5 rounded-2xl" />
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === currentUserId
            return (
              <div key={message.id} className={cn('flex animate-message-in', isOwn ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[80%] px-4 py-2.5 sm:max-w-[65%]',
                    isOwn
                      ? 'rounded-[20px] rounded-br-md bg-primary text-primary-foreground'
                      : 'rounded-[20px] rounded-bl-md border bg-card text-foreground'
                  )}
                >
                  <p className="whitespace-pre-wrap break-words text-[15px] leading-snug">{message.content}</p>
                  <p
                    className={cn('mt-1 text-right text-[11px]', isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground')}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Campo de envio */}
      <div className="shrink-0 border-t bg-card p-3 sm:px-5">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <label htmlFor="chat-message" className="sr-only">
            Mensagem
          </label>
          <Input
            id="chat-message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="h-12 flex-1 rounded-full bg-background px-5"
            disabled={isLoading}
            autoComplete="off"
          />
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12"
            disabled={isLoading || !newMessage.trim()}
            aria-label="Enviar mensagem"
          >
            {isLoading ? <Spinner label="Enviando" /> : <Send className="h-[18px] w-[18px]" aria-hidden="true" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
