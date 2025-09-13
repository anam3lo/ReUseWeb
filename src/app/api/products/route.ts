import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const productSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  imageUrl: z.string().url().optional().or(z.literal('')),
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

    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const imageUrl = formData.get('imageUrl') as string
    const imageFile = formData.get('imageFile') as File | null

    // Validação básica
    if (!title || !category) {
      return NextResponse.json(
        { message: 'Título e categoria são obrigatórios' },
        { status: 400 }
      )
    }

    let finalImageUrl = null

    // Se há arquivo de imagem, salvar (por enquanto, usar URL)
    if (imageFile && imageFile.size > 0) {
      // Em produção, você salvaria o arquivo em um serviço como AWS S3
      // Por enquanto, vamos usar uma URL placeholder
      finalImageUrl = 'https://picsum.photos/400/400?random=' + Math.random()
    } else if (imageUrl && imageUrl.trim()) {
      finalImageUrl = imageUrl.trim()
    }

    // Criar produto no banco
    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        category: category.trim(),
        image: finalImageUrl,
        ownerId: session.user.id,
      }
    })

    return NextResponse.json(
      { 
        message: 'Produto criado com sucesso',
        product: {
          id: product.id,
          title: product.title,
          category: product.category
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
