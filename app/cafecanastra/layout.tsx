import type React from "react"
import type { Metadata } from "next"
import "../globals.css"

export const metadata: Metadata = {
  title: "Café Canastra - O Café da Serra do Tempo",
  description: "Café artesanal brasileiro da icônica Serra da Canastra. Feito com calma. Bebido com alma.",
  keywords: "café, brasileiro, artesanal, Serra da Canastra, Minas Gerais, specialty coffee",
  openGraph: {
    title: "Café Canastra - O Café da Serra do Tempo",
    description: "Café artesanal brasileiro da icônica Serra da Canastra",
    images: ["/og-image.jpg"],
  },
}

export default function CafeCanastraLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
