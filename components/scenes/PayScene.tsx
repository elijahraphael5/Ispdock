'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { $, $$, count, money, tapAt } from '@/lib/scene';
import { useScene } from './useScene';

const METHODS = ['Bank transfer', 'Card', 'USSD', 'OPay'];
const OPTS = [['#2B50EC', 'Bank transfer', '0123456789 · Wema'], ['#0B6B57', 'Card', 'Visa, Mastercard, Verve'], ['#E4572E', 'USSD', '*737# from any bank'], ['#12A4AF', 'OPay', 'Wallet']];

// Pick a way to pay, tap Pay, the gateway confirms, the money runs to the account,
// the oldest bill is stamped paid and the rest lands in the wallet.
function setup(pay: HTMLDivElement) {
  const pScreen = $(pay, '.ps-screen'), opts = $$(pay, '.ps-opt'), sel = $(pay, '.ps-sel'), pBtn = $(pay, '.ps-btn');
  const label = $(pay, '.ps-label'), spin = $(pay, '.ps-spin'), done = $(pay, '.ps-done'), check = $(pay, '.ps-check');
  const checkPath = $(pay, '.ps-check path'), via = $(pay, '.ps-via'), pTap = $(pay, '.ps-tap'), ledger = $(pay, '.ps-ledger');
  const stamp = $(pay, '.ps-stamp'), wallet = $(pay, '.ps-wallet'), pToast = $(pay, '.ps-toast'), packet = $(pay, '.ps-packet');
  const wire = $<SVGPathElement>(pay, '.ps-wire-base'), wireLen = wire.getTotalLength();
  return (i: number) => {
    const m = i % opts.length, o = opts[m];
    gsap.set(opts, { opacity: 0, y: 14 });
    gsap.set(sel, { opacity: 0, y: 0, height: opts[0].offsetHeight });
    opts.forEach((x) => x.classList.remove('on'));
    gsap.set(label, { opacity: 1 }); gsap.set(spin, { opacity: 0, rotation: 0 });
    gsap.set(done, { autoAlpha: 0 }); gsap.set(check, { scale: 0.3 }); gsap.set(checkPath, { strokeDashoffset: 40 });
    gsap.set(ledger, { opacity: 0, x: 24 }); gsap.set(pToast, { autoAlpha: 0, y: -12 }); gsap.set(packet, { opacity: 0 });
    gsap.set(stamp, { opacity: 1, scale: 1, rotation: 0 });
    stamp.textContent = 'Due'; stamp.classList.remove('paid'); wallet.textContent = '₦0';
    via.textContent = METHODS[m] + ' · confirmed by the gateway';
    const w = count(wallet, 0, 5000, money), run = { t: 0 };
    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(opts, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' })
      .to(ledger, { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out' }, 0.25);
    tapAt(tl, pTap, pScreen, o, '+=0.35');
    tl.to(sel, { opacity: 1, y: o.offsetTop, height: o.offsetHeight, duration: 0.45, ease: 'expo.inOut' }, '<')
      .call(() => o.classList.add('on'), undefined, '<0.2');
    tapAt(tl, pTap, pScreen, pBtn, '+=0.75');
    tl.to(pBtn, { scale: 0.96, duration: 0.08, yoyo: true, repeat: 1 }, '<')
      .to(label, { opacity: 0, duration: 0.15 }, '<')
      .to(spin, { opacity: 1, duration: 0.15 }, '<')
      .to(spin, { rotation: 630, duration: 1.15, ease: 'none' }, '<')
      .to(done, { autoAlpha: 1, duration: 0.25 })
      .to(check, { scale: 1, duration: 0.55, ease: 'back.out(2.4)' }, '<')
      .to(checkPath, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, '-=0.25')
      .set(packet, { opacity: 1 }, '+=0.1')
      .to(run, { t: 1, duration: 0.75, ease: 'power1.inOut', onUpdate: () => { const p = wire.getPointAtLength(run.t * wireLen); gsap.set(packet, { x: p.x, y: p.y }); } })
      .set(packet, { opacity: 0 })
      .call(() => { stamp.textContent = 'Paid'; stamp.classList.add('paid'); })
      .fromTo(stamp, { scale: 2.6, rotation: -16, opacity: 0 }, { scale: 1, rotation: -4, opacity: 1, duration: 0.45, ease: 'back.out(3)', immediateRender: false }, '<')
      .to(ledger, { x: 3, duration: 0.05, yoyo: true, repeat: 5 }, '<0.3')
      .to(w.target, { duration: 0.9, ease: 'power2.out', ...w.vars }, '<')
      .to(pToast, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'expo.out' }, '-=0.4')
      .to({}, { duration: 2.4 })
      .to([opts, sel, done, ledger, pToast], { opacity: 0, duration: 0.45 });
    return tl;
  };
}

export function PayScene() {
  const ref = useRef<HTMLDivElement>(null);
  useScene(ref, setup);
  return (
    <div className="scene-box"><div className="scene pay" ref={ref}>
      <div className="ps-phone"><div className="ps-screen">
        <div className="ps-head"><small>Amount to pay</small><b>₦20,000</b><span>Fibre 50 · CUS-2041</span></div>
        <div className="ps-opts">
          <i className="ps-sel"></i>
          {OPTS.map(([c, name, sub], k) => (
            <div key={name} className={'ps-opt' + (k === 0 ? ' on' : '')}><i style={{ ['--m' as string]: c }}></i><b>{name}</b><span>{sub}</span></div>
          ))}
        </div>
        <div className="ps-btn"><span className="ps-label">Pay ₦20,000</span><i className="ps-spin"></i></div>
        <div className="ps-done"><div className="ps-check"><svg viewBox="0 0 40 40"><path d="M10 21l7 7 14-15" /></svg></div><b>₦20,000 received</b><span className="ps-via">Bank transfer · confirmed</span></div>
        <i className="ps-tap"></i>
      </div></div>
      <svg className="ps-wire" viewBox="0 0 460 440"><path className="ps-wire-base" d="M214 300 H238 V236 H262" /><path className="ps-wire-flow" d="M214 300 H238 V236 H262" /><rect className="ps-packet" x="-6" y="-6" width="12" height="12" /></svg>
      <div className="ps-ledger">
        <small>Account · CUS-2041</small>
        <div className="ps-row"><span>INV-0138 · Oct</span><b>₦15,000</b><em className="ps-tag paid">Paid</em></div>
        <div className="ps-row"><span>INV-0142 · Nov</span><b>₦15,000</b><em className="ps-tag ps-stamp paid">Paid</em></div>
        <div className="ps-row ps-wallet-row"><span>Wallet</span><b className="ps-wallet">₦5,000</b><em className="ps-tag">Kept</em></div>
      </div>
      <div className="ps-toast"><i></i>Oldest bill paid first<br /><span>Receipt emailed</span></div>
    </div></div>
  );
}
