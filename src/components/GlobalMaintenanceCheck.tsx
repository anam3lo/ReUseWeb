'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface MaintenanceConfig {
  maintenanceMode: boolean
  maintenanceMessage: string
}

export default function GlobalMaintenanceCheck() {
  const [isLoading, setIsLoading] = useState(true)
  const [maintenanceActive, setMaintenanceActive] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkMaintenanceStatus()
    
    // Verificar a cada 30 segundos
    const interval = setInterval(checkMaintenanceStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkMaintenanceStatus = async () => {
    try {
      const response = await fetch('/api/maintenance')
      const config: MaintenanceConfig = await response.json()
      
      setMaintenanceActive(config.maintenanceMode)
      
      if (config.maintenanceMode) {
        // Se modo de manutenção está ativo e não está na página de manutenção
        if (pathname !== '/maintenance') {
          console.log('🔧 Modo de manutenção ativo - redirecionando para manutenção...')
          router.push('/maintenance')
        }
      } else {
        // Se não está em manutenção e está na página de manutenção, redirecionar para home
        if (pathname === '/maintenance') {
          console.log('🟢 Sistema normal - redirecionando para home...')
          router.push('/')
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status de manutenção:', error)
      // Em caso de erro, assumir que está em manutenção por segurança
      setMaintenanceActive(true)
      if (pathname !== '/maintenance') {
        router.push('/maintenance')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Se está carregando, não mostrar nada (deixar o site carregar normalmente)
  if (isLoading) {
    return null
  }

  // Se está em manutenção e não é a página de manutenção, redirecionar silenciosamente
  if (maintenanceActive && pathname !== '/maintenance') {
    return null // O redirecionamento já foi feito no useEffect
  }

  return null // Componente invisível
}
