'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import SignOutButton from '@/components/SignOutButton'
import ChatInterface from '@/components/ChatInterface'
import { ArrowLeft } from 'lucide-react'

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversationList, setConversationList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Carregar conversas
    const loadConversations = async () => {
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
    }

    loadConversations()
  }, [session, status, router])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Carregando conversas...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/products" className="text-2xl font-bold text-green-600 hover:text-green-700">
                ReUse
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <span className="text-gray-700">Olá, {session.user?.name}</span>
              <Button variant="outline" asChild>
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar aos Produtos
                </Link>
              </Button>
              <SignOutButton />
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Conversas</h1>
          <p className="text-gray-600 mt-2">
            Negocie trocas e converse com outros usuários
          </p>
        </div>

        {conversationList.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Conversas */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Conversas Ativas</h2>
                </div>
                <div className="divide-y">
                  {conversationList.map((conversation, index) => (
                    <div 
                      key={index} 
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        // Passar a conversa selecionada para o ChatInterface
                        const event = new CustomEvent('selectConversation', { 
                          detail: conversation 
                        })
                        window.dispatchEvent(event)
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold">
                            {conversation.otherUser.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {conversation.otherUser.name}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {new Date(conversation.lastMessage.timestamp).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.product.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interface de Chat */}
            <div className="lg:col-span-2">
              <ChatInterface 
                conversations={conversationList}
                currentUserId={session.user.id}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              Nenhuma conversa iniciada ainda
            </div>
            <p className="text-gray-400 mb-6">
              Interesse-se por produtos para começar conversas
            </p>
            <Button asChild>
              <Link href="/products">Ver Produtos</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
