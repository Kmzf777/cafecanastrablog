import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import SkipLink from "@/components/skip-link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Café Canastra - O melhor café artesanal da Serra da Canastra",
    template: "%s | Café Canastra"
  },
  description: "Descubra o melhor café artesanal da Serra da Canastra. Cafés especiais com tradição mineira e qualidade excepcional. Compre online e experimente sabores únicos.",
  keywords: ["café especial", "serra da canastra", "café brasileiro", "café artesanal", "café mineiro", "café gourmet"],
  authors: [{ name: "Equipe Café Canastra" }],
  creator: "Café Canastra",
  publisher: "Café Canastra",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cafecanastra.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://cafecanastra.com',
    title: 'Café Canastra - O melhor café artesanal da Serra da Canastra',
    description: 'Descubra o melhor café artesanal da Serra da Canastra. Cafés especiais com tradição mineira e qualidade excepcional.',
    siteName: 'Café Canastra',
    images: [
      {
        url: '/logo-canastra.png',
        width: 1200,
        height: 630,
        alt: 'Café Canastra - Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Café Canastra - O melhor café artesanal da Serra da Canastra',
    description: 'Descubra o melhor café artesanal da Serra da Canastra. Cafés especiais com tradição mineira e qualidade excepcional.',
    images: ['/logo-canastra.png'],
    creator: '@cafecanastra',
    site: '@cafecanastra',
  },
  other: {
    'theme-color': '#d97706',
    'color-scheme': 'light dark',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo-canastra.png" />
        <link rel="apple-touch-icon" href="/logo-canastra.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#d97706" />
        <meta name="msapplication-TileColor" content="#d97706" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Café Canastra" />
        <meta name="application-name" content="Café Canastra" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Preconnect para melhorar performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cafecanastra.com" />
        
        {/* DNS Prefetch para recursos externos */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Schema estruturado para organização */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Café Canastra",
              url: "https://cafecanastra.com",
              logo: {
                "@type": "ImageObject",
                url: "https://cafecanastra.com/logo-canastra.png",
                width: 1200,
                height: 630,
              },
              description: "O melhor café artesanal da Serra da Canastra",
              address: {
                "@type": "PostalAddress",
                addressRegion: "Minas Gerais",
                addressCountry: "BR",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: "Portuguese",
              },
              sameAs: [
                "https://www.instagram.com/cafecanastra",
                "https://loja.cafecanastra.com",
                "https://atacado.cafecanastra.com",
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <SkipLink />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
