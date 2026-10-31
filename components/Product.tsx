import { Head } from './Head';

const TOOLS: [string, string, string[]][] = [
  ['Billing and invoices', 'Monthly invoices, renewals, credit notes, quotations and statements, numbered and branded for you.', ['Invoices', 'Renewals', 'PDF']],
  ['Every way to pay', 'Card, bank transfer, USSD, Monnify, OPay, a personal bank account per customer, and a cash desk with two-person approval.', ['Paystack', 'Monnify', 'OPay']],
  ['Accounting', 'Double-entry books that post themselves from invoices and payments. Exports to QuickBooks, Xero and Zoho.', ['Ledger', 'VAT', 'Reports']],
  ['Customer portal', 'Customers see their plan, bills, data used and connection in plain words. They pay, renew and ask for help themselves.', ['my.yourisp.com']],
  ['Support and chat', "Live chat, tickets, email to ticket, a help centre and the customer's whole history next to every conversation.", ['Chat', 'Tickets', 'Email']],
  ['Technician jobs', 'Installs and repairs on a dispatch board, a phone view for engineers with photos and signatures, even offline.', ['Dispatch', 'Field app']],
  ['Stock', "Routers and ONUs by serial number, from the warehouse to the van to the customer's home, valued in your books.", ['Serials', 'Vans', 'Value']],
  ['Broadcasts and portal ads', "Email, SMS and WhatsApp campaigns, plus a slider on your customers' dashboard for offers and news.", ['Email', 'SMS', 'WhatsApp']],
  ['Zones and partners', 'Split staff by area and pay franchise partners commission on the customers in their zones, worked out for you.', ['Areas', 'Commission']],
  ['Company email', 'noreply@, support@ and staff mailboxes on your own domain, with webmail. Invoices and receipts go out under your name.', ['Your domain', 'Webmail']],
  ['Router monitoring', 'Every router and switch checked every 30 seconds, with graphs, and an alert in Telegram or Slack when one stops answering.', ['30 s checks', 'Alerts']],
  ['API and webhooks', 'Read customers, invoices and payments from your own tools, and get told the moment an invoice is paid.', ['REST', 'Webhooks']],
];

export function Product() {
  return (
    <section className="section" id="product">
      <div className="wrap grid">
        <Head label="Product · 12 tools" title="Everything outside the network." muted="Already included." lede="Every plan runs the whole business, so you never outgrow us because billing or accounting is missing." />
        <ol className="index">
          {TOOLS.map(([title, text, tags], i) => (
            <li className="reveal" key={title}>
              <span className="ix-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="ix-tags">{tags.map((t, k) => <span key={t}>{k ? <br /> : null}{t}</span>)}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
