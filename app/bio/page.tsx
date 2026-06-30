import type { Metadata } from "next"
import BioClient from "./BioClient"

const description =
  "Cafés especiais da Serra da Canastra. Loja online, atacado, própria marca e mais."

export const metadata: Metadata = {
  title: "Café Canastra — Links",
  description,
  openGraph: {
    title: "Café Canastra — Links",
    description,
    url: "https://cafecanastra.com/bio",
    siteName: "Café Canastra",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/banner-cafecanastra.png",
        width: 1200,
        height: 630,
        alt: "Café Canastra — Cafés especiais da Serra da Canastra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Café Canastra — Links",
    description,
    images: ["/banner-cafecanastra.png"],
  },
}

export default function BioPage() {
  return <BioClient />
}
