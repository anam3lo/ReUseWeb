'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X } from 'lucide-react'

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
    
    router.push(`/products?${params.toString()}`)
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
    
    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/products')
  }

  const hasActiveFilters = currentSearch || currentCategory

  return (
    <div className="space-y-4">
      {/* Barra de Pesquisa */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="px-6">
          Buscar
        </Button>
        {hasActiveFilters && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={clearFilters}
            className="px-4"
          >
            <X className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        )}
      </form>

      {/* Filtros por Categoria */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span>Categorias:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={currentCategory === '' ? "default" : "outline"}
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => handleCategoryFilter('')}
          >
            Todas
          </Badge>
          
          {categories.map((category) => (
            <Badge
              key={category}
              variant={currentCategory === category ? "default" : "outline"}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Resultados */}
      {hasActiveFilters && (
        <div className="text-sm text-gray-600">
          {currentSearch && (
            <span>Buscando por: <strong>"{currentSearch}"</strong></span>
          )}
          {currentSearch && currentCategory && <span> • </span>}
          {currentCategory && (
            <span>Categoria: <strong>{currentCategory}</strong></span>
          )}
        </div>
      )}
    </div>
  )
}
