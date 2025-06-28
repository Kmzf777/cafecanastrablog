"use client"

import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100">
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
          className="text-5xl md:text-7xl font-bold text-amber-800 mb-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          O Café da Serra do Tempo
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-amber-600 font-medium"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Feito com calma. Bebido com alma.
        </motion.p>
      </div>
    </div>
  )
}
