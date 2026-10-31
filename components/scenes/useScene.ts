'use client';

import { useEffect, type RefObject } from 'react';
import { fitScene, loopScene, type Tl } from '@/lib/scene';
import { prefersStill } from '@/lib/site';

// Scales the stage to its panel and, unless motion is reduced, loops the story while it is on screen.
// setup() runs once and returns the builder for each loop.
export function useScene(ref: RefObject<HTMLDivElement | null>, setup: (sc: HTMLDivElement) => (i: number) => Tl) {
  useEffect(() => {
    const sc = ref.current;
    if (!sc) return;
    const fit = () => fitScene(sc);
    fit();
    window.addEventListener('resize', fit);
    const stop = prefersStill() ? null : loopScene(sc, setup(sc));
    return () => { window.removeEventListener('resize', fit); stop?.(); };
    // setup is a module-level function in every scene, so it never changes
  }, []);
}
