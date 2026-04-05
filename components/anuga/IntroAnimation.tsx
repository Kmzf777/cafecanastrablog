'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

const lines = [
  { text: 'Esse café aumenta a margem do seu negócio.', style: 'text-3xl md:text-5xl font-extrabold text-[#FAFAF9] tracking-tight leading-snug' },
  { text: 'Direto do produtor rural, na Serra da Canastra.', style: 'text-2xl md:text-4xl text-[#C8A96E] font-bold tracking-tight leading-snug' },
  { text: 'Mais qualidade. Mais consistência. Mais lucro por xícara.', style: 'text-xl md:text-3xl text-[#E7E5E4] font-bold leading-snug' },
];

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const done = useRef(false);

  // Advance lines
  useEffect(() => {
    if (currentLine >= lines.length) return;

    const timer = setTimeout(() => {
      setCurrentLine((prev) => prev + 1);
    }, 2200);

    return () => clearTimeout(timer);
  }, [currentLine]);

  // Finish when all lines shown
  useEffect(() => {
    if (currentLine < lines.length || done.current) return;
    done.current = true;

    const timer = setTimeout(onComplete, 600);
    return () => clearTimeout(timer);
  }, [currentLine, onComplete]);

  return (
    <motion.div
      className="anuga-page fixed inset-0 z-50 flex flex-col items-center justify-center px-8 overflow-hidden"
      style={{ background: '#0A0A0A' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top gold line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 h-[1px] origin-left"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #C8A96E 40%, #C8A96E 60%, transparent 100%)' }}
      />

      {/* Ambient glow */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{ opacity: currentLine >= lines.length ? 0 : [0.03, 0.06, 0.03] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #C8A96E 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Text — one phrase at a time */}
      <div className="max-w-md md:max-w-xl w-full text-center relative z-10 min-h-[100px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentLine < lines.length && (
            <motion.p
              key={currentLine}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={lines[currentLine].style}
            >
              {lines[currentLine].text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: currentLine >= lines.length ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-[#C8A96E]/30"
      />
    </motion.div>
  );
}
