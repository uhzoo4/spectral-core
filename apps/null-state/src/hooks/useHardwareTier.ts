import { useState, useEffect } from 'react';

export type HardwareTier = 'low' | 'medium' | 'high';

export function useHardwareTier(): HardwareTier {
  const [tier, setTier] = useState<HardwareTier>('medium');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check concurrency and approximate device memory
    const concurrency = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || 4;
    const dpr = window.devicePixelRatio || 1;
    
    // Check mobile user agents
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    if (isMobile || memory < 4 || concurrency < 4) {
      setTier('low');
    } else if (memory >= 8 && concurrency >= 8 && dpr >= 1.5) {
      setTier('high');
    } else {
      setTier('medium');
    }
  }, []);

  return tier;
}
