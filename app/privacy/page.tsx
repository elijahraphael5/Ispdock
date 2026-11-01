import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/components/LegalPage';
import { COMPANY, CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy policy — ISPDock',
  description: 'How ISPDock, a product of Metasoft Limited, collects, uses and protects personal data.',
};

const mail = <a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a>;

const sections: LegalSection[] = [
  {
    id: 'who', title: 'Who we are',
    body: (
      <>
        <p>ISPDock is a product of {COMPANY.legalName}, a company registered in Nigeria ({COMPANY.rc}) (&ldquo;Metasoft&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). This policy explains how we handle personal data when you visit ispdock.com, contact us, or use the ISPDock platform (the company dashboard, the customer portal and related apps).</p>
        <p>We follow the Nigeria Data Protection Act 2023 (NDPA) and the rules of the Nigeria Data Protection Commission (NDPC). Questions about this policy or your data: {mail}.</p>
      </>
    ),
  },
  {
    id: 'roles', title: 'Our two roles',
    body: (
      <>
        <p><b>We are the data controller</b> for data about visitors to this website, people who contact us or book a demo, and the internet service providers (&ldquo;companies&rdquo;) that subscribe to ISPDock and their staff users.</p>
        <p><b>We are a data processor</b> for data about each company&rsquo;s own customers (their subscribers). The company decides why and how that data is used and is the controller of it; we store and process it only to run the platform for that company, on its instructions. If you are a customer of an internet provider that uses ISPDock, please contact your provider first about your data. We will help them answer you.</p>
      </>
    ),
  },
  {
    id: 'collect', title: 'What we collect',
    body: (
      <>
        <p><b>Website visitors.</b> Our servers record basic technical data with each request (IP address, browser type, the page asked for, date and time) to keep the site running and secure. The site sets no cookies and uses no tracking or advertising tools (see our <a href="/cookies">cookie policy</a>).</p>
        <p><b>People who contact us.</b> What you send us: your name, email address, phone number, company and message. Demo bookings are made through Calendly, which collects the details you enter there under its own privacy policy and passes them to us.</p>
        <p><b>Companies and their staff.</b> Company name and registration details, addresses, contact and billing details, and for each staff user their name, email address, phone number, role, password (stored only as a one-way hash), two-step sign-in settings, sign-in times and the actions they take in the dashboard (kept in an audit log).</p>
        <p><b>Payments to us.</b> Invoices and payment records for the subscription. Card and bank payments are taken by our payment provider; we never see or store full card numbers.</p>
        <p><b>Data we process for companies</b> (as processor): their customers&rsquo; names, contact details, addresses and location, identity documents provided for verification, plans, invoices, payments, connection and usage records, equipment details, support tickets and chats, and messages the company sends them.</p>
      </>
    ),
  },
  {
    id: 'use', title: 'Why we use it, and on what legal basis',
    body: (
      <ul>
        <li><b>To provide the platform and our services</b> to the company that subscribed: performance of a contract.</li>
        <li><b>To bill for the service</b> and keep financial records: performance of a contract and legal obligation (tax and accounting law).</li>
        <li><b>To keep the platform secure</b> (sign-in protection, audit logs, fraud and abuse prevention, backups): legitimate interests, and our duty under the NDPA to protect data.</li>
        <li><b>To reply to you and arrange demos</b>: legitimate interests, or steps you asked for before a contract.</li>
        <li><b>To send service messages</b> (security alerts, invoices, changes to these terms): performance of a contract and legal obligation.</li>
        <li><b>To improve the product</b> using aggregated, non-identifying figures: legitimate interests.</li>
        <li><b>Optional marketing emails</b>, only with your consent, which you can withdraw at any time.</li>
      </ul>
    ),
  },
  {
    id: 'share', title: 'Who we share it with',
    body: (
      <>
        <p>We do not sell personal data. We share it only with service providers who help us run ISPDock, under contracts that require them to protect it and use it only for us. Depending on how a company sets up its account, these can include:</p>
        <ul>
          <li>server hosting, file storage and off-site backup providers;</li>
          <li>email delivery and SMS providers;</li>
          <li>payment providers (for example Paystack, Flutterwave, Monnify or OPay; payments a company&rsquo;s customers make go through that company&rsquo;s own account with the provider);</li>
          <li>map providers (OpenStreetMap, or Google Maps if a company connects its own key);</li>
          <li>alert channels a company connects (such as Telegram or Slack), and Calendly for demo bookings.</li>
        </ul>
        <p>We may also disclose data when the law requires it, to protect rights, safety or security, or as part of a merger or sale of the business (the buyer would be bound by this policy). We will tell you about such a transfer where the law requires it.</p>
      </>
    ),
  },
  {
    id: 'transfers', title: 'Transfers outside Nigeria',
    body: <p>Some of our service providers store or process data outside Nigeria. When that happens we rely on the grounds the NDPA allows, such as an adequate level of protection in the receiving country, contractual safeguards, or your consent, and we take steps to keep the data protected to the standard of this policy.</p>,
  },
  {
    id: 'retention', title: 'How long we keep it',
    body: (
      <>
        <p>We keep personal data only as long as we need it for the purposes above or the law requires. As a guide:</p>
        <ul>
          <li>company and staff account data: while the account is open, then up to six months after it closes (so it can be exported or restored), unless the company asks us to delete it sooner;</li>
          <li>invoices and payment records: up to six years, as tax and accounting law requires;</li>
          <li>audit logs and change history: up to two years; in-app notifications: 90 days;</li>
          <li>connection records processed for companies: up to about 13 months;</li>
          <li>backups: deleted on a rolling basis, generally within 30 days;</li>
          <li>enquiries and demo requests: up to two years after the last contact.</li>
        </ul>
        <p>Data we process for a company is deleted or returned when the company asks or when its subscription ends, as set out in our <a href="/terms">terms of service</a>.</p>
      </>
    ),
  },
  {
    id: 'security', title: 'How we protect it',
    body: <p>We use encrypted connections (HTTPS), one-way hashing for passwords, encryption for stored secrets such as payment keys, optional two-step sign-in, role-based access so staff see only what their role allows, separation between companies at the database level, audit logs of staff actions, and regular backups. No system is perfectly secure; if a breach puts your rights at risk we will notify the NDPC within 72 hours where the law requires it, and tell the companies and people affected without undue delay.</p>,
  },
  {
    id: 'rights', title: 'Your rights',
    body: (
      <>
        <p>Under the NDPA you can ask us to: tell you what data we hold about you and give you a copy; correct it; delete it; restrict or object to how we use it; move it to another provider in a common format; and not be subject to decisions made only by automated means that significantly affect you. Where we rely on consent you can withdraw it at any time.</p>
        <p>Email {mail}. We may need to confirm who you are first. We reply within 30 days. If you are not satisfied, you can complain to the Nigeria Data Protection Commission (ndpc.gov.ng).</p>
        <p>If your data is held by an internet provider that uses ISPDock, send your request to that provider; we will help them deal with it.</p>
      </>
    ),
  },
  {
    id: 'children', title: 'Children',
    body: <p>ISPDock is a business service and is not meant for anyone under 18. We do not knowingly collect children&rsquo;s data for our own purposes. A company may hold data about customers of any age; it is responsible for having a lawful basis for that.</p>,
  },
  {
    id: 'changes', title: 'Changes to this policy',
    body: <p>We may update this policy. The date at the top shows the latest version. If a change is significant we will tell companies by email or in the dashboard before it takes effect.</p>,
  },
  {
    id: 'contact', title: 'Contact',
    body: <p>{COMPANY.legalName} ({COMPANY.rc}), owner of ISPDock. Email: {mail}.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      path="/privacy"
      title="Privacy policy"
      intro={<p className="lede">What personal data ISPDock collects, why, who sees it, how long we keep it, and the rights you have over it.</p>}
      sections={sections}
    />
  );
}
