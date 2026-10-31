import { Head } from './Head';

const STEPS = [
  ['Bring your customer list', 'Send us your spreadsheet. Your customers and their plans come across in one import.'],
  ['Connect your routers', 'We connect your MikroTik routers to ISPDock and give you the exact commands to paste in.'],
  ['Your addresses and email', 'admin., my. and mail. on your own domain, with the records to add listed for you.'],
  ['Train your team, then send logins', 'Your staff learn it first. Then every customer gets their portal login in one go.'],
];

export function MoveOver() {
  return (
    <section className="section section-accent" id="move">
      <div className="wrap grid">
        <Head label="Moving over" title="We move you in. You keep working." lede="Four steps, done with you, usually within two weeks. Your customers notice one thing: a better portal." />
        <ol className="steps">
          {STEPS.map(([title, text], i) => <li className="reveal" key={title}><span className="ix-n">Step {i + 1}</span><b>{title}</b><span>{text}</span></li>)}
        </ol>
      </div>
    </section>
  );
}
