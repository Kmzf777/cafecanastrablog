"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Calendar,
  Award,
  Heart,
  Plus,
  Minus,
  Instagram,
  Facebook,
  Youtube,
  Mountain,
  LocateFixed,
  Coffee,
  HeartHandshake,
} from "lucide-react"
import BlogNotification from "@/components/blog-notification"
import ProductCarousel from "@/components/product-carousel"
import LanguageSwitcher from '@/components/LanguageSwitcher'
import BlogSection from "@/components/blog-section"

export default function CafeCanastraWebsite() {
  const [isMenuScrolled, setIsMenuScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("classico")
  const [selectedVariant, setSelectedVariant] = useState("moido")
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    const handleScroll = () => {
      setIsMenuScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const products = {
    classico: {
      name: "Canastra Clássico",
      description:
        "Nosso blend tradicional, com notas de chocolate e caramelo. Um café encorpado e equilibrado, perfeito para o dia a dia.",
      image: "/placeholder.svg?height=400&width=400&text=Canastra+Clássico",
      color: "amber",
      variants: {
        moido: {
          name: "Moído",
          description: "Moagem média, ideal para cafeteiras tradicionais e filtro de papel.",
          image: "/placeholder.svg?height=200&width=200&text=Clássico+Moído",
        },
        grao: {
          name: "Grão",
          description: "Grãos inteiros para você moer na hora e preservar todo o aroma.",
          image: "/placeholder.svg?height=200&width=200&text=Clássico+Grão",
        },
        capsula: {
          name: "Cápsula",
          description: "Compatível com máquinas Nespresso®, praticidade sem perder qualidade.",
          image: "/placeholder.svg?height=200&width=200&text=Clássico+Cápsula",
        },
        drip: {
          name: "Drip Coffee",
          description: "Sachês individuais para um café coado perfeito em qualquer lugar.",
          image: "/placeholder.svg?height=200&width=200&text=Clássico+Drip",
        },
      },
    },
    suave: {
      name: "Canastra Suave",
      description:
        "Um blend delicado com acidez moderada e notas de frutas amarelas. Perfeito para momentos de tranquilidade.",
      image: "/placeholder.svg?height=400&width=400&text=Canastra+Suave",
      color: "emerald",
      variants: {
        moido: {
          name: "Moído",
          description: "Moagem média, ideal para cafeteiras tradicionais e filtro de papel.",
          image: "/placeholder.svg?height=200&width=200&text=Suave+Moído",
        },
        grao: {
          name: "Grão",
          description: "Grãos inteiros para você moer na hora e preservar todo o aroma.",
          image: "/placeholder.svg?height=200&width=200&text=Suave+Grão",
        },
        capsula: {
          name: "Cápsula",
          description: "Compatível com máquinas Nespresso®, praticidade sem perder qualidade.",
          image: "/placeholder.svg?height=200&width=200&text=Suave+Cápsula",
        },
        drip: {
          name: "Drip Coffee",
          description: "Sachês individuais para um café coado perfeito em qualquer lugar.",
          image: "/placeholder.svg?height=200&width=200&text=Suave+Drip",
        },
      },
    },
    canela: {
      name: "Canastra Canela",
      description:
        "Nossa edição especial com sutis notas de canela. Um café aromático e envolvente para momentos especiais.",
      image: "/placeholder.svg?height=400&width=400&text=Canastra+Canela",
      color: "rose",
      variants: {
        moido: {
          name: "Moído",
          description: "Moagem média, ideal para cafeteiras tradicionais e filtro de papel.",
          image: "/placeholder.svg?height=200&width=200&text=Canela+Moído",
        },
        grao: {
          name: "Grão",
          description: "Grãos inteiros para você moer na hora e preservar todo o aroma.",
          image: "/placeholder.svg?height=200&width=200&text=Canela+Grão",
        },
        capsula: {
          name: "Cápsula",
          description: "Compatível com máquinas Nespresso®, praticidade sem perder qualidade.",
          image: "/placeholder.svg?height=200&width=200&text=Canela+Cápsula",
        },
        drip: {
          name: "Drip Coffee",
          description: "Sachês individuais para um café coado perfeito em qualquer lugar.",
          image: "/placeholder.svg?height=200&width=200&text=Canela+Drip",
        },
      },
    },
  }

  const getColorClass = (product: string, type: string) => {
    const colorMap = {
      classico: {
        bg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-200",
        hover: "hover:bg-amber-100",
        button: "bg-amber-600 hover:bg-amber-700",
        light: "bg-amber-100",
      },
      suave: {
        bg: "bg-emerald-50",
        text: "text-emerald-800",
        border: "border-emerald-200",
        hover: "hover:bg-emerald-100",
        button: "bg-emerald-600 hover:bg-emerald-700",
        light: "bg-emerald-100",
      },
      canela: {
        bg: "bg-rose-50",
        text: "text-rose-800",
        border: "border-rose-200",
        hover: "hover:bg-rose-100",
        button: "bg-rose-600 hover:bg-rose-700",
        light: "bg-rose-100",
      },
    }

    return colorMap[product as keyof typeof colorMap][type as keyof (typeof colorMap)["classico"]]
  }

  const giftKits = [
    {
      name: "Kit Iniciante",
      description: "Perfeito para presentear quem ama café",
      image: "/placeholder.svg?height=300&width=250&text=Kit+Iniciante",
    },
    {
      name: "Kit Premium",
      description: "Uma experiência sensorial completa",
      image: "/placeholder.svg?height=300&width=250&text=Kit+Premium",
    },
    {
      name: "Kit Personalizado",
      description: "Monte seu kit com os cafés favoritos",
      image: "/placeholder.svg?height=300&width=250&text=Kit+Personalizado",
    },
  ]

  const testimonials = [
    {
      name: "Maria Silva",
      location: "São Paulo, SP",
      text: "O melhor café que já experimentei! A qualidade é excepcional e o sabor me transporta para a Serra da Canastra.",
      avatar: "/placeholder.svg?height=60&width=60&text=MS",
    },
    {
      name: "João Santos",
      location: "Belo Horizonte, MG",
      text: "Cada xícara é uma nova descoberta de sabores únicos. O atendimento é impecável e a entrega sempre pontual.",
      avatar: "/placeholder.svg?height=60&width=60&text=JS",
    },
    {
      name: "Ana Costa",
      location: "Rio de Janeiro, RJ",
      text: "Café de qualidade excepcional! Recomendo especialmente o Canastra Canela, uma experiência sensorial única.",
      avatar: "/placeholder.svg?height=60&width=60&text=AC",
    },
  ]

  const faqs = [
    {
      question: "Entre em contato",
      answer:
        "Entre em contato conosco pelo WhatsApp ou formulário de contato. Nossa equipe responderá imediatamente para processar seu pedido.",
    },
    {
      question: "Realizamos entregas em todo o Brasil.",
      answer: "O prazo varia de um a 10 dias úteis para região Sul Sudeste Centro-Oeste e até 20 dias para região Norte e Nordeste.",
    },
    {
      question: "Qual a origem dos grãos?",
      answer:
        "Todos os nossos cafés são cultivados na Serra da Canastra, em Minas Gerais em nossa própria fazenda.",
    },
    {
      question: "Como preparar o café perfeito?",
      answer:
        "Cada embalagem vem com instruções específicas. Recomendamos água filtrada a 92-96°C e proporcao 1:12 (40g para 480ml agua)",
    },
  ]

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const response = await fetch('/api/landing-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      
      if (result.success) {
        setSubmitMessage("Dados enviados com sucesso! Entraremos em contato em breve.")
        setFormData({ nome: "", email: "", whatsapp: "" })
      } else {
        setSubmitMessage("Erro ao enviar dados. Tente novamente.")
      }
    } catch (error) {
      setSubmitMessage("Erro ao enviar dados. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  // 1. Corrigir array de navegação (remover Kits)
  const navigationItems = [
    { name: "Início", id: "início" },
    { name: "Nossa História", id: "nossa-historia" },
    { name: "Cafés", id: "cafés" },
    { name: "Depoimentos", id: "depoimentos" },
    { name: "Blog", id: "blog" },
    { name: "Contato", id: "contato" }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Fixed Navigation */}
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isMenuScrolled ? "bg-white shadow-lg" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="/logo-canastra.png"
                alt="Café Canastra"
                className={`h-8 sm:h-10 w-auto transition-all duration-300 ${
                  isMenuScrolled ? "filter-none" : "filter brightness-0 invert"
                }`}
              />
            </div>
            {/* Language Switcher no topo, à direita do logo */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
            </div>
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-colors hover:text-amber-600 text-sm xl:text-base ${
                    isMenuScrolled ? "text-gray-800" : "text-white"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={isMenuScrolled ? "text-gray-800" : "text-white"}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <Button 
                className="bg-amber-600 hover:bg-amber-700 text-white text-sm xl:text-base"
                onClick={() => scrollToSection("contato")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Fale Conosco
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden mt-4 pb-4 bg-white rounded-lg shadow-lg"
            >
              <div className="flex flex-col space-y-3 px-4 py-3">
                {navigationItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className="text-gray-800 hover:text-amber-600 transition-colors py-2 text-left"
                  >
                    {item.name}
                  </button>
                ))}
                <Button 
                  className="bg-amber-600 hover:bg-amber-700 text-white mt-3"
                  onClick={() => scrollToSection("contato")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Fale Conosco
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="início" className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src="/banner-cafecanastra.png"
            alt="Banner Café Canastra"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </motion.div>

        <motion.div
          className="relative z-10 text-center text-white px-4 w-full max-w-4xl mx-auto"
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold mb-4 sm:mb-6 leading-tight">
            O Café que Eterniza Momentos
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Cultivado com alma mineira desde 1985, cada grão leva até você o sabor puro da Serra da Canastra.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
              onClick={() => scrollToSection("contato")}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Solicitar Atendimento
            </Button>
            <Button
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base transition-colors duration-200"
              style={{ boxShadow: 'none' }}
              onClick={() => scrollToSection("nossa-historia")}
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Nossa História
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8" />
        </motion.div>
      </section>

      {/* Diferenciais Section */}
      <section id="diferenciais" className="py-16 lg:py-24 bg-gradient-to-b from-amber-50 to-white">
        <div className="w-full px-2 sm:px-4 lg:px-8 mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">O que faz do Café Canastra algo único?</h2>
          </div>
          <div className="w-full grid gap-6 grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 sm:p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-amber-200 h-full">
              <div className="bg-amber-100 rounded-full p-4 mb-4 flex items-center justify-center">
                <Mountain className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Origem Serra da Canastra</h3>
              <p className="text-gray-700 text-sm hidden sm:block">Só torramos cafés que nós mesmos cultivamos, colhemos e selecionamos. Sem intermediários, sem misturas.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 sm:p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-amber-200 h-full">
              <div className="bg-amber-100 rounded-full p-4 mb-4 flex items-center justify-center">
                <LocateFixed className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Single Origin</h3>
              <p className="text-gray-700 text-sm hidden sm:block">Cada café vem de um lote único, refletindo as nuances do nosso terroir.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 sm:p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-amber-200 h-full">
              <div className="bg-amber-100 rounded-full p-4 mb-4 flex items-center justify-center">
                <Coffee className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Da fazenda à torrefação</h3>
              <p className="text-gray-700 text-sm hidden sm:block">Controle absoluto da qualidade em todas as etapas.</p>
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 sm:p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-amber-200 h-full">
              <div className="bg-amber-100 rounded-full p-4 mb-4 flex items-center justify-center">
                <HeartHandshake className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Respeito às pessoas e ao meio ambiente</h3>
              <p className="text-gray-700 text-sm hidden sm:block">Valorizamos nossa comunidade local, nossos colaboradores e cultivamos práticas sustentáveis que protegem a Serra da Canastra.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {/* <BlogSection /> (REMOVER DAQUI) */}

      {/* Carrossel de Produtos */}
      <section id="cafés">
        <ProductCarousel scrollToSection={scrollToSection} />
      </section>

      {/* Nossa História */}
      <section id="nossa-historia" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full order-2 lg:order-1"
            >
              <img
                src="/nossa-historia.png"
                alt="Nossa História"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full order-1 lg:order-2"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold mb-4 sm:mb-6 text-gray-800">
                Nossa História
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                Desde 1985, a família Canastra dedica-se ao cultivo artesanal de café especial na icônica Serra da
                Canastra. Nossa paixão pela terra e pelo grão perfeito nos levou a criar uma das marcas mais respeitadas
                do café brasileiro.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Cada xícara conta uma história de tradição, inovação e amor pela arte de fazer café. Do plantio à sua
                mesa, cuidamos de cada detalhe para entregar uma experiência única e inesquecível.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">1985</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Fundação da fazenda familiar</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">2010</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Primeiro prêmio de qualidade</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">2020</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Lançamento da marca Canastra</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Galeria Sensorial */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="w-full max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold mb-4 text-gray-800">
              Galeria Sensorial
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Uma jornada visual pelo processo artesanal do nosso café
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[
              { src: "/plantio-artesanal-low.png", label: "Plantio Artesanal" },
              { src: "/colheita-manual-low.png", label: "Colheita Manual" },
              { src: "/secagem-solar-low.png", label: "Secagem Solar" },
              { src: "/torra-artesanal-low.png", label: "Torra Artesanal" },
              { src: "/moagem-fresca-low.png", label: "Moagem Fresca" },
              { src: "/preparo-perfeito-low.png", label: "Preparo Perfeito" },
              { src: "/degustacao-low.png", label: "Degustação" },
              { src: "/experiencia-unica-low.png", label: "Experiência Única" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-32 sm:h-40 lg:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-semibold text-xs sm:text-sm lg:text-base text-center px-2">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="w-full max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold mb-4 text-gray-800">
              O que nossos clientes dizem
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Histórias reais de quem já experimentou a qualidade Canastra
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <motion.div
                className="flex transition-transform duration-300"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2 sm:px-4">
                    <Card className="bg-white shadow-lg">
                      <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                        <blockquote className="text-sm sm:text-lg lg:text-xl text-gray-700 mb-4 sm:mb-6 italic leading-relaxed">
                          "{testimonial.text}"
                        </blockquote>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{testimonial.name}</h4>
                          <p className="text-gray-600 text-xs sm:text-sm">{testimonial.location}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="flex justify-center mt-6 sm:mt-8 space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentTestimonial(currentTestimonial === 0 ? testimonials.length - 1 : currentTestimonial - 1)
                }
                className="w-8 h-8 sm:w-10 sm:h-10"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentTestimonial(currentTestimonial === testimonials.length - 1 ? 0 : currentTestimonial + 1)
                }
                className="w-8 h-8 sm:w-10 sm:h-10"
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="blog">
        <BlogSection />
      </section>
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="w-full max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold mb-4 text-gray-800">
              Perguntas Frequentes
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              Tire suas dúvidas sobre nossos produtos e serviços
            </p>
          </motion.div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Collapsible open={openFaq === index} onOpenChange={() => setOpenFaq(openFaq === index ? null : index)}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 sm:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-left font-semibold text-gray-800 text-sm sm:text-base pr-4">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 sm:px-6 pb-4 sm:pb-6 bg-white rounded-b-lg">
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold mb-4 text-gray-800">Fale Conosco</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Entraremos em contato em até 1 minuto!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full max-w-2xl mx-auto"
          >
            <Card className="shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center">Entrar em Contato Agora</h3>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                    <Input 
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      placeholder="Seu nome completo" 
                      className="border-gray-300 text-sm sm:text-base" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                    <Input 
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Seu melhor e-mail" 
                      className="border-gray-300 text-sm sm:text-base" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                    <Input 
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="(DD)XXXXX-XXXX" 
                      className="border-gray-300 text-sm sm:text-base" 
                      required
                    />
                  </div>
                  {submitMessage && (
                    <div className={`p-3 rounded-lg text-sm ${
                      submitMessage.includes("sucesso") 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {submitMessage}
                    </div>
                  )}
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm sm:text-base py-3 sm:py-4"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <motion.div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button 
          size="lg" 
          className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-3 sm:p-4"
          onClick={() => scrollToSection("contato")}
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </motion.div>

      <BlogNotification />
    </div>
  )
}
