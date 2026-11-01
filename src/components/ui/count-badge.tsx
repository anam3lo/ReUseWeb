import { cn } from '@/lib/utils'

interface CountBadgeProps {
  count: number
  /** "inline" fica ao lado do texto; "corner" fica no canto de um ícone */
  placement?: 'inline' | 'corner'
  /** Cor da borda no modo "corner", para destacar do fundo */
  ringClassName?: string
  className?: string
}

/** Selo vermelho com o número de itens novos (ex.: mensagens não lidas). */
export function CountBadge({ count, placement = 'inline', ringClassName = 'border-card', className }: CountBadgeProps) {
  if (count <= 0) return null
  const label = count > 9 ? '9+' : String(count)

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-5 min-w-[20px] animate-pop items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-bold leading-none text-destructive-foreground',
        placement === 'corner' && cn('absolute -right-1.5 -top-1.5 h-[18px] min-w-[18px] border-2 px-1 text-[10px]', ringClassName),
        className
      )}
    >
      {label}
    </span>
  )
}
