"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Calendar, Award, Mountain, Coffee, Sprout } from "lucide-react"
import Link from "next/link"
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white shadow-sm">
        <div className="w-full px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <img
                src="/logo-canastra.png"
                alt="Café Canastra"
                className="h-8 sm:h-10 w-auto"
              />
            </Link>
             <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link href="/">
                <Button variant="ghost" className="flex items-center gap-2 text-amber-800 hover:text-amber-900 hover:bg-amber-50">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Voltar para o Início</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 px-4 sm:px-6 bg-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6"
          >
            Nossa História: Um Legado em Cada Grão
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-700 italic"
          >
            "Tudo começou com um sonho e um pedaço de terra fértil."
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          
          {/* 1985 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg text-gray-600"
          >
            <div className="flex items-baseline gap-4 mb-4 border-b border-amber-100 pb-2">
              <span className="text-3xl font-bold text-amber-600 font-serif">1985</span>
              <h2 className="text-xl font-semibold text-gray-900 m-0">O Início do Sonho</h2>
            </div>
            <p>
              Em 1985, no coração do cerrado mineiro, mais precisamente no lendário Chapadão de Ferro, nascia a paixão da família Boaventura pelo café. Foi ali, num pequeno sítio em Patrocínio/MG, que a Sra. Conceição e o Sr. Belchior Boaventura decidiram plantar seus primeiros pés de café. Mais do que um cultivo, aquele era o início de um legado.
            </p>
          </motion.div>

          {/* 1996 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg text-gray-600"
          >
            <div className="flex items-baseline gap-4 mb-4 border-b border-amber-100 pb-2">
              <span className="text-3xl font-bold text-amber-600 font-serif">1996</span>
              <h2 className="text-xl font-semibold text-gray-900 m-0">Foco na Excelência</h2>
            </div>
            <p>
              Em 1996, o café ganhou novo propósito. Silvio Boaventura, filho do casal, enxergou além da tradição. Com um olhar atento ao futuro, ele percebeu que o mundo queria mais do que café – queria qualidade. Foi assim que a família trocou o foco da quantidade pela excelência, iniciando uma nova era voltada para mercados exigentes como os Estados Unidos, o Japão e a Europa.
            </p>
          </motion.div>

          {/* 2008 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg text-gray-600"
          >
            <div className="flex items-baseline gap-4 mb-4 border-b border-amber-100 pb-2">
              <span className="text-3xl font-bold text-amber-600 font-serif">2008</span>
              <h2 className="text-xl font-semibold text-gray-900 m-0">A Descoberta da Canastra</h2>
            </div>
            <p>
              2008 marcou uma virada: novos horizontes, novos aromas. O reconhecimento pelos cafés especiais da família Boaventura crescia, e com ele, a vontade de expandir. Na busca por um terroir único, encontramos o lugar perfeito: a Serra da Canastra, em Minas Gerais.
            </p>
            <p className="mt-4">
              Essa região não é apenas bonita – ela é generosa com o café. Com altitudes entre as mais elevadas do país, um regime de chuvas homogêneo, dias quentes e noites frias, a Canastra proporciona o cenário ideal para o amadurecimento lento dos grãos, o que intensifica sua doçura natural e complexidade sensorial. É lá que cultivamos variedades nobres como Araras, Caturra 2SL e Paraíso, conhecidas por seus grãos maiores, mais densos e aromáticos.
            </p>
          </motion.div>

          {/* 2016 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg text-gray-600"
          >
            <div className="flex items-baseline gap-4 mb-4 border-b border-amber-100 pb-2">
              <span className="text-3xl font-bold text-amber-600 font-serif">2016</span>
              <h2 className="text-xl font-semibold text-gray-900 m-0">Do Grão à Xícara</h2>
            </div>
            <p>
              Em 2016, o Brasil e o mundo conheceram o sabor direto da origem. A terceira geração da família entrou em cena. Arthur Boaventura assumiu a gestão da torrefação e, com ela, começou uma nova fase do nosso propósito: levar o café direto da fazenda até a mesa – sem intermediários.
            </p>
            <p className="mt-4">
              Nasceu a Café Canastra, uma marca que expressa tudo o que somos: tradição, inovação, sustentabilidade e respeito.
            </p>
          </motion.div>

          {/* Expansion */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg text-gray-600"
          >
             <div className="flex items-baseline gap-4 mb-4 border-b border-amber-100 pb-2">
              <span className="text-3xl font-bold text-amber-600 font-serif">Hoje</span>
              <h2 className="text-xl font-semibold text-gray-900 m-0">Conquistando o Mundo</h2>
            </div>
            <p>
              Além da comercialização do café torrado (em grãos, moído e em cápsulas), essa fase também marcou o início da nossa exportação direta. Hoje, os cafés da família Boaventura saem da Serra da Canastra e chegam a torrefações em países como Chile, Argentina, Estados Unidos, Irlanda, Holanda, Emirados Árabes Unidos, entre outros.
            </p>
            <p className="mt-4">
              E não paramos por aí: também ajudamos outros produtores a realizarem seus sonhos, oferecendo o serviço de private label, para que possam lançar suas próprias marcas de café com a mesma qualidade que cultivamos há gerações.
            </p>
          </motion.div>

          {/* Conclusion */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-amber-50 p-8 rounded-2xl text-center"
          >
            <p className="text-xl font-serif text-amber-900 italic leading-relaxed">
              "De grão em grão, o que começou como um sonho familiar se transformou em uma marca com alma, aroma e propósito. Café Canastra é mais do que café: é história, é legado, é o sabor do Brasil que conquista o mundo."
            </p>
          </motion.div>

        </div>
      </section>
    </div>
  )
}
