# ANUGA Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone landing page at `/anuga` for Café Canastra's ANUGA 2026 event — QR code → animated intro → lead capture form → webhook → success screen with WhatsApp CTA.

**Architecture:** Single client component orchestrating 3 screens (intro animation, main form, success) with state transitions. Self-contained in `components/anuga/`, exclusive design not shared with the main site. Form submits to two n8n webhooks in parallel.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS, framer-motion (TextEffect component), shadcn/ui utilities (`cn()`).

---

## File Structure

```
app/anuga/
  page.tsx              — Server component: metadata + renders AnugaClient
  layout.tsx            — Hides global footer via CSS override

components/anuga/
  AnugaClient.tsx       — Client component: state machine for 3 screens
  IntroAnimation.tsx    — Tela 1: fullscreen text animation with skip
  MainContent.tsx       — Tela 2: hero + value props + form wrapper
  AnugaForm.tsx         — Form with validation, masks, bilingual export mode
  SuccessScreen.tsx     — Tela 3: confirmation + WhatsApp CTA

components/ui/
  text-effect.tsx       — TextEffect animation component (new file)
```

---

### Task 1: TextEffect UI Component

**Files:**
- Create: `components/ui/text-effect.tsx`

- [ ] **Step 1: Create the TextEffect component**

```tsx
// components/ui/text-effect.tsx
'use client';

import { cn } from '@/lib/utils';
import {
  AnimatePresence,
  motion,
  TargetAndTransition,
  Variants,
} from 'framer-motion';
import React from 'react';

type PresetType = 'blur' | 'shake' | 'scale' | 'fade' | 'slide';

type TextEffectProps = {
  children: string;
  per?: 'word' | 'char' | 'line';
  as?: keyof React.JSX.IntrinsicElements;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  preset?: PresetType;
  delay?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
  segmentWrapperClassName?: string;
};

const defaultStaggerTimes: Record<'char' | 'word' | 'line', number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
  exit: { opacity: 0 },
};

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(12px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(12px)' },
    },
  },
  shake: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: 0 },
      visible: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } },
      exit: { x: 0 },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
};

const AnimationComponent: React.FC<{
  segment: string;
  variants: Variants;
  per: 'line' | 'word' | 'char';
  segmentWrapperClassName?: string;
}> = React.memo(({ segment, variants, per, segmentWrapperClassName }) => {
  const content =
    per === 'line' ? (
      <motion.span variants={variants} className='block'>
        {segment}
      </motion.span>
    ) : per === 'word' ? (
      <motion.span
        aria-hidden='true'
        variants={variants}
        className='inline-block whitespace-pre'
      >
        {segment}
      </motion.span>
    ) : (
      <motion.span className='inline-block whitespace-pre'>
        {segment.split('').map((char, charIndex) => (
          <motion.span
            key={`char-${charIndex}`}
            aria-hidden='true'
            variants={variants}
            className='inline-block whitespace-pre'
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );

  if (!segmentWrapperClassName) {
    return content;
  }

  const defaultWrapperClassName = per === 'line' ? 'block' : 'inline-block';

  return (
    <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>
      {content}
    </span>
  );
});

AnimationComponent.displayName = 'AnimationComponent';

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  variants,
  className,
  preset,
  delay = 0,
  trigger = true,
  onAnimationComplete,
  segmentWrapperClassName,
}: TextEffectProps) {
  let segments: string[];

  if (per === 'line') {
    segments = children.split('\n');
  } else if (per === 'word') {
    segments = children.split(/(\s+)/);
  } else {
    segments = children.split('');
  }

  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  const selectedVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };
  const containerVariants = variants?.container || selectedVariants.container;
  const itemVariants = variants?.item || selectedVariants.item;
  const ariaLabel = per === 'line' ? undefined : children;

  const stagger = defaultStaggerTimes[per];

  const delayedContainerVariants: Variants = {
    hidden: containerVariants.hidden,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...(containerVariants.visible as TargetAndTransition)?.transition,
        staggerChildren:
          (containerVariants.visible as TargetAndTransition)?.transition
            ?.staggerChildren || stagger,
        delayChildren: delay,
      },
    },
    exit: containerVariants.exit,
  };

  return (
    <AnimatePresence mode='popLayout'>
      {trigger && (
        <MotionTag
          initial='hidden'
          animate='visible'
          exit='exit'
          aria-label={ariaLabel}
          variants={delayedContainerVariants}
          className={cn('whitespace-pre-wrap', className)}
          onAnimationComplete={onAnimationComplete}
        >
          {segments.map((segment, index) => (
            <AnimationComponent
              key={`${per}-${index}-${segment}`}
              segment={segment}
              variants={itemVariants}
              per={per}
              segmentWrapperClassName={segmentWrapperClassName}
            />
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify the component compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to text-effect.tsx

- [ ] **Step 3: Commit**

```bash
git add components/ui/text-effect.tsx
git commit -m "feat: add TextEffect animation component for ANUGA landing"
```

---

### Task 2: Anuga Layout (Hide Global Footer)

**Files:**
- Create: `app/anuga/layout.tsx`

- [ ] **Step 1: Create the anuga layout that hides the global footer**

The root layout renders a `<footer>` directly. The cleanest way to hide it for this route without modifying the root layout is a CSS override in a nested layout.

```tsx
// app/anuga/layout.tsx
import type React from "react"

