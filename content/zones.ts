import type { L } from './i18n';
import type { MediaId } from './media.generated';

export type ZoneId = 'hub' | 'social' | 'tiny' | 'fnb' | 'stage' | 'popoff';
export type MapAreaId = ZoneId | 'entrance' | 'facilities';

export type Zone = {
  id: ZoneId;
  /** Display name. The decks use the Latin names on Arabic slides too. */
  name: string;
  subtitle: L;
  /** One-line pitch (Spons p4). */
  summary: L;
  /** Longer zone introduction (V06 section dividers). */
  intro: L;
  /** What the zone contains (V06 p10 masterplan legend). */
  features: readonly L[];
  /** Zone colour from the V06 masterplan legend. */
  color: string;
  image: MediaId;
  imageAlt: L;
  /** Optional second concept render shown in the zone dialog (cropped V06 render or film still). */
  extraImage?: { id: MediaId; alt: L };
};

/** The six zones, in the order of V06 p7. */
export const zones: readonly Zone[] = [
  {
    id: 'hub',
    name: 'The Hub',
    subtitle: { ar: 'المتاجر الرئيسية', en: 'Main stores' },
    summary: {
      ar: 'التجربة الرائدة؛ حيث تجتمع عروض العلامات التجارية، والشاشات التفاعلية، والفعاليات الغامرة، تحت سقف واحد يأسر الأنظار.',
      en: 'The flagship experience: brand showcases, interactive screens and immersive events under one eye-catching roof.',
    },
    intro: {
      ar: 'القلب المرن والمتجدد لسيتي بوب؛ حيث تتحول المنتجات والتجارب الرقمية إلى رحلة اكتشاف واقعية، تجمع بين السوق، وتجارب الجمال، والورش التفاعلية، ومحتوى حيّ في مساحة واحدة متكاملة.',
      en: 'The flexible, ever-changing heart of City Pop, where products and experiences from the digital world become a real-world journey of discovery: a market, beauty experiences, interactive workshops and live content in one space.',
    },
    features: [
      { ar: 'المتاجر الرئيسية', en: 'Flagship stores' },
      { ar: 'الأعمال الفنية', en: 'Art installations' },
      { ar: 'ورش العمل', en: 'Workshops' },
    ],
    color: '#BF4363',
    image: 'zone-hub',
    imageAlt: {
      ar: 'تصوّر لمنطقة ذا هب المضيئة',
      en: 'Concept render of The Hub',
    },
    extraImage: {
      id: 'concept-hub-plaza',
      alt: { ar: 'تصوّر لساحة ذا هب بين واجهات المتاجر الزجاجية المضيئة', en: 'Concept render of The Hub plaza between lit glass storefronts' },
    },
  },
  {
    id: 'social',
    name: 'Social POP',
    subtitle: { ar: 'البازار', en: 'The bazaar' },
    summary: {
      ar: 'ممشى نابض بالحياة، تصطف على جانبيه الأكشاك، والمتاجر الثانوية، ولحظات الاكتشاف المتجددة.',
      en: 'A lively promenade lined with kiosks, boutique stores and something new to discover at every turn.',
    },
    intro: {
      ar: 'بازار اجتماعي مفتوح، صُمِّم للعروض غير الرسمية، ولحظات التصوير، والمقاعد، والألعاب، وطاقة مجتمعية خالصة.',
      en: 'An open social bazaar made for pop-up performances, photo moments, places to sit, games and pure community energy.',
    },
    features: [
      { ar: 'المتاجر الثانوية', en: 'Boutique stores' },
      { ar: 'جلسات ومقاعد', en: 'Seating' },
      { ar: 'العروض الأدائية والحية', en: 'Live performances' },
      { ar: 'أجنحة الرعاة', en: 'Sponsor spaces' },
    ],
    color: '#6B5FA8',
    image: 'zone-social',
    imageAlt: {
      ar: 'تصوّر لممشى سوشال بوب',
      en: 'Concept render of the Social POP promenade',
    },
    extraImage: {
      id: 'concept-promenade',
      alt: { ar: 'تصوّر لممشى سوشال بوب وأكشاكه المضيئة', en: 'Concept render of the Social POP promenade and its lit kiosks' },
    },
  },
  {
    id: 'tiny',
    name: 'Tiny POP',
    subtitle: { ar: 'منطقة الأطفال', en: 'Kids’ zone' },
    summary: {
      ar: 'عالم عجيب لصغار الزوّار، يضم مناطق لعب موضوعية، وورشاً مصغّرة، وسوقاً صغيراً خاصاً بهم.',
      en: 'A world of wonder for younger visitors, with themed play areas, mini workshops and a little market of their own.',
    },
    intro: {
      ar: 'حيث تتحوّل سيتي بوب إلى وجهة عائلية: منطقة آمنة ومرحة تحوّل الزيارة العابرة إلى يوم كامل من المتعة، وتمنح الآباء فرصة أطول للتسوّق براحة بال.',
      en: 'Where City Pop becomes a family destination: a safe, playful zone that turns a quick visit into a full day out, and gives parents more time to shop with peace of mind.',
    },
    features: [
      { ar: 'أنشطة الأطفال', en: 'Kids’ activities' },
      { ar: 'عالم الألعاب الهوائية', en: 'Inflatable play world' },
      { ar: 'ورش العمل', en: 'Workshops' },
      { ar: 'حديقة الحيوان', en: 'Petting zoo' },
    ],
    color: '#4F4BCE',
    image: 'zone-tiny',
    imageAlt: {
      ar: 'تصوّر لمنطقة الأطفال تايني بوب',
      en: 'Concept render of the Tiny POP kids’ zone',
    },
    extraImage: {
      id: 'concept-tiny-town',
      alt: { ar: 'تصوّر علوي لمنطقة الأطفال والألعاب الهوائية', en: 'Aerial concept render of the kids’ zone and inflatables' },
    },
  },
  {
    id: 'fnb',
    name: 'F&B POP',
    subtitle: { ar: 'منطقة الطعام', en: 'Food & drink' },
    summary: {
      ar: 'وجهة متكاملة للمطاعم والمقاهي تجمع مفاهيم مطاعم مميزة، وأكشاكاً متخصصة منتقاة بعناية.',
      en: 'A complete dining destination bringing together standout restaurant concepts and carefully chosen specialty kiosks.',
    },
    intro: {
      ar: 'وجهة متكاملة للمطاعم والمقاهي، تجمع مفاهيم مطاعم مميزة، وأكشاكاً متخصصة منتقاة بعناية، وجلسات للاستراحة بين المناطق.',
      en: 'A complete dining destination with standout restaurant concepts, carefully chosen specialty kiosks and lounge seating between the zones.',
    },
    features: [
      { ar: 'أكشاك المأكولات والمشروبات', en: 'Food & drink kiosks' },
      { ar: 'مطعم مؤقت (Pop-up)', en: 'Pop-up restaurant' },
      { ar: 'محور المقاهي', en: 'Café row' },
      { ar: 'جلسات الاستراحة', en: 'Lounge seating' },
    ],
    color: '#D96E8A',
    image: 'zone-fnb',
    imageAlt: {
      ar: 'تصوّر لمنطقة المطاعم والمقاهي',
      en: 'Concept render of the F&B POP dining zone',
    },
    extraImage: {
      id: 'concept-cafe',
      alt: { ar: 'تصوّر لمقهى بطابقين وجلسات علوية', en: 'Concept still of a two-storey café with a rooftop terrace' },
    },
  },
  {
    id: 'stage',
    name: 'Stage POP',
    subtitle: { ar: 'المسرح', en: 'The stage' },
    summary: {
      ar: 'منصة واحدة قوية، تحتضن العروض الحية، وفعاليات العلامات التجارية، وإطلاقات المنتجات، ولحظات جماهيرية لا تُنسى.',
      en: 'One powerful stage for live shows, brand events, product launches and unforgettable crowd moments.',
    },
    intro: {
      ar: 'المسرح الخارجي هو الوجهة الترفيهية الرئيسية للفعالية، بسعة لا تقل عن 1,500 مقعد ونظام تذاكر مستقل، ويقدّم برنامجًا متجددًا من العروض المدفوعة على مدار فترة الحدث.',
      en: 'The open-air stage is the event’s main entertainment venue: at least 1,500 seats with separate ticketing, hosting a changing programme of paid shows throughout the event.',
    },
    features: [
      { ar: 'المنصة والشاشة', en: 'Stage & screen' },
      { ar: '134 مقعدًا لكبار الشخصيات (VIP)', en: '134 VIP seats' },
      { ar: '1,496 مقعدًا للجمهور العام', en: '1,496 general seats' },
    ],
    color: '#37AAA8',
    image: 'zone-stage',
    imageAlt: {
      ar: 'تصوّر لمسرح ستيج بوب',
      en: 'Concept render of the Stage POP venue',
    },
    extraImage: {
      id: 'concept-stage',
      alt: { ar: 'تصوّر للمسرح المفتوح وجلسات الطعام أمامه', en: 'Concept render of the open-air stage with dining in front' },
    },
  },
  {
    id: 'popoff',
    name: 'POP OFF',
    subtitle: { ar: 'المنطقة الترفيهية', en: 'Entertainment zone' },
    summary: {
      ar: 'منطقة ترفيهية نابضة بالحماس، تجمع بين التحديات التفاعلية، والمغامرات الجماعية، والألعاب التنافسية، لتصنع للزوار لحظات مليئة بالطاقة والمتعة تستحق التكرار.',
      en: 'A high-energy entertainment zone of interactive challenges, group adventures and competitive games: moments worth coming back for.',
    },
    intro: {
      ar: 'حيث تتحول سيتي بوب إلى وجهة مليئة بالحماس والتحدي؛ منافسة، وألعاب تفاعلية، ومغامرات جماعية داخل أجواء شبابية مليئة بالطاقة.',
      en: 'Where City Pop turns up the excitement: competition, interactive games and group adventures in a youthful, high-energy setting.',
    },
    features: [
      { ar: 'ألعاب كرنفالية', en: 'Carnival games' },
      { ar: 'كارتينغ', en: 'Karting' },
      { ar: 'ليزر تاغ', en: 'Laser tag' },
      { ar: 'غرفة الهروب', en: 'Escape room' },
      { ar: 'أركيد', en: 'Arcade' },
    ],
    color: '#4482FF',
    image: 'zone-popoff',
    imageAlt: {
      ar: 'تصوّر لمنطقة بوب أوف الترفيهية',
      en: 'Concept render of the POP OFF entertainment zone',
    },
  },
];

