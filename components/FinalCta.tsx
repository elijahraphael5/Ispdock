import { CONTACT_EMAIL } from '@/lib/site';
import { ContactLink } from './ContactLink';

export function FinalCta() {
  return (
    <section className="section final">
      <div className="wrap grid reveal">
        <p className="label rail">A 30-minute call</p>
        <h2 className="display col-main">See it running on your own customers.</h2>
        <p className="lede col-text">We&apos;ll show you your dashboard with your plans in it, and answer every question about moving over.</p>
        <div className="cta-row col-main">
          <ContactLink className="btn btn-primary">Book a demo <span className="arr" aria-hidden="true">→</span></ContactLink>
          <a className="btn btn-ghost" href="#pricing">See pricing</a>
        </div>
        <address className="contact col-main" id="contact">
          <p className="label">Contact</p>
          <a className="contact-mail" href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a>
          <p className="fine">Demos, pricing, moving over from another system: one inbox, answered by the people who build ISPDock.</p>
        </address>
      </div>
    </section>
  );
}
