import type { Metadata } from 'next'
import HomeClient from './HomeClient'
import { BlogPreviewSection } from '@/components/BlogPreviewSection'

export const metadata: Metadata = {
  title: 'Café Canastra | Café Especial da Serra da Canastra, MG',
  description: 'Café especial produzido na Serra da Canastra, Minas Gerais. Altitude, terroir único e torra artesanal para uma xícara excepcional. Peça online.',
  alternates: {
    canonical: 'https://cafecanastra.com',
  },
  openGraph: {
    type: 'website',
    url: 'https://cafecanastra.com',
    title: 'Café Canastra | Café Especial da Serra da Canastra, MG',
    description: 'Café especial produzido na Serra da Canastra, Minas Gerais. Altitude, terroir único e torra artesanal para uma xícara excepcional.',
    images: [
      {
        url: '/banner-cafecanastra.png',
        width: 1200,
        height: 630,
        alt: 'Café Canastra — Café Especial da Serra da Canastra',
      },
    ],
  },
}

import { SITE_CONFIG, FAQS } from '@/lib/site-config'
import SchemaOrg from '@/components/schema-org'

export default function HomePage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.logo,
    description: SITE_CONFIG.description,
    address: {
      '@type': 'PostalAddress',
      ...SITE_CONFIG.address,
    },
    sameAs: Object.values(SITE_CONFIG.social),
    priceRange: '$$',
    servesCuisine: 'Café Especial',
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE_CONFIG.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <SchemaOrg schema={[organizationSchema, websiteSchema, faqSchema]} />
      <HomeClient blogSection={<BlogPreviewSection />} />
    </>
  )
}
