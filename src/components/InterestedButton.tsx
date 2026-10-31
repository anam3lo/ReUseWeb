'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Heart, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InterestedButtonProps {
  productId: string
  ownerId: string
  currentUserId: string
}

export default function InterestedButton({ productId, ownerId, currentUserId }: InterestedButtonProps) {
  const [isInterested, setIsInterested] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInterested = async () => {
    if (isInterested) return

    setIsLoading(true)

    try {
      // Enviar mensagem automática de interesse
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: 'Olá! Tenho interesse neste produto. Podemos conversar sobre ele?',
          receiverId: ownerId,
          productId: productId,
        }),
      })

      if (response.ok) {
        setIsInterested(true)
        // Mostrar feedback visual
        setTimeout(() => {
          setIsInterested(false)
        }, 3000)
      } else {
        console.error('Erro ao enviar interesse')
      }
    } catch (error) {
      console.error('Erro ao enviar interesse:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="lg"
      variant={isInterested ? 'accent' : 'outline'}
      className={cn('h-14 flex-1 text-base', isInterested && 'disabled:opacity-100')}
      onClick={handleInterested}
      disabled={isLoading || isInterested}
      aria-live="polite"
    >
      {isLoading ? (
        <>
          <Spinner className="h-5 w-5" label="Enviando interesse" />
          Enviando...
        </>
      ) : isInterested ? (
        <>
          <Check className="h-5 w-5 animate-pop" aria-hidden="true" />
          Interesse Enviado!
        </>
      ) : (
        <>
          <Heart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
          Tenho interesse
        </>
      )}
    </Button>
  )
}
