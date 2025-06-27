"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BlogBreadcrumbProps {
  postTitle: string
  postSlug: string
}

export default function BlogBreadcrumb({ postTitle, postSlug }: BlogBreadcrumbProps) {
  const breadcrumbItems = [
    { name: "Início", href: "/cafecanastra" },
    { name: "Blog", href: "/blog" },
    { name: postTitle, href: `/blog/${postSlug}`, current: true },
  ]

  // Schema estruturado para breadcrumb
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://cafecanastra.com${item.href}`,
    })),
  }

  return (
    <>
      {/* Schema estruturado */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      
      {/* Breadcrumb visual */}
      <Breadcrumb className="mb-4 lg:mb-6">
        <BreadcrumbList className="text-sm">
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem key={item.href}>
              {item.current ? (
                <BreadcrumbPage className="text-amber-600 font-medium">
                  {item.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link 
                    href={item.href}
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                    aria-label={`Ir para ${item.name}`}
                  >
                    {index === 0 && <Home className="w-4 h-4 mr-1" />}
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              )}
              {index < breadcrumbItems.length - 1 && (
                <BreadcrumbSeparator className="text-gray-400">
                  <ChevronRight className="w-4 h-4" />
                </BreadcrumbSeparator>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
} 