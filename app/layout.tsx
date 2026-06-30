import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GoogleTagManager } from "@next/third-parties/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import SkipLink from "@/components/skip-link"
import SiteFooter from "@/components/site-footer"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Café Canastra | Café Especial da Serra da Canastra, MG",
    template: "%s | Café Canastra"
  },
  description: "Café especial produzido na Serra da Canastra, Minas Gerais. Altitude, terroir único e torra artesanal para uma xícara excepcional. Peça online.",
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
    title: 'Café Canastra | Café Especial da Serra da Canastra, MG',
    description: 'Café especial produzido na Serra da Canastra, Minas Gerais. Altitude, terroir único e torra artesanal para uma xícara excepcional.',
    siteName: 'Café Canastra',
    images: [
      {
        url: '/banner-cafecanastra.png',
        width: 1200,
        height: 630,
        alt: 'Café Canastra — Café Especial da Serra da Canastra',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Café Canastra | Café Especial da Serra da Canastra, MG',
    description: 'Café especial produzido na Serra da Canastra, Minas Gerais. Altitude, terroir único e torra artesanal para uma xícara excepcional.',
    images: ['/banner-cafecanastra.png'],
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
      <GoogleTagManager gtmId="GTM-PX8PWW6" />
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
        <meta name="facebook-domain-verification" content="ogohpq49tdth8zt1ms0zfm49dbtdli" />
        
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

      <body className={inter.className} suppressHydrationWarning>
        <SkipLink />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
