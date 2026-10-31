import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--ff-inter', display: 'swap' });
const tight = Inter_Tight({ subsets: ['latin'], weight: ['300', '500', '600', '700', '800'], variable: '--ff-tight', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--ff-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'ISPDock — Run your whole ISP from one place',
  description: 'Billing, payments, customers, support and your network in one platform built for Nigerian internet service providers. From ₦150 per customer a month.',
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
  openGraph: {
    title: 'ISPDock — Run your whole ISP from one place',
    description: 'Billing, payments, customers, support and your network in one platform built for Nigerian ISPs.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

// Before the first paint: mark that scripts run (reveal styles) and apply a theme the visitor picked earlier
const BOOT = "document.documentElement.classList.add('js');try{var t=localStorage.getItem('ispdock-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${tight.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      {/* browser extensions add attributes to body before React loads */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
