import { CONTACT } from '@/lib/site';

// A booking page (Calendly) opens in a new tab so the site stays open behind it; an email link opens the mail app.
const external = /^https?:\/\//.test(CONTACT);

export function ContactLink({ className, children }: { className?: string; children: React.ReactNode }) {
  return <a className={className} href={CONTACT} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>;
}
