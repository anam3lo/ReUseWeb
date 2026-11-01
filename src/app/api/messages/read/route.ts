import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const readSchema = z.object({
  productId: z.string().min(1),
  otherUserId: z.string().min(1),
})

/**
 * Marca como lidas as mensagens de uma conversa
 * (as que o usuário logado recebeu da outra pessoa sobre aquele produto).
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const parsed = readSchema.safeParse(await request.json().catch(() => null))

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Parâmetros obrigatórios: productId e otherUserId' },
        { status: 400 }
      )
    }

    const { productId, otherUserId } = parsed.data

    const result = await prisma.message.updateMany({
      where: {
        productId,
        senderId: otherUserId,
        receiverId: session.user.id,
        read: false,
      },
      data: { read: true },
    })

    return NextResponse.json({ updated: result.count })
  } catch (error) {
    console.error('Erro ao marcar mensagens como lidas:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
