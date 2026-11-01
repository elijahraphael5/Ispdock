import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/components/LegalPage';
import { COMPANY, CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of service — ISPDock',
  description: 'The terms on which Metasoft Limited provides the ISPDock platform to internet service providers.',
};

const mail = <a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a>;

const sections: LegalSection[] = [
  {
    id: 'agreement', title: 'The agreement',
    body: (
      <>
        <p>These terms are an agreement between {COMPANY.legalName} ({COMPANY.rc}) (&ldquo;Metasoft&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), which owns and runs ISPDock, and the business that signs up for it (&ldquo;you&rdquo;, the &ldquo;company&rdquo;). They cover the ISPDock platform: the company dashboard, the customer portal, the apps and the related services (together, the &ldquo;service&rdquo;).</p>
        <p>By creating an account, paying an invoice or using the service you accept these terms, our <a href="/privacy">privacy policy</a>, <a href="/refunds">refund policy</a> and <a href="/cookies">cookie policy</a>. If you accept for a business, you confirm you are allowed to bind it. If a separate written agreement signed by both sides says something different, that agreement wins.</p>
      </>
    ),
  },
  {
    id: 'eligibility', title: 'Who can use ISPDock',
    body: <p>The service is for businesses, mainly internet service providers. You must be at least 18 and give accurate details about your business. You are responsible for holding any licence or registration your own business needs (for example from the Nigerian Communications Commission).</p>,
  },
  {
    id: 'accounts', title: 'Accounts and security',
    body: (
      <ul>
        <li>You decide who on your team gets a login and what each role can do, and you are responsible for what happens under your logins.</li>
        <li>Keep passwords private, use two-step sign-in where you can, and remove access for people who leave.</li>
        <li>Tell us at once at {mail} if you think an account has been misused.</li>
      </ul>
    ),
  },
  {
    id: 'fees', title: 'Plans, fees and payment',
    body: (
      <ul>
        <li>Prices are in naira, per company, per month, as shown on our pricing page or agreed with you in writing. VAT (currently 7.5%) is added.</li>
        <li>Subscriptions are billed monthly in advance. There is no minimum term.</li>
        <li>A one-off setup (installation) fee applies when you join. It pays for moving you in, setting up and training, and is not refundable.</li>
        <li>Invoices are due within 7 days unless your invoice says otherwise. If an invoice stays unpaid after we have reminded you, we may limit or pause the service until it is paid. We will warn you before we do.</li>
        <li>Going over your plan&rsquo;s limits (for example number of customers) may need a higher plan or extra charges shown in the dashboard or on your invoice.</li>
        <li>We may change prices with at least 30 days&rsquo; notice. A change applies from your next billing month after the notice ends.</li>
        <li>Refunds are covered by our <a href="/refunds">refund policy</a>.</li>
      </ul>
    ),
  },
  {
    id: 'your-data', title: 'Your data and your customers',
    body: (
      <>
        <p>You own the data you and your customers put into ISPDock (&ldquo;your data&rdquo;). You give us permission to store and process it only to provide, secure and support the service, and as our privacy policy describes.</p>
        <p>For your customers&rsquo; personal data you are the data controller and we are your data processor. We will: process it only on your documented instructions (these terms and how you configure the service); keep it confidential and limit access to people who need it; protect it with appropriate security; use only service providers bound by similar duties; help you answer your customers&rsquo; requests and meet your obligations under the Nigeria Data Protection Act 2023; tell you without undue delay about a breach affecting it; and delete or return it when the service ends.</p>
        <p>You are responsible for having a lawful basis for the data you collect, for telling your customers how you use it (your own privacy notice), for any consent your messages need, and for the accuracy of what you enter.</p>
        <p>You are also responsible for how you deal with your customers: your prices, invoices, disconnections and reconnections, refunds to them, and your own terms with them. The service carries out the actions and rules you set up; check them before you switch them on.</p>
      </>
    ),
  },
  {
    id: 'use', title: 'Acceptable use',
    body: (
      <>
        <p>You must not use the service to:</p>
        <ul>
          <li>break any law, or send spam or messages your recipients did not agree to;</li>
          <li>store or send unlawful, infringing or harmful content, or malware;</li>
          <li>try to get into accounts or data that are not yours, or test, probe or overload the service without our written permission;</li>
          <li>copy, resell or rebuild the service, or reverse engineer it except where the law allows;</li>
          <li>get around plan limits or security controls.</li>
        </ul>
        <p>We may pause the parts of an account that break these rules to protect the service or others, and we will tell you why.</p>
      </>
    ),
  },
  {
    id: 'third', title: 'Services from other providers',
    body: <p>Some features connect to services you choose and pay for separately, such as payment providers, SMS and email senders, maps, and your own network equipment. Their own terms apply to them. We are not responsible for their availability, fees or acts, but we will help you work with them through the service.</p>,
  },
  {
    id: 'availability', title: 'Availability, changes and support',
    body: (
      <>
        <p>We work to keep the service running and fast, monitor it around the clock and back it up regularly. We do not promise it will never be interrupted: planned maintenance, problems with providers we rely on and events outside our control can affect it. Any guaranteed service level applies only if it is agreed in writing.</p>
        <p>We improve ISPDock continually and may change or remove features. If we remove something important to your plan we will give you reasonable notice.</p>
        <p>Support is available by email at {mail} and in the dashboard.</p>
      </>
    ),
  },
  {
    id: 'ip', title: 'Our intellectual property',
    body: <p>ISPDock, its software, designs and content belong to Metasoft or its licensors. While you are subscribed, we give you a non-exclusive, non-transferable right to use the service for your business under these terms. If you send us ideas or feedback, we may use them without owing you anything.</p>,
  },
  {
    id: 'confidential', title: 'Confidentiality',
    body: <p>Each side will keep the other&rsquo;s non-public business information confidential, use it only for this agreement, and share it only with people who need it and are bound to keep it confidential. This does not cover information that is public, already known, independently developed, or that the law requires to be disclosed.</p>,
  },
  {
    id: 'ending', title: 'Cancelling and ending the agreement',
    body: (
      <ul>
        <li>You can cancel at any time by telling us at {mail} or through the dashboard. Cancelling stops future billing; the service stays available until the end of the month you have paid for.</li>
        <li>We may end the agreement with 30 days&rsquo; notice, or straight away if you seriously break these terms (including non-payment after reminders) and do not fix it within 14 days of our notice.</li>
        <li>After the agreement ends you can ask for an export of your data for 30 days. After that we delete your data from the live service; copies in backups are removed on their normal cycle. We keep records the law requires (for example invoices).</li>
      </ul>
    ),
  },
  {
    id: 'warranty', title: 'Warranties',
    body: <p>We will provide the service with reasonable skill and care. Apart from that and anything the law does not let us exclude, the service is provided &ldquo;as is&rdquo; and we give no other promises, for example that it will suit a particular purpose or be free of every error.</p>,
  },
  {
    id: 'liability', title: 'Limits on liability',
    body: (
      <>
        <p>Neither side is liable to the other for loss of profit, revenue, business, goodwill or data, or for indirect or consequential loss, arising from this agreement.</p>
        <p>Each side&rsquo;s total liability under this agreement in any 12 months is limited to the fees you paid for the service in the 12 months before the event that caused the claim.</p>
        <p>These limits do not apply to your duty to pay fees, to a breach of the acceptable use rules, or to liability that cannot be limited by law (such as for fraud).</p>
      </>
    ),
  },
  {
    id: 'indemnity', title: 'Claims about your use',
    body: <p>You will cover us against claims by third parties (including your customers) arising from your data, your dealings with your customers, or your breach of these terms or the law, provided we tell you promptly about the claim and let you handle it.</p>,
  },
  {
    id: 'changes', title: 'Changes to these terms',
    body: <p>We may update these terms. If a change matters to you we will tell you by email or in the dashboard at least 30 days before it takes effect. If you do not agree, you can cancel before then. Continuing to use the service after that means you accept the new terms.</p>,
  },
  {
    id: 'law', title: 'Law and disputes',
    body: <p>These terms are governed by the laws of the Federal Republic of Nigeria. If a dispute arises, both sides will first try in good faith to settle it within 30 days of one side raising it in writing. If that fails, the courts of Lagos State, Nigeria, will decide it.</p>,
  },
  {
    id: 'general', title: 'General',
    body: <p>You may not transfer this agreement without our written consent; we may transfer it to a company that takes over ISPDock. If a part of these terms cannot be enforced, the rest still applies. Not enforcing a right straight away does not waive it. Neither side is responsible for delays caused by events outside its reasonable control. Notices to us go to {mail}; notices to you go to the email address on your account.</p>,
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      path="/terms"
      title="Terms of service"
      intro={<p className="lede">The agreement between Metasoft Limited and the internet service providers that use ISPDock: what we provide, what you pay, and what each side is responsible for.</p>}
      sections={sections}
    />
  );
}
