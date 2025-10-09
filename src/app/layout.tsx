import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import GlobalMaintenanceCheck from '@/components/GlobalMaintenanceCheck'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReUse - Plataforma de Reutilização',
  description: 'Conecte-se com pessoas para reutilizar itens e reduzir o desperdício',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={inter.className}>
        <GlobalMaintenanceCheck />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
