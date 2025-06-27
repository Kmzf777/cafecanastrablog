"use client"

import { motion } from "framer-motion"
import { Coffee } from "lucide-react"

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-amber-950 via-stone-900 to-black flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="mb-8"
        >
          <Coffee className="w-16 h-16 text-amber-400 mx-auto" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl font-bold text-amber-100 mb-4"
        >
          Preparando sua experiência...
        </motion.h2>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="h-1 bg-amber-400 rounded-full mx-auto max-w-xs"
        />
      </div>
    </div>
  )
}
