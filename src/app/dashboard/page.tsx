import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Inbox, MessageCircle, PackageOpen, Plus, RefreshCw, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import Header from '@/components/Header'
import ProductImage from '@/components/ProductImage'
import Reveal from '@/components/Reveal'
import { formatRelativeDate, getFirstName } from '@/lib/format'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Buscar produtos do usuário
  const userProducts = await prisma.product.findMany({
    where: {
      ownerId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  })

  // Buscar mensagens recebidas
  const recentMessages = await prisma.message.findMany({
    where: {
      receiverId: session.user.id
    },
    include: {
      sender: {
        select: {
          name: true
        }
      },
      product: {
        select: {
          title: true
        }
      }
    },
    orderBy: {
      timestamp: 'desc'
    },
    take: 5
  })

  const stats = [
    { label: 'Produtos Anunciados', value: userProducts.length, icon: Tag, highlight: true },
    { label: 'Mensagens Recebidas', value: recentMessages.length, icon: MessageCircle, highlight: false },
    { label: 'Produtos Vendidos', value: 0, icon: RefreshCw, highlight: false },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1.5">
            <p className="animate-fade-up text-[15px] text-muted-foreground">Olá, {getFirstName(session.user?.name)}</p>
            <h1 className="animate-fade-up text-4xl font-bold tracking-[-0.035em] sm:text-5xl" style={{ animationDelay: '60ms' }}>
              Dashboard
            </h1>
            <p className="animate-fade-up text-muted-foreground" style={{ animationDelay: '100ms' }}>
              Gerencie seus produtos e mensagens
            </p>
          </div>
          <Button asChild>
            <Link href="/products/new">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Anunciar Produto
            </Link>
          </Button>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 80}>
              <div
                className={
                  stat.highlight
                    ? 'flex h-full flex-col gap-5 rounded-3xl bg-primary p-6 text-white'
                    : 'flex h-full flex-col gap-5 rounded-3xl border bg-card p-6'
                }
              >
                <div className="flex items-center justify-between">
                  <span className={stat.highlight ? 'text-sm text-white/75' : 'text-sm text-muted-foreground'}>
                    {stat.label}
                  </span>
                  <span
                    className={
                      stat.highlight
                        ? 'flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20'
                        : 'flex h-10 w-10 items-center justify-center rounded-xl bg-mint'
                    }
                  >
                    <stat.icon className={stat.highlight ? 'h-5 w-5 text-accent' : 'h-5 w-5 text-primary'} aria-hidden="true" />
                  </span>
                </div>
                <span className="font-display text-5xl font-bold leading-none">{stat.value}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-5">
          {/* Meus Produtos */}
          <Reveal>
            <section className="rounded-4xl border bg-card p-2" aria-labelledby="my-products">
              <PanelHeader
                id="my-products"
                title="Meus Produtos"
                description="Seus produtos anunciados na plataforma"
                href="/products"
                linkLabel="Ver todos"
              />
              {userProducts.length > 0 ? (
                <ul>
                  {userProducts.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.id}`}
                        className="group flex items-center gap-4 rounded-2xl p-3 transition-colors duration-200 hover:bg-background"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                          <ProductImage src={product.image} alt={product.title} category={product.category} iconSize="sm" sizes="56px" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">{product.title}</p>
                          <p className="text-[13px] text-muted-foreground">
                            {product.category} · {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyPanel icon={PackageOpen} text="Você ainda não anunciou nenhum produto">
                  <Button asChild>
                    <Link href="/products/new">Anunciar Primeiro Produto</Link>
                  </Button>
                </EmptyPanel>
              )}
            </section>
          </Reveal>

          {/* Mensagens Recentes */}
          <Reveal delay={80}>
            <section className="rounded-4xl border bg-card p-2" aria-labelledby="recent-messages">
              <PanelHeader
                id="recent-messages"
                title="Mensagens Recentes"
                description="Últimas mensagens recebidas sobre seus produtos"
                href="/chat"
                linkLabel="Ver todas"
              />
              {recentMessages.length > 0 ? (
                <ul>
                  {recentMessages.map((message) => (
                    <li key={message.id}>
                      <Link
                        href="/chat"
                        className="flex items-start gap-3 rounded-2xl p-3 transition-colors duration-200 hover:bg-background"
                      >
                        <Avatar name={message.sender.name} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate font-semibold">{message.sender.name}</p>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {formatRelativeDate(message.timestamp)}
                            </span>
                          </div>
                          <p className="truncate text-[13px] font-medium text-primary">{message.product.title}</p>
                          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{message.content}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyPanel icon={Inbox} text="Nenhuma mensagem recebida ainda" />
              )}
            </section>
          </Reveal>
        </div>
      </main>
    </div>
  )
}

function PanelHeader({
  id,
  title,
  description,
  href,
  linkLabel,
}: {
  id: string
  title: string
  description: string
  href: string
  linkLabel: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 pb-3 pt-4">
      <div className="space-y-1">
        <h2 id={id} className="text-[22px] font-semibold">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Link href={href} className="shrink-0 pt-1 text-sm font-semibold text-primary hover:text-primary-hover">
        {linkLabel}
      </Link>
    </div>
  )
}

function EmptyPanel({
  icon: Icon,
  text,
  children,
}: {
  icon: typeof Inbox
  text: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 pb-10 pt-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint">
        <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
      </span>
      <p className="text-muted-foreground">{text}</p>
      {children}
    </div>
  )
}
