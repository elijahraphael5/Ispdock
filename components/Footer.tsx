import { CONTACT_EMAIL } from '@/lib/site';
import { Mark } from './Mark';
import { Wordmark } from './Wordmark';
import { Year } from './Year';

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap grid foot-in">
        <div className="rail">
          <a className="brand" href="#top"><Mark /><span>ISPDock</span></a>
          <p className="fine">Software for internet service providers.</p>
        </div>
        <div className="foot-col">
          <p className="label">Platform</p>
          <ul className="foot-links">
            <li><a href="#product">Product</a></li>
            <li><a href="#network">Network</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#compare">Compare</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <p className="label">Company</p>
          <ul className="foot-links">
            <li><a href="#move">Moving over</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a></li>
          </ul>
        </div>
        <p className="fine rail foot-base">© <Year /> ISPDock, a product of Metasoft. Prices in naira, before VAT.</p>
        <p className="fine col-main foot-base foot-top"><a href="#top">Back to top ↑</a></p>
      </div>
      <Wordmark />
    </footer>
  );
}
