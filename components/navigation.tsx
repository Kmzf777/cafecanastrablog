"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-amber-500/20" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image src="/logo-canastra.png" alt="Café Canastra" width={120} height={60} className="filter invert" />
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {["Cafés", "Assinatura", "Produtores", "Blog", "Contato"].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-amber-100 hover:text-amber-400 transition-colors font-light tracking-wide"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </motion.a>
          ))}
        </div>

        <motion.button
          className="bg-gradient-to-r from-amber-600 to-amber-500 text-black px-6 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Comprar Agora
        </motion.button>
      </div>
    </motion.nav>
  )
}
