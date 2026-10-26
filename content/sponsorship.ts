import type { L } from './i18n';

/** Sponsorship offer from "الرعايات - CITY POP.pdf" (Spons p8–26). Prices exclude VAT. */
export type TierId = 'platinum' | 'gold' | 'silver';

export type Tier = {
  id: TierId;
  name: L;
  badge: L;
  pitch: L;
  price: number;
  slots: number;
  color: string;
};

export const tiers: readonly Tier[] = [
  {
    id: 'platinum',
    name: { ar: 'البلاتينيوم', en: 'Platinum' },
    badge: { ar: 'الأعلى تأثيرًا', en: 'Highest impact' },
    pitch: {
      ar: 'تغطية شاملة وأولوية قصوى في كافة مناطق الفعالية',
      en: 'Full coverage and top priority across every zone',
    },
    price: 600_000,
    slots: 1,
    color: '#C5B2FA',
  },
  {
    id: 'gold',
    name: { ar: 'الذهبي', en: 'Gold' },
    badge: { ar: 'خيار متوازن', en: 'Balanced choice' },
    pitch: {
      ar: 'تواجد تسويقي وتغطية إعلامية موجهة للجمهور',
      en: 'Marketing presence and audience-focused media coverage',
    },
    price: 300_000,
    slots: 3,
    color: '#F2D598',
  },
  {
    id: 'silver',
    name: { ar: 'الفضي', en: 'Silver' },
    badge: { ar: 'وصول فعال', en: 'Effective reach' },
    pitch: {
      ar: 'فرصة ممتازة لإبراز الهوية ضمن أروقة وفعاليات الحدث',
      en: 'A strong way to showcase your brand across the event',
    },
    price: 120_000,
    slots: 5,
    color: '#C6D1E3',
  },
];

/**
 * One cell of the benefit matrix, as printed in the deck:
 * true/false = included/not included, `share` = % of logo space, `count` = a quantity.
 */
export type Cell = boolean | { share: number } | { count: number; unit?: L };

export type BenefitRow = {
  label: L;
  /** Values in tier order: platinum, gold, silver. */
  values: readonly [Cell, Cell, Cell];
};

export type BenefitGroup = { id: string; title: L; rows: readonly BenefitRow[] };

const yes = true;
const no = false;
const share = (value: number) => ({ share: value });
const posts = (value: number) => ({
  count: value,
  unit:
    value === 1
      ? { ar: 'منشور', en: 'post' }
      : { ar: 'منشورات', en: 'posts' },
});
const tickets = (value: number) => ({
  count: value,
  unit: { ar: 'تذاكر', en: 'tickets' },
});

export const shareNote: L = {
  ar: 'النسبة المئوية تمثّل حصة الراعي من إجمالي مساحة الشعارات المتاحة في كل نقطة تماس.',
  en: 'Percentages are the sponsor’s share of the total logo space available at each touchpoint.',
};

