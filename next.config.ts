import type { NextConfig } from 'next';

// Static export: `next build` writes plain files to out/, so any static host (nginx, Vercel, Netlify, S3) can serve it.
const config: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default config;
