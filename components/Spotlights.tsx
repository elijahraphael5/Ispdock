import { BrandScene } from './scenes/BrandScene';
import { PayScene } from './scenes/PayScene';
import { PortalScene } from './scenes/PortalScene';

const SPOTS = [
  { cls: '', label: 'Billing', title: 'Billing that runs itself.',
    lede: 'Invoices go out on each renewal date, payments land on the right bill and receipts are emailed. When a bill is due, the customer’s internet connection is suspended, and it comes back the moment they pay.',
    ticks: ['Monthly invoices, renewals and receipts, numbered and in your name.', 'A bill is marked paid only after the payment is confirmed.', 'Suspend and reconnect through RADIUS, with no one on your team lifting a finger.'],
    Scene: PayScene },
  { cls: ' spot-green', label: 'Customer portal', title: 'A portal your customers actually understand.',
    lede: 'No IP addresses, no jargon. Days left on their plan, what they owe, how much data they used and whether they are online. In real figures, in plain words.',
    ticks: ['Renew, change plan and pay in a few taps.', 'Chat with your team from any page.', 'Several connections under one account.'],
    Scene: PortalScene },
  { cls: ' spot-sun', label: 'Your brand', title: 'Your name on everything. Not ours.',
    lede: 'Staff sign in at admin.yourisp.com and customers at my.yourisp.com. Your logo and colours run through the dashboard, the portal, every email and every invoice.',
    ticks: ['Five layouts and five dashboard designs to choose from.', 'Light and dark mode.', 'Sign-in screens with your own pictures and words.'],
    Scene: BrandScene },
];

// Three coloured cards that stack while scrolling. Label in the rail, copy from column 4, picture from column 8.
export function Spotlights() {
  return (
    <section className="stack" aria-label="Highlights">
      {SPOTS.map(({ cls, label, title, lede, ticks, Scene }, i) => (
        <div key={label} className={'grid spot' + cls} style={{ ['--i' as string]: i }}>
          <p className="label rail">{label}<b aria-hidden="true">{String(i + 1).padStart(2, '0')}</b></p>
          <div className="spot-copy">
            <h2>{title}</h2>
            <p className="lede">{lede}</p>
            <ul className="ticks">{ticks.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div className="spot-art" aria-hidden="true"><Scene /></div>
        </div>
      ))}
    </section>
  );
}
