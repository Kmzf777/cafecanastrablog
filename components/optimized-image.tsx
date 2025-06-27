"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  caption?: string
  priority?: boolean
  sizes?: string
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  caption,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (priority) {
      setIsLoading(false)
    }
  }, [priority])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Gerar srcset para diferentes tamanhos
  const generateSrcSet = (originalSrc: string) => {
    // Se for uma imagem externa ou placeholder, retornar apenas o src original
    if (originalSrc.startsWith('http') || originalSrc.includes('placeholder')) {
      return originalSrc
    }
    
    // Para imagens locais, gerar diferentes tamanhos
    const sizes = [400, 800, 1200, 1600]
    return sizes
      .map(size => `${originalSrc}?w=${size} ${size}w`)
      .join(', ')
  }

  const imageSrc = hasError ? "/placeholder.svg" : src

  return (
    <figure className="my-6 lg:my-8" role="group" aria-labelledby={caption ? "image-caption" : undefined}>
      <div className="relative">
        {isLoading && !priority && (
          <Skeleton className={`w-full h-48 lg:h-64 ${className}`} />
        )}
        
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full max-h-96 lg:max-h-[500px] object-cover rounded-lg shadow-lg transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
          srcSet={generateSrcSet(imageSrc)}
          onLoad={handleLoad}
          onError={handleError}
          aria-describedby={caption ? "image-caption" : undefined}
        />
        
        {isLoading && !priority && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        )}
      </div>
      
      {caption && (
        <figcaption 
          id="image-caption"
          className="text-xs sm:text-sm text-gray-500 text-center mt-2 italic"
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
} 