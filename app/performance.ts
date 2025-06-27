// Configurações de performance para o site Café Canastra

export const performanceConfig = {
  // Configurações de imagens
  images: {
    // Formatos suportados
    formats: ['webp', 'avif', 'jpeg', 'png'],
    
    // Tamanhos de imagem para diferentes dispositivos
    sizes: {
      mobile: {
        width: 640,
        height: 480,
      },
      tablet: {
        width: 1024,
        height: 768,
      },
      desktop: {
        width: 1920,
        height: 1080,
      },
    },
    
    // Qualidade de compressão
    quality: 85,
    
    // Lazy loading
    lazyLoading: true,
    
    // Placeholder blur
    placeholder: 'blur',
  },
  
  // Configurações de fontes
  fonts: {
    // Preload de fontes críticas
    preload: ['Inter'],
    
    // Display swap para melhor performance
    display: 'swap',
    
    // Subset de caracteres
    subsets: ['latin'],
  },
  
  // Configurações de cache
  cache: {
    // Tempo de cache para recursos estáticos
    static: 31536000, // 1 ano
    
    // Tempo de cache para conteúdo dinâmico
    dynamic: 3600, // 1 hora
    
    // Tempo de cache para API
    api: 300, // 5 minutos
  },
  
  // Configurações de compressão
  compression: {
    // Gzip
    gzip: true,
    
    // Brotli
    brotli: true,
    
    // Nível de compressão
    level: 6,
  },
  
  // Configurações de CDN
  cdn: {
    // Domínios de CDN
    domains: [
      'cafecanastra.com',
      'loja.cafecanastra.com',
      'atacado.cafecanastra.com',
    ],
    
    // Headers de cache
    cacheHeaders: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'CDN-Cache-Control': 'public, max-age=31536000',
    },
  },
  
  // Configurações de bundle
  bundle: {
    // Tamanho máximo do bundle
    maxSize: 250, // KB
    
    // Análise de bundle
    analyze: process.env.NODE_ENV === 'development',
    
    // Tree shaking
    treeShaking: true,
    
    // Code splitting
    codeSplitting: true,
  },
  
  // Configurações de monitoramento
  monitoring: {
    // Web Vitals
    webVitals: true,
    
    // Core Web Vitals
    coreWebVitals: {
      LCP: 2500, // ms
      FID: 100, // ms
      CLS: 0.1,
    },
    
    // Performance budget
    budget: {
      'first-contentful-paint': 1800,
      'largest-contentful-paint': 2500,
      'first-input-delay': 100,
      'cumulative-layout-shift': 0.1,
    },
  },
}

// Funções utilitárias para performance
export const performanceUtils = {
  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },
  
  // Throttle function
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },
  
  // Intersection Observer para lazy loading
  createIntersectionObserver: (
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {}
  ): IntersectionObserver => {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    })
  },
  
  // Preload de recursos
  preloadResource: (href: string, as: string): void => {
    if (typeof window === 'undefined') return
    
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  },
  
  // Prefetch de recursos
  prefetchResource: (href: string): void => {
    if (typeof window === 'undefined') return
    
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  },
  
  // Medir performance
  measurePerformance: (name: string, fn: () => void): void => {
    if (typeof window === 'undefined') return
    
    const start = performance.now()
    fn()
    const end = performance.now()
    
    console.log(`${name}: ${end - start}ms`)
  },
  
  // Verificar se o usuário tem conexão lenta
  isSlowConnection: (): boolean => {
    if (typeof navigator === 'undefined') return false
    
    const connection = (navigator as any).connection
    if (!connection) return false
    
    return (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.effectiveType === '3g' ||
      connection.saveData
    )
  },
  
  // Verificar se o usuário prefere dados economizados
  prefersReducedData: (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-data: reduce)').matches
  },
  
  // Otimizar imagens baseado na conexão
  getOptimalImageSize: (): 'small' | 'medium' | 'large' => {
    if (performanceUtils.isSlowConnection() || performanceUtils.prefersReducedData()) {
      return 'small'
    }
    return 'large'
  },
}

// Hook personalizado para performance
export const usePerformance = () => {
  const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
    return performanceUtils.debounce(func, wait)
  }
  
  const throttle = <T extends (...args: any[]) => any>(func: T, limit: number) => {
    return performanceUtils.throttle(func, limit)
  }
  
  const preload = (href: string, as: string) => {
    performanceUtils.preloadResource(href, as)
  }
  
  const prefetch = (href: string) => {
    performanceUtils.prefetchResource(href)
  }
  
  const measure = (name: string, fn: () => void) => {
    performanceUtils.measurePerformance(name, fn)
  }
  
  return {
    debounce,
    throttle,
    preload,
    prefetch,
    measure,
    isSlowConnection: performanceUtils.isSlowConnection(),
    prefersReducedData: performanceUtils.prefersReducedData(),
    getOptimalImageSize: performanceUtils.getOptimalImageSize(),
  }
} 