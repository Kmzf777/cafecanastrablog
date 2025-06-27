"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Coffee, Gift, Truck, Star } from "lucide-react"

export default function SubscriptionPlan() {
  const [frequency, setFrequency] = useState<"weekly" | "monthly">("monthly")

  const benefits = [
    { icon: Coffee, text: "Café sempre fresco" },
    { icon: Truck, text: "Entrega gratuita" },
    { icon: Gift, text: "Brindes exclusivos" },
    { icon: Star, text: "Acesso antecipado" },
  ]

  return (
    <section id="assinatura" className="min-h-screen py-20 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-amber-100 mb-4">Assinatura Canastra</h2>
          <p className="text-xl text-amber-200/80">Receba o melhor café da serra em sua casa</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-black/40 backdrop-blur-md border border-amber-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />

            <CardHeader className="relative z-10 text-center pb-8">
              <CardTitle className="text-3xl text-amber-100 mb-4">Plano Premium</CardTitle>

              <div className="flex items-center justify-center space-x-4 mb-6">
                <span className={frequency === "weekly" ? "text-amber-400" : "text-amber-200/60"}>Semanal</span>
                <Switch
                  checked={frequency === "monthly"}
                  onCheckedChange={(checked) => setFrequency(checked ? "monthly" : "weekly")}
                />
                <span className={frequency === "monthly" ? "text-amber-400" : "text-amber-200/60"}>Mensal</span>
              </div>

              <div className="text-center">
                <span className="text-5xl font-bold text-amber-400">R$ {frequency === "monthly" ? "120" : "35"}</span>
                <span className="text-amber-200/80 ml-2">/{frequency === "monthly" ? "mês" : "semana"}</span>
                {frequency === "monthly" && <Badge className="ml-4 bg-amber-600 text-black">Economize 15%</Badge>}
              </div>
            </CardHeader>

            <CardContent className="relative z-10">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-semibold text-amber-100 mb-4">Benefícios Inclusos</h4>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center">
                          <benefit.icon className="w-5 h-5 text-amber-400" />
                        </div>
                        <span className="text-amber-200">{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-900/20 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-amber-100 mb-4">O que você recebe</h4>
                  <ul className="space-y-2 text-amber-200/80">
                    <li>• 500g de café premium por entrega</li>
                    <li>• Variedade rotativa de blends</li>
                    <li>• Guia de preparo personalizado</li>
                    <li>• Acesso ao clube exclusivo</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-amber-500 text-black hover:shadow-lg hover:shadow-amber-500/25 px-8 py-3 text-lg font-semibold"
                >
                  Quero café em casa
                  <Coffee className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
