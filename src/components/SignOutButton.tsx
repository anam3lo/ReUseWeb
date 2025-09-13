'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ redirect: false })
      // Forçar refresh da página para atualizar o estado de autenticação
      window.location.href = '/'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Mesmo com erro, redirecionar para garantir que o usuário saia
      window.location.href = '/'
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleSignOut} disabled={isLoading}>
      {isLoading ? 'Saindo...' : 'Sair'}
    </Button>
  )
}
