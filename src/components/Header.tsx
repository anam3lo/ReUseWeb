'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Package,
  Plus,
  User,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import Logo from '@/components/Logo'
import SignOutButton from '@/components/SignOutButton'
import { cn } from '@/lib/utils'
import { getFirstName } from '@/lib/format'

const NAV_LINKS = [
  { href: '/products', label: 'Produtos', icon: Package },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

function isActive(pathname: string, href: string) {
  if (href === '/products') return pathname === '/products' || /^\/products\/(?!new)/.test(pathname)
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Header() {
  const { data: session, status } = useSession()
  const pathname = usePathname() ?? '/'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Sombra sutil no header ao rolar a página
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fecha menus ao trocar de página
  useEffect(() => {
    setMobileOpen(false)
    setMenuOpen(false)
  }, [pathname])

  // Fecha o menu do usuário ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!menuOpen && !mobileOpen) return
    const onPointer = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen, mobileOpen])

  const user = session?.user

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md transition-[box-shadow,border-color] duration-300',
        scrolled ? 'border-border shadow-[0_8px_24px_-20px_rgba(19,34,28,0.5)]' : 'border-transparent'
      )}
    >
      <div className="container flex h-[68px] items-center justify-between gap-4">
        <Logo />

        {/* Navegação desktop */}
        {user && (
          <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200',
                    active ? 'bg-foreground text-background' : 'text-foreground hover:bg-secondary'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {status === 'loading' ? (
            <div className="flex items-center gap-2" aria-label="Carregando sessão">
              <Skeleton className="hidden h-11 w-28 rounded-full sm:block" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          ) : user ? (
            <>
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/products/new">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Anunciar
                </Link>
              </Button>

              {/* Menu do usuário */}
              <div ref={menuRef} className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label="Abrir menu da conta"
                  className="flex items-center gap-1.5 rounded-full p-1 pr-2 transition-colors hover:bg-secondary"
                >
                  <Avatar name={user.name} />
                  <ChevronDown
                    className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', menuOpen && 'rotate-180')}
                    aria-hidden="true"
                  />
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+8px)] w-64 origin-top-right animate-scale-in rounded-2xl border bg-popover p-2 shadow-lift"
                  >
                    <div className="px-3 pb-3 pt-2">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="my-1 h-px bg-border" />
                    <MenuLink href="/profile" icon={User}>Meu perfil</MenuLink>
                    <MenuLink href="/dashboard" icon={LayoutDashboard}>Dashboard</MenuLink>
                    <MenuLink href="/chat" icon={MessageCircle}>Conversas</MenuLink>
                    <div className="my-1 h-px bg-border" />
                    <SignOutButton variant="menu" />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/auth/signin">Entrar</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/auth/signup">Criar conta</Link>
              </Button>
            </>
          )}

          {/* Botão do menu mobile */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div id="mobile-menu" className="animate-slide-down border-t bg-background md:hidden">
          <div className="container flex flex-col gap-1 py-4">
            {user ? (
              <>
                <div className="mb-2 flex items-center gap-3 rounded-2xl bg-card p-3">
                  <Avatar name={user.name} size="lg" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">Olá, {getFirstName(user.name)}</p>
                    <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                {NAV_LINKS.map((link) => (
                  <MobileLink key={link.href} href={link.href} icon={link.icon} active={isActive(pathname, link.href)}>
                    {link.label}
                  </MobileLink>
                ))}
                <MobileLink href="/profile" icon={User} active={pathname === '/profile'}>
                  Meu perfil
                </MobileLink>
                <Button asChild size="lg" className="mt-3 w-full">
                  <Link href="/products/new">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Anunciar produto
                  </Link>
                </Button>
                <div className="mt-2">
                  <SignOutButton variant="menu" className="justify-center" />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/signin">Entrar</Link>
                </Button>
                <Button asChild size="lg">
                  <Link href="/auth/signup">Criar conta</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function MenuLink({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: typeof User
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
    >
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      {children}
    </Link>
  )
}

function MobileLink({
  href,
  icon: Icon,
  active,
  children,
}: {
  href: string
  icon: typeof User
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-base font-medium transition-colors',
        active ? 'bg-mint text-primary' : 'hover:bg-secondary'
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {children}
    </Link>
  )
}
