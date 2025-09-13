import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ProductImage from '@/components/ProductImage'

interface Product {
  id: string
  title: string
  description: string | null
  image: string | null
  category: string
  createdAt: Date
  owner: {
    name: string
  }
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200 group">
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <ProductImage
              src={product.image}
              alt={product.title}
              className="w-full h-full group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-green-600 transition-colors">
                {product.title}
              </CardTitle>
              <Badge variant="secondary" className="ml-2 flex-shrink-0">
                {product.category}
              </Badge>
            </div>
            <CardDescription className="text-sm text-gray-500">
              Por {product.owner.name}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {product.description || 'Sem descrição disponível'}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {new Date(product.createdAt).toLocaleDateString('pt-BR')}
              </span>
              <Button size="sm" asChild>
                <Link href={`/products/${product.id}`}>
                  Ver Detalhes
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