export default function AnugaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style>{`
        body > div > footer,
        body footer.bg-\\[\\#181c23\\] {
          display: none !important;
        }
      `}</style>
      {children}
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/anuga/layout.tsx
git commit -m "feat: add anuga layout that hides global footer"
```

---

### Task 3: IntroAnimation Component (Tela 1)

**Files:**
- Create: `components/anuga/IntroAnimation.tsx`

- [ ] **Step 1: Create the IntroAnimation component**

```tsx
// components/anuga/IntroAnimation.tsx
'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TextEffect } from '@/components/ui/text-effect';

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);

  const handleLine1Complete = useCallback(() => setShowLine2(true), []);
  const handleLine2Complete = useCallback(() => setShowLine3(true), []);
  const handleLine3Complete = useCallback(() => {
    setTimeout(onComplete, 600);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{
        background: 'linear-gradient(135deg, #2C1810 0%, #4A2C1A 50%, #8B6914 100%)',
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-lg text-center space-y-6">
        <TextEffect
          per="char"
          preset="blur"
          as="h1"
          className="text-2xl md:text-3xl font-bold text-[#F5E6D0] font-serif"
          onAnimationComplete={handleLine1Complete}
        >
          Esse café aumenta a margem do seu negócio.
        </TextEffect>

        {showLine2 && (
          <TextEffect
            per="char"
            preset="blur"
            as="p"
            className="text-lg md:text-xl text-[#F5E6D0]/80 italic font-serif"
            onAnimationComplete={handleLine2Complete}
          >
            Direto do produtor rural, na Serra da Canastra.
          </TextEffect>
        )}

        {showLine3 && (
          <TextEffect
            per="char"
            preset="blur"
            as="p"
            className="text-base md:text-lg text-[#F5E6D0]/60 font-serif"
            onAnimationComplete={handleLine3Complete}
          >
            Mais qualidade. Mais consistência. Mais lucro por xícara.
          </TextEffect>
        )}
      </div>

      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 text-[#F5E6D0]/40 hover:text-[#F5E6D0]/70 text-sm tracking-widest transition-colors"
      >
        PULAR →
      </button>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/anuga/IntroAnimation.tsx
git commit -m "feat: add IntroAnimation component for ANUGA landing"
```

---

### Task 4: AnugaForm Component

**Files:**
- Create: `components/anuga/AnugaForm.tsx`

- [ ] **Step 1: Create the AnugaForm component with validation and webhook submission**

```tsx
// components/anuga/AnugaForm.tsx
'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface AnugaFormProps {
  onSuccess: () => void;
}

type Segmento = '' | 'cafeteria' | 'revenda' | 'consumo_proprio' | 'exportacao';

interface FormData {
  nome: string;
  whatsapp: string;
  email: string;
  segmento: Segmento;
}

interface FormErrors {
  nome?: string;
  whatsapp?: string;
  email?: string;
  segmento?: string;
}

function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.nome || data.nome.trim().length < 2) {
    errors.nome = 'Nome é obrigatório';
  }
  const digits = data.whatsapp.replace(/\D/g, '');
  if (!digits || digits.length < 10 || digits.length > 11) {
    errors.whatsapp = 'WhatsApp inválido';
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'E-mail inválido';
  }
  if (!data.segmento) {
    errors.segmento = 'Selecione uma opção';
  }
  return errors;
}

const LABELS: Record<string, { pt: string; en: string }> = {
  nome: { pt: 'Nome', en: 'Name' },
  whatsapp: { pt: 'WhatsApp', en: 'WhatsApp' },
  email: { pt: 'E-mail', en: 'Email' },
  segmento: { pt: 'Você compra café para...', en: 'You buy coffee for...' },
  cafeteria: { pt: 'Cafeteria', en: 'Coffee Shop' },
  revenda: { pt: 'Revenda', en: 'Resale' },
  consumo_proprio: { pt: 'Consumo próprio', en: 'Personal Use' },
  exportacao: { pt: 'Exportação 🌍', en: 'Export 🌍' },
  submit: { pt: 'Quero receber meu benefício', en: 'I want my benefit' },
  aviso: {
    pt: 'Seu cupom será enviado por WhatsApp e e-mail. Verifique se os dados estão corretos.',
    en: 'Your coupon will be sent via WhatsApp and email. Please verify your info.',
  },
};

function label(key: string, bilingual: boolean): string {
  const l = LABELS[key];
  if (!l) return key;
  return bilingual ? `${l.pt} / ${l.en}` : l.pt;
}

export default function AnugaForm({ onSuccess }: AnugaFormProps) {
  const [form, setForm] = useState<FormData>({
    nome: '',
    whatsapp: '',
    email: '',
    segmento: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const isExport = form.segmento === 'exportacao';

  const handleChange = useCallback(
    (field: keyof FormData, value: string) => {
      setForm((prev) => ({
        ...prev,
        [field]: field === 'whatsapp' ? formatWhatsApp(value) : value,
      }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setSubmitError('');
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
        segmento: form.segmento,
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
          onSuccess();
        } else {
          setSubmitError('Erro ao enviar. Tente novamente.');
        }
      } catch {
        setSubmitError('Erro de conexão. Verifique sua internet.');
      } finally {
        setSubmitting(false);
      }
    },
    [form, onSuccess]
  );

  const inputClass =
    'w-full px-4 py-3 rounded-lg border bg-white text-[#2C1810] text-sm placeholder:text-[#2C1810]/40 focus:outline-none focus:ring-2 focus:ring-[#8B6914]/50 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-[#4A2C1A] mb-1">
          {label('nome', isExport)}
        </label>
        <input
          type="text"
          value={form.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
          placeholder={isExport ? 'Your name' : 'Seu nome'}
          className={cn(inputClass, errors.nome && 'border-red-400')}
        />
        {errors.nome && (
          <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
        )}
      </div>

      {/* WhatsApp */}
      <div>
        <label className="block text-sm font-medium text-[#4A2C1A] mb-1">
          {label('whatsapp', isExport)}
        </label>
        <input
          type="tel"
          value={form.whatsapp}
          onChange={(e) => handleChange('whatsapp', e.target.value)}
          placeholder="(DD) 99999-9999"
          className={cn(inputClass, errors.whatsapp && 'border-red-400')}
        />
        {errors.whatsapp && (
          <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#4A2C1A] mb-1">
          {label('email', isExport)}
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder={isExport ? 'your@email.com' : 'seu@email.com'}
          className={cn(inputClass, errors.email && 'border-red-400')}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Segmento */}
      <div>
        <label className="block text-sm font-medium text-[#4A2C1A] mb-1">
          {label('segmento', isExport)}
        </label>
        <select
          value={form.segmento}
          onChange={(e) => handleChange('segmento', e.target.value as Segmento)}
          className={cn(
            inputClass,
            !form.segmento && 'text-[#2C1810]/40',
            errors.segmento && 'border-red-400'
          )}
        >
          <option value="">{isExport ? 'Select...' : 'Selecione...'}</option>
          <option value="cafeteria">{label('cafeteria', isExport)}</option>
          <option value="revenda">{label('revenda', isExport)}</option>
          <option value="consumo_proprio">{label('consumo_proprio', isExport)}</option>
          <option value="exportacao">{label('exportacao', isExport)}</option>
        </select>
        {errors.segmento && (
          <p className="text-red-500 text-xs mt-1">{errors.segmento}</p>
        )}
      </div>

      {/* Export message */}
      {isExport && (
        <div className="bg-[#2C1810]/5 border border-[#8B6914]/30 rounded-lg p-4 text-sm text-[#4A2C1A]">
          <p className="font-medium">
            🌍 We work with export-ready specialty coffees. Our team can assist
            you internationally.
          </p>
        </div>
      )}

      {/* Submit error */}
      {submitError && (
        <p className="text-red-500 text-sm text-center">{submitError}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className={cn(
          'w-full py-4 rounded-lg font-bold text-white text-base transition-all',
          submitting
            ? 'bg-[#8B6914]/50 cursor-not-allowed'
            : 'bg-[#8B6914] hover:bg-[#7A5B10] active:scale-[0.98]'
        )}
      >
        {submitting
          ? 'Enviando...'
          : label('submit', isExport)}
      </button>

      {/* Helper text */}
      <p className="text-xs text-[#2C1810]/50 text-center">
        {label('aviso', isExport)}
      </p>
    </form>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/anuga/AnugaForm.tsx
git commit -m "feat: add AnugaForm with validation, masks, bilingual export mode"
```

---

### Task 5: MainContent Component (Tela 2)

**Files:**
- Create: `components/anuga/MainContent.tsx`

- [ ] **Step 1: Create the MainContent component**

```tsx
// components/anuga/MainContent.tsx
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
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/anuga/MainContent.tsx
git commit -m "feat: add MainContent component with hero, value props, and form"
```

---

### Task 6: SuccessScreen Component (Tela 3)

**Files:**
- Create: `components/anuga/SuccessScreen.tsx`

- [ ] **Step 1: Create the SuccessScreen component**

```tsx
// components/anuga/SuccessScreen.tsx
'use client';

import { motion } from 'framer-motion';

const WHATSAPP_URL =
  'https://wa.me/5534993195252?text=Ol%C3%A1%20Jo%C3%A3o%2C%20acabei%20de%20me%20cadastrar%20na%20ANUGA%20e%20quero%20entender%20melhor%20os%20caf%C3%A9s.';

export default function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'linear-gradient(135deg, #2C1810 0%, #3D2215 100%)' }}
    >
      {/* Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
        className="w-20 h-20 rounded-full border-2 border-[#8B6914] flex items-center justify-center mb-8"
      >
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-10 h-10 text-[#8B6914]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      </motion.div>

      {/* Confirmation */}
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#F5E6D0] mb-3">
        Seu cupom de 20%
        <br />
        foi liberado!
      </h1>
      <p className="text-[#F5E6D0]/60 text-sm mb-10">
        Enviamos no seu WhatsApp e e-mail.
      </p>

      {/* Divider */}
      <div className="w-16 border-t border-[#F5E6D0]/20 mb-10" />

      {/* CTA */}
      <h2 className="font-serif text-lg text-[#F5E6D0] mb-2">
        Quer ajuda para escolher
        <br />
        seu café agora?
      </h2>
      <p className="text-[#F5E6D0]/50 text-sm mb-6">
        Fale com nosso consultor e descubra o melhor café para o seu negócio
      </p>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1FB855] text-white font-bold py-4 px-8 rounded-lg text-base transition-all active:scale-[0.98]"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Quero escolher meu café
      </a>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/anuga/SuccessScreen.tsx
git commit -m "feat: add SuccessScreen with animated check and WhatsApp CTA"
```

---

### Task 7: AnugaClient Orchestrator

**Files:**
- Create: `components/anuga/AnugaClient.tsx`

- [ ] **Step 1: Create the AnugaClient orchestrator component**

```tsx
// components/anuga/AnugaClient.tsx
'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroAnimation from './IntroAnimation';
import MainContent from './MainContent';
import SuccessScreen from './SuccessScreen';

type Screen = 'intro' | 'main' | 'success';

export default function AnugaClient() {
  const [screen, setScreen] = useState<Screen>('intro');

  const handleIntroComplete = useCallback(() => setScreen('main'), []);
  const handleFormSuccess = useCallback(() => setScreen('success'), []);

  return (
    <AnimatePresence mode="wait">
      {screen === 'intro' && (
        <IntroAnimation key="intro" onComplete={handleIntroComplete} />
      )}
      {screen === 'main' && (
        <MainContent key="main" onFormSuccess={handleFormSuccess} />
      )}
      {screen === 'success' && <SuccessScreen key="success" />}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/anuga/AnugaClient.tsx
git commit -m "feat: add AnugaClient state machine orchestrating 3 screens"
```

---

### Task 8: Page Route and Metadata

**Files:**
- Create: `app/anuga/page.tsx`

- [ ] **Step 1: Create the anuga page with SEO metadata**

```tsx
// app/anuga/page.tsx
import type { Metadata } from 'next';
import AnugaClient from '@/components/anuga/AnugaClient';

export const metadata: Metadata = {
  title: 'Café Canastra | ANUGA 2026 — Oferta Exclusiva',
  description:
    'Ganhe 20% de bonificação na sua primeira compra. Café especial direto do produtor na Serra da Canastra.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Café Canastra | ANUGA 2026 — Oferta Exclusiva',
    description:
      'Ganhe 20% de bonificação. Café especial direto do produtor na Serra da Canastra.',
    type: 'website',
    images: [
      {
        url: '/banner-cafecanastra.png',
        width: 1200,
        height: 630,
        alt: 'Café Canastra — ANUGA 2026',
      },
    ],
  },
};

export default function AnugaPage() {
  return <AnugaClient />;
}
```

- [ ] **Step 2: Run dev server and verify the page loads**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds with `/anuga` in the output

- [ ] **Step 3: Commit**

```bash
git add app/anuga/page.tsx
git commit -m "feat: add /anuga route with SEO metadata"
```

---

### Task 9: Integration Test — Full Flow

- [ ] **Step 1: Start dev server and verify the full flow manually**

Run: `npm run dev`

Open `http://localhost:3000/anuga` and verify:
1. Intro animation plays with char-by-char blur text
2. "PULAR" button skips to main content
3. Global footer is hidden
4. Form validates all fields
5. Selecting "Exportação" shows bilingual labels and English message
6. WhatsApp field applies mask correctly
7. Submit sends to both webhooks (check Network tab)
8. Success screen appears with animated checkmark
9. WhatsApp button opens correct URL

- [ ] **Step 2: Final commit with all files**

```bash
git add -A
git commit -m "feat: complete ANUGA 2026 landing page with animation, form, and success flow"
```
