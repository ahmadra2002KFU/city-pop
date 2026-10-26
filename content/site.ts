import type { L, PageId } from './i18n';

/**
 * Contact channels. Mufeed has not supplied them yet (plan decision D4);
 * components must hide a channel whose value is null rather than invent one.
 */
export const contact: {
  email: string | null;
  /** International format without "+" or spaces, e.g. 9665XXXXXXXX. */
  whatsapp: string | null;
  /** Form-service endpoint (e.g. Formspree) that accepts a POST of form data. */
  formEndpoint: string | null;
} = {
  email: null,
  whatsapp: null,
  formEndpoint: null,
};

export const siteName = 'CITY POP';

export const meta: Record<PageId, { title: L; description: L }> = {
  visitors: {
    title: {
      ar: 'سيتي بوب | من الشاشة إلى الواقع، الخبر',
      en: 'City Pop | From screen to reality, Al Khobar',
    },
    description: {
      ar: 'سيتي بوب: مدينة متنقلة للتسوق والترفيه والتجارب في الخبر، من 25 نوفمبر 2026 إلى 5 يناير 2027. ست مناطق، 40 يومًا من التجارب.',
      en: 'City Pop is a pop-up city of shopping, entertainment and experiences in Al Khobar, 25 November 2026 to 5 January 2027. Six zones, 40 days.',
    },
  },
  partners: {
    title: {
      ar: 'سيتي بوب للشركاء | المساحات التأجيرية والرعاية',
      en: 'City Pop for partners | Leasable spaces and sponsorship',
    },
    description: {
      ar: 'احجز مساحتك أو كن راعيًا في سيتي بوب بالخبر: 54 وحدة تأجيرية و3 فئات رعاية، 500,000 زائر متوقع على مدى 40 يومًا.',
      en: 'Lease a space or sponsor City Pop in Al Khobar: 54 units and three sponsorship tiers, with 500,000 expected visitors over 40 days.',
    },
  },
};

export type NavItem = { href: string; label: L };

/** In-page anchors per page. Section ids are part of the public contract (verify-live.mjs). */
export const nav: Record<PageId, readonly NavItem[]> = {
  visitors: [
    { href: '#concept', label: { ar: 'الفكرة', en: 'The idea' } },
    { href: '#zones', label: { ar: 'المناطق', en: 'Zones' } },
    { href: '#hub', label: { ar: 'ذا هب', en: 'The Hub' } },
    { href: '#map', label: { ar: 'المخطط', en: 'Map' } },
    { href: '#visit', label: { ar: 'زيارتك', en: 'Your visit' } },
  ],
  partners: [
    { href: '#numbers', label: { ar: 'بالأرقام', en: 'In numbers' } },
    { href: '#masterplan', label: { ar: 'المخطط', en: 'Masterplan' } },
    { href: '#spaces', label: { ar: 'المساحات', en: 'Spaces' } },
    { href: '#sponsorship', label: { ar: 'الرعاية', en: 'Sponsorship' } },
    { href: '#enquire', label: { ar: 'تواصل معنا', en: 'Enquire' } },
  ],
};

export const common = {
  skip: { ar: 'انتقل إلى المحتوى', en: 'Skip to content' },
  menu: { ar: 'القائمة', en: 'Menu' },
  close: { ar: 'إغلاق', en: 'Close' },
  mainNav: { ar: 'القائمة الرئيسية', en: 'Main navigation' },
  switchLang: { ar: 'English', en: 'العربية' },
  switchLangLabel: { ar: 'Switch to English', en: 'التبديل إلى العربية' },
  pages: {
    visitors: { ar: 'الزوار', en: 'Visitors' },
    partners: { ar: 'الشركاء', en: 'Partners' },
  } satisfies Record<PageId, L>,
  partnerCta: { ar: 'كن شريكًا', en: 'Partner with us' },
  enquireCta: { ar: 'تواصل معنا', en: 'Enquire now' },
  conceptLabel: { ar: 'تصوّر مبدئي', en: 'Concept visual' },
  /**
   * Concept film modal. Off until Mufeed confirms (plan D1/D7): the full film shows
   * Riyadh signage and its music licence is unknown. The film file is not in the repo;
   * add it at `src` (under public/) before enabling.
   */
  film: {
    enabled: false as boolean,
    src: '/media/video/city-pop-film-720.mp4',
    cta: { ar: 'شاهد الفيلم التصوّري', en: 'Watch the concept film' },
    title: { ar: 'سيتي بوب: الفيلم التصوّري', en: 'City Pop: the concept film' },
    note: {
      ar: 'تصوّر مبدئي مُنتَج رقميًا، وليس تصويرًا للفعالية.',
      en: 'A digitally produced concept visualisation, not footage of the event.',
    },
  },
  footer: {
    tagline: {
      ar: 'تسوق . ترفيه . تجارب',
      en: 'Shop · Play · Experience',
    },
    organiser: { ar: 'من تنظيم شركة مفيد', en: 'Organised by Mufeed' },
    legal: {
      ar: 'الصور تصوّرات مبدئية للمشروع. الأسعار بالريال السعودي، وأسعار الرعاية غير شاملة ضريبة القيمة المضافة. جميع المساحات والباقات تخضع للتوفر وموافقة فريق سيتي بوب.',
      en: 'Images are concept visuals. Prices are in Saudi riyals; sponsorship prices exclude VAT. All spaces and packages are subject to availability and approval by the City Pop team.',
    },
    rights: { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
    pagesLabel: { ar: 'الصفحات', en: 'Pages' },
    contactLabel: { ar: 'تواصل', en: 'Contact' },
    backToTop: { ar: 'العودة إلى الأعلى', en: 'Back to top' },
  },
} as const;
