import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SignOutButton from '@/components/SignOutButton'

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
              <SignOutButton />
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Gerencie seus produtos e mensagens</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Meus Produtos */}
          <Card>
            <CardHeader>
              <CardTitle>Meus Produtos</CardTitle>
              <CardDescription>
                Seus produtos anunciados na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProducts.length > 0 ? (
                <div className="space-y-4">
                  {userProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{product.title}</h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))}
                  <Button asChild className="w-full">
                    <Link href="/products">Ver Todos os Produtos</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Você ainda não anunciou nenhum produto</p>
                  <Button asChild>
                    <Link href="/products/new">Anunciar Primeiro Produto</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mensagens Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Mensagens Recentes</CardTitle>
              <CardDescription>
                Últimas mensagens recebidas sobre seus produtos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentMessages.length > 0 ? (
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{message.sender.name}</p>
                          <p className="text-sm text-gray-600">{message.product.title}</p>
                          <p className="text-sm text-gray-500 mt-1">{message.content}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(message.timestamp).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  ))}
                  <Button asChild className="w-full">
                    <Link href="/chat">Ver Todas as Mensagens</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma mensagem recebida ainda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{userProducts.length}</div>
                <div className="text-sm text-gray-600">Produtos Anunciados</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{recentMessages.length}</div>
                <div className="text-sm text-gray-600">Mensagens Recebidas</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Produtos Vendidos</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
