'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import AuthLayout, { FormAlert } from '@/components/AuthLayout'
import PasswordInput from '@/components/PasswordInput'
import { cn } from '@/lib/utils'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const setField = (name: 'password' | 'confirmPassword') => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validações do lado do cliente
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setIsLoading(false)
      return
    }

    if (formData.name.length < 2) {
      setError('O nome deve ter pelo menos 2 caracteres')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (response.ok) {
        // Redirecionar para login com mensagem de sucesso
        window.location.href = '/auth/signin?message=Conta criada com sucesso!'
      } else {
        const data = await response.json()
        setError(data.message || 'Erro ao criar conta')
      }
    } catch (error) {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const passwordLongEnough = formData.password.length >= 6
  const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword

  return (
    <AuthLayout
      mode="signup"
      title="Criar sua conta"
      description={
        <>
          Ou{' '}
          <Link href="/auth/signin" className="font-semibold text-primary underline-offset-4 hover:underline">
            faça login na sua conta
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <FormAlert tone="error">{error}</FormAlert>}

        <div className="space-y-2.5">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome completo"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="password">Senha</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={setField('password')}
            placeholder="Mínimo 6 caracteres"
            visible={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={setField('confirmPassword')}
            placeholder="Digite a senha novamente"
            visible={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />
        </div>

        {/* Dicas da senha em tempo real */}
        <ul className="space-y-1.5 text-[13px]" aria-live="polite">
          <PasswordHint ok={passwordLongEnough}>Pelo menos 6 caracteres</PasswordHint>
          <PasswordHint ok={passwordsMatch}>As senhas coincidem</PasswordHint>
        </ul>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Spinner label="Criando conta" />}
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>
    </AuthLayout>
  )
}

function PasswordHint({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className={cn('flex items-center gap-2 transition-colors duration-200', ok ? 'text-primary' : 'text-muted-foreground')}>
      <span
        className={cn(
          'flex h-4 w-4 items-center justify-center rounded-full border transition-[background-color,border-color] duration-200',
          ok ? 'border-primary bg-primary text-white' : 'border-input'
        )}
        aria-hidden="true"
      >
        {ok && <Check className="h-3 w-3 animate-pop" strokeWidth={3} />}
      </span>
      {children}
      <span className="sr-only">{ok ? '(ok)' : '(pendente)'}</span>
    </li>
  )
}
