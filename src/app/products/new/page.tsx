'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Header from '@/components/Header'
import Chatbot from '@/components/Chatbot'
import ProductForm from '@/components/ProductForm'
import { Bot, ChevronLeft } from 'lucide-react'

export default function NewProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-5xl py-10" aria-busy="true" aria-label="Carregando">
          <Skeleton className="mb-3 h-12 w-80 max-w-full" />
          <Skeleton className="mb-8 h-5 w-96 max-w-full" />
          <Skeleton className="h-[520px] w-full rounded-4xl" />
        </main>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Link
              href="/products"
              className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Voltar aos Produtos
            </Link>
            <h1 className="animate-fade-up text-4xl font-bold tracking-[-0.035em] sm:text-5xl">Anunciar Produto</h1>
            <p className="animate-fade-up text-base text-muted-foreground sm:text-lg" style={{ animationDelay: '60ms' }}>
              Compartilhe seus itens para reutilização e ajude o meio ambiente
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsChatbotOpen(true)}>
            <Bot className="h-4 w-4" aria-hidden="true" />
            Assistente
          </Button>
        </div>

        <ProductForm mode="create" ownerName={session?.user?.name} cancelHref="/products" />
      </main>

      {/* Chatbot */}
      <Chatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  )
}
