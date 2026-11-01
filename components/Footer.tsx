import { COMPANY, CONTACT_EMAIL, LEGAL_PAGES } from '@/lib/site';
import { CookieSettingsButton } from './CookieBanner';
import { Mark } from './Mark';
import { Wordmark } from './Wordmark';
import { Year } from './Year';

// `base` = '/' on pages other than the home page, so the section links lead back to it
export function Footer({ base = '' }: { base?: string }) {
  return (
    <footer className="foot">
      <div className="wrap grid foot-in">
        <div className="rail">
          <a className="brand" href={base ? '/' : '#top'}><Mark /><span>ISPDock</span></a>
          <p className="fine">Software for internet service providers.</p>
        </div>
        <div className="foot-col">
          <p className="label">Platform</p>
          <ul className="foot-links">
            <li><a href={base + '#product'}>Product</a></li>
            <li><a href={base + '#network'}>Network</a></li>
            <li><a href={base + '#pricing'}>Pricing</a></li>
            <li><a href={base + '#compare'}>Compare</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <p className="label">Company</p>
          <ul className="foot-links">
            <li><a href={base + '#move'}>Moving over</a></li>
            <li><a href={base + '#faq'}>FAQ</a></li>
            <li><a href={base + '#contact'}>Contact</a></li>
            <li><a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <p className="label">Legal</p>
          <ul className="foot-links">
            {LEGAL_PAGES.map(([href, text]) => <li key={href}><a href={href}>{text}</a></li>)}
            <li><CookieSettingsButton /></li>
          </ul>
        </div>
        <p className="fine rail foot-base">© <Year /> ISPDock, a product of {COMPANY.legalName} ({COMPANY.rc}).</p>
        <p className="fine col-main foot-base foot-top"><a href="#top">Back to top ↑</a></p>
      </div>
      <Wordmark />
    </footer>
  );
}
