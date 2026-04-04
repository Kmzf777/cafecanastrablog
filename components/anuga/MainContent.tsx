'use client';

import { motion } from 'framer-motion';
import AnugaForm from './AnugaForm';
import Image from 'next/image';

interface MainContentProps {
  onFormSuccess: () => void;
}

const valueProps = [
  'Compra direta do produtor (sem intermediários)',
  'Padronização de qualidade',
  'Melhor custo-benefício por xícara',
];

export default function MainContent({ onFormSuccess }: MainContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#F5EDE4]"
    >
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#2C1810] to-[#3D2215] text-[#F5E6D0] py-12 px-6 text-center">
        <Image
          src="/logo-canastra.png"
          alt="Café Canastra"
          width={80}
          height={80}
          className="mx-auto mb-6 rounded-full bg-white/10 p-2"
        />
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-4 leading-tight">
          Ganhe 20% de bonificação
          <br />
          na sua primeira compra
        </h1>
        <span className="inline-block text-sm border border-[#F5E6D0]/30 px-4 py-1.5 rounded-full text-[#F5E6D0]/70">
          🎯 Exclusivo visitantes ANUGA
        </span>
      </section>

      {/* Photo strip */}
      <div className="flex overflow-hidden h-24 md:h-32">
        <Image
          src="/colheita-manual-low.png"
          alt="Colheita manual"
          width={400}
          height={128}
          className="object-cover flex-1 min-w-0"
        />
        <Image
          src="/torra-artesanal-low.png"
          alt="Torra artesanal"
          width={400}
          height={128}
          className="object-cover flex-1 min-w-0"
        />
        <Image
          src="/degustacao-low.png"
          alt="Degustação"
          width={400}
          height={128}
          className="object-cover flex-1 min-w-0"
        />
      </div>

      {/* Value Block */}
      <section className="px-6 py-10 max-w-lg mx-auto">
        <h2 className="font-serif text-xl font-bold text-[#4A2C1A] mb-6">
          Por que esse café aumenta sua margem?
        </h2>
        <ul className="space-y-4">
          {valueProps.map((prop) => (
            <li key={prop} className="flex items-start gap-3">
              <span className="text-[#8B6914] text-lg mt-0.5">✦</span>
              <span className="text-[#2C1810] text-sm leading-relaxed">
                {prop}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Divider */}
      <div className="mx-6 max-w-lg mx-auto border-t border-[#2C1810]/10" />

      {/* Form Section */}
      <section className="px-6 py-10 max-w-lg mx-auto">
        <h2 className="font-serif text-lg font-bold text-[#4A2C1A] mb-6">
          Receba seu cupom agora
        </h2>
        <AnugaForm onSuccess={onFormSuccess} />
      </section>

      {/* Footer mini */}
      <div className="text-center py-6 text-xs text-[#2C1810]/30">
        © {new Date().getFullYear()} Café Canastra
      </div>
    </motion.div>
  );
}
