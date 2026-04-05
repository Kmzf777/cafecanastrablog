'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
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
  exportacao: { pt: 'Exportação', en: 'Export' },
  submit: { pt: 'Quero receber meu benefício', en: 'I want my benefit' },
  aviso: {
    pt: 'Seu cupom será enviado por WhatsApp e e-mail.',
    en: 'Your coupon will be sent via WhatsApp and email.',
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
    'w-full px-4 py-3.5 rounded-xl border border-[#292524] bg-[#0C0A09] text-[#FAFAF9] text-sm placeholder:text-[#57534E] focus:outline-none focus:border-[#C8A96E]/50 focus:ring-1 focus:ring-[#C8A96E]/20 transition-all duration-200';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-[#A8A29E] mb-2">
          {label('nome', isExport)}
        </label>
        <input
          type="text"
          value={form.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
          placeholder={isExport ? 'Your name' : 'Seu nome'}
          className={cn(inputClass, errors.nome && 'border-red-500/50')}
        />
        {errors.nome && (
          <p className="text-red-400 text-xs mt-1.5">{errors.nome}</p>
        )}
      </div>

      {/* WhatsApp */}
      <div>
        <label className="block text-sm font-medium text-[#A8A29E] mb-2">
          {label('whatsapp', isExport)}
        </label>
        <input
          type="tel"
          value={form.whatsapp}
          onChange={(e) => handleChange('whatsapp', e.target.value)}
          placeholder="(DD) 99999-9999"
          className={cn(inputClass, errors.whatsapp && 'border-red-500/50')}
        />
        {errors.whatsapp && (
          <p className="text-red-400 text-xs mt-1.5">{errors.whatsapp}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#A8A29E] mb-2">
          {label('email', isExport)}
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder={isExport ? 'your@email.com' : 'seu@email.com'}
          className={cn(inputClass, errors.email && 'border-red-500/50')}
        />
        {errors.email && (
          <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
        )}
      </div>

      {/* Segmento */}
      <div>
        <label className="block text-sm font-medium text-[#A8A29E] mb-2">
          {label('segmento', isExport)}
        </label>
        <select
          value={form.segmento}
          onChange={(e) => handleChange('segmento', e.target.value as Segmento)}
          className={cn(
            inputClass,
            'appearance-none bg-[length:16px] bg-[position:right_16px_center] bg-no-repeat',
            !form.segmento && 'text-[#57534E]',
            errors.segmento && 'border-red-500/50'
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          }}
        >
          <option value="">{isExport ? 'Select...' : 'Selecione...'}</option>
          <option value="cafeteria">{label('cafeteria', isExport)}</option>
          <option value="revenda">{label('revenda', isExport)}</option>
          <option value="consumo_proprio">{label('consumo_proprio', isExport)}</option>
          <option value="exportacao">{label('exportacao', isExport)}</option>
        </select>
        {errors.segmento && (
          <p className="text-red-400 text-xs mt-1.5">{errors.segmento}</p>
        )}
      </div>

      {/* Export message */}
      {isExport && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-[#C8A96E]/5 border border-[#C8A96E]/20 rounded-xl p-4 text-sm text-[#C8A96E]"
        >
          <p className="font-medium">
            We work with export-ready specialty coffees. Our team can assist you internationally.
          </p>
        </motion.div>
      )}

      {/* Submit error */}
      {submitError && (
        <p className="text-red-400 text-sm text-center">{submitError}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className={cn(
          'w-full py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300',
          submitting
            ? 'bg-[#C8A96E]/30 text-[#C8A96E]/50 cursor-not-allowed'
            : 'bg-[#C8A96E] text-[#0C0A09] hover:bg-[#D4B97A] active:scale-[0.98]'
        )}
      >
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Enviando...
          </span>
        ) : (
          label('submit', isExport)
        )}
      </button>

      {/* Helper text */}
      <p className="text-xs text-[#57534E] text-center">
        {label('aviso', isExport)}
      </p>
    </form>
  );
}
