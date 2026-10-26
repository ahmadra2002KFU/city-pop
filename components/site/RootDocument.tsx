import '@/app/styles/tokens.css';
import '@/app/styles/base.css';
import { dir, tr, type Lang } from '@/content/i18n';
import { common } from '@/content/site';

/** Shared <html> shell for the Arabic and English root layouts. */
export function RootDocument({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} dir={dir(lang)}>
      <body>
        <a className="skip-link" href="#main">
          {tr(common.skip, lang)}
        </a>
        {children}
      </body>
    </html>
  );
}
