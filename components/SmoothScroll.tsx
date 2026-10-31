'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersStill } from '@/lib/site';

// Eased scrolling (Lenis) driven by GSAP's ticker, so the page and every scroll animation move on the same frame.
// In-page links (#pricing …) glide there too, clear of the sticky nav. Off for reduced motion.
export function SmoothScroll() {
  useEffect(() => {
    if (prefersStill()) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: true });
    document.documentElement.classList.add('lenis');
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); document.documentElement.classList.remove('lenis'); };
  }, []);
  return null;
}
