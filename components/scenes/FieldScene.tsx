'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { $, $$, count, tapAt } from '@/lib/scene';
import { useScene } from './useScene';

const STEPS = ['Scheduled', 'On the way', 'On site', 'Done'];

// A technician's install job: on the way, on site, the router leaves the van stock, the customer signs, job done.
function setup(sc: HTMLDivElement) {
  const screen = $(sc, '.fd-screen'), steps = $$(sc, '.fd-step'), btn = $(sc, '.fd-btn'), tap = $(sc, '.fd-tap');
  const sign = $(sc, '.fd-sign path'), stock = $(sc, '.fd-stock'), onu = $(sc, '.fd-onu'), cable = $(sc, '.fd-cable');
  const toast = $(sc, '.fd-toast'), parts = $$(sc, '.fd-screen > *:not(.fd-tap)');
  const LABELS = ['Start trip', 'I have arrived', 'Mark as done'];
  return () => {
    steps.forEach((s, k) => s.classList.toggle('on', k === 0));
    btn.textContent = LABELS[0];
    onu.textContent = '12'; cable.textContent = '300';
    gsap.set(parts, { opacity: 1 });
    gsap.set(sign, { strokeDashoffset: 260 });
    gsap.set([stock, toast], { autoAlpha: 0, y: 14 });
    const o = count(onu, 12, 11, String), m = count(cable, 300, 260, String);
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(parts, { y: 12, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' })
      .to(stock, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 0.5);
    [1, 2].forEach((k) => {
      tapAt(tl, tap, screen, btn, '+=0.7');
      tl.to(btn, { scale: 0.96, duration: 0.08, yoyo: true, repeat: 1 }, '<')
        .call(() => { steps[k].classList.add('on'); btn.textContent = LABELS[k]; }, undefined, '<')
        .fromTo(steps[k], { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' }, '<');
    });
    tl.to(o.target, { duration: 0.6, ease: 'power2.out', ...o.vars }, '+=0.3')
      .to(m.target, { duration: 0.9, ease: 'power2.out', ...m.vars }, '<')
      .to(sign, { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut' }, '+=0.2');
    tapAt(tl, tap, screen, btn, '+=0.3');
    tl.to(btn, { scale: 0.96, duration: 0.08, yoyo: true, repeat: 1 }, '<')
      .call(() => { steps[3].classList.add('on'); btn.textContent = 'Job closed'; }, undefined, '<')
      .to(toast, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'expo.out' }, '+=0.3')
      .to({}, { duration: 2.4 })
      .to(parts.concat([stock, toast]), { opacity: 0, duration: 0.45 });
    return tl;
  };
}

export function FieldScene() {
  const ref = useRef<HTMLDivElement>(null);
  useScene(ref, setup);
  return (
    <div className="scene-box"><div className="scene field" ref={ref}>
      <div className="pt-phone"><div className="pt-screen fd-screen">
        <div className="fd-job"><small>JOB-000142 · Install</small><b>Ada Okafor</b><span>14 Admiralty Way, Lekki</span></div>
        <ol className="fd-steps">{STEPS.map((s, k) => <li className={'fd-step' + (k === 0 ? ' on' : '')} key={s}><i></i>{s}</li>)}</ol>
        <div className="fd-sig"><small>Customer signature</small>
          <svg viewBox="0 0 180 54"><path d="M6 40 C 20 8, 30 8, 34 36 S 52 52, 60 22 S 80 6, 86 34 S 104 46, 118 20 S 140 30, 150 26 S 166 22, 174 30" /></svg>
        </div>
        <div className="pt-btn fd-btn">Start trip</div>
        <i className="ps-tap fd-tap"></i>
      </div></div>
      <div className="fd-stock"><small>Van 2 · stock</small>
        <p><span>ONU</span><b><span className="fd-onu">12</span></b></p>
        <p><span>Drop cable (m)</span><b><span className="fd-cable">300</span></b></p>
        <p><span>Router</span><b>8</b></p>
      </div>
      <div className="pt-toast fd-toast"><i></i>Installed · Ada is online<br /><span>Job closed in 48 minutes</span></div>
    </div></div>
  );
}
