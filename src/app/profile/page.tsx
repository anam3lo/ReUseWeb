import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, ChevronRight, LayoutDashboard, Mail, MessageCircle, PackageOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import Reveal from '@/components/Reveal'
import SignOutButton from '@/components/SignOutButton'
import { getFirstName } from '@/lib/format'

export const metadata = {
  title: 'Meu perfil · ReUse',
}

/**
 * Perfil do usuário logado.
 * Usa apenas dados que já existem no banco: nome, e-mail, data de criação,
 * produtos anunciados e mensagens recebidas.
 */
export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const [user, products, receivedMessages] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, createdAt: true },
    }),
    prisma.product.findMany({
      where: { ownerId: session.user.id },
      include: { owner: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.message.count({
      where: { receiverId: session.user.id },
    }),
  ])

  if (!user) {
    redirect('/auth/signin')
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const stats = [
    { label: 'Produtos anunciados', value: products.length },
    { label: 'Mensagens recebidas', value: receivedMessages },
    { label: 'Produtos vendidos', value: 0 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container space-y-8 py-6 sm:py-10">
        {/* Cabeçalho do perfil */}
        <section className="animate-fade-up overflow-hidden rounded-4xl border bg-card">
          <div className="relative h-32 overflow-hidden bg-primary sm:h-44" aria-hidden="true">
            <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-accent" />
            <div className="absolute -bottom-32 right-40 h-56 w-56 rounded-full bg-primary-hover max-sm:hidden" />
          </div>

          <div className="flex flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
              <Avatar
                name={user.name}
                size="xl"
                className="relative z-10 -mt-14 border-[6px] border-card shadow-lift sm:-mt-16"
              />
              <div className="space-y-1.5 sm:pb-2">
                <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">{user.name}</h1>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {user.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    Membro desde {memberSince}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:pb-2">
              <Button asChild>
                <Link href="/products/new">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Anunciar produto
                </Link>
              </Button>
              <SignOutButton />
            </div>
          </div>

          <dl className="grid grid-cols-3 border-t">
            {stats.map((stat, index) => (
              <div key={stat.label} className={index > 0 ? 'border-l px-4 py-5 sm:px-8' : 'px-4 py-5 sm:px-8'}>
                <dt className="text-xs text-muted-foreground sm:text-[13px]">{stat.label}</dt>
                <dd className="font-display text-2xl font-bold sm:text-3xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
          {/* Anúncios */}
          <section aria-labelledby="profile-products" className="space-y-5">
            <h2 id="profile-products" className="text-2xl font-semibold">
              Anúncios de {getFirstName(user.name)}
            </h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                {products.map((product, index) => (
                  <Reveal key={product.id} delay={(index % 3) * 70} className="h-full">
                    <ProductCard product={product} aspect="wide" />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed bg-card px-6 py-14 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint">
                  <PackageOpen className="h-7 w-7 text-primary" aria-hidden="true" />
                </span>
                <p className="text-muted-foreground">Você ainda não anunciou nenhum produto</p>
                <Button asChild>
                  <Link href="/products/new">Anunciar Primeiro Produto</Link>
                </Button>
              </div>
            )}
          </section>

          {/* Dados da conta */}
          <Reveal as="aside" className="space-y-4 rounded-3xl border bg-card p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold">Dados da conta</h2>
            <dl className="space-y-4 text-[15px]">
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">Nome</dt>
                <dd className="font-medium">{user.name}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">E-mail</dt>
                <dd className="break-all font-medium">{user.email}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">Conta criada em</dt>
                <dd className="font-medium">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</dd>
              </div>
            </dl>
            <div className="h-px bg-border" />
            <nav aria-label="Atalhos da conta" className="-mx-2 space-y-1">
              <ShortcutLink href="/chat" icon={MessageCircle}>Minhas conversas</ShortcutLink>
              <ShortcutLink href="/dashboard" icon={LayoutDashboard}>Ir para o dashboard</ShortcutLink>
            </nav>
          </Reveal>
        </div>
      </main>
    </div>
  )
}

function ShortcutLink({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: typeof MessageCircle
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-semibold transition-colors hover:bg-background"
    >
      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      <span className="flex-1">{children}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  )
}
