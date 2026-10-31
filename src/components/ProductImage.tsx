'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getCategoryStyle } from '@/lib/categories'

interface ProductImageProps {
  src?: string | null
  alt: string
  className?: string
  /** Categoria do produto, usada para o visual quando não há imagem */
  category?: string | null
  /** Tamanho do ícone exibido quando não há imagem */
  iconSize?: 'sm' | 'md' | 'lg'
  /** Dica de tamanho para o navegador escolher a imagem */
  sizes?: string
  width?: number
  height?: number
}

const ICON_SIZES = { sm: 'h-6 w-6', md: 'h-12 w-12', lg: 'h-24 w-24' }

/**
 * Imagem do produto com skeleton enquanto carrega, fade-in ao terminar
 * e um fallback ilustrado pela categoria quando não há foto.
 * O elemento pai define o tamanho (ex.: aspect-square).
 */
export default function ProductImage({
  src,
  alt,
  className = '',
  category,
  iconSize = 'md',
  sizes = '(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw',
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { icon: Icon, tint, ink } = getCategoryStyle(category)

  if (!src || imageError) {
    return (
      <div
        className={cn('flex h-full w-full items-center justify-center', className)}
        style={{ backgroundColor: tint }}
        role="img"
        aria-label={`${alt} (sem foto)`}
      >
        <Icon
          className={cn(ICON_SIZES[iconSize], 'transition-transform duration-500 ease-smooth group-hover:scale-110')}
          style={{ color: ink }}
          strokeWidth={1.4}
          aria-hidden="true"
        />
      </div>
    )
  }

  return (
    <div className={cn('relative h-full w-full overflow-hidden bg-muted', className)}>
      {isLoading && <div className="skeleton absolute inset-0 rounded-none" aria-hidden="true" />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn(
          'object-cover transition-[opacity,transform] duration-500 ease-smooth group-hover:scale-105',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onError={() => {
          setImageError(true)
          setIsLoading(false)
        }}
        onLoad={() => setIsLoading(false)}
        unoptimized={true} // Para evitar problemas com domínios externos
      />
    </div>
  )
}
