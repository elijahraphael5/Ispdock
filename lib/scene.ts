import { gsap } from 'gsap';

export type Tl = gsap.core.Timeline;

export const $ = <T extends Element = HTMLElement>(root: Element, s: string) => root.querySelector(s) as T;
export const $$ = <T extends Element = HTMLElement>(root: Element, s: string) => Array.from(root.querySelectorAll(s)) as T[];

// Position of el inside root, ignoring transforms
export const pos = (el: HTMLElement, root: HTMLElement) => {
  let x = 0, y = 0, n: HTMLElement | null = el;
  while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
  return { x, y };
};

// A finger tap: a square ring that lands on el and spreads out
export const tapAt = (tl: Tl, tap: HTMLElement, root: HTMLElement, el: HTMLElement, at: string | number) => {
  tl.call(() => { const p = pos(el, root); gsap.set(tap, { x: p.x + el.offsetWidth * 0.66, y: p.y + el.offsetHeight / 2 }); }, undefined, at)
    .fromTo(tap, { scale: 0.4, opacity: 1 }, { scale: 1.9, opacity: 0, duration: 0.55, ease: 'power2.out' }, '>');
};

// A number that counts from `from` to `to` inside el
export const count = (el: HTMLElement, from: number, to: number, fmt: (n: number) => string) => {
  const o = { v: from };
  return { target: o, vars: { v: to, onUpdate: () => { el.textContent = fmt(Math.round(o.v)); } } };
};

export const money = (n: number) => '₦' + n.toLocaleString('en-NG');

// Run build(i) for i = 0, 1, 2 ... one after another, playing only while the scene is on screen.
// Returns a cleanup that stops everything.
export const loopScene = (sc: HTMLElement, build: (i: number) => Tl) => {
  let i = 0, tl: Tl | null = null, on = false;
  const next = () => { tl = build(i++); tl.eventCallback('onComplete', next); if (!on) tl.pause(); };
  next();
  const io = new IntersectionObserver((e) => { on = e[0].isIntersecting; if (on) tl?.play(); else tl?.pause(); }, { threshold: 0.3 });
  io.observe(sc);
  return () => { io.disconnect(); tl?.kill(); tl = null; };
};

// Scenes are fixed 460 x 440 stages; scale each to fit its panel
export const fitScene = (sc: HTMLElement) => {
  const box = sc.parentElement as HTMLElement, art = box.parentElement as HTMLElement, cs = getComputedStyle(art);
  const k = Math.min(1, (art.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / 460);
  box.style.width = 460 * k + 'px';
  box.style.height = 440 * k + 'px';
  sc.style.transform = 'scale(' + k + ')';
};
