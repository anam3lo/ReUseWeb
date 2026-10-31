import Header from '@/components/Header'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingNewProduct() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 sm:py-12" aria-busy="true" aria-label="Carregando">
        <Skeleton className="mb-3 h-12 w-80 max-w-full" />
        <Skeleton className="mb-8 h-5 w-96 max-w-full" />
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
          <Skeleton className="h-[560px] rounded-4xl" />
          <Skeleton className="h-80 rounded-3xl max-lg:hidden" />
        </div>
      </main>
    </div>
  )
}
