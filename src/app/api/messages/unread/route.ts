import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Sempre consultar o banco (nunca usar cache), pois o número muda a todo momento
export const dynamic = 'force-dynamic'

/** Quantidade de mensagens recebidas pelo usuário logado que ainda não foram lidas. */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const count = await prisma.message.count({
      where: {
        receiverId: session.user.id,
        read: false,
      },
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Erro ao contar mensagens não lidas:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
