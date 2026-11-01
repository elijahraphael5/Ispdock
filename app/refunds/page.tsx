import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/components/LegalPage';
import { COMPANY, CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Refund policy — ISPDock',
  description: 'When payments for ISPDock are and are not refunded.',
};

const mail = <a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a>;

const sections: LegalSection[] = [
  {
    id: 'scope', title: 'What this covers',
    body: <p>This policy covers payments companies make to {COMPANY.legalName} ({COMPANY.rc}) for ISPDock: the monthly subscription and the one-off setup fee. It does not cover payments that an internet provider&rsquo;s own customers make to that provider through ISPDock. That money goes to the provider, and the provider&rsquo;s own refund policy applies; please contact your provider.</p>,
  },
  {
    id: 'monthly', title: 'Monthly subscription',
    body: (
      <ul>
        <li>Subscriptions are paid monthly in advance and are not refunded, in full or in part, including for a month you stop using part-way through.</li>
        <li>You can cancel at any time. Nothing more is charged after you cancel, and the service stays available until the end of the month you have paid for.</li>
        <li>Moving to a smaller plan takes effect from your next billing month.</li>
      </ul>
    ),
  },
  {
    id: 'setup', title: 'Setup (installation) fee',
    body: <p>The one-off setup fee is not refundable. It pays for work done for you as soon as you join: moving your customers in, connecting your equipment, setting up your addresses and email, and training your staff.</p>,
  },
  {
    id: 'exceptions', title: 'When we do refund',
    body: (
      <>
        <p>We refund in full:</p>
        <ul>
          <li>a payment taken twice for the same invoice;</li>
          <li>an amount we charged by mistake, or more than your invoice said;</li>
          <li>a charge made after you had cancelled in time.</li>
        </ul>
        <p>If we end the agreement without you being at fault, or stop offering ISPDock altogether, we refund the unused part of any period you have paid for in advance.</p>
      </>
    ),
  },
  {
    id: 'how', title: 'How to ask for a refund',
    body: <p>Email {mail} within 30 days of the payment, with your company name and the invoice number. We reply within 5 business days. Approved refunds are paid to the account or card you paid from, usually within 14 business days; your bank may take longer to show it.</p>,
  },
  {
    id: 'rights', title: 'Your legal rights',
    body: <p>Nothing in this policy takes away rights you have under Nigerian law, including the Federal Competition and Consumer Protection Act 2018.</p>,
  },
];

export default function RefundsPage() {
  return (
    <LegalPage
      path="/refunds"
      title="Refund policy"
      intro={<p className="lede">Plans are monthly with no contract. You can cancel any time; what you have already paid is not refunded, except for the mistakes listed below.</p>}
      sections={sections}
    />
  );
}
