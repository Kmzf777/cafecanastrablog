"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Mail, Phone, MapPin, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const faqs = [
  {
    question: "Como funciona a assinatura?",
    answer:
      "Nossa assinatura entrega café fresco diretamente na sua casa. Você pode escolher a frequência (semanal ou mensal) e pausar ou cancelar a qualquer momento.",
  },
  {
    question: "Qual a origem dos grãos?",
    answer:
      "Todos os nossos cafés são cultivados na Serra da Canastra, em Minas Gerais, por produtores parceiros que seguem práticas sustentáveis e de comércio justo.",
  },
  {
    question: "Como preparar o café perfeito?",
    answer:
      "Cada embalagem vem com instruções específicas de preparo. Recomendamos usar água filtrada a 92-96°C e uma proporção de 1:15 (café:água).",
  },
]

export default function ContactSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section id="contato" className="min-h-screen py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-amber-100 mb-4">Fale Conosco</h2>
          <p className="text-xl text-amber-200/80 max-w-2xl mx-auto">
            Estamos aqui para ajudar você a descobrir o café perfeito
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-black/40 backdrop-blur-md border border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-100">Entre em Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Seu nome"
                    className="bg-black/20 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                  />
                  <Input
                    type="email"
                    placeholder="Seu email"
                    className="bg-black/20 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                  />
                </div>
                <Input
                  placeholder="Assunto"
                  className="bg-black/20 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                />
                <Textarea
                  placeholder="Sua mensagem"
                  rows={5}
                  className="bg-black/20 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                />
                <Button className="w-full bg-amber-600 hover:bg-amber-500 text-black">Enviar Mensagem</Button>
              </CardContent>
            </Card>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 text-amber-200">
                <Mail className="w-5 h-5 text-amber-400" />
                <span>contato@cafecanastra.com.br</span>
              </div>
              <div className="flex items-center space-x-3 text-amber-200">
                <Phone className="w-5 h-5 text-amber-400" />
                <span>(37) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-3 text-amber-200 md:col-span-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>Serra da Canastra, Minas Gerais, Brasil</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Card className="bg-black/40 backdrop-blur-md border border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-100">Perguntas Frequentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <Collapsible
                    key={index}
                    open={openFaq === index}
                    onOpenChange={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-amber-900/20 rounded-lg hover:bg-amber-900/30 transition-colors">
                      <span className="text-amber-100 font-medium text-left">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-amber-400 transition-transform ${
                          openFaq === index ? "rotate-180" : ""
                        }`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 text-amber-200/80">{faq.answer}</CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>

            <motion.div className="fixed bottom-6 right-6 z-40" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="lg" className="bg-green-600 hover:bg-green-500 text-white rounded-full shadow-lg">
                <MessageCircle className="w-6 h-6 mr-2" />
                WhatsApp
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
