'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

/** De quanto em quanto tempo o app confere se chegaram mensagens novas */
const POLL_INTERVAL_MS = 15_000

interface UnreadMessagesContextValue {
  /** Mensagens recebidas e ainda não lidas */
  count: number
  /** Busca o número de novo na hora (ex.: depois de abrir uma conversa) */
  refresh: () => void
}

const UnreadMessagesContext = createContext<UnreadMessagesContextValue>({
  count: 0,
  refresh: () => {},
})

/** Número de mensagens não lidas, compartilhado entre cabeçalho, barra inferior e páginas. */
export function useUnreadMessages() {
  return useContext(UnreadMessagesContext)
}

/** Texto curto para o selo (ex.: 3, 9+). */
export function formatBadgeCount(count: number) {
  return count > 9 ? '9+' : String(count)
}

export function UnreadMessagesProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const pathname = usePathname()
  const [count, setCount] = useState(0)
  const inFlight = useRef(false)

  const refresh = useCallback(async () => {
    if (status !== 'authenticated' || inFlight.current) return
    inFlight.current = true
    try {
      const response = await fetch('/api/messages/unread', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setCount(typeof data.count === 'number' ? data.count : 0)
      }
    } catch (error) {
      // Sem conexão: mantém o último número e tenta de novo no próximo ciclo
      console.error('Erro ao verificar mensagens não lidas:', error)
    } finally {
      inFlight.current = false
    }
  }, [status])

  // Confere ao entrar, a cada 15s e quando a pessoa volta para a aba
  useEffect(() => {
    if (status !== 'authenticated') {
      setCount(0)
      return
    }

    refresh()
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') refresh()
    }, POLL_INTERVAL_MS)

    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
    }
  }, [status, refresh])

  // Mostra o número no título da aba: "(2) ReUse - ..."
  // (pequeno atraso porque o Next.js também atualiza o título ao trocar de página)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const base = document.title.replace(/^\(\d+\+?\)\s*/, '')
      document.title = count > 0 ? `(${formatBadgeCount(count)}) ${base}` : base
    }, 60)
    return () => window.clearTimeout(timer)
  }, [count, pathname])

  return (
    <UnreadMessagesContext.Provider value={{ count, refresh }}>
      {children}
    </UnreadMessagesContext.Provider>
  )
}
