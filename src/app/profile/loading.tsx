import Header from '@/components/Header'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductGridSkeleton } from '@/components/ProductGridSkeleton'

export default function LoadingProfile() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container space-y-8 py-6 sm:py-10" aria-busy="true" aria-label="Carregando perfil">
        <Skeleton className="h-80 w-full rounded-4xl" />
        <ProductGridSkeleton count={4} />
      </main>
    </div>
  )
}
