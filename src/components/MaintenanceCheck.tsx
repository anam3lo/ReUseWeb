'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface MaintenanceConfig {
  maintenanceMode: boolean
  maintenanceMessage: string
}

export default function MaintenanceCheck() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkMaintenanceStatus()
  }, [])

  const checkMaintenanceStatus = async () => {
    try {
      const response = await fetch('/api/maintenance')
      const config: MaintenanceConfig = await response.json()
      
      if (config.maintenanceMode) {
        // Se modo de manutenção está ativo, redirecionar
        console.log('🔧 Modo de manutenção ativo - redirecionando...')
        router.push('/maintenance')
      } else {
        // Se não está em manutenção, continuar normalmente
        console.log('🟢 Sistema normal - continuando...')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Erro ao verificar status de manutenção:', error)
      // Em caso de erro, continuar normalmente
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-mint border-t-primary"></div>
          <p className="text-muted-foreground">Verificando status do sistema...</p>
        </div>
      </div>
    )
  }

  return null // Componente invisível quando não está carregando
}
