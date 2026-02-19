"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
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
                            <Link href="/en/cafecanastra">
                                <Button variant="ghost" className="flex items-center gap-2 text-amber-800 hover:text-amber-900 hover:bg-amber-50">
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Back to Home</span>
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
                        Our History: A Legacy in Every Bean
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-700 italic"
                    >
                        "It all started with a dream and a piece of fertile land."
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
                            <h2 className="text-xl font-semibold text-gray-900 m-0">The Beginning of a Dream</h2>
                        </div>
                        <p>
                            In 1985, in the heart of the Minas Gerais cerrado, more precisely in the legendary Chapadão de Ferro, the Boaventura family's passion for coffee was born. It was there, on a small farm in Patrocínio/MG, that Mrs. Conceição and Mr. Belchior Boaventura decided to plant their first coffee trees. More than a crop, that was the beginning of a legacy.
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
                            <h2 className="text-xl font-semibold text-gray-900 m-0">Focus on Excellence</h2>
                        </div>
                        <p>
                            In 1996, coffee gained a new purpose. Silvio Boaventura, the couple's son, saw beyond tradition. With a keen eye on the future, he realized that the world wanted more than coffee – it wanted quality. That's how the family shifted focus from quantity to excellence, starting a new era aimed at demanding markets like the United States, Japan, and Europe.
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
                            <h2 className="text-xl font-semibold text-gray-900 m-0">Discovering The Canastra</h2>
                        </div>
                        <p>
                            2008 marked a turning point: new horizons, new aromas. As recognition for the Boaventura family's specialty coffees grew, so did the desire to expand. In the search for a unique terroir, we found the perfect place: the Serra da Canastra, in Minas Gerais.
                        </p>
                        <p className="mt-4">
                            This region is not just beautiful – it is generous with coffee. With some of the highest altitudes in the country, a consistent rainfall regime, hot days and cold nights, the Canastra provides the ideal setting for slow bean maturation, which intensifies their natural sweetness and sensory complexity. It is there that we cultivate noble varieties like Araras, Caturra 2SL, and Paraíso, known for their larger, denser, and more aromatic beans.
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
                            <h2 className="text-xl font-semibold text-gray-900 m-0">From Bean to Cup</h2>
                        </div>
                        <p>
                            In 2016, Brazil and the world experienced flavor straight from the origin. The third generation of the family entered the scene. Arthur Boaventura took over roasting management and, with it, began a new phase of our purpose: taking coffee directly from the farm to the table – without intermediaries.
                        </p>
                        <p className="mt-4">
                            Café Canastra was born, a brand that expresses everything we are: tradition, innovation, sustainability, and respect.
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
                            <span className="text-3xl font-bold text-amber-600 font-serif">Today</span>
                            <h2 className="text-xl font-semibold text-gray-900 m-0">Conquering the World</h2>
                        </div>
                        <p>
                            In addition to selling roasted coffee (whole bean, ground, and capsules), this phase also marked the beginning of our direct export. Today, the Boaventura family's coffees leave Serra da Canastra and reach roasteries in countries like Chile, Argentina, the United States, Ireland, the Netherlands, the United Arab Emirates, among others.
                        </p>
                        <p className="mt-4">
                            And we don't stop there: we also help other producers achieve their dreams by offering private label services, so they can launch their own coffee brands with the same quality we have cultivated for generations.
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
                            "Bean by bean, what started as a family dream has transformed into a brand with soul, aroma, and purpose. Café Canastra is more than coffee: it is history, it is legacy, it is the flavor of Brazil conquering the world."
                        </p>
                    </motion.div>

                </div>
            </section>
        </div>
    )
}
