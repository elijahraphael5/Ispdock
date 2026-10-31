'use client';

import { useEffect, useRef } from 'react';
import { prefersStill } from '@/lib/site';

const NAME = 'ISPDock';

// The footer name set very large. Each letter's weight morphs in a slow wave (Inter Tight is a variable font),
// filling in as it gets heavy; letters near the pointer swell and fill. Runs only while on screen.
export function Wordmark() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersStill()) return;
    const letters = Array.from(el.querySelectorAll<HTMLElement>('span'));
    let raf = 0, running = false, px = -1, near = 0, t0 = performance.now();
    const centres = () => letters.map((l) => { const r = l.getBoundingClientRect(); return r.left + r.width / 2; });
    let cx = centres();

    const frame = (now: number) => {
      if (!running) return;
      const t = (now - t0) / 1000;
      near += ((px >= 0 ? 1 : 0) - near) * 0.08; // ease the pointer's pull in and out
      const reach = el.clientWidth / 5;
      letters.forEach((l, i) => {
        const wave = 0.5 + 0.5 * Math.sin(t * 1.5 - i * 0.75);
        const pull = px >= 0 ? Math.exp(-Math.pow((px - cx[i]) / reach, 2)) : 0;
        const k = Math.min(1, wave * (1 - near * 0.6) + pull * near);
        l.style.fontWeight = String(Math.round(200 + 700 * k));
        l.style.setProperty('--fill', (Math.max(0, k - 0.45) / 0.55 * 100).toFixed(0) + '%');
      });
      if (now % 500 < 17) cx = centres(); // widths change as letters morph; re-measure now and then
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!running) { running = true; t0 = performance.now() - 2000; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const onMove = (e: PointerEvent) => { px = e.clientX; };
    const onLeave = () => { px = -1; };
    const onResize = () => { cx = centres(); };
    const io = new IntersectionObserver((e) => (e[0].isIntersecting ? start() : stop()));
    io.observe(el);
    const foot = el.closest('footer') || el;
    foot.addEventListener('pointermove', onMove as EventListener);
    foot.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);
    el.classList.add('is-live');
    return () => {
      stop(); io.disconnect();
      foot.removeEventListener('pointermove', onMove as EventListener);
      foot.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
      el.classList.remove('is-live');
      letters.forEach((l) => { l.style.fontWeight = ''; l.style.removeProperty('--fill'); });
    };
  }, []);

  return (
    <div className="wordmark" aria-hidden="true" ref={ref}>
      {NAME.split('').map((c, i) => <span key={i}>{c}</span>)}
    </div>
  );
}
