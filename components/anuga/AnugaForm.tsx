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
