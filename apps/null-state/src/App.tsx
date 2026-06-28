import React from 'react';
import NullStateEngine from './components/WebGL/NullStateEngine';
import HeroSection from './components/HeroSection';

export default function App() {
  return (
    <div className="relative w-full min-h-screen bg-[#030507] overflow-hidden select-none">
      {/* Background WebGL Instancing Engine */}
      <NullStateEngine />

      {/* Foreground cyber HUD overlay */}
      <HeroSection />
    </div>
  );
}
