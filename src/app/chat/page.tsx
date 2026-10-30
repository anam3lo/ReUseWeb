'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { MessagesSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import Header from '@/components/Header'
import ChatInterface, { ConversationData } from '@/components/ChatInterface'
import { cn } from '@/lib/utils'
import { formatRelativeDate } from '@/lib/format'

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversationList, setConversationList] = useState<ConversationData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  /**
   * Função memoizada para carregar conversas
   * (evita recriação da função e warnings no useEffect)
   */
  const loadConversations = useCallback(async () => {
    try {
      const response = await fetch('/api/chat/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversationList(data.conversations || [])
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Efeito para checar sessão e buscar conversas
   */
  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    loadConversations()
  }, [session, status, router, loadConversations])

  const conversationKey = (conversation: ConversationData, index: number) =>
    conversation.id ?? `${conversation.product.id}-${conversation.otherUser.id}-${index}`

  const selectConversation = (conversation: ConversationData | null, key: string | null) => {
    setSelectedKey(key)
    const event = new CustomEvent('selectConversation', {
      detail: conversation,
    })
    window.dispatchEvent(event)
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8" aria-busy="true" aria-label="Carregando conversas">
          <Skeleton className="mb-2 h-11 w-56" />
          <Skeleton className="mb-8 h-5 w-80 max-w-full" />
          <div className="grid h-[560px] gap-0 overflow-hidden rounded-4xl border bg-card lg:grid-cols-[340px_1fr]">
            <div className="space-y-2 border-r p-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden bg-surface lg:block" />
          </div>
        </main>
      </div>
    )
  }

  if (!session) return null

  const hasSelection = selectedKey !== null

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Conteúdo */}
      <main className="container py-6 sm:py-8">
        <div className={cn('mb-6 space-y-1.5', hasSelection && 'max-lg:hidden')}>
          <h1 className="animate-fade-up text-4xl font-bold tracking-[-0.035em] sm:text-5xl">Conversas</h1>
          <p className="animate-fade-up text-muted-foreground" style={{ animationDelay: '60ms' }}>
            Negocie trocas e converse com outros usuários
          </p>
        </div>

        {conversationList.length > 0 ? (
          <div
            className={cn(
              'grid animate-fade-up overflow-hidden rounded-4xl border bg-card lg:grid-cols-[340px_1fr]',
              'h-[calc(100dvh-200px)] min-h-[480px] lg:h-[calc(100vh-240px)] lg:max-h-[760px]',
              hasSelection && 'max-lg:h-[calc(100dvh-180px)]'
            )}
            style={{ animationDelay: '120ms' }}
          >
            {/* Lista de Conversas */}
            <aside className={cn('flex min-h-0 flex-col border-r', hasSelection && 'max-lg:hidden')}>
              <div className="border-b px-5 py-4">
                <h2 className="text-lg font-semibold">Conversas Ativas</h2>
                <p className="text-[13px] text-muted-foreground">
                  {conversationList.length} {conversationList.length === 1 ? 'conversa' : 'conversas'}
                </p>
              </div>
              <ul className="min-h-0 flex-1 overflow-y-auto p-2">
                {conversationList.map((conversation, index) => {
                  const key = conversationKey(conversation, index)
                  const active = key === selectedKey
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        aria-current={active ? 'true' : undefined}
                        onClick={() => selectConversation(conversation, key)}
                        className={cn(
                          'relative flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-colors duration-200',
                          active ? 'bg-mint' : 'hover:bg-background'
                        )}
                      >
                        {active && <span className="absolute inset-y-3 left-0 w-1 rounded-full bg-primary" aria-hidden="true" />}
                        <Avatar name={conversation.otherUser.name} size="lg" tone={active ? 'primary' : 'accent'} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="truncate font-sans text-[15px] font-semibold">
                              {conversation.otherUser.name}
                            </h3>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {formatRelativeDate(conversation.lastMessage.timestamp)}
                            </span>
                          </div>
                          <p className="truncate text-[13px] font-medium text-primary">
                            {conversation.product.title}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[13px] text-muted-foreground">
                              {conversation.lastMessage.content}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </aside>

            {/* Interface de Chat */}
            <div className={cn('min-h-0', !hasSelection && 'max-lg:hidden')}>
              <ChatInterface
                conversations={conversationList}
                currentUserId={session.user.id}
                onBack={() => selectConversation(null, null)}
              />
            </div>
          </div>
        ) : (
          <div className="flex animate-fade-up flex-col items-center gap-4 rounded-4xl border border-dashed bg-card px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-mint">
              <MessagesSquare className="h-8 w-8 text-primary" aria-hidden="true" />
            </span>
            <p className="text-lg font-semibold">Nenhuma conversa iniciada ainda</p>
            <p className="max-w-sm text-muted-foreground">
              Interesse-se por produtos para começar conversas
            </p>
            <Button asChild>
              <Link href="/products">Ver Produtos</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
