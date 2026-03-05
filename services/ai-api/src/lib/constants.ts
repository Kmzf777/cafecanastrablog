export const CATEGORIES = [
  'Receitas',
  'Terroir & Origem',
  'Metodos de Preparo',
  'Noticias',
  'Curiosidades',
] as const

export type Category = (typeof CATEGORIES)[number]
