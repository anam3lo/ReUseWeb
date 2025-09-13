import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const messageSchema = z.object({
  content: z.string().min(1, 'Mensagem não pode estar vazia'),
  receiverId: z.string().min(1, 'Destinatário é obrigatório'),
  productId: z.string().min(1, 'Produto é obrigatório'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, receiverId, productId } = messageSchema.parse(body)

    // Verificar se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        owner: {
          select: { id: true }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o destinatário existe
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    })

    if (!receiver) {
      return NextResponse.json(
        { message: 'Destinatário não encontrado' },
        { status: 404 }
      )
    }

    // Criar mensagem
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: session.user.id,
        receiverId,
        productId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true
          }
        },
        product: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json(
      { 
        message: 'Mensagem enviada com sucesso',
        data: message
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Erro ao enviar mensagem:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const otherUserId = searchParams.get('otherUserId')

    if (!productId || !otherUserId) {
      return NextResponse.json(
        { message: 'Parâmetros obrigatórios: productId e otherUserId' },
        { status: 400 }
      )
    }

    // Buscar mensagens entre os usuários sobre o produto
    const messages = await prisma.message.findMany({
      where: {
        productId,
        OR: [
          {
            senderId: session.user.id,
            receiverId: otherUserId
          },
          {
            senderId: otherUserId,
            receiverId: session.user.id
          }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
