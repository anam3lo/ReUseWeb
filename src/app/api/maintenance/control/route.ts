import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { setMaintenanceStatus } from '@/lib/maintenance-status'

const prisma = new PrismaClient()

// Type assertion para resolver problema de tipos
const prismaWithConfig = prisma as any

// POST - Controle externo do modo de manutenção (para Node-RED)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      maintenanceMode, 
      maintenanceMessage,
      apiKey 
    } = body

    // Verificar API Key (opcional, mas recomendado para segurança)
    const expectedApiKey = process.env.MAINTENANCE_API_KEY
    if (expectedApiKey && apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: 'API Key inválida' },
        { status: 401 }
      )
    }

    // Validar dados
    if (typeof maintenanceMode !== 'boolean') {
      return NextResponse.json(
        { error: 'maintenanceMode deve ser um boolean' },
        { status: 400 }
      )
    }

    // Buscar configuração existente ou criar nova
    let config = await prisma.config.findFirst({
      orderBy: { id: 'desc' }
    })

    if (config) {
      // Atualizar configuração existente
      config = await prismaWithConfig.config.update({
        where: { id: config.id },
        data: {
          maintenanceMode,
          maintenanceMessage: maintenanceMessage || config.maintenanceMessage
        }
      })
    } else {
      // Criar nova configuração
      config = await prismaWithConfig.config.create({
        data: {
          maintenanceMode,
          maintenanceMessage: maintenanceMessage || 'Sistema em manutenção. Voltaremos em breve!'
        }
      })
    }

    // Atualizar configuração local
    setMaintenanceStatus(config.maintenanceMode, config.maintenanceMessage)

    // Log da ação para auditoria
    console.log(`Modo de manutenção ${maintenanceMode ? 'ATIVADO' : 'DESATIVADO'} via API externa`)

    return NextResponse.json({
      success: true,
      config,
      message: `Modo de manutenção ${maintenanceMode ? 'ativado' : 'desativado'} com sucesso`
    })
  } catch (error) {
    console.error('Erro ao controlar modo de manutenção:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET - Status atual para Node-RED
export async function GET() {
  try {
    const config = await prismaWithConfig.config.findFirst({
      orderBy: { id: 'desc' }
    })

    if (!config) {
      return NextResponse.json({
        maintenanceMode: false,
        maintenanceMessage: 'Sistema em manutenção. Voltaremos em breve!',
        message: 'Nenhuma configuração encontrada'
      })
    }

    return NextResponse.json({
      maintenanceMode: config.maintenanceMode,
      maintenanceMessage: config.maintenanceMessage,
      lastUpdated: config.updatedAt
    })
  } catch (error) {
    console.error('Erro ao verificar status:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
