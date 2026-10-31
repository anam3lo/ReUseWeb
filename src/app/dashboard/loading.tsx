import Header from '@/components/Header'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 sm:py-12" aria-busy="true" aria-label="Carregando dashboard">
        <div className="mb-8 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="mb-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-36 rounded-3xl" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          <Skeleton className="h-96 rounded-4xl" />
          <Skeleton className="h-96 rounded-4xl" />
        </div>
      </main>
    </div>
  )
}
