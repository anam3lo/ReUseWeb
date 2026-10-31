import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import ProductImage from '@/components/ProductImage'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { formatRelativeDate } from '@/lib/format'

export interface ProductCardData {
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

interface ProductCardProps {
  product: ProductCardData
  /** Proporção da imagem */
  aspect?: 'square' | 'wide'
}

/** Card de produto usado na home, no catálogo e no perfil. */
export default function ProductCard({ product, aspect = 'square' }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="card-hover group flex h-full flex-col rounded-3xl border bg-card p-2.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div
        className={`relative overflow-hidden rounded-2xl ${aspect === 'square' ? 'aspect-square' : 'aspect-[4/3]'}`}
      >
        <ProductImage src={product.image} alt={product.title} category={product.category} />
        <Badge variant="overlay" className="absolute left-3 top-3">
          {product.category}
        </Badge>
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/90 text-foreground opacity-0 backdrop-blur transition-all duration-300 ease-smooth group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-1.5 pb-1.5 pt-3 sm:px-2 sm:pb-2 sm:pt-4">
        <h3 className="line-clamp-2 font-display text-[15px] font-semibold sm:text-lg leading-snug transition-colors group-hover:text-primary">
          {product.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground max-sm:hidden">
          {product.description || 'Sem descrição disponível'}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
          <span className="flex min-w-0 items-center gap-2 text-[13px] text-foreground/80">
            <Avatar name={product.owner.name} size="sm" tone="mint" />
            <span className="truncate max-[400px]:hidden">{product.owner.name}</span>
          </span>
          <time dateTime={new Date(product.createdAt).toISOString()} className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeDate(product.createdAt)}
          </time>
        </div>
      </div>
    </Link>
  )
}
