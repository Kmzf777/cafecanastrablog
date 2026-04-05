'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroAnimation from './IntroAnimation';
import AnugaQuiz from './AnugaQuiz';

type Screen = 'intro' | 'quiz';

const PRELOAD_IMAGES = [
  '/logo-canastra.png',
  '/colheita manual.png',
];

export default function AnugaClient() {
  const [screen, setScreen] = useState<Screen>('intro');

  useEffect(() => {
    PRELOAD_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const handleIntroComplete = useCallback(() => setScreen('quiz'), []);

  return (
    <AnimatePresence mode="wait">
      {screen === 'intro' && (
        <IntroAnimation key="intro" onComplete={handleIntroComplete} />
      )}
      {screen === 'quiz' && (
        <AnugaQuiz key="quiz" />
      )}
    </AnimatePresence>
  );
}
