const FACTS = [
  ['12 tools', 'to run the whole ISP, from billing to stock, on every plan'],
  ['30 s', 'between router checks, with an alert the moment one stops answering'],
  ['1 RADIUS', 'for PPPoE, static IP and hotspot logins on your MikroTik routers'],
  ['2 weeks', 'to move you over, usually: customers, routers, addresses and staff'],
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
