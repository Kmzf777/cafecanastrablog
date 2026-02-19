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
                            <Link href="/es/cafecanastra">
                                <Button variant="ghost" className="flex items-center gap-2 text-amber-800 hover:text-amber-900 hover:bg-amber-50">
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Volver al Inicio</span>
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
                        Nuestra Historia: Un Legado en Cada Grano
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-700 italic"
                    >
                        "Todo comenzó con un sueño y un pedazo de tierra fértil."
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
                            <h2 className="text-xl font-semibold text-gray-900 m-0">El Inicio del Sueño</h2>
                        </div>
                        <p>
                            En 1985, en el corazón del cerrado de Minas Gerais, más precisamente en el legendario Chapadão de Ferro, nacía la pasión de la familia Boaventura por el café. Fue allí, en una pequeña finca en Patrocínio/MG, donde la Sra. Conceição y el Sr. Belchior Boaventura decidieron plantar sus primeros árboles de café. Más que un cultivo, aquel era el comienzo de un legado.
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
                            <h2 className="text-xl font-semibold text-gray-900 m-0">Enfoque en la Excelencia</h2>
                        </div>
                        <p>
                            En 1996, el café ganó un nuevo propósito. Silvio Boaventura, hijo de la pareja, vio más allá de la tradición. Con una mirada atenta al futuro, se dio cuenta de que el mundo quería más que café – quería calidad. Así fue como la familia cambió el enfoque de la cantidad por el de la excelencia, iniciando una nueva era dirigida a mercados exigentes como Estados Unidos, Japón y Europa.
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
                            <h2 className="text-xl font-semibold text-gray-900 m-0">El Descubrimiento de la Canastra</h2>
                        </div>
                        <p>
                            2008 marcó un giro: nuevos horizontes, nuevos aromas. El reconocimiento por los cafés especiales de la familia Boaventura crecía, y con él, el deseo de expandirse. En la búsqueda de un terroir único, encontramos el lugar perfecto: la Serra da Canastra, en Minas Gerais.
                        </p>
                        <p className="mt-4">
                            Esta región no solo es hermosa – es generosa con el café. Con altitudes entre las más elevadas del país, un régimen de lluvias homogéneo, días calurosos y noches frías, la Canastra proporciona el escenario ideal para la maduración lenta de los granos, lo que intensifica su dulzura natural y complejidad sensorial. Es allí donde cultivamos variedades nobles como Araras, Caturra 2SL y Paraíso, conocidas por sus granos más grandes, densos y aromáticos.
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
                            <h2 className="text-xl font-semibold text-gray-900 m-0">Del Grano a la Taza</h2>
                        </div>
                        <p>
                            En 2016, Brasil y el mundo conocieron el sabor directo del origen. La tercera generación de la familia entró en escena. Arthur Boaventura asumió la gestión del tostado y, con ella, comenzó una nueva fase de nuestro propósito: llevar el café directo de la finca a la mesa – sin intermediarios.
                        </p>
                        <p className="mt-4">
                            Nació Café Canastra, una marca que expresa todo lo que somos: tradición, innovación, sostenibilidad y respeto.
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
                            <span className="text-3xl font-bold text-amber-600 font-serif">Hoy</span>
                            <h2 className="text-xl font-semibold text-gray-900 m-0">Conquistando el Mundo</h2>
                        </div>
                        <p>
                            Además de la comercialización del café tostado (en grano, molido y en cápsulas), esta fase también marcó el inicio de nuestra exportación directa. Hoy, los cafés de la familia Boaventura salen de la Serra da Canastra y llegan a tostadores en países como Chile, Argentina, Estados Unidos, Irlanda, Países Bajos, Emiratos Árabes Unidos, entre otros.
                        </p>
                        <p className="mt-4">
                            Y no paramos ahí: también ayudamos a otros productores a cumplir sus sueños, ofreciendo el servicio de private label, para que puedan lanzar sus propias marcas de café con la misma calidad que hemos cultivado por generaciones.
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
                            "Grano a grano, lo que comenzó como un sueño familiar se transformó en una marca con alma, aroma y propósito. Café Canastra es más que café: es historia, es legado, es el sabor de Brasil que conquista el mundo."
                        </p>
                    </motion.div>

                </div>
            </section>
        </div>
    )
}
