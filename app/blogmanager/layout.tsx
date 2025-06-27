import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Administração do Blog | Café Canastra",
  description: "Painel administrativo para gerenciamento do blog do Café Canastra",
}

export default function BlogManagerLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white">{children}</div>
}
