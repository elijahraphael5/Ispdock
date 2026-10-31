'use client';

import { useEffect } from 'react';
import { prefersStill } from '@/lib/site';

// Buttons lean toward the pointer while it is over them and spring back when it leaves.
// Writes --mx / --my on the button; the CSS adds them to the hover lift. Mouse and pen only.
export function Magnetic() {
  useEffect(() => {
    if (prefersStill() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const SEL = '.btn, .theme-btn';
    const move = (e: PointerEvent) => {
      const b = (e.target as Element).closest<HTMLElement>(SEL);
      if (!b) return;
      const r = b.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      b.style.setProperty('--mx', (x * 10).toFixed(1) + 'px');
      b.style.setProperty('--my', (y * 8).toFixed(1) + 'px');
    };
    const out = (e: PointerEvent) => {
      const b = (e.target as Element).closest<HTMLElement>(SEL);
      if (b && !b.contains(e.relatedTarget as Node)) { b.style.removeProperty('--mx'); b.style.removeProperty('--my'); }
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerout', out);
    return () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerout', out); };
  }, []);
  return null;
}
