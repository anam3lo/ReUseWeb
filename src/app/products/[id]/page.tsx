import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, ChevronLeft, Mail, MessageCircle, Pencil, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import Header from '@/components/Header'
import InterestedButton from '@/components/InterestedButton'
import DeleteProductButton from '@/components/DeleteProductButton'
import ProductImage from '@/components/ProductImage'

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
  const createdAt = new Date(product.createdAt)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6 sm:py-10">
        {/* Navegação estrutural */}
        <nav aria-label="Navegação estrutural" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/products" className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary-hover">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Voltar aos Produtos
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="transition-colors hover:text-foreground"
          >
            {product.category}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="line-clamp-1 text-foreground" aria-current="page">{product.title}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          {/* Imagem do Produto */}
          <div className="group relative aspect-square animate-fade-up overflow-hidden rounded-4xl border bg-card lg:sticky lg:top-24">
            <ProductImage
              src={product.image}
              alt={product.title}
              category={product.category}
              iconSize="lg"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </div>

          {/* Informações do Produto */}
          <div className="flex animate-fade-up flex-col gap-7" style={{ animationDelay: '100ms' }}>
            <div className="space-y-4">
              <Badge variant="secondary" className="text-[13px]">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold leading-[1.04] tracking-[-0.035em] sm:text-5xl">{product.title}</h1>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Anunciado em {createdAt.toLocaleDateString('pt-BR')}
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="eyebrow text-muted-foreground">Descrição</h2>
              <p className="whitespace-pre-line text-[17px] leading-relaxed text-foreground/85">
                {product.description || 'Sem descrição disponível'}
              </p>
            </section>

            {/* Informações do Anunciante */}
            <section aria-labelledby="owner-heading" className="rounded-3xl border bg-card p-5">
              <h2 id="owner-heading" className="eyebrow mb-4 text-muted-foreground">
                Informações do Anunciante
              </h2>
              <div className="flex items-center gap-4">
                <Avatar name={product.owner.name} size="lg" tone="primary" />
                <div className="min-w-0 space-y-1">
                  <p className="text-base font-semibold">{product.owner.name}</p>
                  <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{product.owner.email}</span>
                  </p>
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row">
              {!isOwner ? (
                <>
                  <Button size="lg" className="h-14 flex-1 text-base" asChild>
                    <Link href="/chat">
                      <MessageCircle className="h-5 w-5" aria-hidden="true" />
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
                <div className="flex w-full flex-col gap-3">
                  <div className="flex items-center justify-center gap-2 rounded-2xl bg-mint px-4 py-3 text-sm font-semibold text-primary">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Este é seu produto
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button size="lg" className="h-14 flex-1 text-base" asChild>
                      <Link href={`/products/${product.id}/edit`}>
                        <Pencil className="h-5 w-5" aria-hidden="true" />
                        Editar anúncio
                      </Link>
                    </Button>
                    <DeleteProductButton
                      productId={product.id}
                      productTitle={product.title}
                      redirectTo="/dashboard"
                      className="h-14"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
