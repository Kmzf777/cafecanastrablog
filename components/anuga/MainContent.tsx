'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import AnugaForm from './AnugaForm';
import Image from 'next/image';

interface MainContentProps {
  onFormSuccess: () => void;
}

const products = [
  {
    name: 'Canastra Clássico',
    image: '/cafe-classico.png',
    badge: 'Mais vendido',
    desc: 'Torra escura, intensidade 8. Encorpado com notas caramelizadas e achocolatadas.',
    specs: '100% Arábica · +80 SCA · Moagem médio-fina',
    taste: { doçura: 4, acidez: 3, corpo: 5, amargor: 5 },
    bg: 'from-[#1C1917] to-[#292524]',
  },
  {
    name: 'Canastra Suave',
    image: '/cafe-suave.png',
    badge: 'Equilibrado',
    desc: 'Torra média, intensidade 7. Encorpado com notas achocolatadas e finalização cítrica.',
    specs: '100% Arábica · +80 SCA · Moagem médio-fina',
    taste: { doçura: 3, acidez: 4, corpo: 4, amargor: 3 },
    bg: 'from-[#1C1917] to-[#1a1614]',
  },
  {
    name: 'Canastra Canela',
    image: '/cafe-canela.png',
    badge: 'Edição especial',
    desc: 'Torra escura, intensidade 7. Notas caramelizadas com canela natural.',
    specs: '100% Arábica · +80 SCA · Com canela',
    taste: { doçura: 3, acidez: 3, corpo: 4, amargor: 3 },
    bg: 'from-[#1C1917] to-[#1e1512]',
  },
  {
    name: 'Canastra Microlote',
    image: '/microlote-png.png',
    badge: '86 pontos SCA',
    desc: 'Médio corpo com notas de cacau, melaço e finalização suavemente cítrica.',
    specs: '100% Arábica Especial · 86 SCA · Microlote',
    taste: { doçura: 2, acidez: 4, corpo: 4, amargor: 3 },
    bg: 'from-[#1C1917] to-[#19170f]',
  },
];

function TasteBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] uppercase tracking-wider text-[#78716C] w-14 shrink-0">{label}</span>
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= value ? 'bg-[#C8A96E]' : 'bg-[#292524]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const valueProps = [
  {
    title: 'Compra direta',
    desc: 'Sem intermediários. Da fazenda para o seu negócio com preço justo e rastreabilidade total.',
  },
  {
    title: 'Qualidade padronizada',
    desc: 'Lotes consistentes, pontuação acima de 80 SCAA, torra controlada e certificada.',
  },
  {
    title: 'Maior margem',
    desc: 'Melhor custo-benefício por xícara. Café especial que o seu cliente percebe — e paga.',
  },
];

function FadeInSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function MainContent({ onFormSuccess }: MainContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="anuga-page min-h-screen bg-[#0C0A09] text-[#FAFAF9]"
    >
      {/* Grain overlay */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="/colheita manual.png"
            alt=""
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C0A09]/80 via-[#0C0A09]/60 to-[#0C0A09]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <Image
              src="/logo-canastra.png"
              alt="Café Canastra"
              width={56}
              height={56}
              className="rounded-full ring-1 ring-white/10 brightness-0 invert"
            />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#C8A96E] border border-[#C8A96E]/30 px-4 py-2 rounded-full backdrop-blur-sm bg-[#C8A96E]/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96E] animate-pulse" />
              Exclusivo ANUGA 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-6"
          >
            Ganhe <span className="text-[#C8A96E]">20%</span> de bonificação
            <br className="hidden sm:block" />
            {' '}na sua primeira compra
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-[#A8A29E] font-light max-w-xl leading-relaxed"
          >
            Café especial da Serra da Canastra, direto do produtor. Sem intermediários, sem surpresas.
          </motion.p>
        </div>
      </section>

      {/* ─── PHOTO STRIP ─── */}
      <section className="relative z-10">
        <div className="grid grid-cols-3 gap-[1px] bg-[#C8A96E]/10">
          {[
            { src: '/colheita manual.png', alt: 'Colheita manual na Serra da Canastra' },
            { src: '/torra artesanal.jpg', alt: 'Torra artesanal controlada' },
            { src: '/degustacao.jpg', alt: 'Degustação e cupping profissional' },
          ].map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 + i * 0.15 }}
              className="relative aspect-[16/9] overflow-hidden"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                quality={90}
                sizes="33vw"
              />
              <div className="absolute inset-0 bg-[#0C0A09]/20" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── VALUE PROPOSITIONS ─── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-20 md:py-28">
        <FadeInSection>
          <p className="text-xs tracking-[0.25em] uppercase text-[#C8A96E] mb-4">
            Por que Café Canastra
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-16">
            Por que esse café aumenta
            <br />
            <span className="text-[#A8A29E]">sua margem?</span>
          </h2>
        </FadeInSection>

        <div className="space-y-12">
          {valueProps.map((prop, i) => (
            <FadeInSection key={prop.title} delay={i * 0.1}>
              <div className="group flex gap-6 md:gap-8 items-start">
                <span className="shrink-0 w-10 h-10 rounded-full border border-[#C8A96E]/30 flex items-center justify-center text-sm text-[#C8A96E] font-medium mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-[#C8A96E] transition-colors duration-300">
                    {prop.title}
                  </h3>
                  <p className="text-[#A8A29E] leading-relaxed font-light">
                    {prop.desc}
                  </p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C8A96E]/20 to-transparent" />
      </div>

      {/* ─── FORM SECTION ─── */}
      <section className="relative z-10 max-w-xl mx-auto px-6 py-20 md:py-28">
        <FadeInSection>
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.25em] uppercase text-[#C8A96E] mb-4">
              Oferta exclusiva
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Receba seu cupom
            </h2>
            <p className="text-[#A8A29E] font-light">
              Preencha os dados abaixo e receba o benefício no seu WhatsApp e e-mail.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.15}>
          <div className="bg-[#1C1917] border border-[#292524] rounded-2xl p-6 md:p-8">
            <AnugaForm onSuccess={onFormSuccess} />
          </div>
        </FadeInSection>
      </section>

      {/* ─── PRODUCTS ─── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C8A96E]/20 to-transparent" />
      </div>

      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-28">
        <FadeInSection>
          <p className="text-xs tracking-[0.25em] uppercase text-[#C8A96E] mb-4">
            Nossos cafés
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Conheça a linha completa
          </h2>
          <p className="text-[#A8A29E] font-light max-w-lg mb-16">
            Todos os cafés incluídos na bonificação de 20%. Escolha o blend ideal para o seu negócio.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product, i) => (
            <FadeInSection key={product.name} delay={i * 0.08}>
              <div className={`group relative bg-gradient-to-b ${product.bg} border border-[#292524] rounded-2xl overflow-hidden hover:border-[#C8A96E]/20 transition-all duration-500`}>
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-[#C8A96E] bg-[#0C0A09]/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[#C8A96E]/20">
                    {product.badge}
                  </span>
                </div>

                {/* Product image */}
                <div className="relative h-52 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-transparent to-transparent z-[1]" />
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={160}
                    height={200}
                    className="relative z-[2] object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    quality={90}
                  />
                </div>

                {/* Info */}
                <div className="px-4 pb-5">
                  <h3 className="text-base font-semibold mb-1.5 tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-[#A8A29E] text-xs leading-relaxed mb-3">
                    {product.desc}
                  </p>
                  <p className="text-[10px] text-[#57534E] tracking-wide mb-4">
                    {product.specs}
                  </p>

                  {/* Taste profile */}
                  <div className="space-y-2">
                    {Object.entries(product.taste).map(([key, val]) => (
                      <TasteBar key={key} label={key} value={val} />
                    ))}
                  </div>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ─── ORIGIN ─── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C8A96E]/20 to-transparent" />
      </div>

      <section className="relative z-10 max-w-3xl mx-auto px-6 py-20 md:py-28">
        <FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#C8A96E] mb-4">
                Origem
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                Serra da Canastra,
                <br />
                <span className="text-[#A8A29E]">Minas Gerais</span>
              </h2>
              <div className="space-y-4 text-sm text-[#A8A29E] font-light leading-relaxed">
                <p>
                  Cultivado a <span className="text-[#FAFAF9] font-medium">1.250m de altitude</span> na Fazenda Divinéia, nosso café se beneficia do terroir único da Serra da Canastra — clima ameno, solo fértil e maturação lenta dos grãos.
                </p>
                <p>
                  Variedades <span className="text-[#FAFAF9] font-medium">Arara, Paraíso e Catuaí</span>, colhidas manualmente e processadas com controle rigoroso de qualidade.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Altitude', value: '1.250m' },
                { label: 'Espécie', value: '100% Arábica' },
                { label: 'Pontuação', value: '+80 SCA' },
                { label: 'Processo', value: 'Natural / CD' },
              ].map((item) => (
                <div key={item.label} className="bg-[#1C1917] border border-[#292524] rounded-xl p-4 text-center">
                  <p className="text-xl md:text-2xl font-semibold text-[#C8A96E] mb-1">{item.value}</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#78716C]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative z-10 py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0A09] via-[#C8A96E]/[0.03] to-[#0C0A09]" />
        <FadeInSection className="relative z-10 text-center max-w-lg mx-auto px-6">
          <p className="text-xs tracking-[0.25em] uppercase text-[#C8A96E] mb-4">
            Não perca
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
            Garanta seus 20% de bonificação
          </h2>
          <p className="text-[#A8A29E] font-light mb-8">
            Oferta exclusiva para visitantes ANUGA 2026. Preencha o formulário acima ou fale direto com nosso consultor.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-3.5 rounded-xl bg-[#C8A96E] text-[#0C0A09] font-semibold text-sm tracking-wide hover:bg-[#D4B97A] transition-all duration-300 active:scale-[0.98]"
            >
              Preencher formulário
            </button>
            <a
              href="https://wa.me/5534993195252?text=Ol%C3%A1%2C%20vim%20pela%20ANUGA%20e%20quero%20saber%20mais%20sobre%20os%20caf%C3%A9s."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#292524] text-[#FAFAF9] font-semibold text-sm tracking-wide hover:border-[#C8A96E]/30 hover:bg-[#C8A96E]/5 transition-all duration-300"
            >
              <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar no WhatsApp
            </a>
          </div>
        </FadeInSection>
      </section>

      {/* ─── FOOTER ─── */}
      <div className="relative z-10 text-center py-8 border-t border-[#1C1917]">
        <p className="text-xs text-[#57534E] tracking-wide">
          &copy; {new Date().getFullYear()} Caf&eacute; Canastra &mdash; Serra da Canastra, MG
        </p>
      </div>
    </motion.div>
  );
}
