import Header from '@/components/Header'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductGridSkeleton } from '@/components/ProductGridSkeleton'

export default function LoadingProducts() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 sm:py-12">
        <div className="mb-8 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-12 w-72 max-w-full" />
            <Skeleton className="h-5 w-96 max-w-full" />
          </div>
          <Skeleton className="h-32 w-full rounded-3xl" />
        </div>
        <ProductGridSkeleton />
      </main>
    </div>
  )
}
