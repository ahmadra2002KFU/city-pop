/* oxlint-disable nextjs/no-img-element -- Static export serves generated logos directly. */
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { dir, pagePath, type Lang } from '@/content/i18n';
import { notFoundCopy } from '@/content/copy/not-found';
import { media } from '@/content/media.generated';
import { assetPath } from '@/lib/asset-path';
import { Picture } from '@/components/primitives/Picture';
import styles from './not-found.module.css';

/**
 * Exported as dist/client/404.html, which GitHub Pages serves for every missing
 * URL under the project. Links use the base path so they work from any depth.
 */
export default function NotFound() {
  return (
    <>
      <title>{notFoundCopy.documentTitle}</title>
      <main id="main" className={styles.page}>
        <Picture id="gate" alt="" sizes="100vw" className={styles.backdrop} />
        <div className={styles.inner}>
          <a
            href={assetPath(pagePath('visitors', 'ar'))}
            className={styles.brand}
          >
            <img
              src={assetPath(
                `/media/wordmark-${media.wordmark.widths[1]}.webp`,
              )}
              alt="CITY POP"
              width={media.wordmark.width}
              height={media.wordmark.height}
            />
          </a>
          <p className={`latin ${styles.code}`} aria-hidden>
            {notFoundCopy.code}
          </p>
          <div className={styles.columns}>
            {(['ar', 'en'] as const satisfies readonly Lang[]).map((lang) => {
              const text = notFoundCopy[lang];
              const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;
              return (
                <section
                  key={lang}
                  lang={lang}
                  dir={dir(lang)}
                  className={styles.column}
                >
                  <h1 className={styles.title}>{text.title}</h1>
                  <p className={styles.text}>{text.text}</p>
                  <ul className={styles.links}>
                    <li>
                      <a
                        className={styles.primary}
                        href={assetPath(pagePath('visitors', lang))}
                      >
                        {text.home}
                        <Arrow aria-hidden size={18} />
                      </a>
                    </li>
                    <li>
                      <a
                        className={styles.secondary}
                        href={assetPath(pagePath('partners', lang))}
                      >
                        {text.partners}
                      </a>
                    </li>
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
