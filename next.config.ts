import type { NextConfig } from 'next';
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://card.ahmadgra.com';
const nextConfig: NextConfig = {
  output: 'export',
  // This single-page export is mounted by the static host. Vinext's router
  // basePath would prevent its prerenderer from exporting the root route.
  // An absolute prefix keeps Vinext's emitted files at _next/static on disk.
  assetPrefix: basePath ? `${siteOrigin}${basePath}` : undefined,
  trailingSlash: false,
};
export default nextConfig;
