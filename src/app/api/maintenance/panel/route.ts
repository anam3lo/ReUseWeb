import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Type assertion para resolver problema de tipos
const prismaWithConfig = prisma as any

// GET - Painel de controle para Node-RED (interface web)
export async function GET(request: NextRequest) {
  try {
    const config = await prismaWithConfig.config.findFirst({
      orderBy: { id: 'desc' }
    })

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel de Controle - Modo de Manutenção</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#4f46e5',
                        secondary: '#64748b'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    🔧 Painel de Controle - Modo de Manutenção
                </h1>
                <p class="text-gray-600">
                    Controle o modo de manutenção do sistema ReUseWeb
                </p>
            </div>

            <!-- Status Atual -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4">Status Atual</h2>
                <div id="current-status" class="space-y-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-3 h-3 rounded-full ${config?.maintenanceMode ? 'bg-red-500' : 'bg-green-500'}" id="status-indicator"></div>
                        <span class="font-medium" id="status-text">
                            ${config?.maintenanceMode ? 'Modo de Manutenção ATIVO' : 'Sistema NORMAL'}
                        </span>
                    </div>
                    <div class="text-sm text-gray-600">
                        <p><strong>Mensagem:</strong> <span id="current-message">${config?.maintenanceMessage || 'N/A'}</span></p>
                        <p><strong>Última atualização:</strong> <span id="last-updated">${config?.updatedAt ? new Date(config.updatedAt).toLocaleString('pt-BR') : 'N/A'}</span></p>
                    </div>
                </div>
            </div>

            <!-- Controles -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4">Controles</h2>
                
                <!-- Ativar/Desativar -->
                <div class="mb-6">
                    <h3 class="text-lg font-medium mb-3">Modo de Manutenção</h3>
                    <div class="flex space-x-4">
                        <button 
                            onclick="toggleMaintenance(true)" 
                            class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                            ${config?.maintenanceMode ? 'disabled class="bg-gray-400 cursor-not-allowed"' : ''}
                        >
                            🔴 Ativar Manutenção
                        </button>
                        <button 
                            onclick="toggleMaintenance(false)" 
                            class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                            ${!config?.maintenanceMode ? 'disabled class="bg-gray-400 cursor-not-allowed"' : ''}
                        >
                            🟢 Desativar Manutenção
                        </button>
                    </div>
                </div>

                <!-- Mensagem Personalizada -->
                <div class="mb-6">
                    <h3 class="text-lg font-medium mb-3">Mensagem Personalizada</h3>
                    <div class="space-y-3">
                        <textarea 
                            id="custom-message" 
                            placeholder="Digite uma mensagem personalizada para os usuários..."
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="3"
                        >${config?.maintenanceMessage || ''}</textarea>
                        <button 
                            onclick="updateMessage()" 
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Atualizar Mensagem
                        </button>
                    </div>
                </div>

                <!-- Atualizar Status -->
                <div class="flex justify-end">
                    <button 
                        onclick="refreshStatus()" 
                        class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                    >
                        🔄 Atualizar Status
                    </button>
                </div>
            </div>

            <!-- Log de Atividades -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Log de Atividades</h2>
                <div id="activity-log" class="space-y-2 text-sm">
                    <p class="text-gray-600">Nenhuma atividade registrada ainda.</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        let activityLog = [];

        function addToLog(message) {
            const timestamp = new Date().toLocaleString('pt-BR');
            activityLog.unshift(\`[\${timestamp}] \${message}\`);
            if (activityLog.length > 10) activityLog.pop();
            
            const logElement = document.getElementById('activity-log');
            logElement.innerHTML = activityLog.map(log => \`<p class="text-gray-700">\${log}</p>\`).join('');
        }

        async function toggleMaintenance(enable) {
            try {
                const response = await fetch('/api/maintenance/control', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        maintenanceMode: enable,
                        apiKey: '${process.env.MAINTENANCE_API_KEY || 'default-key'}'
                    })
                });

                const result = await response.json();
                
                if (result.success) {
                    addToLog(\`Modo de manutenção \${enable ? 'ATIVADO' : 'DESATIVADO'}\`);
                    setTimeout(refreshStatus, 1000);
                } else {
                    alert('Erro: ' + result.error);
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao atualizar modo de manutenção');
            }
        }

        async function updateMessage() {
            const message = document.getElementById('custom-message').value;
            
            try {
                const response = await fetch('/api/maintenance/control', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        maintenanceMode: ${config?.maintenanceMode || false},
                        maintenanceMessage: message,
                        apiKey: '${process.env.MAINTENANCE_API_KEY || 'default-key'}'
                    })
                });

                const result = await response.json();
                
                if (result.success) {
                    addToLog('Mensagem personalizada atualizada');
                    setTimeout(refreshStatus, 1000);
                } else {
                    alert('Erro: ' + result.error);
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao atualizar mensagem');
            }
        }

        async function refreshStatus() {
            try {
                const response = await fetch('/api/maintenance');
                const data = await response.json();
                
                // Atualizar indicadores visuais
                const indicator = document.getElementById('status-indicator');
                const statusText = document.getElementById('status-text');
                const currentMessage = document.getElementById('current-message');
                const lastUpdated = document.getElementById('last-updated');
                
                if (data.maintenanceMode) {
                    indicator.className = 'w-3 h-3 rounded-full bg-red-500';
                    statusText.textContent = 'Modo de Manutenção ATIVO';
                } else {
                    indicator.className = 'w-3 h-3 rounded-full bg-green-500';
                    statusText.textContent = 'Sistema NORMAL';
                }
                
                currentMessage.textContent = data.maintenanceMessage || 'N/A';
                lastUpdated.textContent = data.updatedAt ? new Date(data.updatedAt).toLocaleString('pt-BR') : 'N/A';
                
                // Atualizar textarea
                document.getElementById('custom-message').value = data.maintenanceMessage || '';
                
                addToLog('Status atualizado');
            } catch (error) {
                console.error('Erro ao atualizar status:', error);
                alert('Erro ao atualizar status');
            }
        }

        // Auto-refresh a cada 30 segundos
        setInterval(refreshStatus, 30000);
    </script>
</body>
</html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Erro ao gerar painel:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
