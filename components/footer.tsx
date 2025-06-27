"use client"

import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Instagram, Facebook, Youtube, Mail } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="relative py-20 px-6 bg-gradient-to-t from-black to-stone-900">
      {/* 3D Mountain Skyline Background */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 1200 300" className="w-full h-full">
          <path
            d="M0,300 L0,200 L100,150 L200,180 L300,120 L400,160 L500,100 L600,140 L700,80 L800,120 L900,90 L1000,130 L1100,110 L1200,150 L1200,300 Z"
            fill="url(#mountainGradient)"
          />
          <defs>
            <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#92400e" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Image src="/logo-canastra.png" alt="Café Canastra" width={150} height={75} className="filter invert" />
            </div>
            <p className="text-amber-200/80 mb-6 leading-relaxed max-w-md">
              Desde 1985, cultivamos o melhor café especial da Serra da Canastra, unindo tradição familiar e inovação
              sustentável.
            </p>

            <div className="space-y-4">
              <h4 className="text-amber-100 font-semibold">Receba novidades e ofertas exclusivas</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Seu melhor email"
                  className="bg-black/20 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                />
                <Button className="bg-amber-600 hover:bg-amber-500 text-black">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-amber-100 font-semibold mb-6">Navegação</h4>
            <ul className="space-y-3">
              {["Nossos Cafés", "Assinatura", "Produtores", "Blog", "Sobre Nós"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-amber-200/80 hover:text-amber-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-amber-100 font-semibold mb-6">Suporte</h4>
            <ul className="space-y-3">
              {["Central de Ajuda", "Política de Privacidade", "Termos de Uso", "Trocas e Devoluções", "Contato"].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="text-amber-200/80 hover:text-amber-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-amber-500/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-amber-200/60 text-sm mb-4 md:mb-0"
            >
              © 2024 Café Canastra. Todos os direitos reservados.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex space-x-4"
            >
              {[
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Youtube, href: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center text-amber-400 hover:bg-amber-600/30 hover:text-amber-300 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
