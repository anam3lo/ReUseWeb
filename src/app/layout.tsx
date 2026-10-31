import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import GlobalMaintenanceCheck from '@/components/GlobalMaintenanceCheck'
import MobileTabBar from '@/components/MobileTabBar'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  title: 'ReUse - Plataforma de Reutilização',
  description: 'Conecte-se com pessoas para reutilizar itens e reduzir o desperdício',
}

export const viewport: Viewport = {
  themeColor: '#F7F6F1',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        {/* Sem JavaScript, o conteúdo com animação de entrada aparece direto */}
        <noscript>
          <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body className="min-h-screen font-sans">
        <GlobalMaintenanceCheck />
        <Providers>
          {children}
          <MobileTabBar />
        </Providers>
      </body>
    </html>
  )
}
