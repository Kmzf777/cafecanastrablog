'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroAnimation from './IntroAnimation';
import MainContent from './MainContent';
import SuccessScreen from './SuccessScreen';

type Screen = 'intro' | 'main' | 'success';

const PRELOAD_IMAGES = [
  '/colheita manual.png',
  '/torra artesanal.jpg',
  '/degustacao.jpg',
  '/logo-canastra.png',
  '/cafe-classico.png',
  '/cafe-suave.png',
  '/cafe-canela.png',
  '/microlote-png.png',
];

export default function AnugaClient() {
  const [screen, setScreen] = useState<Screen>('intro');

  // Preload images in the background while user watches the intro
  useEffect(() => {
    PRELOAD_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

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
