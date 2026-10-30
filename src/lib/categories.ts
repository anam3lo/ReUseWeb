import {
  BookOpen,
  Bike,
  LayoutGrid,
  Package,
  Puzzle,
  Shirt,
  Smartphone,
  Sofa,
  Sprout,
  type LucideIcon,
} from 'lucide-react'

/** Categorias oferecidas no formulário de anúncio. */
export const PRODUCT_CATEGORIES = [
  'Eletrônicos',
  'Roupas',
  'Livros',
  'Móveis',
  'Casa e Jardim',
  'Esportes',
  'Brinquedos',
  'Outros',
] as const

export interface CategoryStyle {
  icon: LucideIcon
  /** Fundo suave usado quando o produto não tem foto */
  tint: string
  /** Cor do ícone sobre o fundo suave */
  ink: string
}

const STYLES: Record<string, CategoryStyle> = {
  'Eletrônicos': { icon: Smartphone, tint: '#E8E8E4', ink: '#5E625C' },
  Roupas: { icon: Shirt, tint: '#E1E8F4', ink: '#4A6290' },
  Livros: { icon: BookOpen, tint: '#EDE3EE', ink: '#7E5A85' },
  'Móveis': { icon: Sofa, tint: '#EFE7DA', ink: '#8A6B45' },
  'Casa e Jardim': { icon: Sprout, tint: '#E4EEDF', ink: '#4F7341' },
  Esportes: { icon: Bike, tint: '#DDE8F0', ink: '#4B6E86' },
  Brinquedos: { icon: Puzzle, tint: '#F4E6DC', ink: '#9A5B36' },
  Outros: { icon: LayoutGrid, tint: '#E6F0EA', ink: '#1D5C46' },
}

const FALLBACK: CategoryStyle = { icon: Package, tint: '#ECEBE4', ink: '#5B6862' }

/** Ícone e cores de uma categoria (com fallback para categorias desconhecidas). */
export function getCategoryStyle(category?: string | null): CategoryStyle {
  if (!category) return FALLBACK
  return STYLES[category] ?? FALLBACK
}
