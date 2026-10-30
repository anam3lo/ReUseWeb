'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchAndFiltersProps {
  categories: string[]
  currentSearch: string
  currentCategory: string
}

export default function SearchAndFilters({
  categories,
  currentSearch,
  currentCategory
}: SearchAndFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentSearch)
  const [isPending, startTransition] = useTransition()

  const navigate = (url: string) => {
    startTransition(() => {
      router.push(url)
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)

    if (search.trim()) {
      params.set('search', search.trim())
    } else {
      params.delete('search')
    }

    // Manter a categoria atual
    if (currentCategory) {
      params.set('category', currentCategory)
    }

    navigate(`/products?${params.toString()}`)
  }

  const handleCategoryFilter = (category: string) => {
    const params = new URLSearchParams(searchParams)

    if (category === currentCategory) {
      // Se clicou na categoria atual, remove o filtro
      params.delete('category')
    } else {
      // Senão, aplica a nova categoria
      params.set('category', category)
    }

    // Manter a busca atual
    if (currentSearch) {
      params.set('search', currentSearch)
    }

    navigate(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch('')
    navigate('/products')
  }

  const hasActiveFilters = currentSearch || currentCategory

  return (
    <div className="space-y-4 rounded-3xl border bg-card p-3 sm:p-5">
      {/* Barra de Pesquisa */}
      <form onSubmit={handleSearch} role="search" className="flex flex-wrap gap-2">
        <div className="relative min-w-0 flex-1 basis-60">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="product-search" className="sr-only">
            Buscar produtos
          </label>
          <Input
            id="product-search"
            type="search"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[52px] rounded-2xl bg-background pl-12"
          />
        </div>
        <Button type="submit" size="lg" className="h-[52px] flex-1 rounded-2xl sm:flex-none" disabled={isPending}>
          {isPending ? <Spinner label="Buscando" /> : <Search className="h-4 w-4" aria-hidden="true" />}
          Buscar
        </Button>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={clearFilters}
            className="h-[52px] animate-fade-in rounded-2xl"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Limpar
          </Button>
        )}
      </form>

      {/* Filtros por Categoria */}
      <div
        role="group"
        aria-label="Filtrar por categoria"
        className="scrollbar-none -mx-3 flex gap-2 overflow-x-auto px-3 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        <CategoryChip active={currentCategory === ''} onClick={() => handleCategoryFilter('')}>
          Todas
        </CategoryChip>
        {categories.map((category) => (
          <CategoryChip
            key={category}
            active={currentCategory === category}
            onClick={() => handleCategoryFilter(category)}
          >
            {category}
          </CategoryChip>
        ))}
      </div>

      {/* Resultados */}
      {hasActiveFilters && (
        <p className="animate-fade-in px-1 text-sm text-muted-foreground" aria-live="polite">
          {currentSearch && (
            <span>Buscando por: <strong className="text-foreground">"{currentSearch}"</strong></span>
          )}
          {currentSearch && currentCategory && <span> • </span>}
          {currentCategory && (
            <span>Categoria: <strong className="text-foreground">{currentCategory}</strong></span>
          )}
        </p>
      )}
    </div>
  )
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'h-10 shrink-0 rounded-full border px-4 text-sm transition-[background-color,border-color,color,transform] duration-200 ease-smooth active:scale-95',
        active
          ? 'border-foreground bg-foreground font-semibold text-background'
          : 'border-border bg-card font-medium text-foreground/80 hover:border-primary hover:text-foreground'
      )}
    >
      {children}
    </button>
  )
}
