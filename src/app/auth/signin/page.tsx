'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import AuthLayout, { FormAlert } from '@/components/AuthLayout'
import PasswordInput from '@/components/PasswordInput'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setSuccess(message)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou senha inválidos')
      } else {
        setSuccess('Login realizado com sucesso! Redirecionando...')
        // Aguardar um pouco para mostrar a mensagem de sucesso
        setTimeout(() => {
          // Forçar refresh da página para atualizar o estado de autenticação
          window.location.href = '/'
        }, 1000)
      }
    } catch (error) {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      mode="signin"
      title="Entrar na sua conta"
      description={
        <>
          Ou{' '}
          <Link href="/auth/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
            crie uma nova conta
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {success && <FormAlert tone="success">{success}</FormAlert>}
        {error && <FormAlert tone="error">{error}</FormAlert>}

        <div className="space-y-2.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="password">Senha</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            placeholder="Sua senha"
            visible={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Spinner label="Entrando" />}
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </AuthLayout>
  )
}
