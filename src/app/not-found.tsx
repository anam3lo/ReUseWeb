import Link from 'next/link'
import { ArrowLeft, PackageSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="container py-5">
        <Logo />
      </div>
      <main className="container flex flex-1 animate-fade-up flex-col items-center justify-center gap-5 pb-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-mint">
          <PackageSearch className="h-10 w-10 text-primary" aria-hidden="true" />
        </span>
        <p className="eyebrow">Erro 404</p>
        <h1 className="text-4xl font-bold tracking-[-0.035em] sm:text-5xl">Página não encontrada</h1>
        <p className="max-w-md text-muted-foreground">
          O endereço pode estar errado ou o produto pode ter sido removido.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link href="/products">Ver produtos</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Página inicial
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
