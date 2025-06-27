"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coffee } from "lucide-react"

const coffees = [
  {
    id: 1,
    name: "Canastra Clássico",
    description: "Este café sabe a névoa da manhã na Canastra",
    notes: ["Chocolate", "Caramelo", "Nozes"],
    roast: "Médio",
    price: "R$ 45,00",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    name: "Reserva Especial",
    description: "Grãos selecionados das altitudes mais elevadas",
    notes: ["Frutas Vermelhas", "Mel", "Floral"],
    roast: "Claro",
    price: "R$ 65,00",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 3,
    name: "Edição Limitada",
    description: "Microlote de produção artesanal exclusiva",
    notes: ["Cítrico", "Baunilha", "Especiarias"],
    roast: "Médio-Escuro",
    price: "R$ 85,00",
    image: "/placeholder.svg?height=300&width=300",
  },
]

export default function CoffeeLineup() {
  const [selectedCoffee, setSelectedCoffee] = useState<number | null>(null)

  return (
    <section id="cafes" className="min-h-screen py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-amber-100 mb-4">Nossos Cafés</h2>
          <p className="text-xl text-amber-200/80 max-w-2xl mx-auto">
            Cada grão conta uma história da Serra da Canastra
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {coffees.map((coffee, index) => (
            <motion.div
              key={coffee.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="group cursor-pointer"
              onClick={() => setSelectedCoffee(coffee.id)}
            >
              <Card className="bg-black/40 backdrop-blur-md border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={coffee.image || "/placeholder.svg"}
                    alt={coffee.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-amber-100">{coffee.name}</h3>
                    <Badge variant="outline" className="border-amber-500 text-amber-400">
                      {coffee.roast}
                    </Badge>
                  </div>

                  <p className="text-amber-200/80 mb-4 italic">{coffee.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {coffee.notes.map((note) => (
                      <Badge key={note} variant="secondary" className="bg-amber-900/30 text-amber-300">
                        {note}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-amber-400">{coffee.price}</span>
                    <Button className="bg-amber-600 hover:bg-amber-500 text-black">
                      <Coffee className="w-4 h-4 mr-2" />
                      Comprar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
