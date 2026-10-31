'use client';

import { useEffect, useRef } from 'react';
import { prefersStill } from '@/lib/site';

const TEXT = 'Most ISPs run on a spreadsheet, a payment link, a WhatsApp group and a router nobody wants to touch. Customers pay and still get cut off. Staff chase transfers by screenshot. ISPDock puts it all on one dock: the bill, the payment, the login, the router and the reply.';

// Words fill in as the paragraph scrolls past
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const fill = ref.current;
    if (!fill) return;
    const words = Array.from(fill.querySelectorAll<HTMLElement>('.w'));
    if (prefersStill()) { words.forEach((w) => w.classList.add('on')); return; }
    let lit = -1, queued = false;
    const paint = () => {
      queued = false;
      const r = fill.getBoundingClientRect(), vh = window.innerHeight;
      // 0 when the top reaches 85% of the screen, 1 when the bottom reaches 55%
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.3);
      const n = Math.round(Math.max(0, Math.min(1, p)) * words.length);
      if (n === lit) return;
      words.forEach((w, i) => w.classList.toggle('on', i < n));
      lit = n;
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    paint();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return (
    <section className="section" aria-label="Why ISPDock">
      <div className="wrap grid">
        <p className="label rail">Why ISPDock</p>
        <p className="fill col-main" ref={ref}>
          {TEXT.split(/(\s+)/).filter(Boolean).map((p, i) => (/^\s+$/.test(p) ? p : <span className="w" key={i}>{p}</span>))}
        </p>
      </div>
    </section>
  );
}
