import type { Metadata } from 'next';
import { pagePath, tr, type Lang, type PageId } from '@/content/i18n';
import { meta, siteName } from '@/content/site';
import { media } from '@/content/media.generated';
import { shareImage } from '@/content/seo';
import { assetPath } from './asset-path';
import { absoluteUrl, siteOrigin } from './site-url';

/**
 * Search engines stay out until Mufeed confirms the launch facts and contact
 * channels (plan decision D9). Flip to true at release.
 */
export const indexable = false;

/** The social card: its generated JPEG fallback, with the pixel size it is encoded at. */
export function shareImageFile(): {
  path: string;
  width: number;
  height: number;
} {
  const image = media[shareImage.id];
  const width = Number(image.fallback.match(/-(\d+)\./)?.[1] ?? image.width);
  return {
    path: `/media/${image.fallback}`,
    width,
    height: Math.round((width * image.height) / image.width),
  };
}

export function pageMetadata(page: PageId, lang: Lang): Metadata {
  const title = tr(meta[page].title, lang);
  const description = tr(meta[page].description, lang);
  const card = shareImageFile();
  const image = {
    url: absoluteUrl(card.path),
    width: card.width,
    height: card.height,
    alt: tr(shareImage.alt, lang),
    type: 'image/jpeg',
  };
  return {
    metadataBase: new URL(siteOrigin),
    title,
    description,
    alternates: {
      canonical: absoluteUrl(pagePath(page, lang)),
      languages: {
        ar: absoluteUrl(pagePath(page, 'ar')),
        en: absoluteUrl(pagePath(page, 'en')),
        'x-default': absoluteUrl(pagePath(page, 'ar')),
      },
    },
    openGraph: {
      type: 'website',
      siteName,
      title,
      description,
      url: absoluteUrl(pagePath(page, lang)),
      locale: lang === 'ar' ? 'ar_SA' : 'en_GB',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    icons: {
      icon: assetPath('/favicon.svg'),
      apple: { url: assetPath('/apple-touch-icon.png'), sizes: '180x180' },
    },
  };
}
