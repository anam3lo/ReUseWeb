'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
  src?: string | null
  alt: string
  className?: string
  width?: number
  height?: number
}

export default function ProductImage({ 
  src, 
  alt, 
  className = '', 
  width = 400, 
  height = 400 
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // URL de fallback usando picsum.photos
  const fallbackUrl = `https://picsum.photos/${width}/${height}?random=${Math.random()}`

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  if (!src || imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-center p-4">
          <div className="text-4xl mb-2">📦</div>
          <div className="text-sm">Sem imagem</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500">Carregando...</div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        unoptimized={true} // Para evitar problemas com domínios externos
      />
    </div>
  )
}
