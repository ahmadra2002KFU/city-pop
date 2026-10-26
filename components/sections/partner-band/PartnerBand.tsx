import { assetPath } from '@/lib/asset-path';
import { pagePath, tr, type Lang } from '@/content/i18n';
import { visitorsCopy } from '@/content/copy/visitors';
import { ButtonLink } from '@/components/primitives/ButtonLink';
import styles from './partner-band.module.css';

const copy = visitorsCopy.partnerBand;

/** Visitor-page bridge to the partners page. */
export function PartnerBand({ lang }: { lang: Lang }) {
  return (
    <section className={`container ${styles.band}`} aria-labelledby="partner-band-title">
      <div>
        <h2 id="partner-band-title">{tr(copy.title, lang)}</h2>
        <p>{tr(copy.text, lang)}</p>
      </div>
      <ButtonLink href={assetPath(pagePath('partners', lang))} arrow>
        {tr(copy.cta, lang)}
      </ButtonLink>
    </section>
  );
}
