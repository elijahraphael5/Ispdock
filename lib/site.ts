// Where every "Book a demo" button goes (the Calendly booking page). Change this one line to move it.
export const CONTACT = 'https://calendly.com/elijahraphael5/30min';
export const CONTACT_EMAIL = 'hello@ispdock.com';

// Plans: keep equal to the platform's pricing sheet (docs/pricing.md in isp-platform).
export type Plan = { key: 'starter' | 'growth' | 'enterprise'; name: string; price: number; limit: number };
export const PLANS: Plan[] = [
  { key: 'starter', name: 'Starter', price: 45000, limit: 300 },
  { key: 'growth', name: 'Growth', price: 150000, limit: 2000 },
  { key: 'enterprise', name: 'Enterprise', price: 450000, limit: 5000 },
];

export const naira = (n: number) => '₦' + Math.round(n).toLocaleString('en-NG');

// True when the visitor asked for less motion. Client only.
export const prefersStill = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
