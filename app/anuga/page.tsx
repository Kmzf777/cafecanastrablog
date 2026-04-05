import type { Metadata } from 'next';
import AnugaClient from '@/components/anuga/AnugaClient';

export const metadata: Metadata = {
  title: 'Café Canastra | ANUGA Select Brazil 2026',
  description:
    'Ganhe R$200 de desconto na primeira compra. Café especial direto do produtor na Serra da Canastra.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Café Canastra | ANUGA Select Brazil 2026',
    description:
      'Ganhe R$200 de desconto. Café especial direto do produtor na Serra da Canastra.',
    type: 'website',
    images: [
      {
        url: '/banner-cafecanastra.png',
        width: 1200,
        height: 630,
        alt: 'Café Canastra — ANUGA Select Brazil 2026',
      },
    ],
  },
};

export default function AnugaPage() {
  return <AnugaClient />;
}
