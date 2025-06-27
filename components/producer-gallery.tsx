"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Play } from "lucide-react"

const producers = [
  {
    id: 1,
    name: "João Silva",
    location: "Fazenda Boa Vista",
    image: "/placeholder.svg?height=400&width=300",
    story: "Terceira geração de cafeicultores, João cultiva café há mais de 30 anos nas encostas da Serra da Canastra.",
    video: "/placeholder-video.mp4",
  },
  {
    id: 2,
    name: "Maria Santos",
    location: "Sítio Esperança",
    image: "/placeholder.svg?height=400&width=300",
    story: "Pioneira na agricultura sustentável, Maria desenvolve técnicas inovadoras de cultivo orgânico.",
    video: "/placeholder-video.mp4",
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    location: "Fazenda Altitude",
    image: "/placeholder.svg?height=400&width=300",
    story: "Especialista em microlotes, Carlos produz alguns dos cafés mais premiados da região.",
    video: "/placeholder-video.mp4",
  },
]

export default function ProducerGallery() {
  const [selectedProducer, setSelectedProducer] = useState<number | null>(null)

  return (
    <section id="produtores" className="min-h-screen py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-amber-100 mb-4">Nossos Produtores</h2>
          <p className="text-xl text-amber-200/80 max-w-2xl mx-auto">
            Conheça as pessoas por trás de cada xícara excepcional
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {producers.map((producer, index) => (
            <motion.div
              key={producer.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => setSelectedProducer(producer.id)}
            >
              <Card className="bg-black/40 backdrop-blur-md border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 overflow-hidden">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={producer.image || "/placeholder.svg"}
                    alt={producer.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-amber-100 mb-1">{producer.name}</h3>
                    <p className="text-amber-300 text-sm">{producer.location}</p>
                  </div>
                  <div className="absolute top-4 right-4 w-12 h-12 bg-amber-600/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 text-black ml-1" />
                  </div>
                </div>

                <CardContent className="p-6">
                  <p className="text-amber-200/80 leading-relaxed">{producer.story}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedProducer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setSelectedProducer(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-black/90 backdrop-blur-md border border-amber-500/20 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <video className="w-full h-64 object-cover" controls autoPlay muted>
                    <source src="/placeholder-video.mp4" type="video/mp4" />
                  </video>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white hover:bg-black/50"
                    onClick={() => setSelectedProducer(null)}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <div className="p-6">
                  {producers.find((p) => p.id === selectedProducer) && (
                    <>
                      <h3 className="text-2xl font-bold text-amber-100 mb-2">
                        {producers.find((p) => p.id === selectedProducer)?.name}
                      </h3>
                      <p className="text-amber-300 mb-4">
                        {producers.find((p) => p.id === selectedProducer)?.location}
                      </p>
                      <p className="text-amber-200/80 leading-relaxed">
                        {producers.find((p) => p.id === selectedProducer)?.story}
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
