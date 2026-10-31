import { Head } from './Head';

const QA = [
  ["Does the customers' money go through ISPDock?", 'No. You connect your own Paystack, Monnify or OPay account, and payments go straight to you. ISPDock only bills you for the platform.'],
  ['Which routers does it work with?', 'MikroTik over RADIUS for PPPoE, static IP, hotspot and MAC logins, plus router monitoring over the RouterOS API. Other devices can be monitored by ping and ports. Fibre OLTs from Huawei and ZTE are supported in Enterprise.'],
  ['Can I keep my own domain?', 'Yes. Your staff and customers use addresses on your domain, such as admin.yourisp.com and my.yourisp.com. You add one record at your domain provider and we take care of the rest.'],
  ['What happens when I grow past my plan?', "You'll see your usage against the limit in your dashboard and can ask to move up from there. Above 5,000 customers we make a plan for you."],
  ['Is there a contract?', 'No. Plans are monthly. The setup fee is paid once and is not refunded, because it pays for the work of moving you in.'],
  ['Is my data backed up?', 'Yes. The database is backed up every day and a copy is kept off the server.'],
];

export function Faq() {
  return (
    <section className="section" id="faq">
      <div className="wrap grid">
        <Head label="FAQ" title="Questions" />
        <div className="faq col-main reveal">
          {QA.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </div>
    </section>
  );
}
