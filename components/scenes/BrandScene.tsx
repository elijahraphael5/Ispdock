'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { $, $$, type Tl } from '@/lib/scene';
import { useScene } from './useScene';

const BRANDS = [
  { name: 'Nova Fibre', b: '#E4572E', bd: '#8F2F15' },
  { name: 'Kite Net', b: '#1A73E8', bd: '#0B3C8C' },
  { name: 'Bluebird Wireless', b: '#7C3AED', bd: '#4C1D95' },
  { name: 'Ember Link', b: '#0F766E', bd: '#0A3F3A' },
];
const CHART = [0.45, 0.6, 0.52, 0.74, 0.68, 0.9];

// A colour wipe repaints the dashboard and the email for the next company,
// then the address types itself as admin., my. and mail.
function setup(brand: HTMLDivElement) {
  const wipe = $(brand, '.br-wipe'), names = $$(brand, '.br-name'), sub = $(brand, '.br-sub'), mail = $(brand, '.br-mail');
  const chart = $$(brand, '.br-chart i'), chips = $$(brand, '.br-chips i'), hero = $(brand, '.br-hero');
  const type = (tl: Tl, word: string) => {
    const erase = { p: 0 }, write = { p: 0 };
    let from = '';
    tl.to(erase, { p: 1, duration: 0.25, ease: 'none', onStart: () => { from = sub.textContent || ''; },
      onUpdate: () => { sub.textContent = from.slice(0, Math.round(from.length * (1 - erase.p))); } }, '+=0.9')
      .to(write, { p: 1, duration: word.length * 0.07, ease: 'none',
        onUpdate: () => { sub.textContent = word.slice(0, Math.round(word.length * write.p)); } });
  };
  return (i: number) => {
    const B = BRANDS[i % BRANDS.length];
    gsap.set(wipe, { backgroundColor: B.b, clipPath: 'inset(0 100% 0 0)' });
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(mail, { opacity: 0, y: 12, duration: 0.3 })
      .to(wipe, { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'expo.inOut' }, 0)
      .call(() => {
        brand.style.setProperty('--b', B.b); brand.style.setProperty('--bd', B.bd);
        names.forEach((n) => { n.textContent = B.name; });
        chips.forEach((c, k) => c.classList.toggle('on', k === i % chips.length));
        sub.textContent = 'admin.';
      })
      .to(wipe, { clipPath: 'inset(0 0% 0 100%)', duration: 0.55, ease: 'expo.inOut' })
      .fromTo(chart, { scaleY: 0 }, { scaleY: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out', immediateRender: false }, '<0.15')
      .fromTo(hero, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'expo.out', immediateRender: false }, '<')
      .to(mail, { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out' }, '<0.2');
    type(tl, 'my.');
    type(tl, 'mail.');
    type(tl, 'admin.');
    tl.to({}, { duration: 0.6 });
    return tl;
  };
}

export function BrandScene() {
  const ref = useRef<HTMLDivElement>(null);
  useScene(ref, setup);
  return (
    <div className="scene-box"><div className="scene brand" ref={ref}>
      <div className="br-win">
        <div className="br-bar"><i></i><i></i><i></i><span className="br-url"><b className="br-sub">admin.</b>yourisp.com</span></div>
        <div className="br-body">
          <div className="br-side"><i className="br-logo"></i><i className="on"></i><i></i><i></i><i></i></div>
          <div className="br-main">
            <div className="br-head"><b className="br-name">Nova Fibre</b><i className="br-btn"></i></div>
            <div className="br-hero"><small>Collected this month</small><b>₦18.4m</b></div>
            <div className="br-chart">{CHART.map((h, k) => <i key={k} style={{ ['--h' as string]: h }}></i>)}</div>
          </div>
        </div>
        <i className="br-wipe"></i>
      </div>
      <div className="br-mail"><div className="br-mail-top"><i className="br-logo"></i><b className="br-name">Nova Fibre</b></div><p>Your invoice for November is ready.</p><span className="br-mail-btn">Pay now</span></div>
      <div className="br-chips">{BRANDS.map((b, k) => <i key={b.name} className={k === 0 ? 'on' : undefined} style={{ ['--c' as string]: b.b }}></i>)}</div>
    </div></div>
  );
}
