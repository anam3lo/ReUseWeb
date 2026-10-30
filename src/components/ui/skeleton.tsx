import { cn } from '@/lib/utils'

/** Bloco com brilho animado para estados de carregamento. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn('skeleton', className)} {...props} />
}
