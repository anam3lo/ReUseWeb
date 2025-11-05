import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // usamos o singleton
import { updateMaintenanceConfig } from '@/lib/maintenance-config'

// GET - Verificar status do modo de manutenção
export async function GET() {
  try {
    const config = await prisma.config.findFirst({
      orderBy: { id: 'desc' },
    })

    if (!config) {
      const newConfig = await prisma.config.create({
        data: {
          maintenanceMode: false,
          maintenanceMessage: 'Sistema em manutenção. Voltaremos em breve!',
        },
      })

      updateMaintenanceConfig?.({
        maintenanceMode: newConfig.maintenanceMode,
        maintenanceMessage:
          newConfig.maintenanceMessage ?? 'Sistema em manutenção. Voltaremos em breve!',
      })

      return NextResponse.json(newConfig)
    }

    updateMaintenanceConfig?.({
      maintenanceMode: config.maintenanceMode,
      maintenanceMessage:
        config.maintenanceMessage ?? 'Sistema em manutenção. Voltaremos em breve!',
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Erro ao verificar modo de manutenção:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}

// PUT - Atualizar modo de manutenção
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { maintenanceMode, maintenanceMessage } = body

    if (typeof maintenanceMode !== 'boolean') {
      return NextResponse.json(
        { error: 'maintenanceMode deve ser um boolean' },
        { status: 400 },
      )
    }

    let config = await prisma.config.findFirst({
      orderBy: { id: 'desc' },
    })

    if (config) {
      config = await prisma.config.update({
        where: { id: config.id },
        data: {
          maintenanceMode,
          maintenanceMessage:
            maintenanceMessage ??
            config.maintenanceMessage ??
            'Sistema em manutenção. Voltaremos em breve!',
        },
      })
    } else {
      config = await prisma.config.create({
        data: {
          maintenanceMode,
          maintenanceMessage:
            maintenanceMessage ?? 'Sistema em manutenção. Voltaremos em breve!',
        },
      })
    }

    updateMaintenanceConfig?.({
      maintenanceMode: config.maintenanceMode,
      maintenanceMessage:
        config.maintenanceMessage ?? 'Sistema em manutenção. Voltaremos em breve!',
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Erro ao atualizar modo de manutenção:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor ao atualizar modo de manutenção' },
      { status: 500 },
    )
  }
}
