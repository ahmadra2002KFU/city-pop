import type { Lang } from '@/content/i18n';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { PartnersHero } from '@/components/sections/partners-hero/PartnersHero';
import { Numbers } from '@/components/sections/numbers/Numbers';
import { SiteMap } from '@/components/sections/site-map/SiteMap';
import { Spaces } from '@/components/sections/spaces/Spaces';
import { Sponsorship } from '@/components/sections/sponsorship/Sponsorship';
import { ReturnReasons } from '@/components/sections/return/ReturnReasons';
import { Delivery } from '@/components/sections/delivery/Delivery';
import { Enquire } from '@/components/sections/enquire/Enquire';

/** Partners page: numbers, masterplan, leasable units, sponsorship and enquiry. */
export function PartnersPage({ lang }: { lang: Lang }) {
  return (
    <>
      <Header lang={lang} page="partners" />
      <main id="main">
        <PartnersHero lang={lang} />
        <Numbers lang={lang} />
        <SiteMap lang={lang} variant="partners" />
        <Spaces lang={lang} />
        <Sponsorship lang={lang} />
        <ReturnReasons lang={lang} />
        <Delivery lang={lang} />
        <Enquire lang={lang} />
      </main>
      <Footer lang={lang} page="partners" />
    </>
  );
}
