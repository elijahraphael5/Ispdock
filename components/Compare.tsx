import { Head } from './Head';

const OTHERS = [
  ['Sonar', 'https://sonar.software/pricing', '₦1,000 – ₦1,666', '$500 a month minimum, contract, payments are an add-on.'],
  ['Splynx', 'https://splynx.com/compare/sonar-vs-splynx/', '₦220 – ₦733', 'Falls as you grow. Add-ons extra.'],
  ['Centipid', 'https://docs.centipidbilling.com/reference/pricing', '₦333', 'PPPoE. Hotspot is 3% of hotspot revenue instead.'],
];

export function Compare() {
  return (
    <section className="section" id="compare">
      <div className="wrap grid">
        <Head label="Compare" title="What ISP software costs per customer." lede="Published prices, converted at ₦1,333 to the dollar. Checked October 2026." />
        <div className="table-wrap col-main reveal">
          <table className="cmp">
            <caption className="sr-only">Monthly price per active customer</caption>
            <thead><tr><th scope="col">Platform</th><th scope="col">Per customer a month</th><th scope="col">Worth knowing</th></tr></thead>
            <tbody>
              <tr className="us"><th scope="row">ISPDock</th><td><b>₦75 – ₦150</b></td><td>Billed in naira. Local payments included. No contract or minimum.</td></tr>
              {OTHERS.map(([name, href, price, note]) => (
                <tr key={name}><th scope="row"><a href={href} rel="noopener" target="_blank">{name}</a></th><td>{price}</td><td>{note}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="fine col-text reveal">ISPDock per-customer figures are each plan&apos;s price at its customer limit. Other prices are as published by each company on the date above and may have changed; follow the links for current prices.</p>
      </div>
    </section>
  );
}
