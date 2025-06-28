"use client"

import { useEffect, useState } from "react"

interface SkipLinkProps {
  targetId?: string
  children?: React.ReactNode
}

export default function SkipLink({ targetId = "main-content", children = "Pular para o conteúdo principal" }: SkipLinkProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" && !event.shiftKey) {
        setIsVisible(true)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        // Manter visível por um tempo para permitir que o usuário clique
        setTimeout(() => setIsVisible(false), 3000)
      }
    }

    const handleClick = () => {
      setIsVisible(false)
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
      document.removeEventListener("click", handleClick)
    }
  }, [])

  const handleSkip = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.focus()
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!isVisible) return null

  return (
    <a
      href={`#${targetId}`}
      onClick={handleSkip}
      className="fixed top-4 left-4 z-[9999] bg-amber-600 text-white px-4 py-2 rounded-lg shadow-lg transform -translate-y-full focus:translate-y-0 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
      aria-label="Pular para o conteúdo principal"
    >
      {children}
    </a>
  )
} 