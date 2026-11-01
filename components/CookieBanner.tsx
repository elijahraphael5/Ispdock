'use client';

import { useEffect, useState } from 'react';

/**
 * Cookie notice. The site sets no cookies and runs no tracking or advertising: the only thing it keeps in the
 * browser is the light/dark choice and this answer. The visitor's answer is still recorded (with the date), and
 * `consentFor('analytics')` is what any future analytics must check before it loads — nothing optional runs
 * without a yes. The footer's "Cookie settings" opens the notice again.
 */
const KEY = 'ispdock-consent';
const VERSION = 1;
const OPEN_EVENT = 'ispdock:cookie-settings';

type Choice = { v: number; analytics: boolean; at: string };

function read(): Choice | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || 'null') as Choice | null;
    return c && c.v === VERSION ? c : null;
  } catch { return null; }
}

/** True only when the visitor said yes to that kind of storage. */
export function consentFor(kind: 'analytics'): boolean {
  return typeof window !== 'undefined' && !!read()?.[kind];
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!read()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const save = (analytics: boolean) => {
    try { localStorage.setItem(KEY, JSON.stringify({ v: VERSION, analytics, at: new Date().toISOString() })); } catch {}
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div className="ck" role="dialog" aria-labelledby="ck-title" aria-describedby="ck-body">
      <p className="ck-title" id="ck-title">Cookies on this site</p>
      <p className="ck-body" id="ck-body">
        We only keep what the site needs to work, like your light or dark choice. No tracking or advertising cookies.
        If we ever add optional analytics, they will only run if you accept. <a href="/cookies">Cookie policy</a>
      </p>
      <div className="ck-actions">
        <button type="button" className="btn btn-sm btn-primary" onClick={() => save(true)}>Accept</button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => save(false)}>Essential only</button>
      </div>
    </div>
  );
}

/** Footer link that opens the notice again. */
export function CookieSettingsButton() {
  return (
    <button type="button" className="foot-linkbtn" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>Cookie settings</button>
  );
}
