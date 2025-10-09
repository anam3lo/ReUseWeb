// Status de manutenção simples e direto
// Este arquivo é atualizado via API e lido pelo middleware

// 🔧 FORÇAR MODO DE MANUTENÇÃO - ALTERE PARA false PARA DESATIVAR
let maintenanceStatus = {
  isActive: false, // SISTEMA NORMAL
  message: '🛠️ Sistema em manutenção programada. Voltaremos em breve!',
  lastUpdated: Date.now()
}

export function setMaintenanceStatus(isActive: boolean, message?: string) {
  maintenanceStatus = {
    isActive,
    message: message || maintenanceStatus.message,
    lastUpdated: Date.now()
  }
  console.log('🔧 Status de manutenção atualizado:', maintenanceStatus)
}

export function getMaintenanceStatus() {
  return maintenanceStatus
}

export function isMaintenanceActive(): boolean {
  return maintenanceStatus.isActive
}

export function getMaintenanceMessage(): string {
  return maintenanceStatus.message
}
