import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  className?: string
  label?: string
}

/** Indicador de carregamento acessível. */
export function Spinner({ className, label = 'Carregando' }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <Loader2 className={cn('h-4 w-4 animate-spin', className)} aria-hidden="true" />
    </span>
  )
}
