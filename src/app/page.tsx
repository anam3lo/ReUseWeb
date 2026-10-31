import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, Leaf, MessageCircle, PackageOpen, RefreshCw, Search, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import SiteFooter from '@/components/SiteFooter'
import ProductCard from '@/components/ProductCard'
import ProductImage from '@/components/ProductImage'
import Reveal from '@/components/Reveal'
import { PRODUCT_CATEGORIES, getCategoryStyle } from '@/lib/categories'

const STEPS = [
  {
    icon: Tag,
    title: 'Anuncie',
    text: 'Tire uma foto, escolha a categoria e descreva o item. Leva poucos minutos.',
  },
  {
    icon: MessageCircle,
    title: 'Converse',
    text: 'Quem se interessa fala com você pelo chat da plataforma para combinar a troca.',
  },
  {
    icon: RefreshCw,
    title: 'Reutilize',
    text: 'O item ganha um novo dono e deixa de virar lixo. Simples assim.',
  },
]

export default async function Home() {
  const session = await getServerSession(authOptions)

  // Buscar produtos recentes
  const recentProducts = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      owner: {
        select: {
          name: true,
        }
      }
    }
  })

  const productsHref = session ? '/products' : '/auth/signin'
  const categoryHref = (category: string) =>
    session ? `/products?category=${encodeURIComponent(category)}` : '/auth/signin'
  const [heroFirst, heroSecond] = recentProducts

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="container grid items-center gap-12 pb-16 pt-10 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24">
          <div className="flex flex-col gap-7">
            <span className="inline-flex animate-fade-up items-center gap-2 self-start rounded-full border bg-card py-1.5 pl-1.5 pr-4 text-[13px] font-medium text-foreground/80">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                <Leaf className="h-3.5 w-3.5 text-accent-foreground" aria-hidden="true" />
              </span>
              Consumo consciente, perto de você
            </span>

            <h1
              className="animate-fade-up text-[44px] font-bold leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-[76px]"
              style={{ animationDelay: '80ms' }}
            >
              Dê uma <span className="text-highlight">nova vida</span> ao que você já tem.
            </h1>

            <p
              className="max-w-xl animate-fade-up text-lg leading-relaxed text-muted-foreground sm:text-xl"
              style={{ animationDelay: '160ms' }}
            >
              Conecte-se com pessoas da sua comunidade para reutilizar, trocar e reduzir o desperdício.
              Juntos, podemos criar um mundo mais sustentável.
            </p>

            <form
              action={productsHref}
              method="get"
              role="search"
              className="flex max-w-xl animate-fade-up items-center gap-2 rounded-full border bg-card p-2 shadow-soft transition-shadow focus-within:shadow-lift"
              style={{ animationDelay: '240ms' }}
            >
              <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <label htmlFor="hero-search" className="sr-only">
                Buscar produtos
              </label>
              <input
                id="hero-search"
                name="search"
                type="search"
                placeholder="O que você está procurando?"
                className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/80"
              />
              <Button type="submit" variant="dark" className="h-11 shrink-0">
                Buscar
              </Button>
            </form>

            <div className="flex animate-fade-up flex-wrap gap-3" style={{ animationDelay: '320ms' }}>
              <Button size="lg" asChild>
                <Link href={productsHref}>
                  {session ? 'Ver produtos' : 'Entrar para ver produtos'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={session ? '/products/new' : '/auth/signup'}>
                  {session ? 'Anunciar produto' : 'Criar conta grátis'}
                </Link>
              </Button>
            </div>
          </div>

          {/* Composição visual do hero */}
          <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[540px] animate-fade-in" aria-hidden="true">
            <div className="absolute inset-[6%_0_0_8%] rounded-[36px] bg-primary" />
            <div className="absolute right-[4%] top-0 h-[38%] w-[38%] rounded-full bg-accent" />

            <HeroCard
              className="left-0 top-[14%] w-[54%] -rotate-[4deg]"
              title={heroFirst?.title ?? 'Poltrona de madeira'}
              category={heroFirst?.category ?? 'Móveis'}
              image={heroFirst?.image ?? null}
            />
            <HeroCard
              className="right-[4%] top-[38%] w-[48%] rotate-[3deg]"
              delay="1.5s"
              title={heroSecond?.title ?? 'Bicicleta aro 26'}
              category={heroSecond?.category ?? 'Esportes'}
              image={heroSecond?.image ?? null}
            />

            <div className="absolute bottom-[5%] left-[12%] flex items-center gap-3 rounded-2xl bg-card py-3 pl-3 pr-5 shadow-float">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <MessageCircle className="h-5 w-5 text-accent-foreground" />
              </span>
              <span className="flex flex-col">
                <span className="text-[13px] font-semibold">Alguém tem interesse!</span>
                <span className="text-xs text-muted-foreground">Combine a troca pelo chat</span>
              </span>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="border-y bg-card">
          <div className="container py-16 sm:py-20">
            <Reveal className="mb-10 max-w-2xl space-y-3">
              <p className="eyebrow">Como funciona</p>
              <h2 className="text-3xl font-bold leading-tight sm:text-[40px]">
                Do armário para a casa de alguém em três passos.
              </h2>
            </Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <Reveal key={step.title} delay={index * 90}>
                  <div className="group flex h-full flex-col gap-4 rounded-3xl bg-background p-7 transition-colors duration-300 hover:bg-mint">
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary transition-transform duration-300 ease-smooth group-hover:-rotate-6">
                        <step.icon className="h-[22px] w-[22px] text-accent" aria-hidden="true" />
                      </span>
                      <span className="font-display text-4xl font-bold text-border">0{index + 1}</span>
                    </div>
                    <h3 className="text-[22px] font-semibold">{step.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">{step.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Categorias */}
        <section className="container pt-16 sm:pt-20">
          <Reveal className="mb-8 space-y-3">
            <p className="eyebrow">Categorias</p>
            <h2 className="text-3xl font-bold sm:text-[40px]">Explore por categoria</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {PRODUCT_CATEGORIES.map((category, index) => {
              const { icon: Icon } = getCategoryStyle(category)
              return (
                <Reveal key={category} delay={index * 40}>
                  <Link
                    href={categoryHref(category)}
                    className="group flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 transition-[border-color,background-color,transform] duration-300 ease-smooth hover:-translate-y-0.5 hover:border-primary hover:bg-mint"
                  >
                    <Icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                    <span className="text-[15px] font-semibold">{category}</span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* Produtos recentes */}
        <section className="container py-16 sm:py-20">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <p className="eyebrow">Acabaram de chegar</p>
              <h2 className="text-3xl font-bold sm:text-[40px]">Produtos recentes</h2>
            </div>
            <Link
              href={productsHref}
              className="group inline-flex items-center gap-2 text-[15px] font-semibold text-primary"
            >
              {session ? 'Ver todos os produtos' : 'Entrar para ver produtos'}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>

          {recentProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {recentProducts.map((product, index) => (
                <Reveal key={product.id} delay={(index % 3) * 80} className="h-full">
                  <ProductCard product={product} aspect="wide" />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed bg-card px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint">
                <PackageOpen className="h-7 w-7 text-primary" aria-hidden="true" />
              </span>
              <p className="text-lg font-semibold">Ainda não há produtos anunciados</p>
              <p className="max-w-sm text-muted-foreground">Seja a primeira pessoa a dar uma nova vida a um item.</p>
              <Button asChild>
                <Link href={session ? '/products/new' : '/auth/signup'}>Anunciar produto</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Chamada final */}
        <section className="container pb-20">
          <Reveal>
            <div className="relative overflow-hidden rounded-4xl bg-foreground px-6 py-14 sm:px-12 sm:py-16">
              <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary" aria-hidden="true" />
              <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                <div className="max-w-xl space-y-3">
                  <h2 className="text-3xl font-bold leading-tight text-white sm:text-[44px]">
                    Tem algo parado em casa?
                  </h2>
                  <p className="text-lg leading-relaxed text-white/70">
                    Anuncie agora e ajude esse item a encontrar alguém que vai usá-lo de verdade.
                  </p>
                </div>
                <Button size="lg" variant="accent" asChild>
                  <Link href={session ? '/products/new' : '/auth/signup'}>
                    Anunciar produto
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function HeroCard({
  className,
  title,
  category,
  image,
  delay,
}: {
  className: string
  delay?: string
  title: string
  category: string
  image: string | null
}) {
  return (
    <div className={`absolute ${className}`}>
      <div className="animate-float rounded-3xl bg-card p-3 shadow-float" style={delay ? { animationDelay: delay } : undefined}>
        <div className="aspect-[4/3] overflow-hidden rounded-2xl">
          <ProductImage src={image} alt={title} category={category} sizes="280px" />
        </div>
        <div className="space-y-1 px-1.5 pb-1 pt-3">
          <p className="text-xs font-semibold text-primary">{category}</p>
          <p className="line-clamp-1 font-display text-base font-semibold sm:text-lg">{title}</p>
        </div>
      </div>
    </div>
  )
}
