'use client';

/* oxlint-disable nextjs/no-img-element -- Static export serves the generated wordmark directly. */
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { assetPath } from '@/lib/asset-path';
import { pagePath, tr, type Lang, type PageId } from '@/content/i18n';
import { common, nav } from '@/content/site';
import { media } from '@/content/media.generated';
import styles from './header.module.css';

type HeaderProps = { lang: Lang; page: PageId };

export function Header({ lang, page }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const otherLang: Lang = lang === 'ar' ? 'en' : 'ar';
  const otherPage: PageId = page === 'visitors' ? 'partners' : 'visitors';
  const cta =
    page === 'partners'
      ? { href: '#enquire', label: tr(common.enquireCta, lang) }
      : { href: assetPath(pagePath('partners', lang)), label: tr(common.partnerCta, lang) };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={styles.header} data-scrolled={scrolled || open}>
      <div className={styles.bar}>
        <a className={styles.brand} href={assetPath(pagePath(page, lang))} aria-label="City Pop">
          <img
            src={assetPath(`/media/wordmark-${media.wordmark.widths[0]}.webp`)}
            alt="CITY POP"
            width={media.wordmark.width}
            height={media.wordmark.height}
          />
        </a>
        <nav className={styles.nav} aria-label={tr(common.mainNav, lang)}>
          {nav[page].map((item) => (
            <a key={item.href} href={item.href}>
              {tr(item.label, lang)}
            </a>
          ))}
        </nav>
        <div className={styles.actions}>
          <a className={styles.pageSwitch} href={assetPath(pagePath(otherPage, lang))}>
            {tr(common.pages[otherPage], lang)}
          </a>
          <a
            className={styles.langSwitch}
            href={assetPath(pagePath(page, otherLang))}
            hrefLang={otherLang}
            lang={otherLang}
            aria-label={tr(common.switchLangLabel, lang)}
          >
            {tr(common.switchLang, lang)}
          </a>
          <a className={styles.cta} href={cta.href}>
            {cta.label}
          </a>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={tr(common.menu, lang)}
            onClick={() => setOpen(!open)}
          >
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>
      <nav
        id="mobile-nav"
        className={styles.mobileNav}
        data-open={open}
        aria-label={tr(common.mainNav, lang)}
        hidden={!open}
      >
        {nav[page].map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {tr(item.label, lang)}
          </a>
        ))}
        <a href={assetPath(pagePath(otherPage, lang))}>{tr(common.pages[otherPage], lang)}</a>
        <a className={styles.mobileCta} href={cta.href} onClick={() => setOpen(false)}>
          {cta.label}
        </a>
      </nav>
    </header>
  );
}
