'use client';

import { useEffect, useRef, useState } from 'react';
import { naira, prefersStill } from '@/lib/site';

const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const INVOICED = [110.8, 113.9, 117.8, 117.0, 123.2, 127.1, 129.5, 132.6, 135.7, 139.6, 145.1, 150.5];
const COLLECTED = [100.6, 104.5, 107.6, 110.0, 113.9, 118.6, 120.9, 125.6, 127.9, 132.6, 138.8, 143.5];
const DOWN0 = [53.2, 59.5, 56.7, 64.4, 63.8, 66.2, 74.2, 74.0, 82.4, 83.5, 91.3, 98.7, 100.0, 94.1, 100.9, 105.9, 103.6, 95.5, 94.1, 96.0, 87.4, 95.6, 89.1, 92.9, 99.3, 106.2, 109.7, 104.0, 109.7, 108.2, 105.7, 108.0, 107.2, 110.0, 110.0, 110.0, 106.8, 108.1, 110.0, 108.5];
const UP0 = [90.5, 92.5, 89.5, 87.5, 90.1, 89.4, 89.1, 85.3, 83.1, 85.2, 80.4, 84.2, 85.0, 82.4, 85.9, 86.0, 90.6, 89.0, 86.3, 85.6, 81.8, 83.7, 81.7, 80.8, 80.0, 80.4, 77.0, 72.6, 72.8, 71.2, 75.6, 73.6, 72.1, 67.2, 64.0, 66.1, 67.3, 65.6, 70.3, 70.7];
const NAV: [string, string][] = [
  ['Dashboard', 'M4 4h7v7H4z M13 4h7v4h-7z M13 10h7v10h-7z M4 13h7v7H4z'],
  ['Customers', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 4-6 8-6s8 2 8 6'],
  ['Billing', 'M6 3h9l3 3v15H6z M9 9h6 M9 13h6'],
  ['Payments', 'M3 7h18v10H3z M3 11h18'],
  ['Support', 'M4 5h16v11H8l-4 4z'],
  ['Network', 'M3 12h4l3-7 4 14 3-7h4'],
  ['Stock', 'M3 8l9-5 9 5v8l-9 5-9-5z'],
  ['Settings', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M4 12h2 M18 12h2 M12 4v2 M12 18v2'],
];
const METHODS = ['Bank transfer', 'Card', 'USSD', 'OPay', 'Monnify', 'Card', 'Bank transfer'];
const PRICES = [9000, 12500, 15000, 18000, 22500, 30000, 45000];
const AGES = ['Just now', '1 min ago', '3 min ago', '5 min ago', '8 min ago'];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

type Pay = { id: number; customer: string; method: string; amount: number; fresh?: boolean };
const PAYS0: Pay[] = [
  { id: 1, customer: 'CUS-2041', method: 'Bank transfer', amount: 15000 },
  { id: 2, customer: 'CUS-1187', method: 'Card', amount: 22500 },
  { id: 3, customer: 'CUS-0954', method: 'USSD', amount: 9000 },
  { id: 4, customer: 'CUS-1630', method: 'OPay', amount: 18000 },
];
const AGES0 = ['Just now', '2 min ago', '6 min ago', '11 min ago'];

const points = (arr: number[]) => arr.map((y, i) => (i * 300 / (arr.length - 1)).toFixed(1) + ',' + y.toFixed(1)).join(' ');
const walk = (arr: number[], lo: number, hi: number) => {
  const last = arr[arr.length - 1];
  return arr.slice(1).concat(Math.min(hi, Math.max(lo, last + (Math.random() - 0.5) * 16)));
};

// The example dashboard in the hero. Today's date, new payments, customers online and traffic keep moving while it is on screen.
export function Dashboard() {
  const ref = useRef<HTMLElement>(null);
  const [today, setToday] = useState('Friday, 31 October');
  const [live, setLive] = useState({ down: DOWN0, up: UP0, online: 1764, collected: 18412500, pays: PAYS0, ages: AGES0, beat: 0 });

  useEffect(() => {
    setToday(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }));
    const device = ref.current;
    if (!device || prefersStill()) return;
    let timer: ReturnType<typeof setInterval> | null = null, nextId = 100;
    const tick = () => setLive((s) => {
      const beat = s.beat + 1, n = { ...s, beat, down: walk(s.down, 22, 108), up: walk(s.up, 60, 112) };
      if (beat % 2 === 0) n.online = Math.max(1700, Math.min(1830, s.online + Math.round((Math.random() - 0.48) * 6)));
      if (beat % 3 === 0) {
        const amount = pick(PRICES);
        const row: Pay = { id: nextId++, customer: 'CUS-' + String(1000 + Math.floor(Math.random() * 1400)).padStart(4, '0'), method: pick(METHODS), amount, fresh: true };
        n.pays = [row, ...s.pays.map((p) => ({ ...p, fresh: false }))].slice(0, 4);
        n.ages = AGES.slice(0, 4);
        n.collected = s.collected + amount;
      }
      return n;
    });
    const io = new IntersectionObserver((e) => {
      if (e[0].isIntersecting && !timer) timer = setInterval(tick, 1000);
      else if (!e[0].isIntersecting && timer) { clearInterval(timer); timer = null; }
    }, { threshold: 0.2 });
    io.observe(device);
    return () => { io.disconnect(); if (timer) clearInterval(timer); };
  }, []);

  const downPts = points(live.down), dy = live.down[live.down.length - 1], uy = live.up[live.up.length - 1];
  const moved = live.beat > 0;

  return (
    <figure className="device" aria-label="The ISPDock dashboard" ref={ref}>
      <div className="device-bar"><i></i><i></i><i></i><span>admin.yourisp.com</span></div>
      <div className="dash" aria-hidden="true">
        <aside className="dash-side">
          <div className="ds-brand"><b></b><span>Your ISP</span></div>
          <p className="ds-sec">Main menu</p>
          <ul className="ds-nav">
            {NAV.map(([label, d], i) => <li key={label} className={i === 0 ? 'on' : undefined}><svg viewBox="0 0 24 24"><path d={d} /></svg><span>{label}</span></li>)}
          </ul>
          <div className="ds-user"><b>AO</b><span>Admin<small>Super admin</small></span></div>
        </aside>
        <div className="dash-main">
          <div className="ds-top">
            <div className="ds-title"><strong>Dashboard</strong><small>{today}</small></div>
            <span className="ds-search">Search customers <kbd>⌘K</kbd></span>
            <span className="ds-bell"><svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z M10 20h4" /></svg><i>3</i></span>
            <span className="ds-avatar">AO</span>
          </div>
          <div className="ds-welcome"><div><small>Good morning, Admin</small><b>Here is your company today.</b></div><span className="chip chip-ghost">Add customer</span><span className="chip">Create invoice</span></div>
          <div className="ds-kpis">
            <div className="tile tile-hero"><small>Collected this month</small><strong>{naira(live.collected)}</strong><em><span className="up">▲ 6.2%</span> vs September · 1,982 of 2,140 paid</em></div>
            <div className="tile"><small><span className="live"></span>Online now</small><strong>{live.online.toLocaleString('en-NG')}</strong><em>Fibre 1,102 · Radio 662</em></div>
            <div className="tile"><small>Outstanding</small><strong>₦2.1m</strong><em>158 invoices · 41 overdue</em></div>
            <div className="tile"><small>Open tickets</small><strong>12</strong><em><span className="down">3 past due</span> · 2 unassigned</em></div>
          </div>
          <div className="ds-row">
            <div className="tile tile-chart">
              <div className="tile-head"><small>Cashflow · last 12 months</small><span className="legend"><i className="l-inv"></i>Invoiced <i className="l-col"></i>Collected</span></div>
              <svg className="cf" viewBox="0 0 600 190" preserveAspectRatio="none" aria-hidden="true">
                <g className="cf-grid">{[10, 49, 88, 127, 166].map((y) => <line key={y} x1="0" x2="600" y1={y} y2={y} />)}</g>
                {MONTHS.map((m, i) => (
                  <g key={m}>
                    <rect className="cf-inv" x={9 + i * 50} y={166 - INVOICED[i]} width="15" height={INVOICED[i]} />
                    <rect className="cf-col" x={26 + i * 50} y={166 - COLLECTED[i]} width="15" height={COLLECTED[i]} />
                    <text x={24 + i * 50} y="184" textAnchor="middle">{m}</text>
                  </g>
                ))}
              </svg>
              <div className="tile-foot"><span>Invoiced this year <b>₦197.8m</b></span><span>Collected <b>₦185.2m</b></span></div>
            </div>
            <div className="tile">
              <div className="tile-head"><small>Network health</small><b className="ok-word">Good · 96%</b></div>
              <div className="meter"><span style={{ width: '96%' }}></span></div>
              <ul className="routers">
                <li><i className="st-ok"></i>Ikeja POP<span>CPU 23%</span></li>
                <li><i className="st-ok"></i>Lekki POP<span>CPU 41%</span></li>
                <li><i className="st-ok"></i>Yaba tower<span>CPU 18%</span></li>
                <li><i className="st-warn"></i>Ajah cabinet<span>Slow · 380 ms</span></li>
              </ul>
            </div>
          </div>
          <div className="ds-row ds-row-b">
            <div className="tile">
              <div className="tile-head"><small>Recent payments</small><span className="tag-live">Live</span></div>
              <table className="pays">
                <thead><tr><th>Customer</th><th>Method</th><th>Amount</th><th>When</th></tr></thead>
                <tbody>
                  {live.pays.map((p, i) => <tr key={p.id} className={p.fresh ? 'new' : undefined}><td>{p.customer}</td><td>{p.method}</td><td>{naira(p.amount)}</td><td>{live.ages[i]}</td></tr>)}
                </tbody>
              </table>
            </div>
            <div className="tile">
              <div className="tile-head"><small>Live traffic</small><span className="legend"><i className="l-col"></i><b>{moved ? Math.round((120 - dy) * 6.2) : 412}</b> Mbps down <i className="l-up"></i><b>{moved ? Math.round((120 - uy) * 3.4) : 146}</b> up</span></div>
              <svg className="tr" viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true">
                <g className="cf-grid"><line x1="0" x2="300" y1="30" y2="30" /><line x1="0" x2="300" y1="60" y2="60" /><line x1="0" x2="300" y1="90" y2="90" /></g>
                <polygon className="tr-fill" points={'0,120 ' + downPts + ' 300,120'} />
                <polyline className="tr-down" points={downPts} />
                <polyline className="tr-up" points={points(live.up)} />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">An example ISPDock dashboard: money collected this month, customers online, outstanding invoices, open tickets, a 12-month cashflow chart, network health per router, recent payments and live traffic. Figures are illustrative.</figcaption>
    </figure>
  );
}
