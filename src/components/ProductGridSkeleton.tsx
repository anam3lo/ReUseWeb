import { Skeleton } from '@/components/ui/skeleton'

/** Grade de cards "fantasma" exibida enquanto os produtos carregam. */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Carregando produtos">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-3xl border bg-card p-2.5">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-2.5 px-2 pb-2 pt-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full max-sm:hidden" />
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