/** Non-zone areas that appear on the masterplan legend (V06 p10). */
export const supportAreas = {
  entrance: {
    name: { ar: 'المدخل', en: 'Entrance' },
    features: [
      { ar: 'البوابة الرئيسية', en: 'Main gate' },
      { ar: 'خريطة الفعالية', en: 'Event map' },
      { ar: 'متجر الهدايا', en: 'Gift shop' },
      { ar: 'الاستعلامات والمفقودات', en: 'Information & lost property' },
    ],
    color: '#C88998',
  },
  facilities: {
    name: { ar: 'المرافق العامة', en: 'Facilities' },
    features: [
      { ar: 'دورات المياه', en: 'Restrooms' },
      { ar: 'مصلّى', en: 'Prayer room' },
    ],
    color: '#D4583B',
  },
} as const satisfies Record<
  'entrance' | 'facilities',
  { name: L; features: readonly L[]; color: string }
>;

/** Legend numbers on the V06 p10 masterplan. */
export const mapNumbers: Record<MapAreaId, number> = {
  entrance: 1,
  hub: 2,
  social: 3,
  tiny: 4,
  fnb: 5,
  popoff: 6,
  stage: 7,
  facilities: 8,
};

export function zoneById(id: ZoneId): Zone {
  const zone = zones.find((item) => item.id === id);
  if (!zone) throw new Error(`Unknown zone: ${id}`);
  return zone;
}