export const benefitGroups: readonly BenefitGroup[] = [
  {
    id: 'association',
    title: { ar: 'حقوق الارتباط', en: 'Association rights' },
    rows: [
      {
        label: { ar: 'الارتباط الرسمي بالفعالية', en: 'Official association with the event' },
        values: [yes, yes, yes],
      },
      {
        label: { ar: 'الحصرية في الفئة', en: 'Category exclusivity' },
        values: [yes, no, no],
      },
      {
        label: {
          ar: 'الحق في استخدام أصول الملكية الفكرية للفعالية',
          en: 'Use of the event’s intellectual property',
        },
        values: [yes, yes, yes],
      },
      {
        label: {
          ar: 'الحق في استخدام الصور والفيديوهات الرسمية',
          en: 'Use of official photos and videos',
        },
        values: [yes, yes, yes],
      },
    ],
  },
  {
    id: 'naming',
    title: { ar: 'حقوق التسمية', en: 'Naming rights' },
    rows: [
      {
        label: {
          ar: 'تسمية إحدى المناطق الست باسم الراعي',
          en: 'Name one of the six zones after your brand',
        },
        values: [yes, no, no],
      },
      {
        label: {
          ar: 'تسمية تفعيل داخل إحدى المناطق',
          en: 'Name an activation inside a zone',
        },
        values: [yes, yes, no],
      },
    ],
  },
  {
    id: 'space',
    title: { ar: 'مساحة العرض والتفعيل', en: 'Display and activation space' },
    rows: [
      {
        label: {
          ar: 'مساحة عرض في منطقة SOCIAL POP بمقاس 3×3',
          en: '3×3 display space in SOCIAL POP',
        },
        values: [yes, yes, no],
      },
    ],
  },
  {
    id: 'visibility',
    title: {
      ar: 'ظهور العلامة التجارية في نقاط التماس',
      en: 'Brand visibility at touchpoints',
    },
    rows: [
      {
        label: { ar: 'الأعلام بالمدخل الرئيسي', en: 'Flags at the main entrance' },
        values: [share(80), no, no],
      },
      {
        label: { ar: 'الأعلام داخل منطقة الفعاليات', en: 'Flags inside the event area' },
        values: [share(40), share(25), no],
      },
      {
        label: { ar: 'اللوحات الترويجية الخاصة بالفعالية', en: 'Event promotional boards' },
        values: [share(40), share(25), share(15)],
      },
      {
        label: {
          ar: 'اللوحات الإرشادية (بأحجام مناسبة لكل فئة)',
          en: 'Wayfinding signs (sized to each tier)',
        },
        values: [share(40), share(25), share(15)],
      },
      {
        label: { ar: 'الخلفيات الإعلامية (Media Wall)', en: 'Media walls' },
        values: [share(40), share(25), share(15)],
      },
      {
        label: {
          ar: 'لوحات الإعلانات الخارجية (Outdoor)',
          en: 'Outdoor advertising boards',
        },
        values: [share(40), share(25), no],
      },
      {
        label: {
          ar: 'الشاشات الإعلانية في موقع الفعالية',
          en: 'On-site advertising screens',
        },
        values: [share(40), share(25), share(15)],
      },
      {
        label: {
          ar: 'منشورات برنامج الفعالية الرقمية',
          en: 'Digital event-programme publications',
        },
        values: [share(40), share(25), share(15)],
      },
      {
        label: {
          ar: 'المطبوعات (بنرات ومطبوعات داخل الموقع)',
          en: 'Printed material (on-site banners and prints)',
        },
        values: [share(40), share(25), no],
      },
      {
        label: {
          ar: 'تذاكر الفعالية وبادجات المنظمين والعاملين',
          en: 'Event tickets and organiser/staff badges',
        },
        values: [yes, yes, no],
      },
      {
        label: {
          ar: 'ظهور فيديو إعلاني على الشاشات الداخلية',
          en: 'Ad video on the indoor screens',
        },
        values: [yes, yes, no],
      },
    ],
  },
  {
    id: 'media',
    title: {
      ar: 'التلفاز والإعلام والمحتوى الرقمي',
      en: 'TV, media and digital content',
    },
    rows: [
      {
        label: {
          ar: 'ظهور الشعار في جميع منصات التواصل للفعالية',
          en: 'Logo on all of the event’s social platforms',
        },
        values: [yes, yes, yes],
      },
      {
        label: {
          ar: 'تضمين شعار الراعي في الإعلان التلفزيوني والرقمي',
          en: 'Logo in the TV and digital advert',
        },
        values: [yes, yes, no],
      },
      {
        label: {
          ar: 'منشورات مخصّصة للراعي على حسابات الفعالية',
          en: 'Dedicated posts on the event accounts',
        },
        values: [posts(6), posts(3), posts(1)],
      },
      {
        label: {
          ar: 'تفعيل عروض ترويجية على منصات الراعي',
          en: 'Promotional offers on your own platforms',
        },
        values: [yes, yes, yes],
      },
      {
        label: {
          ar: 'تغطية عبر صنّاع المحتوى والمؤثرين',
          en: 'Coverage by content creators and influencers',
        },
        values: [yes, yes, no],
      },
      {
        label: {
          ar: 'الذكر ضمن البيانات الصحفية للفعالية',
          en: 'Mention in the event’s press releases',
        },
        values: [yes, yes, yes],
      },
    ],
  },
  {
    id: 'revenue',
    title: { ar: 'الإيرادات والمبيعات', en: 'Revenue and sales' },
    rows: [
      {
        label: {
          ar: 'أولوية العرض في جدار السوق الرقمي (QR)',
          en: 'Display priority on the digital market wall (QR)',
        },
        values: [share(40), share(25), share(15)],
      },
      {
        label: { ar: 'الإدراج ضمن «عرض اليوم»', en: 'Inclusion in “Deal of the Day”' },
        values: [yes, yes, yes],
      },
      {
        label: {
          ar: 'أكواد خصومات حصرية باسم الراعي',
          en: 'Exclusive discount codes in your name',
        },
        values: [yes, yes, yes],
      },
      {
        label: {
          ar: 'توزيع منتجات ترويجية داخل الموقع',
          en: 'Distribute promotional products on site',
        },
        values: [yes, yes, yes],
      },
      {
        label: {
          ar: 'الحملات التسويقية المشتركة للعلامة التجارية',
          en: 'Joint brand marketing campaigns',
        },
        values: [yes, no, no],
      },
    ],
  },
  {
    id: 'hospitality',
    title: { ar: 'التجربة والضيافة', en: 'Experience and hospitality' },
    rows: [
      {
        label: {
          ar: 'تذاكر كبار الشخصيات للمسرح الرئيسي',
          en: 'VIP tickets for the main stage',
        },
        values: [tickets(10), tickets(5), tickets(2)],
      },
      {
        label: { ar: 'تذاكر عامة للمسرح الرئيسي', en: 'General tickets for the main stage' },
        values: [tickets(20), tickets(10), tickets(5)],
      },
      {
        label: { ar: 'دعوات حفل الافتتاح', en: 'Opening-ceremony invitations' },
        values: [yes, yes, yes],
      },
      {
        label: { ar: 'مواقف خاصة مخصّصة للراعي', en: 'Dedicated sponsor parking' },
        values: [yes, yes, no],
      },
    ],
  },
  {
    id: 'activation',
    title: { ar: 'التفعيل والمحتوى', en: 'Activation and content' },
    rows: [
      {
        label: {
          ar: 'ورشة باسم الراعي ضمن تقويم الورش الأسبوعي',
          en: 'A workshop in your name in the weekly calendar',
        },
        values: [yes, yes, no],
      },
      {
        label: { ar: 'المشاركة في «ضيف الأسبوع»', en: 'A slot as “Guest of the Week”' },
        values: [yes, yes, no],
      },
      {
        label: { ar: 'تفعيل خاص داخل The Hub', en: 'A private activation inside The Hub' },
        values: [yes, no, no],
      },
    ],
  },
  {
    id: 'reports',
    title: { ar: 'الإحصائيات والتقارير', en: 'Statistics and reports' },
    rows: [
      {
        label: {
          ar: 'تقرير ما بعد الفعالية (زوار، تفاعل، وصول رقمي)',
          en: 'Post-event report (visitors, engagement, digital reach)',
        },
        values: [yes, yes, yes],
      },
      {
        label: { ar: 'تحليل العائد على الاستثمار (ROI)', en: 'Return-on-investment analysis' },
        values: [yes, yes, no],
      },
      {
        label: {
          ar: 'بيانات جدار السوق الرقمي (المسح والتحويل)',
          en: 'Market-wall data (scans and conversion)',
        },
        values: [yes, yes, no],
      },
    ],
  },
];

export const benefitRows = benefitGroups.flatMap((group) => group.rows);

export function isIncluded(cell: Cell): boolean {
  return cell !== false;
}

/** Number of benefits each tier receives, in tier order. */
export function includedCount(tierIndex: 0 | 1 | 2): number {
  return benefitRows.filter((row) => isIncluded(row.values[tierIndex])).length;
}

/** Rows every tier receives, for an "every tier includes" summary. */
export const sharedBenefits = benefitRows.filter((row) =>
  row.values.every(isIncluded),
);
