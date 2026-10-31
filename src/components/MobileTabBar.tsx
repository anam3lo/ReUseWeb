'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Home, LayoutDashboard, MessageCircle, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const HIDDEN_ON = ['/auth', '/maintenance']

const TABS = [
  { href: '/', label: 'Início', icon: Home, match: (p: string) => p === '/' },
  { href: '/products', label: 'Buscar', icon: Search, match: (p: string) => p === '/products' || /^\/products\/(?!new)/.test(p) },
  { href: '/chat', label: 'Chat', icon: MessageCircle, match: (p: string) => p.startsWith('/chat') },
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard, match: (p: string) => p.startsWith('/dashboard') || p.startsWith('/profile') },
]

/**
 * Barra de navegação inferior, só no celular e para usuários logados.
 * Deixa as ações principais ao alcance do polegar.
 */
export default function MobileTabBar() {
  const pathname = usePathname() ?? '/'
  const { data: session } = useSession()

  if (!session || HIDDEN_ON.some((path) => pathname.startsWith(path))) return null

  const [first, second, third, fourth] = TABS

  return (
    <>
      {/* Espaço para o conteúdo não ficar escondido atrás da barra */}
      <div className="h-24 md:hidden" aria-hidden="true" />
      <nav
        aria-label="Navegação inferior"
        className="fixed inset-x-3 bottom-3 z-40 animate-slide-up rounded-3xl bg-foreground px-2 py-2 shadow-float md:hidden"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <ul className="flex items-center justify-around">
          <TabItem tab={first} active={first.match(pathname)} />
          <TabItem tab={second} active={second.match(pathname)} />
          <li>
            <Link
              href="/products/new"
              aria-label="Anunciar produto"
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground transition-transform duration-200 active:scale-90',
                pathname === '/products/new' && 'ring-2 ring-accent ring-offset-2 ring-offset-foreground'
              )}
            >
              <Plus className="h-6 w-6" strokeWidth={2.4} aria-hidden="true" />
            </Link>
          </li>
          <TabItem tab={third} active={third.match(pathname)} />
          <TabItem tab={fourth} active={fourth.match(pathname)} />
        </ul>
      </nav>
    </>
  )
}

function TabItem({ tab, active }: { tab: (typeof TABS)[number]; active: boolean }) {
  const Icon = tab.icon
  return (
    <li>
      <Link
        href={tab.href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex min-w-[56px] flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-medium transition-colors duration-200 active:scale-95',
          active ? 'text-accent' : 'text-background/70 hover:text-background'
        )}
      >
        <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
        {tab.label}
      </Link>
    </li>
  )
}
