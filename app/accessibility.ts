// Configurações de acessibilidade para o site Café Canastra

export const accessibilityConfig = {
  // Configurações de navegação por teclado
  keyboardNavigation: {
    skipToContent: true,
    focusVisible: true,
    tabIndex: 0,
  },
  
  // Configurações de contraste
  contrast: {
    minimum: 4.5, // WCAG AA
    enhanced: 7.0, // WCAG AAA
  },
  
  // Configurações de texto
  typography: {
    minimumFontSize: 16, // px
    lineHeight: 1.5,
    letterSpacing: 0.01, // em
  },
  
  // Configurações de animação
  animations: {
    reduceMotion: true,
    prefersReducedMotion: true,
  },
  
  // Configurações de idioma
  language: {
    primary: 'pt-BR',
    fallback: 'en',
  },
  
  // Configurações de imagens
  images: {
    requireAlt: true,
    decorativeAlt: '',
    complexAlt: true,
  },
  
  // Configurações de formulários
  forms: {
    requireLabels: true,
    requireDescriptions: true,
    errorAnnouncements: true,
  },
  
  // Configurações de vídeo/áudio
  media: {
    requireCaptions: true,
    requireTranscripts: true,
    requireDescriptions: true,
  },
  
  // Configurações de estrutura
  structure: {
    requireHeadings: true,
    requireLandmarks: true,
    requireLists: true,
  },
}

// Funções utilitárias para acessibilidade
export const accessibilityUtils = {
  // Verificar se o usuário prefere movimento reduzido
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },
  
  // Verificar se o usuário prefere contraste alto
  prefersHighContrast: (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-contrast: high)').matches
  },
  
  // Verificar se o usuário prefere esquema escuro
  prefersDarkMode: (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  },
  
  // Anunciar mudanças para leitores de tela
  announceToScreenReader: (message: string): void => {
    if (typeof window === 'undefined') return
    
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },
  
  // Focar em um elemento
  focusElement: (element: HTMLElement | null): void => {
    if (element) {
      element.focus()
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  },
  
  // Verificar se um elemento está visível
  isElementVisible: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect()
    const style = window.getComputedStyle(element)
    
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      style.opacity !== '0'
    )
  },
  
  // Gerar ID único para elementos
  generateId: (prefix: string = 'element'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  },
  
  // Validar contraste de cores
  validateContrast: (foreground: string, background: string): number => {
    // Implementação simplificada - em produção, use uma biblioteca como tinycolor2
    // Esta é uma aproximação básica
    const getLuminance = (color: string): number => {
      const hex = color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16) / 255
      const g = parseInt(hex.substr(2, 2), 16) / 255
      const b = parseInt(hex.substr(4, 2), 16) / 255
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        if (c <= 0.03928) return c / 12.92
        return Math.pow((c + 0.055) / 1.055, 2.4)
      })
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }
    
    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    
    return (lighter + 0.05) / (darker + 0.05)
  },
}

// Hook personalizado para acessibilidade
export const useAccessibility = () => {
  const announce = (message: string) => {
    accessibilityUtils.announceToScreenReader(message)
  }
  
  const focus = (element: HTMLElement | null) => {
    accessibilityUtils.focusElement(element)
  }
  
  const generateId = (prefix?: string) => {
    return accessibilityUtils.generateId(prefix)
  }
  
  return {
    announce,
    focus,
    generateId,
    prefersReducedMotion: accessibilityUtils.prefersReducedMotion(),
    prefersHighContrast: accessibilityUtils.prefersHighContrast(),
    prefersDarkMode: accessibilityUtils.prefersDarkMode(),
  }
} 