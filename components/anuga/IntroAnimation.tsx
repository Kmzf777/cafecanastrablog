'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

const lines = [
  'Esse café aumenta a margem do seu negócio.',
  'Direto do produtor rural, na Serra da Canastra.',
  'Mais qualidade. Mais consistência. Mais lucro por xícara.',
];

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) {
      const timer = setTimeout(onComplete, 400);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCurrentLine((prev) => prev + 1);
    }, 2800);

    return () => clearTimeout(timer);
  }, [currentLine, onComplete]);

  return (
    <motion.div
      className="anuga-page fixed inset-0 z-50 flex flex-col items-center justify-center px-8"
      style={{ background: '#0C0A09' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative gold line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent, #C8A96E, transparent)' }}
      />

      <div className="max-w-md md:max-w-xl w-full text-center relative z-10 min-h-[120px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentLine < lines.length && (
            <motion.p
              key={currentLine}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{
                enter: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                exit: { duration: 0.4 },
              }}
              className={
                currentLine === 0
                  ? 'text-2xl md:text-4xl font-semibold text-[#FAFAF9] tracking-tight leading-snug'
                  : currentLine === 1
                    ? 'text-lg md:text-2xl text-[#C8A96E] font-light tracking-wide leading-relaxed'
                    : 'text-base md:text-xl text-[#A8A29E] font-light leading-relaxed'
              }
            >
              {lines[currentLine]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-20 flex gap-2">
        {lines.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
              i === currentLine
                ? 'bg-[#C8A96E] scale-100'
                : i < currentLine
                  ? 'bg-[#C8A96E]/30'
                  : 'bg-[#292524]'
            }`}
          />
        ))}
      </div>

      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 text-[#78716C] hover:text-[#C8A96E] text-xs tracking-[0.25em] uppercase transition-colors duration-300"
      >
        Pular
      </button>
    </motion.div>
  );
}
