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
