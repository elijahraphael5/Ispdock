import { Head } from './Head';
import { Globe } from './Globe';

const TOOLS = [
  ['Map', 'Network map and outages', 'Draw your POPs, splice points and fibre. Mark a cut and see exactly which customers are behind it, email them, and send a technician in one step.'],
  ['Fibre', 'Fibre and OLT monitoring', 'Huawei, ZTE and more over SNMP. Weak signal alarms per ONU, and Wi-Fi changes and reboots through TR-069.'],
  ['Diagnostics', 'Connection diagnostics', 'A health score for any customer with every reason listed: account, login, session, router, signal. And the next step to take.'],
  ['Hotspot', 'Hotspot vouchers', 'Sell time and data codes over the counter, through agents, or online with Paystack. Printed cards included.'],
  ['Fair use', 'Data caps and fair use', 'Slow down or cap heavy users by plan automatically, and lift it when they top up.'],
];

export function Network() {
  return (
    <section className="section section-dark has-globe" id="network">
      <div className="wrap grid">
        <Head label="Network · Enterprise" title="Know about a problem before your customers call." lede="As you grow, the network becomes the hard part. These tools come with Enterprise. RADIUS comes with every plan." />
        <div className="net">
          {TOOLS.map(([label, title, text]) => (
            <article className="net-card reveal" key={label}><span className="label">{label}</span><h3>{title}</h3><p>{text}</p></article>
          ))}
          <article className="net-card net-card-all reveal"><span className="label">Every plan</span><h3>RADIUS, on every plan</h3><p>PPPoE and static IP logins on MikroTik, suspended when a bill is overdue and reconnected the moment it is paid. Hotspot and MAC logins come with Enterprise.</p></article>
        </div>
      </div>
      <Globe />
    </section>
  );
}
