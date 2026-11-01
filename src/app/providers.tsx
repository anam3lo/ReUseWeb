'use client'

import { SessionProvider } from 'next-auth/react'
import { UnreadMessagesProvider } from '@/components/UnreadMessagesProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UnreadMessagesProvider>
        {children}
      </UnreadMessagesProvider>
    </SessionProvider>
  )
}
