'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/* ─── Types ─── */
type Segmento = 'cafeteria' | 'revenda' | 'rede' | 'foodservice' | 'exportacao' | 'cliente_final';
type Step = 1 | 2 | 3 | 'consumer';

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
  { id: 'exportacao', label: 'Exportação / Import / Importación', labelEn: 'Export · Import · Importación', icon: '🌍' },
  { id: 'cliente_final', label: 'Cliente Final / Consumo', labelEn: 'End Consumer', icon: '🏠' },
];

/* ─── Country codes ─── */
interface Country {
  code: string;   // ISO
  dial: string;   // dial code without +
  flag: string;
  name: string;
}

const COUNTRIES: Country[] = [
  { code: 'BR', dial: '55',  flag: '🇧🇷', name: 'Brasil' },
  { code: 'DE', dial: '49',  flag: '🇩🇪', name: 'Deutschland' },
  { code: 'US', dial: '1',   flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dial: '44',  flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'ES', dial: '34',  flag: '🇪🇸', name: 'España' },
  { code: 'PT', dial: '351', flag: '🇵🇹', name: 'Portugal' },
  { code: 'FR', dial: '33',  flag: '🇫🇷', name: 'France' },
  { code: 'IT', dial: '39',  flag: '🇮🇹', name: 'Italia' },
  { code: 'NL', dial: '31',  flag: '🇳🇱', name: 'Nederland' },
  { code: 'BE', dial: '32',  flag: '🇧🇪', name: 'België' },
  { code: 'CH', dial: '41',  flag: '🇨🇭', name: 'Schweiz' },
  { code: 'AT', dial: '43',  flag: '🇦🇹', name: 'Österreich' },
  { code: 'SE', dial: '46',  flag: '🇸🇪', name: 'Sverige' },
  { code: 'NO', dial: '47',  flag: '🇳🇴', name: 'Norge' },
  { code: 'DK', dial: '45',  flag: '🇩🇰', name: 'Danmark' },
  { code: 'FI', dial: '358', flag: '🇫🇮', name: 'Suomi' },
  { code: 'PL', dial: '48',  flag: '🇵🇱', name: 'Polska' },
  { code: 'CZ', dial: '420', flag: '🇨🇿', name: 'Česko' },
  { code: 'IE', dial: '353', flag: '🇮🇪', name: 'Ireland' },
  { code: 'GR', dial: '30',  flag: '🇬🇷', name: 'Ελλάδα' },
  { code: 'TR', dial: '90',  flag: '🇹🇷', name: 'Türkiye' },
  { code: 'AE', dial: '971', flag: '🇦🇪', name: 'UAE' },
  { code: 'SA', dial: '966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: 'IL', dial: '972', flag: '🇮🇱', name: 'Israel' },
  { code: 'JP', dial: '81',  flag: '🇯🇵', name: '日本' },
  { code: 'CN', dial: '86',  flag: '🇨🇳', name: '中国' },
  { code: 'KR', dial: '82',  flag: '🇰🇷', name: '한국' },
  { code: 'IN', dial: '91',  flag: '🇮🇳', name: 'India' },
  { code: 'AU', dial: '61',  flag: '🇦🇺', name: 'Australia' },
  { code: 'NZ', dial: '64',  flag: '🇳🇿', name: 'New Zealand' },
  { code: 'CA', dial: '1',   flag: '🇨🇦', name: 'Canada' },
  { code: 'MX', dial: '52',  flag: '🇲🇽', name: 'México' },
  { code: 'AR', dial: '54',  flag: '🇦🇷', name: 'Argentina' },
  { code: 'CL', dial: '56',  flag: '🇨🇱', name: 'Chile' },
  { code: 'CO', dial: '57',  flag: '🇨🇴', name: 'Colombia' },
  { code: 'PE', dial: '51',  flag: '🇵🇪', name: 'Perú' },
  { code: 'UY', dial: '598', flag: '🇺🇾', name: 'Uruguay' },
  { code: 'PY', dial: '595', flag: '🇵🇾', name: 'Paraguay' },
  { code: 'ZA', dial: '27',  flag: '🇿🇦', name: 'South Africa' },
];

/* ─── Helpers ─── */
function formatWhatsAppBR(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatWhatsAppIntl(value: string): string {
  return value.replace(/[^\d\s]/g, '').slice(0, 16);
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.nome || data.nome.trim().length < 2) errors.nome = 'Required · Obrigatório · Requerido';
  const digits = data.whatsapp.replace(/\D/g, '');
  if (!digits || digits.length < 8) errors.whatsapp = 'Invalid number · Inválido';
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email · Inválido';
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
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [form, setForm] = useState<FormData>({ nome: '', whatsapp: '', email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [copied, setCopied] = useState(false);

  const isExport = segmento === 'exportacao';

  const handleSegmentSelect = useCallback((id: Segmento) => {
    setSegmento(id);
    // Default country: BR for non-export, US for export (user can change)
    setCountry(id === 'exportacao' ? COUNTRIES.find((c) => c.code === 'US')! : COUNTRIES[0]);
    setForm((prev) => ({ ...prev, whatsapp: '' }));
    setTimeout(() => setStep(2), 400);
  }, []);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText('ESPECIAL10').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, []);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === 'whatsapp'
          ? country.code === 'BR'
            ? formatWhatsAppBR(value)
            : formatWhatsAppIntl(value)
          : value,
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError('');
  }, [country]);

  const handleCountryChange = useCallback((code: string) => {
    const next = COUNTRIES.find((c) => c.code === code);
    if (next) {
      setCountry(next);
      setForm((prev) => ({ ...prev, whatsapp: '' }));
      setErrors((prev) => ({ ...prev, whatsapp: undefined }));
    }
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
      whatsapp: country.dial + form.whatsapp.replace(/\D/g, ''),
      country_code: country.code,
      country_dial: country.dial,
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
        setStep(segmento === 'cliente_final' ? 'consumer' : 3);
      } else {
        setSubmitError('Error sending · Erro ao enviar · Error al enviar');
      }
    } catch {
      setSubmitError('Connection error · Erro de conexão · Error de conexión');
    } finally {
      setSubmitting(false);
    }
  }, [form, segmento]);

  const numericStep = step === 'consumer' ? 2 : (step as number);

  const inputClass =
    'w-full px-5 py-5 md:px-6 md:py-6 rounded-2xl border-2 border-[#E5DDD0] bg-white text-[#1A1410] text-lg md:text-xl font-semibold placeholder:text-[#A89A86] placeholder:font-normal focus:outline-none focus:border-[#8B5A2B] focus:ring-4 focus:ring-[#8B5A2B]/15 transition-all duration-200';

  const WHATSAPP_URL =
    'https://wa.me/5534993195252?text=Ol%C3%A1%20Jo%C3%A3o%2C%20acabei%20de%20me%20cadastrar%20na%20ANUGA%20e%20quero%20entender%20melhor%20os%20caf%C3%A9s.';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="anuga-page min-h-screen bg-[#FAF6EE] text-[#1A1410] relative flex flex-col"
    >
      {/* Subtle warm gradient wash */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(200,169,110,0.18) 0%, rgba(250,246,238,0) 60%)',
        }}
      />

      {/* ─── HEADER ─── */}
      <header className="relative z-10 px-6 pt-6 pb-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Image
            src="/logo-canastra.png"
            alt="Café Canastra"
            width={48}
            height={48}
            className="rounded-full md:w-14 md:h-14"
          />
          <span className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-[#8B5A2B]">
            ANUGA 2026
          </span>
        </div>
      </header>

      {/* ─── PROGRESS BAR ─── */}
      <div className="relative z-10 px-6 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-2 flex-1 rounded-full overflow-hidden bg-[#E5DDD0]"
              >
                <motion.div
                  className="h-full bg-[#8B5A2B] rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: numericStep >= s ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <main className="relative z-10 flex-1 flex flex-col px-6 pb-8">
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
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
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-4 text-[#1A1410]">
                    Qual o perfil do
                    <br />
                    <span className="text-[#8B5A2B]">seu negócio?</span>
                  </h1>
                  <p className="text-lg md:text-xl text-[#4A3F33] font-semibold">
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
                        'w-full flex items-center gap-5 px-6 py-5 md:px-7 md:py-6 rounded-2xl border-2 text-left transition-all duration-200',
                        segmento === seg.id
                          ? 'border-[#8B5A2B] bg-[#8B5A2B]/10 shadow-lg'
                          : 'border-[#E5DDD0] bg-white hover:border-[#8B5A2B] hover:shadow-md active:scale-[0.98]'
                      )}
                    >
                      <span className="text-3xl md:text-4xl w-10 md:w-12 text-center shrink-0">{seg.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-lg md:text-xl font-bold text-[#1A1410] block leading-tight">{seg.label}</span>
                        <span className="text-sm md:text-base text-[#6B5D4F] font-medium">{seg.labelEn}</span>
                      </div>
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-[#8B5A2B] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
                    className="text-base md:text-lg font-bold text-[#8B5A2B] hover:text-[#5C3A1A] transition-colors mb-5 inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    {isExport ? 'Back · Voltar · Volver' : 'Voltar'}
                  </button>

                  {isExport ? (
                    <>
                      <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-4 text-[#1A1410]">
                        Almost there.
                        <br />
                        <span className="text-[#8B5A2B]">Your details.</span>
                      </h1>
                      <p className="text-lg md:text-xl text-[#4A3F33] font-semibold leading-snug">
                        Casi listo. Tus datos. <span className="text-[#6B5D4F]">/ Quase lá. Seus dados.</span>
                      </p>
                      <p className="mt-3 text-base md:text-lg text-[#4A3F33] font-medium">
                        Fill in your details to unlock your exclusive benefit.
                        <br />
                        Completa tus datos para desbloquear tu beneficio exclusivo.
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-4 text-[#1A1410]">
                        Quase lá.
                        <br />
                        <span className="text-[#8B5A2B]">Seus dados.</span>
                      </h1>
                      <p className="text-lg md:text-xl text-[#4A3F33] font-semibold">
                        Preencha para liberar seu benefício exclusivo ANUGA.
                      </p>
                    </>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
                  <div className="space-y-5 flex-1">
                    {/* Nome */}
                    <div>
                      <label className="block text-base md:text-lg font-bold text-[#1A1410] mb-2">
                        {isExport ? 'Name · Nombre · Nome' : 'Nome'}
                      </label>
                      <input
                        type="text"
                        value={form.nome}
                        onChange={(e) => handleChange('nome', e.target.value)}
                        placeholder={isExport ? 'Your full name / Tu nombre completo' : 'Seu nome completo'}
                        className={cn(inputClass, errors.nome && 'border-red-500')}
                        autoFocus
                      />
                      {errors.nome && <p className="text-red-600 text-base font-semibold mt-2">{errors.nome}</p>}
                    </div>

                    {/* WhatsApp + Country */}
                    <div>
                      <label className="block text-base md:text-lg font-bold text-[#1A1410] mb-2">
                        {isExport ? 'WhatsApp / Phone · Teléfono' : 'WhatsApp'}
                      </label>
                      <div className="flex flex-col gap-3">
                        <div className="relative w-full">
                          <select
                            value={country.code}
                            onChange={(e) => handleCountryChange(e.target.value)}
                            aria-label="Country code"
                            className="appearance-none w-full pl-5 pr-12 py-5 md:py-6 rounded-2xl border-2 border-[#E5DDD0] bg-white text-[#1A1410] text-lg md:text-xl font-bold focus:outline-none focus:border-[#8B5A2B] focus:ring-4 focus:ring-[#8B5A2B]/15 transition-all duration-200 cursor-pointer"
                          >
                            {COUNTRIES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.flag} {c.name} (+{c.dial})
                              </option>
                            ))}
                          </select>
                          <svg
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#8B5A2B]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        <div className="relative w-full">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg md:text-xl font-bold text-[#8B5A2B] pointer-events-none select-none">
                            +{country.dial}
                          </span>
                          <input
                            type="tel"
                            inputMode="tel"
                            value={form.whatsapp}
                            onChange={(e) => handleChange('whatsapp', e.target.value)}
                            placeholder={country.code === 'BR' ? '(DD) 99999-9999' : '000 000 0000'}
                            style={{ paddingLeft: `${(country.dial.length + 1) * 12 + 28}px` }}
                            className={cn(inputClass, errors.whatsapp && 'border-red-500')}
                          />
                        </div>
                      </div>
                      {errors.whatsapp && <p className="text-red-600 text-base font-semibold mt-2">{errors.whatsapp}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-base md:text-lg font-bold text-[#1A1410] mb-2">
                        {isExport ? 'Email · Correo · E-mail' : 'E-mail'}
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder={isExport ? 'your@email.com / tu@email.com' : 'seu@email.com'}
                        className={cn(inputClass, errors.email && 'border-red-500')}
                      />
                      {errors.email && <p className="text-red-600 text-base font-semibold mt-2">{errors.email}</p>}
                    </div>

                    {isExport && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-[#8B5A2B]/10 border-2 border-[#8B5A2B]/30 rounded-2xl p-5 text-base md:text-lg text-[#1A1410] font-semibold space-y-2"
                      >
                        <p>🌍 We work with export-ready specialty coffees. Our team will assist you.</p>
                        <p className="text-[#4A3F33]">Trabajamos con cafés especiales listos para exportar. Nuestro equipo te atenderá.</p>
                      </motion.div>
                    )}
                  </div>

                  {submitError && (
                    <p className="text-red-600 text-base md:text-lg font-bold text-center">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className={cn(
                      'w-full py-5 md:py-6 rounded-2xl font-black text-lg md:text-xl tracking-wide transition-all duration-300 mt-auto shadow-lg',
                      submitting
                        ? 'bg-[#8B5A2B]/40 text-white/70 cursor-not-allowed'
                        : 'bg-[#8B5A2B] text-white hover:bg-[#5C3A1A] active:scale-[0.98]'
                    )}
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2 justify-center">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {isExport ? 'Sending · Enviando…' : 'Enviando...'}
                      </span>
                    ) : (
                      isExport ? 'Unlock my benefit · Desbloquear mi beneficio' : 'Liberar meu benefício'
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
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#8B5A2B] flex items-center justify-center mb-8 shadow-xl"
                >
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="w-10 h-10 md:w-12 md:h-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
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
                  <p className="text-base md:text-lg font-bold tracking-[0.2em] uppercase text-[#8B5A2B] mb-4">
                    {isExport ? 'Your exclusive benefit · Tu beneficio exclusivo' : 'Seu benefício exclusivo'}
                  </p>

                  <div className="mb-3">
                    <span className="anuga-display text-7xl md:text-9xl font-black text-[#1A1410] tracking-tighter">
                      R$<AnimatedCounter target={200} duration={1.0} />
                    </span>
                  </div>
                  {isExport ? (
                    <>
                      <p className="text-xl md:text-2xl font-bold text-[#1A1410] mb-1">
                        discount on your first order
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-[#1A1410] mb-3">
                        descuento en tu primer pedido
                      </p>
                      <p className="text-base md:text-lg text-[#4A3F33] font-semibold mb-10">
                        On orders over R$1,000 · En pedidos superiores a R$1.000
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl md:text-2xl font-bold text-[#1A1410] mb-3">
                        de desconto na primeira compra
                      </p>
                      <p className="text-base md:text-lg text-[#4A3F33] font-semibold mb-10">
                        Em pedidos acima de R$1.000
                      </p>
                    </>
                  )}
                </motion.div>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="w-16 h-[2px] bg-[#8B5A2B] mb-10"
                />

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="w-full max-w-md"
                >
                  {isExport ? (
                    <p className="text-lg md:text-xl text-[#1A1410] font-semibold mb-6 leading-snug">
                      Our team will contact you soon. Want to talk now?
                      <br />
                      <span className="text-[#4A3F33]">Nuestro equipo te contactará pronto. ¿Quieres hablar ahora?</span>
                    </p>
                  ) : (
                    <p className="text-lg md:text-xl text-[#1A1410] font-semibold mb-6">
                      Nossa equipe entrará em contato. Quer falar agora?
                    </p>
                  )}

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1EBF5A] text-white font-black py-5 md:py-6 px-6 rounded-2xl text-lg md:text-xl tracking-wide transition-all duration-300 active:scale-[0.98] shadow-xl"
                  >
                    <svg className="w-6 h-6 md:w-7 md:h-7 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {isExport ? 'Talk to our team · Hablar con el equipo' : 'Falar com consultor'}
                  </a>
                </motion.div>
              </motion.div>
            )}

            {/* ═══ CONSUMER: DISCOUNT REVEAL ═══ */}
            {step === 'consumer' && (
              <motion.div
                key="consumer"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col"
              >
                {/* Back */}
                <button
                  onClick={() => setStep(1)}
                  className="text-base md:text-lg font-bold text-[#8B5A2B] hover:text-[#5C3A1A] transition-colors mb-8 inline-flex items-center gap-2 self-start"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Voltar
                </button>

                {/* Coffee icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.05 }}
                  className="text-5xl md:text-6xl mb-6 text-center"
                >
                  ☕
                </motion.div>

                {/* Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="text-center mb-8"
                >
                  <p className="text-sm md:text-base font-bold tracking-[0.25em] uppercase text-[#8B5A2B] mb-3">
                    Presente especial para você
                  </p>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] text-[#1A1410] mb-3">
                    Você ganhou um<br />
                    <span className="text-[#8B5A2B]">desconto exclusivo!</span>
                  </h1>
                  <p className="text-base md:text-lg text-[#4A3F33] font-semibold">
                    Use o cupom abaixo na sua primeira compra na nossa loja online.
                  </p>
                </motion.div>

                {/* Coupon card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto w-full max-w-sm mb-6"
                >
                  <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Top accent stripe */}
                    <div className="h-2 bg-[#8B5A2B]" />

                    {/* Coupon body */}
                    <div className="px-6 py-7 text-center border-x-2 border-b-2 border-[#E5DDD0] rounded-b-2xl">
                      <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#8B5A2B] mb-4">
                        Cupom de desconto · Café Canastra
                      </p>

                      {/* Dashed separator */}
                      <div className="border-t-2 border-dashed border-[#E5DDD0] mb-4" />

                      {/* Code */}
                      <p className="text-[2.8rem] md:text-6xl font-black tracking-[0.12em] text-[#1A1410] leading-none mb-2 font-mono select-all">
                        ESPECIAL10
                      </p>

                      {/* Dashed separator */}
                      <div className="border-t-2 border-dashed border-[#E5DDD0] mt-4 mb-4" />

                      <p className="text-sm md:text-base text-[#4A3F33] font-semibold">
                        10% de desconto em toda a loja
                      </p>
                      <p className="text-xs text-[#A89A86] font-medium mt-1">
                        loja.cafecanastra.com
                      </p>
                    </div>

                    {/* Side notches */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#FAF6EE] rounded-r-full border-r-2 border-[#E5DDD0]" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#FAF6EE] rounded-l-full border-l-2 border-[#E5DDD0]" />
                  </div>
                </motion.div>

                {/* Copy button */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="mb-4"
                >
                  <button
                    onClick={handleCopyCode}
                    className={`w-full py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg tracking-wide transition-all duration-300 border-2 flex items-center justify-center gap-3 ${
                      copied
                        ? 'bg-green-50 border-green-400 text-green-700'
                        : 'bg-white border-[#8B5A2B] text-[#8B5A2B] hover:bg-[#8B5A2B]/8 active:scale-[0.98]'
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Cupom copiado!
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar código do cupom
                      </>
                    )}
                  </button>
                </motion.div>

                {/* CTA to store */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <a
                    href="https://loja.cafecanastra.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full inline-flex items-center justify-center gap-3 bg-[#8B5A2B] hover:bg-[#5C3A1A] text-white font-black py-5 md:py-6 px-6 rounded-2xl text-lg md:text-xl tracking-wide transition-all duration-300 active:scale-[0.98] shadow-lg"
                  >
                    Ir para a loja
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  <p className="text-center text-xs text-[#A89A86] font-medium mt-3">
                    loja.cafecanastra.com
                  </p>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 text-center py-5 border-t-2 border-[#E5DDD0]">
        <p className="text-sm md:text-base text-[#6B5D4F] font-semibold tracking-wide">
          &copy; {new Date().getFullYear()} Caf&eacute; Canastra &mdash; Serra da Canastra, MG
        </p>
      </footer>
    </motion.div>
  );
}
