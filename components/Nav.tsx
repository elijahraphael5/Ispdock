'use client';

import { useEffect, useState } from 'react';
import { Mark } from './Mark';
import { ContactLink } from './ContactLink';

const LINKS = [['#product', 'Product'], ['#network', 'Network'], ['#pricing', 'Pricing'], ['#faq', 'FAQ']];

// `base` = '/' on pages other than the home page, so the section links lead back to it
export function Nav({ base = '' }: { base?: string }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  // Light / dark: follows the device until the visitor picks one, then remembers it
  useEffect(() => {
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      const t = document.documentElement.getAttribute('data-theme');
      const d = t ? t === 'dark' : system.matches;
      setDark(d);
      document.querySelectorAll('meta[name="theme-color"]').forEach((m) => { m.setAttribute('content', d ? '#000000' : '#FFFFFF'); m.removeAttribute('media'); });
    };
    sync();
    system.addEventListener('change', sync);
    return () => system.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const flip = () => {
    const next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('ispdock-theme', next); } catch {}
    setDark(!dark);
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => { m.setAttribute('content', next === 'dark' ? '#000000' : '#FFFFFF'); m.removeAttribute('media'); });
  };

  return (
    <header className="nav" id="top">
      <div className="wrap nav-in">
        <a className="brand" href={base ? '/' : '#top'} aria-label="ISPDock home"><Mark /><span>ISPDock</span></a>
        <nav aria-label="Main">
          <ul className={'nav-links' + (open ? ' open' : '')} id="navLinks" onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setOpen(false); }}>
            {LINKS.map(([href, text]) => <li key={href}><a href={base + href}>{text}</a></li>)}
          </ul>
        </nav>
        <button className="theme-btn" type="button" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={flip}>
          <svg className="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>
          <svg className="i-sun" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="8" height="8" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></svg>
        </button>
        <ContactLink className="btn btn-sm btn-primary nav-cta">Book a demo</ContactLink>
        <button className="nav-toggle" aria-expanded={open} aria-controls="navLinks" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
          <span></span><span></span>
        </button>
      </div>
    </header>
  );
}
