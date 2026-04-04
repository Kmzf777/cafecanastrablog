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
