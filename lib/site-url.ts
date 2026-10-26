import { assetPath } from './asset-path';

const origin = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://card.ahmadgra.com'
).replace(/\/$/, '');

/** Absolute URL for canonical links, Open Graph and structured data. */
export function absoluteUrl(path: string): string {
  return `${origin}${assetPath(path)}`;
}

export const siteOrigin = origin;
