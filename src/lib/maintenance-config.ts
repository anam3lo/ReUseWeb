// Configuração simples para modo de manutenção
// Este arquivo é atualizado via API e lido pelo middleware

export interface MaintenanceConfig {
  maintenanceMode: boolean
  maintenanceMessage: string
  lastUpdated: number
}

// Configuração padrão - FORÇAR MODO DE MANUTENÇÃO ATIVO
let config: MaintenanceConfig = {
  maintenanceMode: true,
  maintenanceMessage: '🛠️ Sistema em manutenção programada. Voltaremos em breve!',
  lastUpdated: Date.now()
}

// Função para atualizar configuração
export function updateMaintenanceConfig(newConfig: Partial<MaintenanceConfig>) {
  config = {
    ...config,
    ...newConfig,
    lastUpdated: Date.now()
  }
  console.log('🔧 Configuração de manutenção atualizada:', config)
}

// Função para obter configuração
export function getMaintenanceConfig(): MaintenanceConfig {
  return config
}

// Função para verificar se está em manutenção
export function isMaintenanceMode(): boolean {
  return config.maintenanceMode
}

// Função para obter mensagem de manutenção
export function getMaintenanceMessage(): string {
  return config.maintenanceMessage
}
