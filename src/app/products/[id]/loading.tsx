import Header from '@/components/Header'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingProduct() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 sm:py-10" aria-busy="true" aria-label="Carregando produto">
        <Skeleton className="mb-6 h-5 w-64" />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <Skeleton className="aspect-square rounded-4xl" />
          <div className="space-y-6">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-14 w-4/5" />
            <Skeleton className="h-4 w-40" />
            <div className="space-y-2.5 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-28 w-full rounded-3xl" />
            <div className="flex gap-3">
              <Skeleton className="h-14 flex-1 rounded-full" />
              <Skeleton className="h-14 flex-1 rounded-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
