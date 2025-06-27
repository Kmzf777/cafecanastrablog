import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://cafecanastra.com'),
  title: {
    default: "Café Canastra - O melhor café artesanal da Serra da Canastra",
    template: "%s | Café Canastra",
  },
  description:
    "Descubra o sabor único do café especial da Serra da Canastra. Tradição familiar, qualidade artesanal e os melhores grãos do Brasil.",
  keywords: ["café especial", "serra da canastra", "café brasileiro", "café artesanal", "café gourmet", "minas gerais"],
  authors: [{ name: "Café Canastra" }],
  creator: "Café Canastra",
  publisher: "Café Canastra",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://cafecanastra.com",
    siteName: "Café Canastra",
    title: "Café Canastra - O melhor café artesanal da Serra da Canastra",
    description:
      "Descubra o sabor único do café especial da Serra da Canastra. Tradição familiar, qualidade artesanal e os melhores grãos do Brasil.",
    images: [
      {
        url: "/logo-canastra.png",
        width: 1200,
        height: 630,
        alt: "Café Canastra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cafecanastra",
    creator: "@cafecanastra",
    title: "Café Canastra - O melhor café artesanal da Serra da Canastra",
    description:
      "Descubra o sabor único do café especial da Serra da Canastra. Tradição familiar, qualidade artesanal e os melhores grãos do Brasil.",
    images: ["/logo-canastra.png"],
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://cafecanastra.com",
  },
  other: {
    "theme-color": "#d97706",
    "color-scheme": "light",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
