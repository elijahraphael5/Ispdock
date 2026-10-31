'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersStill } from '@/lib/site';

type Geo = { x: number; y: number; sx: number; sy: number };
const NS = 'http://www.w3.org/2000/svg';

// Spotlight cards: all the height of the tallest one, each stuck where its whole height is still on screen
function useStick() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.stack .spot'));
    const small = window.matchMedia('(max-width: 1100px), (max-height: 759px)');
    const set = () => {
      // every card the height of the tallest one, re-measured at each size
      cards.forEach((card) => { card.style.minHeight = ''; });
      const tallest = Math.max(...cards.map((c) => c.offsetHeight));
      cards.forEach((card) => { card.style.minHeight = tallest + 'px'; });
      stick();
    };
    // each card sticks a step below the one before, but never so low that its bottom leaves the screen
    const stick = () => cards.forEach((card, i) => {
      const step = small.matches ? 80 + i * 12 : 88 + i * 16;
      card.style.setProperty('--stick', Math.min(step, window.innerHeight - card.offsetHeight - 12) + 'px');
    });
    set();
    window.addEventListener('resize', set);
    window.addEventListener('load', set);
    return () => { window.removeEventListener('resize', set); window.removeEventListener('load', set); };
  }, []);
}

// Reveal on scroll. Elements marked data-self reveal themselves (their component re-renders its class names).
function useReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll('.reveal:not([data-self])'));
    if (prefersStill()) { items.forEach((el) => el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// Scroll-driven motion for the whole page. Without it (reduced motion) the plain reveal runs.
export function ScrollMotion() {
  useStick();
  useReveal();

  useEffect(() => {
    if (prefersStill()) return;
    gsap.registerPlugin(ScrollTrigger);
    const unreveal = (el: Element) => el.classList.remove('reveal');
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // Dock: the dashboard stays flat and still. On wide screens, scrolling pins it, shrinks it in place, breaks its parts
      // away into the coloured menu boxes on either side and draws a looping line from the dashboard to each box.
      const dock = document.querySelector<HTMLElement>('.dock'), device = document.querySelector<HTMLElement>('.device');
      if (dock && device) {
        mm.add('(min-width: 1101px) and (min-height: 700px)', () => {
          const SCALE = 0.5, GAP = 72, TOP = 24;
          const svg = dock.querySelector<SVGSVGElement>('.dock-lines')!;
          const boxes = gsap.utils.toArray<HTMLElement>(dock.querySelectorAll('.dock-box'));
          const geo = new Map<HTMLElement, Geo>();
          const parts = boxes.map((b) => device.querySelector<HTMLElement>(b.dataset.src!)).filter(Boolean) as HTMLElement[];
          dock.classList.add('is-split');
          // offset of an element inside the dashboard, ignoring transforms
          const rel = (el: HTMLElement | null) => {
            let x = 0, y = 0, n: HTMLElement | null = el;
            while (n && n !== device) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
            return n === device && el ? { x, y, w: el.offsetWidth, h: el.offsetHeight } : null;
          };
          const layout = () => {
            const W = dock.clientWidth, H = device.offsetHeight, w = device.offsetWidth;
            const x0 = (W - w * SCALE) / 2, y0 = TOP, x1 = x0 + w * SCALE;
            // the dock keeps only the shrunk height; the full-size dashboard overflows into the pin's scroll space at first
            dock.style.height = (H * SCALE + TOP * 2) + 'px';
            // the pinned area fills the screen, so the next section can't slide up under the dashboard while it holds still
            (dock.parentElement as HTMLElement).style.minHeight = (window.innerHeight - 84) + 'px';
            const bw = Math.min(260, x0 - GAP);
            const sides: Record<string, HTMLElement[]> = { left: [], right: [] };
            boxes.forEach((b) => { b.style.width = bw + 'px'; b.style.height = ''; sides[b.dataset.side!].push(b); });
            // every box the height of the tallest one
            const tallest = Math.max(...boxes.map((b) => b.offsetHeight));
            boxes.forEach((b) => { b.style.height = tallest + 'px'; });
            svg.setAttribute('width', String(W)); svg.setAttribute('height', String(H));
            svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
            svg.textContent = '';
            Object.keys(sides).forEach((side) => {
              const list = sides[side], gap = 20;
              const total = list.reduce((t, b) => t + b.offsetHeight, 0) + gap * (list.length - 1);
              let y = y0 + (H * SCALE - total) / 2;
              list.forEach((b, i) => {
                const bx = side === 'left' ? x0 - GAP - bw : x1 + GAP, bh = b.offsetHeight, cy = y + bh / 2;
                b.style.left = bx + 'px'; b.style.top = y + 'px';
                // where the part it came from sits once the dashboard has shrunk
                const src = rel(device.querySelector<HTMLElement>(b.dataset.src!)) || { x: w / 2, y: H / 2, w: 40, h: 40 };
                geo.set(b, { x: x0 + src.x * SCALE - bx, y: y0 + src.y * SCALE - y, sx: (src.w * SCALE) / bw, sy: (src.h * SCALE) / bh });
                // elbow line: out of the dashboard's edge, across, then along to the box
                const ex = side === 'left' ? x0 : x1, ey = y0 + (H * SCALE) * (i + 1) / (list.length + 1);
                const tx = side === 'left' ? bx + bw : bx, mx = (ex + tx) / 2;
                const d = 'M' + ex + ' ' + ey + ' H' + mx + ' V' + cy + ' H' + tx;
                const color = getComputedStyle(b).getPropertyValue('--box').trim();
                ['base', 'flow'].forEach((cls) => {
                  const p = document.createElementNS(NS, 'path');
                  p.setAttribute('d', d); p.setAttribute('class', cls); p.setAttribute('stroke', color);
                  svg.appendChild(p);
                });
                [[ex, ey], [tx, cy]].forEach((pt) => {
                  const r = document.createElementNS(NS, 'rect');
                  r.setAttribute('x', String(pt[0] - 4)); r.setAttribute('y', String(pt[1] - 4)); r.setAttribute('width', '8'); r.setAttribute('height', '8');
                  r.setAttribute('fill', color); r.setAttribute('class', 'end');
                  svg.appendChild(r);
                });
                y += bh + gap;
              });
            });
          };
          layout();
          const g = (b: HTMLElement) => geo.get(b)!;
          const drift = parts.map((p) => {
            const left = p.getBoundingClientRect().left < device.getBoundingClientRect().left + device.offsetWidth / 2;
            return { x: (left ? -1 : 1) * gsap.utils.random(14, 26), y: gsap.utils.random(-10, 10), r: gsap.utils.random(-2, 2) };
          });
          const tl = gsap.timeline({ scrollTrigger: { trigger: dock.parentElement, start: 'top 84px', end: '+=1500', pin: true, scrub: 0.6, invalidateOnRefresh: true, onRefreshInit: layout } });
          tl.to(device, { scale: SCALE, y: TOP, transformOrigin: '50% 0%', duration: 1, ease: 'power2.inOut' }, 0)
            .to(parts, { x: (i) => drift[i].x, y: (i) => drift[i].y, rotation: (i) => drift[i].r, opacity: 0.18, duration: 0.8, ease: 'power1.in' }, 0.5)
            .fromTo(boxes, {
              x: (_i: number, b: HTMLElement) => g(b).x, y: (_i: number, b: HTMLElement) => g(b).y,
              scaleX: (_i: number, b: HTMLElement) => g(b).sx, scaleY: (_i: number, b: HTMLElement) => g(b).sy,
              transformOrigin: '0 0', opacity: 0,
            }, { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.1, immediateRender: true }, 0.9)
            .fromTo(svg, { clipPath: 'inset(0 50% 0 50%)', opacity: 0 }, { clipPath: 'inset(0 0% 0 0%)', opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.6)
            .to({}, { duration: 0.4 });
          return () => { dock.classList.remove('is-split'); dock.style.height = ''; (dock.parentElement as HTMLElement).style.minHeight = ''; svg.textContent = ''; boxes.forEach((b) => { b.style.cssText = ''; }); };
        });
      }

      // Phones: each menu box sinks back and darkens as the next one slides over it
      mm.add('(max-width: 820px)', () => {
        const list = gsap.utils.toArray<HTMLElement>('.dock-box');
        list.forEach((box, i) => {
          const next = list[i + 1];
          if (!next) return;
          gsap.to(box, { scale: 0.93, '--dim': 0.28, ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top ' + (80 + (i + 1) * 10) + 'px', scrub: 0.5 } });
        });
      });

      // Section headings rise word by word out of a mask (Words renders the masks)
      gsap.utils.toArray<HTMLElement>('.head').forEach((head) => {
        unreveal(head);
        const tl = gsap.timeline({ scrollTrigger: { trigger: head, start: 'top 85%', toggleActions: 'play none none none' } });
        tl.from(head.querySelectorAll('.label'), { x: -16, opacity: 0, duration: 0.5, ease: 'power2.out' })
          .from(head.querySelectorAll('h2 .wm > span'), { yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.04 }, 0.05);
        const lede = head.querySelectorAll('.lede'); // the FAQ heading has none
        if (lede.length) tl.from(lede, { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.3);
      });

      // Facts: the glass cards rise in order as the section arrives (scroll-linked, no pop), the colour field drifts slower behind them.
      // The scroll moves the outer .fact; the pointer effects live on the inner .glass, so the two never fight over transform.
      const field = document.querySelector<HTMLElement>('.facts-field');
      if (field) {
        const cards = gsap.utils.toArray<HTMLElement>('.facts > .fact');
        const rise = gsap.timeline({ scrollTrigger: { trigger: field, start: 'top 95%', end: 'top 40%', scrub: 0.8 } });
        cards.forEach((c, i) => rise.fromTo(c, { y: 90, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', duration: 1 }, i * 0.15));
        gsap.fromTo('.flow-orbs', { '--py': '120px' }, { '--py': '-120px', ease: 'none', scrollTrigger: { trigger: '.flow-orbs', start: 'top bottom', end: 'bottom top', scrub: true } });
      }
      gsap.utils.toArray<HTMLElement>('.facts > .fact').forEach((fact) => {
        unreveal(fact);
        const strong = fact.querySelector('strong');
        const m = strong?.textContent?.match(/^(\D*)(\d+)(.*)$/);
        const tl = gsap.timeline({ scrollTrigger: { trigger: fact, start: 'top 80%', toggleActions: 'play none none none' } });
        if (strong && m && +m[2] > 0) {
          const o = { v: 0 };
          tl.to(o, { v: +m[2], duration: 1.1, ease: 'power3.out', onUpdate: () => { strong.textContent = m[1] + Math.round(o.v) + m[3]; } }, '<');
        }
      });

      // Product rows slide in, a few hundredths of a second apart when they arrive together
      const rows = gsap.utils.toArray<HTMLElement>('.index li');
      rows.forEach(unreveal);
      gsap.set(rows, { opacity: 0, y: 28 });
      rows.forEach((row, i) => {
        gsap.to(row, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: (i % 3) * 0.07, scrollTrigger: { trigger: row, start: 'top 92%', toggleActions: 'play none none none' } });
      });

      // Network section: the cards follow each other in
      const dark = document.querySelector<HTMLElement>('.section-dark');
      if (dark) {
        const cards = gsap.utils.toArray<HTMLElement>('.net-card');
        cards.forEach(unreveal);
        gsap.from(cards, { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: '.net', start: 'top 80%', toggleActions: 'play none none none' } });
      }

      // Moving-over steps: each block wipes in from the left
      const steps = gsap.utils.toArray<HTMLElement>('.steps li');
      steps.forEach(unreveal);
      gsap.from(steps, { clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'expo.inOut', stagger: 0.12, scrollTrigger: { trigger: '.steps', start: 'top 85%', toggleActions: 'play none none none' } });

      // Spotlight cards: copy and picture slide in; each card sinks back and darkens as the next one covers it
      const spots = gsap.utils.toArray<HTMLElement>('.spot');
      spots.forEach((spot) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: spot, start: 'top 80%', toggleActions: 'play none none none' } });
        tl.from(spot.querySelector('.spot-copy'), { y: 24, opacity: 0, duration: 0.6, ease: 'power2.out' });
        const art = spot.querySelector('.spot-art');
        if (art) tl.from(art, { x: 48, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0.1);
      });
      mm.add('(max-width: 1100px), (max-height: 759px)', () => {
        spots.forEach((spot, i) => {
          const next = spots[i + 1];
          if (!next) return;
          gsap.to(spot, { scale: 0.94, '--dim': 0.3, ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: () => 'top ' + (parseFloat(next.style.getPropertyValue('--stick')) || 80) + 'px', scrub: 0.5, invalidateOnRefresh: true } });
        });
      });
      mm.add('(min-width: 1101px) and (min-height: 760px)', () => {
        spots.forEach((spot, i) => {
          const next = spots[i + 1];
          if (!next) return;
          gsap.to(spot, { scale: 0.94, '--dim': 0.3, ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: () => 'top ' + (parseFloat(next.style.getPropertyValue('--stick')) || 88) + 'px', scrub: 0.5, invalidateOnRefresh: true } });
        });
      });
    });

    // Web fonts change heights; measure again once they are in
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => { window.removeEventListener('load', refresh); mm.revert(); ctx.revert(); };
  }, []);

  return null;
}
