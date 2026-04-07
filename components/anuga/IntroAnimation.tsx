'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Primeira frase dividida em palavras — palavras highlighted recebem destaque dourado
const FIRST_WORDS = ['Esse', 'café', 'aumenta', 'a', 'margem', 'do', 'seu', 'negócio.'];
const HIGHLIGHTED = new Set(['aumenta', 'a', 'margem']);

const SCREENS = [
  { key: 'ganhou' },
  { key: 'first' },
  { key: 'second', text: 'Direto do produtor rural, na Serra da Canastra.',          style: 'text-2xl md:text-4xl text-[#8B5A2B] font-black tracking-tight leading-snug' },
  { key: 'third',  text: 'Mais qualidade. Mais consistência. Mais lucro por xícara.', style: 'text-xl md:text-3xl text-[#4A3F33] font-bold leading-snug' },
];

// ms por screen — tudo rápido para o evento
const DURATIONS = [1600, 2000, 1700, 1700];

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [screen, setScreen] = useState(0);
  const done = useRef(false);

  // Avança para o próximo screen
  useEffect(() => {
    if (screen >= SCREENS.length) return;
    const timer = setTimeout(() => setScreen((s) => s + 1), DURATIONS[screen]);
    return () => clearTimeout(timer);
  }, [screen]);

  // Chama onComplete após o último screen
  useEffect(() => {
    if (screen < SCREENS.length || done.current) return;
    done.current = true;
    const timer = setTimeout(onComplete, 600);
    return () => clearTimeout(timer);
  }, [screen, onComplete]);

  return (
    <motion.div
      className="anuga-page fixed inset-0 z-50 flex flex-col items-center justify-center px-8 overflow-hidden"
      style={{ background: '#FAF6EE' }}
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
        transition={{ duration: 1.4, ease: EASE }}
        className="absolute top-0 left-0 right-0 h-[2px] origin-left"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #8B5A2B 40%, #8B5A2B 60%, transparent 100%)' }}
      />

      {/* Ambient glow */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{ opacity: screen >= SCREENS.length ? 0 : [0.18, 0.28, 0.18] }}
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

      {/* Text — one screen at a time */}
      <div className="max-w-md md:max-w-xl w-full text-center relative z-10 min-h-[120px] flex items-center justify-center">
        <AnimatePresence mode="wait">

          {/* Screen 0 — Você Ganhou R$200,00 */}
          {screen === 0 && (
            <motion.div
              key="ganhou"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.06, filter: 'blur(5px)' }}
              transition={{ duration: 0.35, ease: EASE }}
              className="text-center"
            >
              <motion.p
                className="text-lg md:text-xl font-bold tracking-[0.18em] uppercase text-[#4A3F33]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                Você Ganhou
              </motion.p>
              <motion.p
                className="text-6xl md:text-8xl font-black tracking-tight text-[#8B5A2B] leading-none mt-1"
                initial={{ opacity: 0, scale: 0.82, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.14, duration: 0.38, ease: EASE }}
              >
                R$200,00
              </motion.p>
            </motion.div>
          )}

          {/* Screen 1 — primeira frase com destaque palavra a palavra */}
          {screen === 1 && (
            <motion.div
              key="first"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
              transition={{ duration: 0.35, ease: EASE }}
              className="text-center"
            >
              <p className="text-3xl md:text-5xl font-black text-[#1A1410] tracking-tight leading-snug">
                {FIRST_WORDS.map((word, i) => (
                  <motion.span
                    key={word + i}
                    className="inline-block mr-[0.22em] relative"
                    initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: i * 0.09, duration: 0.42, ease: EASE }}
                  >
                    {/* Highlight dourado para palavras-chave */}
                    {HIGHLIGHTED.has(word) && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute rounded-sm -z-10"
                        style={{
                          inset: '-2px -4px',
                          background: 'linear-gradient(105deg, rgba(200,169,110,0.30) 0%, rgba(232,201,122,0.45) 55%, rgba(200,169,110,0.28) 100%)',
                          transformOrigin: 'left center',
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.7 + i * 0.09, duration: 0.48, ease: EASE }}
                      />
                    )}
                    {word}
                  </motion.span>
                ))}
              </p>

              {/* Underline dourado que se desenha */}
              <motion.div
                className="mx-auto mt-3 h-[2.5px] rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #8B5A2B 0%, #C8A96E 50%, #8B5A2B 100%)',
                  maxWidth: '360px',
                  transformOrigin: 'left center',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.1, duration: 0.7, ease: EASE }}
              />
            </motion.div>
          )}

          {/* Screens 2 e 3 — frases seguintes */}
          {screen > 1 && screen < SCREENS.length && (
            <motion.p
              key={SCREENS[screen].key}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: EASE }}
              className={SCREENS[screen].style}
            >
              {SCREENS[screen].text}
            </motion.p>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: screen >= SCREENS.length ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.3, ease: EASE }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-[#8B5A2B]"
      />
    </motion.div>
  );
}
