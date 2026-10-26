import type { Lang } from '@/content/i18n';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { Hero } from '@/components/sections/hero/Hero';
import { Concept } from '@/components/sections/concept/Concept';
import { Zones } from '@/components/sections/zones/Zones';
import { HubInside } from '@/components/sections/hub/HubInside';
import { SiteMap } from '@/components/sections/site-map/SiteMap';
import { ReturnReasons } from '@/components/sections/return/ReturnReasons';
import { VisitInfo } from '@/components/sections/visit/VisitInfo';
import { PartnerBand } from '@/components/sections/partner-band/PartnerBand';

/** Public visitor page: the story, the zones and practical visit info. */
export function VisitorsPage({ lang }: { lang: Lang }) {
  return (
    <>
      <Header lang={lang} page="visitors" />
      <main id="main">
        <Hero lang={lang} />
        <Concept lang={lang} />
        <Zones lang={lang} />
        <HubInside lang={lang} />
        <SiteMap lang={lang} variant="visitors" />
        <ReturnReasons lang={lang} />
        <VisitInfo lang={lang} />
        <PartnerBand lang={lang} />
      </main>
      <Footer lang={lang} page="visitors" />
    </>
  );
}
