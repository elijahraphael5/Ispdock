const FACTS = [
  ['₦150', 'per customer a month, our standard rate'],
  ['7 ways', 'to get paid: card, transfer, USSD, Monnify, OPay, bank account, cash desk'],
  ['2 addresses', 'yours: admin. for staff and my. for customers'],
  ['0', 'contracts and minimums'],
];

export function Facts() {
  return (
    <section className="section-sm" aria-label="At a glance">
      <div className="wrap grid facts">
        {FACTS.map(([n, t]) => <div className="reveal" key={t}><strong>{n}</strong><span>{t}</span></div>)}
      </div>
    </section>
  );
}
