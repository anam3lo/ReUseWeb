import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/format'

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-28 w-28 text-4xl sm:h-32 sm:w-32',
} as const

const TONES = {
  accent: 'bg-accent text-accent-foreground',
  mint: 'bg-mint text-primary',
  primary: 'bg-primary text-accent',
} as const

interface AvatarProps {
  name?: string | null
  size?: keyof typeof SIZES
  tone?: keyof typeof TONES
  className?: string
}

/** Avatar com as iniciais do usuário (o projeto não armazena foto de perfil). */
export function Avatar({ name, size = 'md', tone = 'accent', className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full font-display font-bold',
        SIZES[size],
        TONES[tone],
        className
      )}
    >
      {getInitials(name)}
    </span>
  )
}
