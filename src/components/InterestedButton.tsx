'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Check } from 'lucide-react'

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
      variant="outline" 
      className="flex-1"
      onClick={handleInterested}
      disabled={isLoading || isInterested}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
          Enviando...
        </>
      ) : isInterested ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Interesse Enviado!
        </>
      ) : (
        <>
          <Heart className="h-4 w-4 mr-2" />
          Interessado
        </>
      )}
    </Button>
  )
}
