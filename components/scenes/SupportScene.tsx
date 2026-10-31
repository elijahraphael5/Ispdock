'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { $, $$, count } from '@/lib/scene';
import { useScene } from './useScene';

const ROWS = [
  { who: 'Ada Okafor', what: 'My internet is slow since morning', tag: 'Chat' },
  { who: 'Musa Bello', what: 'Re: Invoice INV-2026-0412', tag: 'Email' },
  { who: 'Grace Eze', what: 'Router light is blinking red', tag: 'Ticket' },
];

// Chats, emails and tickets land in one inbox; the first one opens, the agent replies and it is resolved and rated.
function setup(sc: HTMLDivElement) {
  const rows = $$(sc, '.su-row'), sel = $(sc, '.su-sel'), open = $(sc, '.su-count'), thread = $(sc, '.su-thread');
  const ask = $(sc, '.su-ask'), typing = $(sc, '.su-typing'), dots = $$(sc, '.su-typing i'), reply = $(sc, '.su-reply');
  const state = $(sc, '.su-state'), toast = $(sc, '.su-toast'), head = $(sc, '.su-head'), inbox = $(sc, '.su-inbox');
  return () => {
    gsap.set([thread, toast, sel], { autoAlpha: 0 });
    gsap.set([ask, reply], { autoAlpha: 0, y: 10 });
    gsap.set(typing, { autoAlpha: 0 });
    state.textContent = 'Open'; state.classList.remove('done');
    open.textContent = '0';
    const c1 = count(open, 0, 3, String), c2 = count(open, 3, 2, String);
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(inbox, { y: 18, opacity: 0, duration: 0.5, ease: 'power3.out' })
      .from(head, { y: 10, opacity: 0, duration: 0.4, ease: 'power3.out' }, 0.1)
      .from(rows, { x: -30, opacity: 0, duration: 0.5, stagger: 0.25, ease: 'expo.out' }, 0.2)
      .to(c1.target, { duration: 0.9, ease: 'power2.out', ...c1.vars }, 0.2)
      .to(sel, { autoAlpha: 1, duration: 0.3 }, '+=0.3')
      .to(rows[0], { x: 6, duration: 0.15, yoyo: true, repeat: 1 }, '<')
      .to(thread, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'expo.out' }, '+=0.1')
      .to(ask, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' })
      .to(typing, { autoAlpha: 1, duration: 0.2 }, '+=0.3')
      .to(dots, { y: -4, duration: 0.22, yoyo: true, repeat: 5, stagger: 0.1, ease: 'sine.inOut' })
      .to(typing, { autoAlpha: 0, duration: 0.15 })
      .to(reply, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' })
      .call(() => { state.textContent = 'Resolved'; state.classList.add('done'); }, undefined, '+=0.6')
      .fromTo(state, { scale: 1.25 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }, '<')
      .to(c2.target, { duration: 0.4, ...c2.vars }, '<')
      .to(rows[0], { opacity: 0.45, duration: 0.4 }, '<')
      .to(toast, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'expo.out' }, '+=0.2')
      .to({}, { duration: 2.4 })
      .to([inbox, sel, thread, toast], { opacity: 0, duration: 0.45 })
      .set([inbox, head, ...rows], { opacity: 1, x: 0, y: 0 });
    return tl;
  };
}

export function SupportScene() {
  const ref = useRef<HTMLDivElement>(null);
  useScene(ref, setup);
  return (
    <div className="scene-box"><div className="scene support" ref={ref}>
      <div className="su-inbox">
        <div className="su-head"><b>Inbox</b><span><b className="su-count">3</b> open</span></div>
        <div className="su-list">
          <i className="su-sel"></i>
          {ROWS.map((r) => (
            <div className="su-row" key={r.who}>
              <i>{r.who.split(' ').map((w) => w[0]).join('')}</i>
              <b>{r.who}</b><span>{r.what}</span><em>{r.tag}</em>
            </div>
          ))}
        </div>
      </div>
      <div className="su-thread" style={{ transform: 'translateX(20px)' }}>
        <div className="su-thread-head"><small>Ada Okafor · Chat</small><em className="su-state">Open</em></div>
        <p className="su-ask">My internet is slow since morning.</p>
        <p className="su-typing"><i></i><i></i><i></i></p>
        <p className="su-reply">We found it: a busy link in your area. It is fixed now, try again.</p>
      </div>
      <div className="su-toast"><i></i>Resolved in 4 minutes<br /><span>Ada rated it 5 out of 5</span></div>
    </div></div>
  );
}
