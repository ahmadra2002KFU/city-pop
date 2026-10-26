/* oxlint-disable nextjs/no-img-element -- Static export serves generated logos directly. */
import { assetPath } from '@/lib/asset-path';
import { formatDate, pagePath, tr, type Lang, type PageId } from '@/content/i18n';
import { facts } from '@/content/facts';
import { common, contact } from '@/content/site';
import { media } from '@/content/media.generated';
import styles from './footer.module.css';

type FooterProps = { lang: Lang; page: PageId };

export function Footer({ lang, page }: FooterProps) {
  const otherPage: PageId = page === 'visitors' ? 'partners' : 'visitors';
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <img
            src={assetPath(`/media/wordmark-${media.wordmark.widths[1]}.webp`)}
            alt="CITY POP"
            width={media.wordmark.width}
            height={media.wordmark.height}
            loading="lazy"
          />
          <p className={styles.tagline}>{tr(common.footer.tagline, lang)}</p>
          <p className={styles.dates}>
            {formatDate(facts.dates.start, lang)} – {formatDate(facts.dates.end, lang)} ·{' '}
            {tr(facts.location.city, lang)}
            {lang === 'ar' ? '، ' : ', '}
            {tr(facts.location.region, lang)}
          </p>
        </div>
        <div className={styles.organiser}>
          <img
            src={assetPath(`/media/mufeed-logo-${media['mufeed-logo'].widths[0]}.webp`)}
            alt={tr(facts.organiser.name, lang)}
            width={media['mufeed-logo'].width}
            height={media['mufeed-logo'].height}
            loading="lazy"
          />
          <p>{tr(common.footer.organiser, lang)}</p>
        </div>
        <nav className={styles.links} aria-label={tr(common.pages[otherPage], lang)}>
          <a href={assetPath(pagePath(otherPage, lang))}>{tr(common.pages[otherPage], lang)}</a>
          {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
          {contact.whatsapp && (
            <a href={`https://wa.me/${contact.whatsapp}`} rel="noopener" dir="ltr">
              +{contact.whatsapp}
            </a>
          )}
        </nav>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>{tr(common.footer.legal, lang)}</p>
        <p>
          © 2026 CITY POP · {tr(facts.organiser.name, lang)}. {tr(common.footer.rights, lang)}.
        </p>
      </div>
    </footer>
  );
}
