'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface SignOutButtonProps {
  /** "button" = botão padrão; "menu" = item de menu (dropdown / menu mobile) */
  variant?: 'button' | 'menu'
  className?: string
}

export default function SignOutButton({ variant = 'button', className }: SignOutButtonProps) {
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

  const content = (
    <>
      {isLoading ? <Spinner label="Saindo" /> : <LogOut className="h-4 w-4" aria-hidden="true" />}
      {isLoading ? 'Saindo...' : 'Sair'}
    </>
  )

  if (variant === 'menu') {
    return (
      <button
        type="button"
        role="menuitem"
        onClick={handleSignOut}
        disabled={isLoading}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60',
          className
        )}
      >
        {content}
      </button>
    )
  }

  return (
    <Button variant="outline" onClick={handleSignOut} disabled={isLoading} className={className}>
      {content}
    </Button>
  )
}
