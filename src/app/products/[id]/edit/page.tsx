import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import Header from '@/components/Header'
import ProductForm from '@/components/ProductForm'
import DeleteProductButton from '@/components/DeleteProductButton'

interface EditProductPageProps {
  params: {
    id: string
  }
}

export const metadata = {
  title: 'Editar anúncio · ReUse',
}

/** Edição de um anúncio já publicado. Só o dono do produto acessa. */
export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      image: true,
      ownerId: true,
    },
  })

  if (!product) {
    notFound()
  }

  // Quem não é dono volta para a página do produto
  if (product.ownerId !== session.user.id) {
    redirect(`/products/${product.id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Link
              href={`/products/${product.id}`}
              className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Voltar ao anúncio
            </Link>
            <h1 className="animate-fade-up text-4xl font-bold tracking-[-0.035em] sm:text-5xl">Editar anúncio</h1>
            <p className="animate-fade-up text-base text-muted-foreground sm:text-lg" style={{ animationDelay: '60ms' }}>
              Atualize as informações de <strong className="font-semibold text-foreground">{product.title}</strong>
            </p>
          </div>
          <DeleteProductButton productId={product.id} productTitle={product.title} redirectTo="/dashboard" />
        </div>

        <ProductForm
          mode="edit"
          productId={product.id}
          initialValues={{
            title: product.title,
            description: product.description,
            category: product.category,
            image: product.image,
          }}
          ownerName={session.user?.name}
          cancelHref={`/products/${product.id}`}
        />
      </main>
    </div>
  )
}
