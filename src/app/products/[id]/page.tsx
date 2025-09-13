import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SignOutButton from '@/components/SignOutButton'
import InterestedButton from '@/components/InterestedButton'
import Image from 'next/image'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const product = await prisma.product.findUnique({
    where: {
      id: params.id
    },
    include: {
      owner: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  if (!product) {
    notFound()
  }

  const isOwner = product.ownerId === session.user.id

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/products" className="text-2xl font-bold text-green-600 hover:text-green-700">
                ReUse
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <span className="text-gray-700">Olá, {session.user?.name}</span>
              <Button asChild>
                <Link href="/products">Voltar aos Produtos</Link>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagem do Produto */}
          <div className="aspect-square relative overflow-hidden rounded-lg">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-gray-400 text-8xl">📦</div>
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <Badge variant="secondary" className="text-sm">
                  {product.category}
                </Badge>
              </div>
              <p className="text-gray-600">Por {product.owner.name}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Descrição</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'Sem descrição disponível'}
              </p>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Informações do Anunciante</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Nome:</strong> {product.owner.name}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {product.owner.email}
                </p>
                <p className="text-gray-700">
                  <strong>Anunciado em:</strong> {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              {!isOwner ? (
                <>
                  <Button size="lg" className="flex-1" asChild>
                    <Link href="/chat">
                      Enviar Mensagem
                    </Link>
                  </Button>
                  <InterestedButton 
                    productId={product.id}
                    ownerId={product.ownerId}
                    currentUserId={session.user.id}
                  />
                </>
              ) : (
                <div className="flex-1 text-center py-2 text-gray-500">
                  Este é seu produto
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
