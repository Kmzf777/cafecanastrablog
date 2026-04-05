'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/* ─── Types ─── */
type Segmento = 'cafeteria' | 'revenda' | 'rede' | 'foodservice' | 'exportacao';
type Step = 1 | 2 | 3;

interface FormData {
  nome: string;
  whatsapp: string;
  email: string;
}

interface FormErrors {
  nome?: string;
  whatsapp?: string;
  email?: string;
}

/* ─── Segments ─── */
const segments: { id: Segmento; label: string; labelEn: string; icon: string }[] = [
  { id: 'cafeteria', label: 'Cafeteria', labelEn: 'Coffee Shop', icon: '☕' },
  { id: 'revenda', label: 'Revenda / Distribuidora', labelEn: 'Resale / Distribution', icon: '📦' },
  { id: 'rede', label: 'Rede / Supermercado', labelEn: 'Retail / Supermarket', icon: '🏪' },
  { id: 'foodservice', label: 'Hotel / Restaurante', labelEn: 'Hotel / Restaurant', icon: '🍽️' },
  { id: 'exportacao', label: 'Exportação / Import', labelEn: 'Export / Import', icon: '🌍' },
];

/* ─── Helpers ─── */
function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.nome || data.nome.trim().length < 2) errors.nome = 'Nome é obrigatório';
  const digits = data.whatsapp.replace(/\D/g, '');
  if (!digits || digits.length < 10 || digits.length > 11) errors.whatsapp = 'WhatsApp inválido';
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'E-mail inválido';
  return errors;
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, duration = 1.2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    }
    ref.current = requestAnimationFrame(tick);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration]);

  return <>{count}</>;
}

/* ─── Step Transition Wrapper ─── */
const stepVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

