import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/components/LegalPage';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Cookie policy — ISPDock',
  description: 'The cookies and browser storage ISPDock uses, and how to control them.',
};

const mail = <a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a>;

const Table = ({ rows }: { rows: [string, string, string, string][] }) => (
  <div className="legal-table-wrap">
    <table className="legal-table">
      <thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">What it is for</th><th scope="col">How long</th></tr></thead>
      <tbody>{rows.map((r) => <tr key={r[0]}><td><code>{r[0]}</code></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}</tbody>
    </table>
  </div>
);

const sections: LegalSection[] = [
  {
    id: 'what', title: 'Cookies and browser storage',
    body: <p>Cookies are small files a website saves in your browser. Websites can also keep small notes in the browser&rsquo;s own storage (&ldquo;local storage&rdquo; and &ldquo;session storage&rdquo;). This policy lists everything ISPDock keeps in your browser, on this website and in the ISPDock apps (the company dashboard, the customer portal and the platform console).</p>,
  },
  {
    id: 'short', title: 'In short',
    body: (
      <ul>
        <li>We use only what is needed for the site and apps to work and to remember choices you make.</li>
        <li>We use no advertising cookies and no tracking across other websites, and we do not sell data.</li>
        <li>If we ever add optional analytics, they will only run after you accept them in the cookie notice.</li>
      </ul>
    ),
  },
  {
    id: 'website', title: 'On ispdock.com',
    body: (
      <>
        <p>This website sets no cookies. It keeps two notes in your browser:</p>
        <Table rows={[
          ['ispdock-theme', 'Local storage', 'Remembers light or dark mode if you switch it', 'Until you clear it'],
          ['ispdock-consent', 'Local storage', 'Remembers your answer to the cookie notice', 'Until you clear it'],
        ]} />
        <p>Fonts are served from our own server, so loading a page does not contact a font provider. The &ldquo;Book a demo&rdquo; button opens Calendly, a separate website with its own cookie policy.</p>
      </>
    ),
  },
  {
    id: 'apps', title: 'In the ISPDock apps',
    body: (
      <>
        <p><b>Strictly necessary.</b> Without these you cannot sign in or the apps cannot work safely. They do not need consent.</p>
        <Table rows={[
          ['refreshToken', 'Cookie (secure, not readable by scripts)', 'Keeps you signed in and renews your session safely', '7 days, or until you sign out'],
          ['isp-idem', 'Session storage', 'Stops a payment or form being sent twice if your connection drops', 'Until you close the tab'],
          ['isp-imp', 'Session storage', 'Marks a support sign-in session so it shows a banner and ends on its own', 'Until you close the tab'],
          ['field-outbox', 'Local storage', 'Holds technicians’ job updates made offline until there is signal', 'Until sent'],
        ]} />
        <p><b>Preferences.</b> These remember choices you make. They stay in your browser and are not used to track you.</p>
        <Table rows={[
          ['isp-theme', 'Local storage', 'Light, dark or match-system appearance', 'Until you clear it'],
          ['isp-layout, isp-pattern', 'Local storage', 'Your company’s screen layout and box pattern, so the page draws correctly straight away', 'Until you clear it'],
          ['pk-view, iv-view', 'Local storage', 'List or grid view on some pages', 'Until you clear it'],
          ['cx-product', 'Local storage', 'Which of your connections the customer portal shows', 'Until you clear it'],
          ['isp-ann-dismissed', 'Local storage', 'Announcements you have closed', 'Until you clear it'],
          ['pt-tabs', 'Session storage', 'The pages you have open in dashboard tabs', 'Until you close the tab'],
          ['isp-consent', 'Local storage', 'Your answer to the cookie notice', 'Until you clear it'],
        ]} />
      </>
    ),
  },
  {
    id: 'third', title: 'Other providers',
    body: <p>Some screens bring in services from other providers, which may set their own cookies or see your IP address under their own policies: payment pages (for example Paystack, Flutterwave, Monnify or OPay) when you pay, and map tiles (OpenStreetMap, or Google Maps when a company has connected it) on map screens. We do not control those cookies.</p>,
  },
  {
    id: 'control', title: 'Your choices',
    body: (
      <>
        <p>Use &ldquo;Cookie settings&rdquo; at the bottom of any page on this website, or in the apps, to change your answer. You can also block or delete cookies and site data in your browser settings. If you block the strictly necessary ones you will not be able to sign in to the apps.</p>
        <p>Questions: {mail}. See also our <a href="/privacy">privacy policy</a>.</p>
      </>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      path="/cookies"
      title="Cookie policy"
      intro={<p className="lede">Everything ISPDock keeps in your browser, why, and how to change it. No advertising or tracking cookies.</p>}
      sections={sections}
    />
  );
}
