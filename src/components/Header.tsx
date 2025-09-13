'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import SignOutButton from '@/components/SignOutButton'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-green-600 hover:text-green-700">
              ReUse
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="text-gray-500">Carregando...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Olá, {session.user?.name}</span>
                <Button variant="outline" asChild>
                  <Link href="/chat">Chat</Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <SignOutButton />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/auth/signin">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Cadastrar</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
