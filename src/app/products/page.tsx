import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import SignOutButton from '@/components/SignOutButton'
import ProductGrid from '@/components/ProductGrid'
import SearchAndFilters from '@/components/SearchAndFilters'

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600 hover:text-green-700">
                ReUse
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <span className="text-gray-700">Olá, {session.user?.name}</span>
              <Button asChild>
                <Link href="/products/new">Anunciar Produto</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <SignOutButton />
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título e Filtros */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Produtos Disponíveis</h1>
          <p className="text-gray-600 mb-6">
            Encontre produtos incríveis para reutilizar e dar uma nova vida aos itens
          </p>
          
          <SearchAndFilters 
            categories={categories.map(c => c.category)}
            currentSearch={searchParams.search || ''}
            currentCategory={searchParams.category || ''}
          />
        </div>

        {/* Grid de Produtos */}
        <Suspense fallback={<div>Carregando produtos...</div>}>
          <ProductGrid products={products} />
        </Suspense>

        {/* Mensagem quando não há produtos */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {searchParams.search || searchParams.category 
                ? 'Nenhum produto encontrado com os filtros aplicados'
                : 'Nenhum produto disponível no momento'
              }
            </div>
            <Button asChild>
              <Link href="/products/new">Anunciar Primeiro Produto</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
