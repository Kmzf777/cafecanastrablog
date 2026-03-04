// Shared constants used across admin components

export const CATEGORIES = [
  'Receitas',
  'Terroir & Origem',
  'Métodos de Preparo',
  'Notícias',
  'Curiosidades',
] as const

export type Category = (typeof CATEGORIES)[number]

export const LOCALES = [
  { value: 'pt', label: 'Português', flag: '🇧🇷' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
] as const

export type Locale = (typeof LOCALES)[number]['value']
