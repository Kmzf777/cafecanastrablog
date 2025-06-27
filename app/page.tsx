"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/cafecanastra")
  }, [router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <img src="/logo-canastra.png" alt="Café Canastra" className="h-16 mx-auto mb-4" />
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  )
}
