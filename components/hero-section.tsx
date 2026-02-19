"use client"

import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Banner background */}
      <img 
        src="/banner-canastra.png" 
        alt="Banner Café Canastra" 
        className="absolute inset-0 w-full h-full object-cover z-0" 
        style={{objectPosition: 'center'}}
      />
      {/* Overlay para contraste */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Background mountains */}
      <div className="absolute inset-0 flex items-end justify-center">
        <motion.div 
          className="flex space-x-8"
          animate={{ 
            y: [0, -10, 0],
            rotateY: [0, 5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-32 h-32 bg-gradient-to-t from-amber-800 to-amber-600 transform rotate-45 rounded-t-full"></div>
          <div className="w-40 h-40 bg-gradient-to-t from-amber-900 to-amber-700 transform rotate-45 rounded-t-full"></div>
          <div className="w-28 h-28 bg-gradient-to-t from-amber-800 to-amber-600 transform rotate-45 rounded-t-full"></div>
        </motion.div>
      </div>

      {/* Coffee particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-amber-800 mb-6 max-w-4xl mx-auto leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Da fazenda à torrefação, café especial direto da Serra da Canastra.
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-2xl text-amber-600 font-medium max-w-2xl mx-auto mb-2 md:mb-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Cultivamos, colhemos e torramos nossos próprios cafés especiais na Serra da Canastra. Aqui, cada xícara carrega a pureza do terroir mineiro — do pé à torra, sem intermediários.
        </motion.p>
      </div>
    </div>
  )
}
