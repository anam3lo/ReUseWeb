import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PackageSearch, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import ProductGrid from '@/components/ProductGrid'
import SearchAndFilters from '@/components/SearchAndFilters'
import { ProductGridSkeleton } from '@/components/ProductGridSkeleton'

interface SearchParams {
  search?: string
  category?: string
}

interface ProductsPageProps {
  searchParams: SearchParams
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Buscar produtos com filtros
  const whereClause: any = {}

  if (searchParams.search) {
    whereClause.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } }
    ]
  }

  if (searchParams.category) {
    whereClause.category = searchParams.category
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      owner: {
        select: {
          name: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Buscar categorias únicas para o filtro
  const categories = await prisma.product.findMany({
    select: {
      category: true
    },
    distinct: ['category']
  })

  const hasFilters = Boolean(searchParams.search || searchParams.category)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 sm:py-12">
        {/* Título e Filtros */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="animate-fade-up text-4xl font-bold tracking-[-0.035em] sm:text-5xl">
                Produtos disponíveis
              </h1>
              <p className="animate-fade-up text-base text-muted-foreground sm:text-lg" style={{ animationDelay: '60ms' }}>
                Encontre produtos incríveis para reutilizar e dar uma nova vida aos itens
              </p>
            </div>
            <Button asChild className="hidden sm:inline-flex">
              <Link href="/products/new">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Anunciar produto
              </Link>
            </Button>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
            <SearchAndFilters
              categories={categories.map(c => c.category)}
              currentSearch={searchParams.search || ''}
              currentCategory={searchParams.category || ''}
            />
          </div>
        </div>

        {products.length > 0 && (
          <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
            <strong className="text-foreground">{products.length}</strong>{' '}
            {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        )}

        {/* Grid de Produtos */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid products={products} />
        </Suspense>

        {/* Mensagem quando não há produtos */}
        {products.length === 0 && (
          <div className="flex animate-fade-up flex-col items-center gap-4 rounded-3xl border border-dashed bg-card px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mint">
              <PackageSearch className="h-8 w-8 text-primary" aria-hidden="true" />
            </span>
            <p className="text-lg font-semibold">
              {hasFilters
                ? 'Nenhum produto encontrado com os filtros aplicados'
                : 'Nenhum produto disponível no momento'
              }
            </p>
            <p className="max-w-sm text-muted-foreground">
              {hasFilters
                ? 'Tente outra palavra ou escolha uma categoria diferente.'
                : 'Que tal começar anunciando algo que você não usa mais?'}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {hasFilters && (
                <Button asChild variant="outline">
                  <Link href="/products">Ver todos</Link>
                </Button>
              )}
              <Button asChild>
                <Link href="/products/new">Anunciar Primeiro Produto</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
