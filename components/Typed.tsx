'use client';

import { useEffect, useRef } from 'react';
import { prefersStill } from '@/lib/site';

// Hero: type the last word, hold, erase, next. Runs only while the hero is on screen.
export function Typed({ words, initial }: { words: string[]; initial: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersStill()) return;
    let wi = 0, current = el.textContent || initial, ci = current.length, del = true, seen = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const tick = () => {
      timer = null;
      if (!seen) return;
      let delay: number;
      if (del) {
        ci--; el.textContent = current.slice(0, ci);
        if (ci <= 0) { del = false; current = words[wi]; wi = (wi + 1) % words.length; delay = 260; } else delay = 38;
      } else {
        ci++; el.textContent = current.slice(0, ci);
        if (ci >= current.length) { del = true; delay = 2000; } else delay = 85;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 2200);
    const io = new IntersectionObserver((e) => { seen = e[0].isIntersecting; if (seen && !timer) timer = setTimeout(tick, 600); });
    io.observe(el);
    return () => { io.disconnect(); if (timer) clearTimeout(timer); el.textContent = initial; };
  }, [words, initial]);
  return <span className="typed" ref={ref}>{initial}</span>;
}
