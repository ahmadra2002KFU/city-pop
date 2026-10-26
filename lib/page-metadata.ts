import type { Metadata } from 'next';
import { pagePath, tr, type Lang, type PageId } from '@/content/i18n';
import { meta, siteName } from '@/content/site';
import { media } from '@/content/media.generated';
import { assetPath } from './asset-path';
import { absoluteUrl, siteOrigin } from './site-url';

/**
 * Search engines stay out until Mufeed confirms the launch facts and contact
 * channels (plan decision D9). Flip to true at release.
 */
export const indexable = false;

export function pageMetadata(page: PageId, lang: Lang): Metadata {
  const title = tr(meta[page].title, lang);
  const description = tr(meta[page].description, lang);
  const ogImage = media.gate;
  const ogWidth = Number(ogImage.fallback.match(/-(\d+)\./)?.[1] ?? ogImage.width);
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
      images: [
        {
          url: absoluteUrl(`/media/${ogImage.fallback}`),
          width: ogWidth,
          height: Math.round((ogWidth * ogImage.height) / ogImage.width),
        },
      ],
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    icons: { icon: assetPath('/favicon.svg') },
  };
}
