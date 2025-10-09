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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Verificando status do sistema...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Ícone de manutenção */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
              <Wrench className="h-10 w-10 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sistema em Manutenção
            </h1>
            <p className="text-gray-600">
              Estamos trabalhando para melhorar sua experiência
            </p>
          </div>

          {/* Mensagem personalizada */}
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {config?.maintenanceMessage || 'Sistema em manutenção. Voltaremos em breve!'}
              </p>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span>Voltaremos em breve</span>
            </div>
            
            {config?.lastUpdated && (
              <p className="text-sm text-gray-500">
                Última atualização: {new Date(config.lastUpdated).toLocaleString('pt-BR')}
              </p>
            )}
          </div>

          {/* Botão de atualização */}
          <div className="space-y-4">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Verificar Novamente</span>
            </button>
            
            <p className="text-sm text-gray-500">
              Esta página será atualizada automaticamente quando o sistema voltar ao normal
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            ReUseWeb - Plataforma de Reutilização Sustentável
          </p>
        </div>
      </div>
    </div>
  )
}