/* ─── MAIN COMPONENT ─── */
export default function AnugaQuiz() {
  const [step, setStep] = useState<Step>(1);
  const [segmento, setSegmento] = useState<Segmento | null>(null);
  const [form, setForm] = useState<FormData>({ nome: '', whatsapp: '', email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const isExport = segmento === 'exportacao';

  const handleSegmentSelect = useCallback((id: Segmento) => {
    setSegmento(id);
    setTimeout(() => setStep(2), 400);
  }, []);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'whatsapp' ? formatWhatsApp(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError('');
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const payload = {
      nome: form.nome.trim(),
      whatsapp: '55' + form.whatsapp.replace(/\D/g, ''),
      email: form.email.trim().toLowerCase(),
      segmento,
      origem: 'anuga_2026',
      timestamp: new Date().toISOString(),
    };

    try {
      const results = await Promise.allSettled([
        fetch('https://webhook.canastrainteligencia.com/webhook/anuga', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
        fetch('https://n8n.canastrainteligencia.com/webhook-test/anuga', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
      ]);

      const anySuccess = results.some(
        (r) => r.status === 'fulfilled' && r.value.ok
      );

      if (anySuccess) {
        setStep(3);
      } else {
        setSubmitError('Erro ao enviar. Tente novamente.');
      }
    } catch {
      setSubmitError('Erro de conexão. Verifique sua internet.');
    } finally {
      setSubmitting(false);
    }
  }, [form, segmento]);

  const inputClass =
    'w-full px-4 py-4 rounded-xl border border-[#1C1917] bg-[#0A0A0A] text-[#FAFAF9] text-sm placeholder:text-[#3F3F46] focus:outline-none focus:border-[#C8A96E]/50 focus:ring-1 focus:ring-[#C8A96E]/20 transition-all duration-200';

  const WHATSAPP_URL =
    'https://wa.me/5534993195252?text=Ol%C3%A1%20Jo%C3%A3o%2C%20acabei%20de%20me%20cadastrar%20na%20ANUGA%20e%20quero%20entender%20melhor%20os%20caf%C3%A9s.';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="anuga-page min-h-screen bg-[#0A0A0A] text-[#FAFAF9] relative flex flex-col"
    >
      {/* Grain */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ─── HEADER ─── */}
      <header className="relative z-10 px-6 pt-6 pb-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Image
            src="/logo-canastra.png"
            alt="Café Canastra"
            width={36}
            height={36}
            className="rounded-full brightness-0 invert"
          />
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#78716C]">
            ANUGA 2026
          </span>
        </div>
      </header>

      {/* ─── PROGRESS BAR ─── */}
      <div className="relative z-10 px-6 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-1 flex-1 rounded-full overflow-hidden bg-[#1C1917]"
              >
                <motion.div
                  className="h-full bg-[#C8A96E] rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: step >= s ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <main className="relative z-10 flex-1 flex flex-col px-6 pb-8">
        <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
          <AnimatePresence mode="wait">

            {/* ═══ STEP 1: SEGMENT ═══ */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col"
              >
                <div className="mb-8">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight mb-3">
                    Qual o perfil do
                    <br />
                    <span className="text-[#C8A96E]">seu negócio?</span>
                  </h1>
                  <p className="text-sm text-[#78716C] font-light">
                    Selecione para personalizar sua experiência.
                  </p>
                </div>

                <div className="space-y-3 flex-1">
                  {segments.map((seg, i) => (
                    <motion.button
                      key={seg.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      onClick={() => handleSegmentSelect(seg.id)}
                      className={cn(
                        'w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-200',
                        segmento === seg.id
                          ? 'border-[#C8A96E]/60 bg-[#C8A96E]/10'
                          : 'border-[#1C1917] bg-[#0F0F0F] hover:border-[#C8A96E]/30 hover:bg-[#C8A96E]/[0.03] active:scale-[0.98]'
                      )}
                    >
                      <span className="text-xl w-8 text-center shrink-0">{seg.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-[#FAFAF9] block">{seg.label}</span>
                        <span className="text-xs text-[#57534E]">{seg.labelEn}</span>
                      </div>
                      <svg className="w-4 h-4 text-[#3F3F46] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 2: CONTACT ═══ */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col"
              >
                <div className="mb-8">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-[#57534E] hover:text-[#C8A96E] transition-colors mb-4 inline-flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar
                  </button>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight mb-3">
                    Quase lá.
                    <br />
                    <span className="text-[#C8A96E]">Seus dados.</span>
                  </h1>
                  <p className="text-sm text-[#78716C] font-light">
                    {isExport
                      ? 'Fill in your details to unlock your exclusive benefit.'
                      : 'Preencha para liberar seu benefício exclusivo ANUGA.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    {/* Nome */}
                    <div>
                      <label className="block text-xs font-medium text-[#A8A29E] mb-1.5 tracking-wide uppercase">
                        {isExport ? 'Nome / Name' : 'Nome'}
                      </label>
                      <input
                        type="text"
                        value={form.nome}
                        onChange={(e) => handleChange('nome', e.target.value)}
                        placeholder={isExport ? 'Your name' : 'Seu nome completo'}
                        className={cn(inputClass, errors.nome && 'border-red-500/40')}
                        autoFocus
                      />
                      {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome}</p>}
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs font-medium text-[#A8A29E] mb-1.5 tracking-wide uppercase">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={form.whatsapp}
                        onChange={(e) => handleChange('whatsapp', e.target.value)}
                        placeholder="(DD) 99999-9999"
                        className={cn(inputClass, errors.whatsapp && 'border-red-500/40')}
                      />
                      {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-[#A8A29E] mb-1.5 tracking-wide uppercase">
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder={isExport ? 'your@email.com' : 'seu@email.com'}
                        className={cn(inputClass, errors.email && 'border-red-500/40')}
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {isExport && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-[#C8A96E]/5 border border-[#C8A96E]/20 rounded-xl p-4 text-sm text-[#C8A96E]"
                      >
                        <p className="font-medium">
                          🌍 We work with export-ready specialty coffees. Our team will assist you.
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {submitError && (
                    <p className="text-red-400 text-sm text-center">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className={cn(
                      'w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 mt-auto',
                      submitting
                        ? 'bg-[#C8A96E]/30 text-[#C8A96E]/50 cursor-not-allowed'
                        : 'bg-[#C8A96E] text-[#0A0A0A] hover:bg-[#D4B97A] active:scale-[0.98]'
                    )}
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2 justify-center">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      isExport ? 'Unlock my benefit' : 'Liberar meu benefício'
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ═══ STEP 3: REVEAL ═══ */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                {/* Check icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 rounded-full border-2 border-[#C8A96E]/40 flex items-center justify-center mb-8"
                >
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="w-7 h-7 text-[#C8A96E]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                </motion.div>

                {/* Benefit reveal */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <p className="text-xs tracking-[0.2em] uppercase text-[#C8A96E] mb-4">
                    {isExport ? 'Your exclusive benefit' : 'Seu benefício exclusivo'}
                  </p>

                  <div className="mb-2">
                    <span className="anuga-display text-6xl md:text-7xl font-extrabold text-[#FAFAF9] tracking-tighter">
                      R$<AnimatedCounter target={200} duration={1.0} />
                    </span>
                  </div>
                  <p className="text-base font-semibold text-[#FAFAF9] mb-1">
                    {isExport ? 'discount on your first order' : 'de desconto na primeira compra'}
                  </p>
                  <p className="text-xs text-[#57534E] mb-10">
                    {isExport ? 'On orders over R$1,000' : 'Em pedidos acima de R$1.000'}
                  </p>
                </motion.div>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="w-10 h-[1px] bg-[#C8A96E]/30 mb-10"
                />

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="w-full max-w-xs"
                >
                  <p className="text-sm text-[#A8A29E] mb-5">
                    {isExport
                      ? 'Our team will contact you soon. Want to talk now?'
                      : 'Nossa equipe entrará em contato. Quer falar agora?'}
                  </p>

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1EBF5A] text-white font-bold py-4 px-6 rounded-xl text-sm tracking-wide transition-all duration-300 active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {isExport ? 'Talk to our team' : 'Falar com consultor'}
                  </a>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 text-center py-4 border-t border-[#1C1917]">
        <p className="text-[10px] text-[#3F3F46] tracking-wide">
          &copy; {new Date().getFullYear()} Caf&eacute; Canastra &mdash; Serra da Canastra, MG
        </p>
      </footer>
    </motion.div>
  );
}
