import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import SkipLink from "@/components/skip-link"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { Analytics } from "@vercel/analytics/next"

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
          <Analytics />
          {/* Footer global com 3 colunas: logo+desc+redes, links úteis, newsletter+empresa */}
          <footer className="bg-[#181c23] text-[#e5e7eb] py-12 px-4 text-sm mt-12 border-t border-[#23272f]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
              {/* Coluna 1: Logo, descrição e redes sociais */}
              <div className="mb-8 md:mb-0 flex flex-col items-start">
                <img src="/logo-canastra.png" alt="Café Canastra" className="h-10 w-auto mb-4" />
                <p className="text-[#e5e7eb]/90 mb-4 leading-relaxed">O melhor café artesanal da Serra da Canastra, cultivado com tradição e paixão desde 1985.</p>
                <div className="flex space-x-4 mt-2">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H5v4h5v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M22.54 6.42A2.78 2.78 0 0 0 20.7 4.6C19.13 4.13 12 4.13 12 4.13s-7.13 0-8.7.47A2.78 2.78 0 0 0 1.46 6.42 29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.84 1.82c1.57.47 8.7.47 8.7.47s7.13 0 8.7-.47a2.78 2.78 0 0 0 1.84-1.82A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
                  </a>
                </div>
              </div>
              {/* Coluna 2: Links úteis */}
              <div className="mb-8 md:mb-0">
                <h4 className="text-amber-500 font-semibold text-base mb-3 flex items-center gap-2">Links Úteis</h4>
                <ul className="space-y-2">
                  <li><a href="/politica-privacidade" className="text-[#e5e7eb]/90 hover:text-white transition-colors">Política de Privacidade</a></li>
                  <li><a href="/termos-uso" className="text-[#e5e7eb]/90 hover:text-white transition-colors">Termos de Uso</a></li>
                </ul>
              </div>
              {/* Coluna 3: Newsletter + informações da empresa */}
              <div>
                <h4 className="text-amber-500 font-semibold text-base mb-3 flex items-center gap-2">Newsletter</h4>
                <p className="text-[#e5e7eb]/90 mb-3">Receba novidades e ofertas exclusivas</p>
                <form className="flex flex-col sm:flex-row gap-2 mb-4">
                  <input type="email" placeholder="Seu e-mail" className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-600" />
                  <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded px-5 py-2 transition-colors">Assinar</button>
                </form>
                <div className="mt-2 text-xs text-[#e5e7eb]/80 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4M3 13h18"/></svg></span>
                    <span>Boaventura Cafés Especiais Ltda<br/>CNPJ 24.252.228/0001-37</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 21c-4.418 0-8-4.03-8-9a8 8 0 1 1 16 0c0 4.97-3.582 9-8 9z"/><circle cx="12" cy="12" r="3"/></svg></span>
                    <span>Fazenda Divinéia: Rodovia LMG827, km15<br/>Pratinha-Medeiros - Minas Gerais</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 21c-4.418 0-8-4.03-8-9a8 8 0 1 1 16 0c0 4.97-3.582 9-8 9z"/><circle cx="12" cy="12" r="3"/></svg></span>
                    <span>Torrefação: Rua Nivaldo Guerreiro Nunes, 701<br/>Distrito Industrial - Uberlândia/MG</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3.08 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.73 3.06a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.99.36 2.01.6 3.06.73A2 2 0 0 1 22 16.92z"/></svg></span>
                    <span>(34) 3226-2600</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg></span>
                    <span><a href="mailto:comercial@cafecanastra.com" className="hover:underline text-[#e5e7eb]">comercial@cafecanastra.com</a></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center text-xs text-[#e5e7eb]/60 mt-10 pt-6 border-t border-[#23272f]">© {new Date().getFullYear()} Café Canastra. Todos os direitos reservados.</div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
