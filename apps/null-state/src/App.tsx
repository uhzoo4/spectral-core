import NullStateEngine from './components/WebGL/NullStateEngine';
import HeroSection from './components/HeroSection';

export default function App() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Scanline CRT glass filters */}
      <div className="ambient-overlay" />
      <div className="terminal-scanlines" />

      {/* Background WebGL Instancing Engine */}
      <NullStateEngine />

      {/* Foreground cyber HUD overlay */}
      <HeroSection />
    </div>
  );
}
