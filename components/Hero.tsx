import { ContactLink } from './ContactLink';
import { Dashboard } from './Dashboard';
import { Typed } from './Typed';

// Each box names the dashboard part it breaks away from (ScrollMotion splits the dashboard into these on wide screens)
const BOXES = [
  { c: 'c-blue', side: 'left', src: '.ds-kpis > .tile:nth-child(2)', label: 'Customers', figure: '2,140 accounts', text: 'KYC, products and a diary for each one.' },
  { c: 'c-sun', side: 'left', src: '.tile-chart', label: 'Billing', figure: '₦197.8m invoiced', text: 'Invoices go out by themselves every month.' },
  { c: 'c-green', side: 'left', src: '.ds-row-b > .tile:first-child', label: 'Auto reconnect', figure: 'Paid = back online', text: 'When a bill is due the connection goes off, and it is back the moment they pay.' },
  { c: 'c-violet', side: 'right', src: '.ds-kpis > .tile:nth-child(4)', label: 'Support', figure: '12 open tickets', text: 'Chat, tickets and customer email in one place.' },
  { c: 'c-teal', side: 'right', src: '.ds-row:not(.ds-row-b) > .tile:last-child', label: 'Network', figure: 'Good · 96%', text: 'Routers, connections and outages, watched every minute.' },
  { c: 'c-coral', side: 'right', src: '.ds-row-b > .tile:last-child', label: 'Stock', figure: '438 devices', text: 'Routers and ONUs tracked by serial number.' },
];

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap grid">
        <p className="label rail reveal"><span className="dot"></span>For ISPs in Nigeria</p>
        <h1 className="hero-title reveal">
          <span className="sr-only">One dock for your billing, payments, customers, support and network.</span>
          <span aria-hidden="true">One dock for<br />your <Typed words={['billing.', 'payments.', 'customers.', 'support.', 'network.']} initial="whole ISP." /><span className="caret"></span></span>
        </h1>
        <div className="hero-copy reveal">
          <div className="cta-row">
            <ContactLink className="btn btn-primary">Book a demo <span className="arr" aria-hidden="true">→</span></ContactLink>
            <a className="btn btn-ghost" href="#pricing">See pricing</a>
          </div>
        </div>
      </div>

      <div className="dock-pin"><div className="wrap dock">
        <Dashboard />
        <svg className="dock-lines" aria-hidden="true"></svg>
        <ul className="dock-boxes" aria-label="What the dashboard connects to">
          {BOXES.map((b) => (
            <li key={b.label} className={'dock-box ' + b.c} data-side={b.side} data-src={b.src}>
              <span className="label">{b.label}</span><b>{b.figure}</b><p>{b.text}</p>
            </li>
          ))}
        </ul>
      </div></div>
    </section>
  );
}
