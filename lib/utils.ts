import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { BlogPost } from "./supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função utilitária para calcular tempo de leitura de forma consistente
export function calculateReadingTime(post: BlogPost): number {
  const wordCount = [
    post.resumo,
    post.secao_1_texto,
    post.secao_2_texto,
    post.secao_3_texto,
    post.secao_4_texto,
    post.secao_5_texto,
    post.secao_6_texto,
    post.secao_7_texto,
    post.conclusao,
  ]
    .filter(Boolean)
    .join(" ")
    .split(" ").length

  return Math.ceil(wordCount / 200) // ~200 palavras por minuto
}
