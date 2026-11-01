import Link from 'next/link'
import { ArrowRight, MessageCircle, PackageOpen, Pencil, Plus, Search } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { CountBadge } from '@/components/ui/count-badge'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import ProductImage from '@/components/ProductImage'
import Reveal from '@/components/Reveal'
import { PRODUCT_CATEGORIES } from '@/lib/categories'
import { getFirstName } from '@/lib/format'

interface LoggedInHomeProps {
  userId: string
  userName: string
}

/** Saudação conforme o horário de Brasília. */
function getGreeting() {
  const hour = Number(
    new Intl.DateTimeFormat('pt-BR', { hour: 'numeric', hourCycle: 'h23', timeZone: 'America/Sao_Paulo' }).format(new Date())
  )
  if (hour >= 5 && hour < 12) return 'Bom dia'
  if (hour >= 12 && hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

/**
 * Início para quem está logado: busca, mensagens novas, atalhos,
 * produtos recentes de outras pessoas e os próprios anúncios.
 */
export default async function LoggedInHome({ userId, userName }: LoggedInHomeProps) {
  const [recentProducts, myProducts, myProductsCount, unreadCount, latestUnread] = await Promise.all([
    prisma.product.findMany({
      where: { ownerId: { not: userId } },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { owner: { select: { name: true } } },
    }),
    prisma.product.findMany({
      where: { ownerId: userId },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { messages: true } } },
    }),
    prisma.product.count({ where: { ownerId: userId } }),
    prisma.message.count({ where: { receiverId: userId, read: false } }),
    prisma.message.findFirst({
      where: { receiverId: userId, read: false },
      orderBy: { timestamp: 'desc' },
      include: {
        sender: { select: { name: true } },
        product: { select: { title: true } },
      },
    }),
  ])

  const firstName = getFirstName(userName)
  const quickCategories = PRODUCT_CATEGORIES.slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container space-y-12 py-8 sm:py-10">
        {/* Saudação + busca + atalhos */}
        <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:gap-5">
          <div className="relative flex animate-fade-up flex-col gap-6 overflow-hidden rounded-4xl bg-primary p-6 text-white sm:p-9">
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-accent" aria-hidden="true" />
            <div className="relative space-y-2">
              <p className="text-[15px] text-white/75">
                {getGreeting()}
                {firstName ? `, ${firstName}` : ''}
              </p>
              <h1 className="max-w-lg text-[32px] font-bold leading-[1.04] tracking-[-0.035em] sm:text-[44px]">
                O que vamos reutilizar hoje?
              </h1>
            </div>

            <form
              action="/products"
              method="get"
              role="search"
              className="relative flex max-w-xl items-center gap-2 rounded-full bg-card p-1.5 text-foreground shadow-soft"
            >
              <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <label htmlFor="home-search" className="sr-only">
                Buscar produtos
              </label>
              <input
                id="home-search"
                name="search"
                type="search"
                placeholder="Buscar produtos"
                className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/80"
              />
              <Button type="submit" variant="dark" className="h-11 shrink-0">
                Buscar
              </Button>
            </form>

            <nav aria-label="Categorias" className="relative flex flex-wrap gap-2">
              {quickCategories.map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className="rounded-full border border-white/30 px-3.5 py-2 text-[13px] font-medium transition-colors hover:border-accent hover:bg-white/10"
                >
                  {category}
                </Link>
              ))}
              <Link
                href="/products"
                className="rounded-full border border-white/30 px-3.5 py-2 text-[13px] font-medium transition-colors hover:border-accent hover:bg-white/10"
              >
                Ver todas
              </Link>
            </nav>
          </div>

          <div className="flex animate-fade-up flex-col gap-3" style={{ animationDelay: '80ms' }}>
            {/* Mensagens */}
            <Link
              href="/chat"
              className="card-hover flex flex-1 flex-col gap-4 rounded-3xl border bg-card p-5"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3 font-semibold">
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-mint">
                    <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                    <CountBadge count={unreadCount} placement="corner" />
                  </span>
                  {unreadCount > 0
                    ? `${unreadCount} ${unreadCount === 1 ? 'mensagem nova' : 'mensagens novas'}`
                    : 'Mensagens'}
                </span>
                <span className="text-[13px] font-semibold text-primary">
                  {unreadCount > 0 ? 'Responder' : 'Abrir chat'}
                </span>
              </span>
              {latestUnread ? (
                <span className="flex items-center gap-3 rounded-2xl bg-background p-3">
                  <Avatar name={latestUnread.sender.name} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold">
                      {latestUnread.sender.name} · {latestUnread.product.title}
                    </span>
                    <span className="block truncate text-[13px] text-muted-foreground">{latestUnread.content}</span>
                  </span>
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Nenhuma mensagem nova por enquanto.</span>
              )}
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard" className="card-hover flex flex-col gap-1.5 rounded-3xl border bg-card p-5">
                <span className="font-display text-[32px] font-bold leading-none">{myProductsCount}</span>
                <span className="text-[13px] text-muted-foreground">
                  {myProductsCount === 1 ? 'Meu anúncio' : 'Meus anúncios'}
                </span>
              </Link>
              <Link
                href="/products/new"
                className="card-hover flex flex-col justify-between gap-3 rounded-3xl bg-accent p-5 text-accent-foreground"
              >
                <Plus className="h-6 w-6" strokeWidth={2.4} aria-hidden="true" />
                <span className="text-sm font-bold">Anunciar item</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Produtos recentes de outras pessoas */}
        <section aria-labelledby="recent-heading" className="space-y-5">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1.5">
              <p className="eyebrow">Para você</p>
              <h2 id="recent-heading" className="text-[28px] font-bold sm:text-[32px]">
                Chegaram agora
              </h2>
            </div>
            <Link href="/products" className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Ver todos os produtos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>

          {recentProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {recentProducts.map((product, index) => (
                <Reveal key={product.id} delay={(index % 4) * 70} className="h-full">
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed bg-card px-6 py-12 text-center">
              <PackageOpen className="h-8 w-8 text-primary" aria-hidden="true" />
              <p className="text-muted-foreground">Ainda não há anúncios de outras pessoas.</p>
            </div>
          )}
        </section>

        {/* Seus anúncios + dica */}
        <section className="grid items-start gap-4 lg:grid-cols-[1.6fr_1fr] lg:gap-5">
          <Reveal>
            <section className="rounded-4xl border bg-card p-2" aria-labelledby="mine-heading">
              <div className="flex items-center justify-between px-4 pb-2 pt-4">
                <h2 id="mine-heading" className="text-[22px] font-semibold">
                  Seus anúncios
                </h2>
                <Link href="/dashboard" className="text-sm font-semibold text-primary hover:text-primary-hover">
                  Gerenciar
                </Link>
              </div>
              {myProducts.length > 0 ? (
                <ul>
                  {myProducts.map((product) => (
                    <li key={product.id} className="flex items-center gap-1 rounded-2xl pr-2 transition-colors hover:bg-background">
                      <Link href={`/products/${product.id}`} className="flex min-w-0 flex-1 items-center gap-4 rounded-2xl p-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                          <ProductImage src={product.image} alt={product.title} category={product.category} iconSize="sm" sizes="48px" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{product.title}</p>
                          <p className="text-[13px] text-muted-foreground">
                            {product.category} ·{' '}
                            {product._count.messages === 0
                              ? 'sem conversas ainda'
                              : `${product._count.messages} ${product._count.messages === 1 ? 'mensagem' : 'mensagens'}`}
                          </p>
                        </div>
                      </Link>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/products/${product.id}/edit`} aria-label={`Editar ${product.title}`}>
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          <span className="max-sm:hidden">Editar</span>
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center gap-4 px-6 pb-10 pt-6 text-center">
                  <p className="text-muted-foreground">Você ainda não anunciou nenhum produto.</p>
                  <Button asChild>
                    <Link href="/products/new">Anunciar Primeiro Produto</Link>
                  </Button>
                </div>
              )}
            </section>
          </Reveal>

          <Reveal delay={80}>
            <div className="relative flex flex-col gap-4 overflow-hidden rounded-4xl bg-foreground p-7 text-white">
              <div className="absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-primary" aria-hidden="true" />
              <p className="eyebrow relative text-accent">Dica</p>
              <p className="relative font-display text-2xl font-semibold leading-tight">
                Anúncios com foto e descrição honesta encontram alguém mais rápido.
              </p>
              <Button asChild variant="accent" className="relative self-start">
                <Link href="/products/new">Anunciar agora</Link>
              </Button>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  )
}
