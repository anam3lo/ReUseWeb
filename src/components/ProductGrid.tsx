import ProductCard, { type ProductCardData } from '@/components/ProductCard'
import Reveal from '@/components/Reveal'

interface ProductGridProps {
  products: ProductCardData[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <Reveal key={product.id} delay={(index % 4) * 70} className="h-full">
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  )
}
