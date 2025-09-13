import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar usuários de exemplo
  const hashedPassword = await bcrypt.hash('123456', 12)
  
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@reuse.com' },
    update: {},
    create: {
      email: 'admin@reuse.com',
      name: 'Administrador',
      password: hashedPassword,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'maria@reuse.com' },
    update: {},
    create: {
      email: 'maria@reuse.com',
      name: 'Maria Silva',
      password: hashedPassword,
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'joao@reuse.com' },
    update: {},
    create: {
      email: 'joao@reuse.com',
      name: 'João Santos',
      password: hashedPassword,
    },
  })

  // Criar produtos de exemplo
  const products = [
    {
      title: 'iPhone 12 em ótimo estado',
      description: 'Vendo iPhone 12 com 128GB, sem riscos na tela, bateria 85%. Acessórios originais incluídos.',
      category: 'Eletrônicos',
      image: 'https://images.unsplash.com/photo-1592899677977-9c10b588e183?w=400&h=400&fit=crop',
      ownerId: user1.id,
    },
    {
      title: 'Livros de programação',
      description: 'Coleção de livros sobre React, Node.js e TypeScript. Todos em excelente estado.',
      category: 'Livros',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
      ownerId: user2.id,
    },
    {
      title: 'Mesa de escritório',
      description: 'Mesa de madeira maciça, 1.20m x 0.80m. Perfeita para home office.',
      category: 'Móveis',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      ownerId: user1.id,
    },
    {
      title: 'Bicicleta usada',
      description: 'Bicicleta aro 26, marchas Shimano, em bom estado de conservação.',
      category: 'Esportes',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
      ownerId: user3.id,
    }
  ]

  const createdProducts = []
  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData,
    })
    createdProducts.push(product)
  }

  // Criar mensagens de exemplo
  const messages = [
    {
      content: 'Olá! Tenho interesse no iPhone. Ainda está disponível?',
      senderId: user2.id,
      receiverId: user1.id,
      productId: createdProducts[0].id,
    },
    {
      content: 'Sim, ainda está disponível! Posso te mostrar mais detalhes.',
      senderId: user1.id,
      receiverId: user2.id,
      productId: createdProducts[0].id,
    },
    {
      content: 'Qual o preço dos livros de programação?',
      senderId: user3.id,
      receiverId: user2.id,
      productId: createdProducts[1].id,
    },
    {
      content: 'A mesa de escritório tem alguma marca ou defeito?',
      senderId: user2.id,
      receiverId: user1.id,
      productId: createdProducts[2].id,
    }
  ]

  for (const messageData of messages) {
    await prisma.message.create({
      data: messageData,
    })
  }

  console.log('Seed executado com sucesso!')
  console.log('Usuários criados:', 3)
  console.log('Produtos criados:', createdProducts.length)
  console.log('Mensagens criadas:', messages.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
