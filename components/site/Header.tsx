'use client';

/* oxlint-disable nextjs/no-img-element -- Static export serves the generated wordmark directly. */
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { assetPath } from '@/lib/asset-path';
import { pagePath, tr, type Lang, type PageId } from '@/content/i18n';
import { common, nav } from '@/content/site';
import { media } from '@/content/media.generated';
import styles from './header.module.css';

type HeaderProps = { lang: Lang; page: PageId };

/** Tracks which in-page section is under the header, for the nav highlight. */
function useActiveSection(page: PageId) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const sections = nav[page]
      .map((item) => item.href)
      .map((href) => document.getElementById(href.slice(1)))
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return;
    const visible = new Map<string, number>();
    // A thin band just below the header: the section crossing it is the current one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
          else visible.delete(entry.target.id);
        }
        const current = sections.find((section) => visible.has(section.id));
        setActive(current ? `#${current.id}` : null);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [page]);
  return active;
}

export function Header({ lang, page }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLElement>(null);
  const items = nav[page];
  const active = useActiveSection(page);
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

  // Mobile menu: focus the first link on open; Escape closes and returns focus to the toggle.
  useEffect(() => {
    if (!open) return;
    mobileNav.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      menuButton.current?.focus();
    };
    // The drawer only exists below the desktop breakpoint; close it if the window grows.
    const wide = window.matchMedia('(min-width: 961px)');
    const onWide = () => {
      if (wide.matches) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => {
      window.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
    };
  }, [open]);

  const toggle = () => {
    if (open) menuButton.current?.focus();
    setOpen(!open);
  };

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
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? 'location' : undefined}
            >
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
            ref={menuButton}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? tr(common.close, lang) : tr(common.menu, lang)}
            onClick={toggle}
          >
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>
      <nav
        ref={mobileNav}
        id="mobile-nav"
        className={styles.mobileNav}
        data-open={open}
        aria-label={tr(common.mainNav, lang)}
        hidden={!open}
      >
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={active === item.href ? 'location' : undefined}
                onClick={() => setOpen(false)}
              >
                {tr(item.label, lang)}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.mobileFoot}>
          <a href={assetPath(pagePath(otherPage, lang))} onClick={() => setOpen(false)}>
            {tr(common.pages[otherPage], lang)}
          </a>
        </div>
        <a className={styles.mobileCta} href={cta.href} onClick={() => setOpen(false)}>
          {cta.label}
        </a>
      </nav>
    </header>
  );
}
