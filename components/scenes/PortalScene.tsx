'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { $, $$, count, tapAt } from '@/lib/scene';
import { useScene } from './useScene';

const BARS = [0.42, 0.66, 0.38, 0.8, 0.55, 0.92, 0.7];

// Usage fills in, the days-left frame shows 12 days, support writes back, the customer taps Renew
// and the frame runs all the way round.
function setup(portal: HTMLDivElement) {
  const tScreen = $(portal, '.pt-screen'), bars = $$(portal, '.pt-bars i'), gb = $(portal, '.pt-gb'), fillPath = $(portal, '.pt-fill');
  const days = $(portal, '.pt-days b'), tBtn = $(portal, '.pt-btn'), tTap = $(portal, '.pt-tap'), chat = $(portal, '.pt-chat');
  const typing = $(portal, '.pt-typing'), dots = $$(portal, '.pt-typing i'), msg = $(portal, '.pt-msg'), tToast = $(portal, '.pt-toast');
  const parts = $$(portal, '.pt-screen > *:not(.pt-tap)');
  return () => {
    gsap.set(parts, { opacity: 1 });
    gsap.set(bars, { scaleY: 0 }); gb.textContent = '0'; days.textContent = '0';
    gsap.set(fillPath, { strokeDashoffset: 480 });
    gsap.set([chat, tToast], { autoAlpha: 0, y: 14 });
    typing.style.display = 'flex'; gsap.set(msg, { opacity: 0, display: 'none' });
    tBtn.textContent = 'Renew';
    const g = count(gb, 0, 184, String), d1 = count(days, 0, 12, String), d2 = count(days, 12, 42, String);
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(parts, { y: 12, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' })
      .to(bars, { scaleY: 1, duration: 0.6, stagger: 0.07, ease: 'back.out(1.8)' }, 0.4)
      .to(g.target, { duration: 1.2, ease: 'power2.out', ...g.vars }, '<')
      .to(fillPath, { strokeDashoffset: 480 * (1 - 12 / 30), duration: 1.1, ease: 'power3.out' }, '<')
      .to(d1.target, { duration: 1.1, ease: 'power3.out', ...d1.vars }, '<')
      .to(chat, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' }, '+=0.2')
      .to(dots, { y: -4, duration: 0.22, yoyo: true, repeat: 5, stagger: 0.1, ease: 'sine.inOut' })
      .call(() => { typing.style.display = 'none'; })
      .to(msg, { display: 'block', opacity: 1, duration: 0.35 });
    tapAt(tl, tTap, tScreen, tBtn, '+=0.5');
    tl.to(tBtn, { scale: 0.96, duration: 0.08, yoyo: true, repeat: 1 }, '<')
      .call(() => { tBtn.textContent = 'Paying by card…'; }, undefined, '<')
      .call(() => { tBtn.textContent = 'Renewed'; }, undefined, '+=0.9')
      .to(fillPath, { strokeDashoffset: 0, duration: 1.3, ease: 'expo.inOut' }, '<')
      .to(d2.target, { duration: 1.3, ease: 'expo.inOut', ...d2.vars }, '<')
      .to(tToast, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'expo.out' }, '-=0.6')
      .to({}, { duration: 2.4 })
      .to(parts.concat([chat, tToast]), { opacity: 0, duration: 0.45 });
    return tl;
  };
}

export function PortalScene() {
  const ref = useRef<HTMLDivElement>(null);
  useScene(ref, setup);
  return (
    <div className="scene-box"><div className="scene portal" ref={ref}>
      <div className="pt-phone"><div className="pt-screen">
        <div className="pt-top"><b>Hi, Ada</b><span className="pt-online"><i></i>Online</span></div>
        <div className="pt-frame">
          <svg viewBox="0 0 132 132"><rect className="pt-track" x="6" y="6" width="120" height="120" /><path className="pt-fill" d="M66 6 H126 V126 H6 V6 Z" /></svg>
          <div className="pt-days"><b>12</b><span>days left</span></div>
        </div>
        <div className="pt-plan"><span>Fibre 50</span><span>renews 12 Nov</span></div>
        <div className="pt-usage"><small>Data this month</small><b><span className="pt-gb">184</span> GB</b>
          <div className="pt-bars">{BARS.map((h, k) => <i key={k} style={{ ['--h' as string]: h }}></i>)}</div>
        </div>
        <div className="pt-btn">Renew</div>
        <i className="ps-tap pt-tap"></i>
      </div></div>
      <div className="pt-chat"><small>Support · Tobi</small><p className="pt-typing"><i></i><i></i><i></i></p><p className="pt-msg">The crew is on the way. About 30 minutes.</p></div>
      <div className="pt-toast"><i></i>Renewed · 30 days added<br /><span>Paid by card · receipt sent</span></div>
    </div></div>
  );
}
