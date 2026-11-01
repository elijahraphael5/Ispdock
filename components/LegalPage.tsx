import { LEGAL_PAGES, LEGAL_UPDATED } from '@/lib/site';
import { Footer } from './Footer';
import { Nav } from './Nav';

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/** One legal page: the page list and the sections on the left, the text on the right. */
export function LegalPage({ path, title, intro, sections }: { path: string; title: string; intro: React.ReactNode; sections: LegalSection[] }) {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav base="/" />
      <main id="main" className="legal">
        <div className="wrap grid">
          <header className="legal-head col-main">
            <p className="label">Legal</p>
            <h1>{title}</h1>
            <p className="fine">Last updated {LEGAL_UPDATED}</p>
            <div className="legal-intro">{intro}</div>
          </header>
          <aside className="rail legal-side" aria-label="Legal pages">
            <ul className="legal-pages">
              {LEGAL_PAGES.map(([href, text]) => (
                <li key={href}><a href={href} aria-current={href === path ? 'page' : undefined}>{text}</a></li>
              ))}
            </ul>
            <p className="label">On this page</p>
            <ol className="legal-toc">
              {sections.map((s) => <li key={s.id}><a href={'#' + s.id}>{s.title}</a></li>)}
            </ol>
          </aside>
          <div className="col-text legal-body">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={s.id + '-h'}>
                <h2 id={s.id + '-h'}><span className="legal-n">{i + 1}.</span> {s.title}</h2>
                {s.body}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer base="/" />
    </>
  );
}
