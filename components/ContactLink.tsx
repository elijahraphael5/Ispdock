import { CONTACT } from '@/lib/site';

export function ContactLink({ className, children }: { className?: string; children: React.ReactNode }) {
  return <a className={className} href={CONTACT}>{children}</a>;
}
