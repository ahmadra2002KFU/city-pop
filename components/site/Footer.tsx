/* oxlint-disable nextjs/no-img-element -- Static export serves generated logos directly. */
import { ArrowUp } from 'lucide-react';
import { assetPath } from '@/lib/asset-path';
import { formatDate, langs, pagePath, tr, type Lang, type PageId } from '@/content/i18n';
import { facts } from '@/content/facts';
import { zones } from '@/content/zones';
import { common, contact, nav } from '@/content/site';
import { media } from '@/content/media.generated';
import styles from './footer.module.css';

type FooterProps = { lang: Lang; page: PageId };

const pageIds: readonly PageId[] = ['visitors', 'partners'];

export function Footer({ lang, page }: FooterProps) {
  const otherLang = langs.find((candidate) => candidate !== lang) ?? lang;
  // Channels stay hidden until Mufeed supplies them (content/site.ts).
  const hasContact = Boolean(contact.email || contact.whatsapp);
  return (
    <footer className={styles.footer}>
      <div className={styles.spectrum} aria-hidden>
        {zones.map((zone) => (
          <span key={zone.id} style={{ background: zone.color }} />
        ))}
      </div>
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
            {formatDate(facts.dates.start, lang)} – {formatDate(facts.dates.end, lang)}
            <br />
            {tr(facts.location.city, lang)}
            {lang === 'ar' ? '، ' : ', '}
            {tr(facts.location.region, lang)}
          </p>
        </div>

        <nav className={styles.column} aria-labelledby="footer-sections">
          <h2 id="footer-sections">{tr(common.pages[page], lang)}</h2>
          <ul>
            {nav[page].map((item) => (
              <li key={item.href}>
                <a href={item.href}>{tr(item.label, lang)}</a>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.column} aria-labelledby="footer-pages">
          <h2 id="footer-pages">{tr(common.footer.pagesLabel, lang)}</h2>
          <ul>
            {pageIds.map((id) => (
              <li key={id}>
                <a
                  href={assetPath(pagePath(id, lang))}
                  aria-current={id === page ? 'page' : undefined}
                >
                  {tr(common.pages[id], lang)}
                </a>
              </li>
            ))}
            <li>
              <a href={assetPath(pagePath(page, otherLang))} hrefLang={otherLang} lang={otherLang}>
                {tr(common.switchLang, lang)}
              </a>
            </li>
          </ul>
        </nav>

        {hasContact && (
          <div className={styles.column}>
            <h2>{tr(common.footer.contactLabel, lang)}</h2>
            <ul>
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </li>
              )}
              {contact.whatsapp && (
                <li>
                  <a href={`https://wa.me/${contact.whatsapp}`} rel="noopener" dir="ltr">
                    +{contact.whatsapp}
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}

        <div className={styles.organiser}>
          <p>{tr(common.footer.organiser, lang)}</p>
          <img
            src={assetPath(`/media/mufeed-logo-${media['mufeed-logo'].widths[0]}.webp`)}
            alt={tr(facts.organiser.name, lang)}
            width={media['mufeed-logo'].width}
            height={media['mufeed-logo'].height}
            loading="lazy"
          />
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.legal}>{tr(common.footer.legal, lang)}</p>
        <div className={styles.bottomRow}>
          <p>
            © 2026 CITY POP · {tr(facts.organiser.name, lang)}. {tr(common.footer.rights, lang)}.
          </p>
          <a className={styles.toTop} href="#main">
            <ArrowUp aria-hidden size={16} />
            {tr(common.footer.backToTop, lang)}
          </a>
        </div>
      </div>
    </footer>
  );
}
