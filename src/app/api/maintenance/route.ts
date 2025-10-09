import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { updateMaintenanceConfig, getMaintenanceConfig } from '@/lib/maintenance-config'

const prisma = new PrismaClient()

// Type assertion para resolver problema de tipos
const prismaWithConfig = prisma as any

// GET - Verificar status do modo de manutenção
export async function GET() {
  try {
    const config = await prismaWithConfig.config.findFirst({
      orderBy: { id: 'desc' }
    })

    if (!config) {
      // Se não existe configuração, criar uma padrão
      const newConfig = await prismaWithConfig.config.create({
        data: {
          maintenanceMode: false,
          maintenanceMessage: 'Sistema em manutenção. Voltaremos em breve!'
        }
      })
      
      // Atualizar configuração local
      updateMaintenanceConfig({
        maintenanceMode: newConfig.maintenanceMode,
        maintenanceMessage: newConfig.maintenanceMessage
      })
      
      return NextResponse.json(newConfig)
    }

    // Atualizar configuração local
    updateMaintenanceConfig({
      maintenanceMode: config.maintenanceMode,
      maintenanceMessage: config.maintenanceMessage
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Erro ao verificar modo de manutenção:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar modo de manutenção
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { maintenanceMode, maintenanceMessage } = body

    // Validar dados
    if (typeof maintenanceMode !== 'boolean') {
      return NextResponse.json(
        { error: 'maintenanceMode deve ser um boolean' },
        { status: 400 }
      )
    }

    // Buscar configuração existente ou criar nova
    let config = await prismaWithConfig.config.findFirst({
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
    updateMaintenanceConfig({
      maintenanceMode: config.maintenanceMode,
      maintenanceMessage: config.maintenanceMessage
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Erro ao atualizar modo de manutenção:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
