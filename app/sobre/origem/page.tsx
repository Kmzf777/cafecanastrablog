import type { Metadata } from 'next'
import SchemaOrg from '@/components/schema-org'
import { generateBreadcrumbSchema } from '@/lib/schemas/blog-schemas'
import { SITE_CONFIG } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Origem Serra da Canastra',
  description: 'Conheça a origem do Café Canastra: terroir único da Serra da Canastra em Minas Gerais, altitude de 1250m, clima favorável e tradição familiar desde 1985.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/sobre/origem`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE_CONFIG.url}/sobre/origem`,
    title: 'Origem Serra da Canastra | Café Canastra',
    description: 'Conheça a origem do Café Canastra: terroir único da Serra da Canastra em Minas Gerais, altitude de 1250m e tradição familiar desde 1985.',
    images: [
      {
        url: '/banner-cafecanastra.png',
        width: 1200,
        height: 630,
        alt: 'Serra da Canastra — Origem do Café Canastra',
      },
    ],
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: SITE_CONFIG.url },
  { name: 'Sobre', url: `${SITE_CONFIG.url}/sobre` },
  { name: 'Nossa Origem', url: `${SITE_CONFIG.url}/sobre/origem` },
])

export default function OrigemPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <SchemaOrg schema={breadcrumbSchema} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Origem Serra da Canastra
        </h1>
        <p className="text-lg text-gray-600">
          Conheça o terroir único que faz do Café Canastra uma experiência incomparável.
        </p>
        {/* Conteúdo completo a ser implementado */}
      </div>
    </main>
  )
}
