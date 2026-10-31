import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: { id: string }
}

/**
 * Exclui um produto.
 * Só o dono do anúncio pode excluir. As mensagens ligadas ao produto
 * são removidas junto (onDelete: Cascade no schema do Prisma).
 */
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: { id: true, ownerId: true },
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    if (product.ownerId !== session.user.id) {
      return NextResponse.json(
        { message: 'Você só pode excluir os seus próprios produtos' },
        { status: 403 }
      )
    }

    await prisma.product.delete({
      where: { id: product.id },
    })

    return NextResponse.json(
      { message: 'Produto excluído com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
