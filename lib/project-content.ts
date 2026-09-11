// Project figures and package terms transcribed from City Pop.pdf.
// Page numbers refer to the original 69-page document (one-based).
export type Localized = readonly [string, string];
export const masterplans = [
  {
    label: ['المقترح الأول', 'Proposal one'],
    area: '28,189',
    page: 9,
    image: 'masterplan-proposal-1-p09.jpg',
  },
  {
    label: ['المقترح الثاني', 'Proposal two'],
    area: '26,500',
    page: 12,
    image: 'masterplan-proposal-2-p12.jpg',
  },
  {
    label: ['المقترح الثالث', 'Proposal three'],
    area: '32,760',
    page: 13,
    image: 'masterplan-proposal-3-p13.jpg',
  },
] as const;

export const sponsorships = [
  {
    id: 'silver',
    name: ['الفضية', 'Silver'],
    focus: ['مساحة ضمن خيمة المعرض', 'A share of the exhibition tent'],
    color: '#c6d1e3',
  },
  {
    id: 'gold',
    name: ['الذهبية', 'Gold'],
    focus: [
      'مساحة وهوية بإرشاد محدود',
      'Shared space with limited brand guidance',
    ],
    color: '#f2d598',
  },
  {
    id: 'platinum',
    name: ['البلاتينيوم', 'Platinum'],
    focus: ['ملكية كاملة لمساحة الخيمة', 'Full ownership of the tent space'],
    color: '#c5b2fa',
  },
] as const;

export const sponsorBenefits: {
  label: Localized;
  values: readonly (boolean | Localized)[];
}[] = [
  {
    label: ['مساحة خيمة المعرض', 'Exhibition tent space'],
    values: [
      [
        'جزء من المساحة وفق اتفاق مع العميل',
        'Part of the space, as agreed with the client',
      ],
      [
        'جزء من المساحة وفق اتفاق مع العميل',
        'Part of the space, as agreed with the client',
      ],
      ['ملكية كاملة للمساحة بأكملها', 'Full ownership of the entire space'],
    ],
  },
  {
    label: [
      'تأجير المساحات المتبقية لشركاء من قطاعات أخرى',
      'Remaining spaces leased to partners in other sectors',
    ],
    values: [true, true, false],
  },
  {
    label: ['الهوية البصرية للفعالية', 'Event visual identity'],
    values: [
      false,
      ['إرشاد محدود', 'Limited guidance'],
      [
        'توجيه كامل للتكامل مع العلامة التجارية',
        'Full direction for brand integration',
      ],
    ],
  },
  {
    label: [
      'تفعيل التقنيات التفاعلية المتقدمة',
      'Advanced interactive technologies',
    ],
    values: [false, false, true],
  },
  {
    label: ['الحملات التسويقية للعلامة التجارية', 'Brand marketing campaigns'],
    values: [false, false, true],
  },
];

export const sharedBenefits: Localized[] = [
  ['منطقة لعب مخصصة للأطفال', 'Dedicated children’s play area'],
  ['منطقة متكاملة للمأكولات والمشروبات', 'Integrated food & beverage area'],
  ['تغطية مخصصة عبر وسائل التواصل الاجتماعي', 'Dedicated social media coverage'],
];

// Positions are anchors on the original first masterplan, not rentable unit boundaries.
export const planAnchors: Record<
  string,
  { x: number; y: number; number: string }
> = {
  hub: { x: 43, y: 19, number: '01' },
  souq: { x: 43, y: 47, number: '02' },
  food: { x: 59, y: 83, number: '04' },
  kids: { x: 22, y: 83, number: '03' },
  stage: { x: 88, y: 28, number: '05' },
  play: { x: 87, y: 67, number: '06' },
};

export const spaceDetails: Record<
  string,
  { format: Localized; dimension: Localized; source: number }
> = {
  hub: {
    format: ['مساحة في خيمة المعرض', 'Exhibition tent space'],
    dimension: [
      'تُحدّد المساحة وفق الاتفاق مع العميل',
      'Space is determined by agreement with the client',
    ],
    source: 59,
  },
  souq: {
    format: ['أكشاك الشارع الاجتماعي', 'Social Street kiosks'],
    dimension: [
      'أبعاد الكشك الموضحة: 4 × 3 م',
      'Kiosk dimensions shown: 4 × 3 m',
    ],
    source: 9,
  },
  food: {
    format: ['مساحات المطاعم والمقاهي', 'Restaurant & café spaces'],
    dimension: [
      'توزيع المطاعم والمقاهي موضّح بالمخطط',
      'Restaurant and café footprints are shown on the plan',
    ],
    source: 9,
  },
  kids: {
    format: ['المدينة الصغيرة واللعب التفاعلي', 'Tiny Town & interactive play'],
    dimension: [
      'مناطق Tiny Town وSoft Play موضّحة بالمخطط',
      'Tiny Town and Soft Play areas are shown on the plan',
    ],
    source: 9,
  },
  stage: {
    format: ['المسرح الرئيسي', 'Main stage'],
    dimension: [
      'مسرح ومدرّج ضمن المخطط المقترح',
      'A stage and audience seating in the proposed layout',
    ],
    source: 9,
  },
  play: {
    format: ['مساحات الألعاب والتحديات', 'Games & challenge spaces'],
    dimension: [
      'مساحات Game Activities وKarting موضّحة بالمخطط',
      'Game Activities and Karting are shown on the plan',
    ],
    source: 9,
  },
};
