import Link from 'next/link'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  href?: string
  className?: string
  /** "dark" para usar sobre fundos escuros */
  tone?: 'default' | 'dark'
}

export function LogoMark({ tone = 'default', className }: { tone?: 'default' | 'dark'; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-[11px] transition-transform duration-500 ease-smooth group-hover:rotate-[-25deg]',
        tone === 'dark' ? 'bg-accent text-primary' : 'bg-primary text-accent',
        className
      )}
    >
      <RefreshCw className="h-[18px] w-[18px]" strokeWidth={2.6} />
    </span>
  )
}

export default function Logo({ href = '/', className, tone = 'default' }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="ReUse — página inicial"
      className={cn('group inline-flex items-center gap-2.5', className)}
    >
      <LogoMark tone={tone} />
      <span
        className={cn(
          'font-display text-[22px] font-bold tracking-[-0.02em]',
          tone === 'dark' ? 'text-white' : 'text-foreground'
        )}
      >
        ReUse
      </span>
    </Link>
  )
}
