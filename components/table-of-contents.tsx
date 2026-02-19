"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { List, ChevronRight } from "lucide-react"

interface TableOfContentsProps {
  sections: Array<{
    id: string
    title: string
    level: number
  }>
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>("")

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (sections.length === 0) return null

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-center gap-2 mb-4">
          <List className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-gray-900">Índice</h3>
        </div>
        <nav className="space-y-2 max-h-96 overflow-y-auto" role="navigation" aria-label="Tabela de conteúdo">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              size="sm"
              className={`w-full justify-start text-left h-auto p-2 ${
                activeSection === section.id
                  ? "bg-amber-50 text-amber-700 border-r-2 border-amber-500"
                  : "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
              }`}
              onClick={() => scrollToSection(section.id)}
              style={{ paddingLeft: `${(section.level - 2) * 16 + 8}px` }}
            >
              <ChevronRight className="w-3 h-3 mr-2 flex-shrink-0" />
              <span className="text-sm leading-relaxed break-words">{section.title}</span>
            </Button>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
} 