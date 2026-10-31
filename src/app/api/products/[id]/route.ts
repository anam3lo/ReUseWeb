import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: { id: string }
}

/**
 * Edita um produto já publicado.
 * Só o dono do anúncio pode editar. Recebe FormData, no mesmo formato do POST /api/products:
 * title, description, category e, opcionalmente, imageFile ou imageUrl (troca a foto)
 * ou removeImage=true (tira a foto). Sem nenhum desses três, a foto atual é mantida.
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
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
        { message: 'Você só pode editar os seus próprios produtos' },
        { status: 403 }
      )
    }

    const formData = await request.formData()

    const title = formData.get('title') as string | null
    const description = formData.get('description') as string | null
    const category = formData.get('category') as string | null
    const imageUrl = formData.get('imageUrl') as string | null
    const imageFile = formData.get('imageFile') as File | null
    const removeImage = formData.get('removeImage') === 'true'

    // Validação básica (mesmas regras do cadastro)
    if (!title?.trim() || !category?.trim()) {
      return NextResponse.json(
        { message: 'Título e categoria são obrigatórios' },
        { status: 400 }
      )
    }

    // undefined = manter a foto atual
    let image: string | null | undefined = undefined

    if (imageFile && imageFile.size > 0) {
      // Mesmo comportamento do cadastro: o arquivo ainda não é salvo em um serviço de armazenamento,
      // então usamos uma imagem de exemplo
      image = 'https://picsum.photos/400/400?random=' + Math.random()
    } else if (imageUrl && imageUrl.trim()) {
      image = imageUrl.trim()
    } else if (removeImage) {
      image = null
    }

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        category: category.trim(),
        ...(image !== undefined ? { image } : {}),
      },
      select: { id: true, title: true, category: true },
    })

    return NextResponse.json(
      { message: 'Produto atualizado com sucesso', product: updated },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao editar produto:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
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
