'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { $, $$ } from '@/lib/scene';
import { useScene } from './useScene';

const ROUTERS = [
  { name: 'Ikeja core', ms: 4 },
  { name: 'Yaba tower', ms: 11 },
  { name: 'Lekki POP', ms: 9 },
  { name: 'Ajah cabinet', ms: 14 },
];

// Every router is checked in turn; one stops answering, the team is told at once, and it is back a few minutes later.
function setup(sc: HTMLDivElement) {
  const rows = $$(sc, '.nw-row'), sweep = $(sc, '.nw-sweep'), alert = $(sc, '.nw-alert'), back = $(sc, '.nw-back');
  const bad = rows[2], badMs = $(bad, '.nw-ms'), badState = $(bad, '.nw-state'), head = $(sc, '.nw-head');
  const sparks = $$(sc, '.nw-spark i'), panel = $(sc, '.nw-panel');
  return () => {
    bad.classList.remove('down');
    badMs.textContent = '9 ms'; badState.textContent = 'Answering';
    gsap.set([alert, back], { autoAlpha: 0, y: 14 });
    gsap.set(sweep, { yPercent: -100, opacity: 0 });
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(panel, { y: 18, opacity: 0, duration: 0.5, ease: 'power3.out' })
      .from(head, { y: 10, opacity: 0, duration: 0.4, ease: 'power3.out' }, 0.1)
      .from(rows, { y: 16, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out' }, 0.15)
      .fromTo(sparks, { scaleY: 0.1 }, { scaleY: 1, duration: 0.5, stagger: { each: 0.015, from: 'random' }, ease: 'back.out(2)' }, 0.4)
      .to(sweep, { opacity: 1, duration: 0.1 }, '+=0.2')
      .to(sweep, { yPercent: 400, duration: 1.6, ease: 'none' })
      .to(sweep, { opacity: 0, duration: 0.1 })
      .call(() => { bad.classList.add('down'); badMs.textContent = 'no reply'; badState.textContent = 'Not answering'; }, undefined, '-=0.8')
      .fromTo(bad, { x: -4 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' }, '<')
      .to(alert, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'expo.out' }, '+=0.3')
      .call(() => { bad.classList.remove('down'); badMs.textContent = '10 ms'; badState.textContent = 'Answering'; }, undefined, '+=1.8')
      .to(back, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'expo.out' }, '<')
      .to({}, { duration: 2.2 })
      .to([panel, alert, back], { opacity: 0, duration: 0.45 })
      .set([panel, head, ...rows], { opacity: 1, y: 0 });
    return tl;
  };
}

export function NetworkScene() {
  const ref = useRef<HTMLDivElement>(null);
  useScene(ref, setup);
  return (
    <div className="scene-box"><div className="scene network" ref={ref}>
      <div className="nw-panel">
        <div className="nw-head"><b>Routers</b><span>checked every 30 s</span></div>
        <div className="nw-rows">
          <i className="nw-sweep"></i>
          {ROUTERS.map((r, k) => (
            <div className="nw-row" key={r.name}>
              <i className="nw-dot"></i>
              <b>{r.name}</b><span className="nw-state">Answering</span>
              <em className="nw-ms">{r.ms} ms</em>
              <div className="nw-spark">{Array.from({ length: 14 }, (_, j) => <i key={j} style={{ ['--h' as string]: 0.3 + ((j * 7 + k * 5) % 10) / 14 }}></i>)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="nw-alert"><small>Alert · Telegram</small><b>Lekki POP is not answering</b><span>214 customers behind it</span></div>
      <div className="nw-back"><i></i>Lekki POP is back<br /><span>Down for 6 minutes</span></div>
    </div></div>
  );
}
