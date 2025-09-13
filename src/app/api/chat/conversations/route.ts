import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar conversas do usuário
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
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
        },
        product: {
          select: {
            id: true,
            title: true,
            image: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    })

    // Agrupar conversas por produto e usuário
    const conversationMap = new Map()
    
    messages.forEach((message: { senderId: string; receiverId: string; receiver: any; sender: any; productId: any; product: any }) => {
      const otherUserId = message.senderId === session.user.id 
        ? message.receiverId 
        : message.senderId
      
      const otherUser = message.senderId === session.user.id 
        ? message.receiver 
        : message.sender
      
      const key = `${message.productId}-${otherUserId}`
      
      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          product: message.product,
          otherUser,
          lastMessage: message,
          unreadCount: 0
        })
      }
      
      // Contar mensagens não lidas (simplificado)
      if (message.receiverId === session.user.id) {
        conversationMap.get(key).unreadCount++
      }
    })

    const conversationList = Array.from(conversationMap.values())

    return NextResponse.json({ 
      conversations: conversationList 
    })
  } catch (error) {
    console.error('Erro ao buscar conversas:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
