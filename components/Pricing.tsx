'use client';

import { useEffect, useRef, useState } from 'react';
import { CONTACT, PLANS, naira, prefersStill } from '@/lib/site';
import { ContactLink } from './ContactLink';
import { Head } from './Head';

const MIN = 50, MAX = 6000;
const CARDS = [
  { key: 'starter', name: 'Starter', for: 'For small ISPs getting started.', price: '₦45,000', items: ['Up to 300 customers', '5 staff logins · 3 routers', 'Every business tool'], no: 'Network tools: Enterprise only' },
  { key: 'growth', name: 'Growth', for: 'For growing ISPs with fibre or several areas.', price: '₦150,000', items: ['Up to 2,000 customers', '25 staff logins · 15 routers', 'Every business tool'], no: 'Network tools: Enterprise only' },
  { key: 'enterprise', name: 'Enterprise', for: 'For large ISPs that run their own network.', price: '₦450,000', items: ['Up to 5,000 customers', 'Unlimited staff and routers', 'Every business tool, plus the network tools', 'Fibre and OLTs, network map, hotspot vouchers, data caps, diagnostics'], pick: true },
];

// Plan calculator: smallest plan that fits, and what it costs per customer. Enterprise stays lit above its limit too;
// the outline never falls back to a smaller plan.
export function Pricing() {
  const [n, setN] = useState(2500);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const plan = PLANS.find((p) => n <= p.limit);
  const ent = PLANS[PLANS.length - 1];
  const lit = (plan || ent).key;

  // This section re-renders as the slider moves, so its cards (data-self) reveal themselves instead of being left to ScrollMotion
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersStill()) { setSeen(true); return; }
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const rv = (c: string) => c + ' reveal' + (seen ? ' in' : '');

  return (
    <section className="section" id="pricing" ref={ref}>
      <div className="wrap grid">
        <Head label="Pricing" title="Simple plans. Priced in naira." lede="Monthly, per company, before 7.5% VAT. No contract and no minimum term." />
        <div className={rv('calc col-main')} data-self aria-labelledby="calcLabel">
          <label id="calcLabel" htmlFor="custCount">How many customers do you have?</label>
          <div className="calc-row">
            <input type="range" id="custCount" min={MIN} max={MAX} step={50} value={n} aria-describedby="calcOut"
              onChange={(e) => setN(Number(e.target.value))} style={{ ['--fill' as string]: ((n - MIN) / (MAX - MIN) * 100) + '%' }} />
            <output id="custOut" htmlFor="custCount">{n.toLocaleString('en-NG')}</output>
          </div>
          <p id="calcOut" className="calc-out" aria-live="polite">
            {!plan ? (
              <><b>Enterprise</b>, with a plan made for your size above 5,000 customers. <a href={CONTACT}>Talk to us</a>.</>
            ) : (
              <><b>{plan.name}</b> at {naira(plan.price)} a month: about <b>{naira(plan.price / n)} per customer</b>
                {plan.key !== 'enterprise' ? <>. With the network tools, <b>Enterprise</b> is about <b>{naira(ent.price / n)} per customer</b>.</> : ', network tools included.'}</>
            )}
          </p>
        </div>

        <div className="plans col-main has-fit">
          <div className="orbs plans-orbs" aria-hidden="true"><i /><i /><i /></div>
          {CARDS.map((c) => (
            <article key={c.key} className={rv('plan' + (c.pick ? ' plan-pick' : '') + (lit === c.key ? ' is-fit' : ''))} data-plan={c.key} data-self>
              {c.pick ? <span className="plan-tag">Recommended</span> : null}
              <div className="glass plan-pane">
                <i className="glass-lens" aria-hidden="true" />
                <i className="glass-sheen" aria-hidden="true" />
                <i className="glass-rim" aria-hidden="true" />
                <h3>{c.name}</h3>
                <p className="plan-for">{c.for}</p>
                <p className="price"><strong>{c.price}</strong><span>/month</span></p>
                <span className="fit">Fits your size</span>
                <ul className="ticks">
                  {c.items.map((t) => <li key={t}>{t}</li>)}
                  {c.no ? <li className="no">{c.no}</li> : null}
                </ul>
                <ContactLink className={'btn btn-block ' + (c.pick ? 'btn-primary' : 'btn-ghost')}>Start with {c.name}</ContactLink>
              </div>
            </article>
          ))}
        </div>
        <p className={rv('fine col-text')} data-self>One-off setup of ₦500,000 on every plan (non-refundable): we move your customers in, connect your routers, set up your addresses and company email, and train your staff. More than 5,000 customers? We&apos;ll make a plan for you.</p>
      </div>
    </section>
  );
}
