import Link from 'next/link'
import Logo from '@/components/Logo'
import { cn } from '@/lib/utils'

interface AuthLayoutProps {
  mode: 'signin' | 'signup'
  title: string
  description: React.ReactNode
  children: React.ReactNode
}

/** Layout dividido para as telas de login e cadastro. */
export default function AuthLayout({ mode, title, description, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Painel da marca */}
      <section className="relative overflow-hidden bg-primary px-6 py-8 text-white sm:px-10 lg:flex lg:w-[46%] lg:flex-col lg:justify-between lg:px-12 lg:py-12">
        <div className="absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-accent max-lg:hidden" aria-hidden="true" />
        <div className="absolute bottom-[180px] right-[150px] h-28 w-28 rounded-full bg-primary-hover max-lg:hidden" aria-hidden="true" />
        <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-accent/90 lg:hidden" aria-hidden="true" />

        <Logo tone="dark" className="relative" />

        <div className="relative mt-8 max-w-md space-y-4 lg:mt-0">
          <p className="animate-fade-up font-display text-3xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-4xl lg:text-[52px]">
            Tudo que já foi útil pode ser de novo.
          </p>
          <p className="animate-fade-up text-base leading-relaxed text-white/75 max-sm:hidden lg:text-lg" style={{ animationDelay: '80ms' }}>
            Entre para anunciar itens, conversar com a comunidade e encontrar o que você precisa.
          </p>
        </div>
      </section>

      {/* Formulário */}
      <section className="flex flex-1 items-start justify-center px-4 py-10 sm:px-6 lg:items-center lg:py-12">
        <div className="w-full max-w-[420px] animate-fade-up space-y-7" style={{ animationDelay: '120ms' }}>
          <nav aria-label="Acesso" className="flex rounded-full bg-secondary p-1">
            <AuthTab href="/auth/signin" active={mode === 'signin'}>
              Entrar
            </AuthTab>
            <AuthTab href="/auth/signup" active={mode === 'signup'}>
              Criar conta
            </AuthTab>
          </nav>

          <div className="space-y-2">
            <h1 className="text-[34px] font-bold leading-tight tracking-[-0.03em]">{title}</h1>
            <p className="text-[15px] text-muted-foreground">{description}</p>
          </div>

          {children}
        </div>
      </section>
    </div>
  )
}

function AuthTab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-11 flex-1 items-center justify-center rounded-full text-[15px] font-semibold transition-[background-color,box-shadow,color] duration-200',
        active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
    </Link>
  )
}

/** Mensagem de feedback (erro ou sucesso) usada nos formulários. */
export function FormAlert({ tone, children }: { tone: 'error' | 'success'; children: React.ReactNode }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'animate-slide-down rounded-2xl border px-4 py-3 text-sm font-medium',
        tone === 'error'
          ? 'border-destructive/20 bg-destructive/10 text-destructive'
          : 'border-primary/20 bg-mint text-primary'
      )}
    >
      {children}
    </div>
  )
}
