'use client';

import { useEffect } from 'react';
import { prefersStill } from '@/lib/site';

// Liquid-glass response for .glass panes: the light (sheen + rim) follows the pointer, the pane leans a little toward it
// and lifts on a spring; pressing squishes it and blooms light from the touch point. Decorative only: nothing to focus.
export function GlassFx() {
  useEffect(() => {
    const panes = Array.from(document.querySelectorAll<HTMLElement>('.glass'));
    if (!panes.length) return;
    const still = prefersStill();
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const off: Array<() => void> = [];

    panes.forEach((pane) => {
      let frame = 0;
      const aim = (e: PointerEvent) => {
        const r = pane.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          pane.style.setProperty('--gx', x + 'px');
          pane.style.setProperty('--gy', y + 'px');
          if (fine && !still) {
            pane.style.setProperty('--ry', ((x / r.width - 0.5) * 7).toFixed(2) + 'deg');
            pane.style.setProperty('--rx', ((0.5 - y / r.height) * 7).toFixed(2) + 'deg');
          }
        });
      };
      const enter = (e: PointerEvent) => { aim(e); pane.classList.add('is-hot'); };
      const leave = () => {
        cancelAnimationFrame(frame);
        pane.classList.remove('is-hot', 'is-press');
        pane.style.removeProperty('--rx'); pane.style.removeProperty('--ry');
      };
      const down = (e: PointerEvent) => { aim(e); pane.classList.add('is-hot', 'is-press'); };
      const up = (e: PointerEvent) => { pane.classList.remove('is-press'); if (e.pointerType !== 'mouse') leave(); };
      pane.addEventListener('pointerenter', enter);
      pane.addEventListener('pointermove', aim);
      pane.addEventListener('pointerleave', leave);
      pane.addEventListener('pointerdown', down);
      pane.addEventListener('pointerup', up);
      pane.addEventListener('pointercancel', leave);
      off.push(() => {
        cancelAnimationFrame(frame); leave();
        pane.removeEventListener('pointerenter', enter);
        pane.removeEventListener('pointermove', aim);
        pane.removeEventListener('pointerleave', leave);
        pane.removeEventListener('pointerdown', down);
        pane.removeEventListener('pointerup', up);
        pane.removeEventListener('pointercancel', leave);
      });
    });
    return () => off.forEach((f) => f());
  }, []);
  return null;
}
