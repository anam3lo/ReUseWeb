import Link from 'next/link'
import Logo from '@/components/Logo'

const COLUMNS = [
  {
    title: 'Plataforma',
    links: [
      { href: '/products', label: 'Produtos' },
      { href: '/products/new', label: 'Anunciar' },
      { href: '/chat', label: 'Chat' },
    ],
  },
  {
    title: 'Conta',
    links: [
      { href: '/auth/signin', label: 'Entrar' },
      { href: '/auth/signup', label: 'Criar conta' },
      { href: '/dashboard', label: 'Dashboard' },
    ],
  },
]

export default function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex flex-col justify-between gap-10 py-12 md:flex-row">
        <div className="max-w-xs space-y-3">
          <Logo />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Conectando pessoas para um mundo mais sustentável.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:gap-16">
          {COLUMNS.map((column) => (
            <div key={column.title} className="space-y-3 text-sm">
              <p className="font-semibold">{column.title}</p>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container border-t py-5 text-xs text-muted-foreground">
        © {new Date().getFullYear()} ReUse
      </div>
    </footer>
  )
}
