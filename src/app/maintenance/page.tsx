'use client'

import { useEffect, useState } from 'react'
import { Wrench, Clock, RefreshCw } from 'lucide-react'

interface MaintenanceConfig {
  maintenanceMode: boolean
  maintenanceMessage: string
  lastUpdated?: string
}

export default function MaintenancePage() {
  const [config, setConfig] = useState<MaintenanceConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMaintenanceStatus()
    
    // Verificar status a cada 30 segundos
    const interval = setInterval(fetchMaintenanceStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await fetch('/api/maintenance')
      const data = await response.json()
      setConfig(data)
      
      // Se modo de manutenção foi desativado, redirecionar para home
      if (!data.maintenanceMode) {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    fetchMaintenanceStatus()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-fade-in text-center">
          <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <p className="text-muted-foreground">Verificando status do sistema...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/40 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />

      <div className="relative w-full max-w-xl animate-fade-up">
        <div className="rounded-4xl border bg-card p-8 text-center shadow-lift sm:p-10">
          {/* Ícone de manutenção */}
          <div className="mb-8">
            <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary">
              <Wrench className="h-9 w-9 text-accent" aria-hidden="true" />
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Sistema em Manutenção
            </h1>
            <p className="text-muted-foreground">
              Estamos trabalhando para melhorar sua experiência
            </p>
          </div>

          {/* Mensagem personalizada */}
          <div className="mb-8 rounded-2xl bg-background p-6">
            <p className="text-lg leading-relaxed text-foreground/85">
              {config?.maintenanceMessage || 'Sistema em manutenção. Voltaremos em breve!'}
            </p>
          </div>

          {/* Informações adicionais */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" aria-hidden="true" />
              <span>Voltaremos em breve</span>
            </div>
            
            {config?.lastUpdated && (
              <p className="text-sm text-muted-foreground">
                Última atualização: {new Date(config.lastUpdated).toLocaleString('pt-BR')}
              </p>
            )}
          </div>

          {/* Botão de atualização */}
          <div className="space-y-4">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-[background-color,transform] duration-200 hover:bg-primary-hover active:scale-[0.97] disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>Verificar Novamente</span>
            </button>
            
            <p className="text-sm text-muted-foreground">
              Esta página será atualizada automaticamente quando o sistema voltar ao normal
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          ReUse · Plataforma de Reutilização Sustentável
        </p>
      </div>
    </div>
  )
}
