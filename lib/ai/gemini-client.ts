// Story 1.1 — Gemini client configuration

import { GoogleGenAI } from '@google/genai'

let clientInstance: GoogleGenAI | null = null

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set. Add it to .env.local to use AI content generation.'
    )
  }
  if (!clientInstance) {
    clientInstance = new GoogleGenAI({ apiKey })
  }
  return clientInstance
}

export const GEMINI_MODEL = 'gemini-2.5-flash'

export const GEMINI_CONFIG = {
  temperature: 0.7,
  responseMimeType: 'application/json' as const,
}
