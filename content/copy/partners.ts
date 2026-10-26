/** Copy for the partners page (leasing, sponsorship, delivery, enquiry). */
export const partnersCopy = {
  hero: {
    eyebrow: { ar: 'للشركاء والرعاة', en: 'For partners and sponsors' },
    title: {
      ar: 'مكان علامتك في قلب المدينة',
      en: 'A place for your brand at the heart of the city',
    },
    lead: {
      ar: 'سيتي بوب تحوّل رحلة التسوّق الرقمي إلى تجربة ملموسة: ست مناطق متكاملة تجمع التجزئة والترفيه والتجربة المباشرة في وجهة واحدة، من تنظيم شركة مفيد.',
      en: 'City Pop turns online shopping into a real-world experience: six connected zones bringing retail, entertainment and live experiences together in one destination, organised by Mufeed.',
    },
    spacesCta: { ar: 'استعرض المساحات', en: 'Browse spaces' },
    sponsorCta: { ar: 'باقات الرعاية', en: 'Sponsorship tiers' },
  },
  numbers: {
    eyebrow: { ar: 'سيتي بوب بالأرقام', en: 'City Pop in numbers' },
    area: { ar: 'م² مساحة الفعالية', en: 'm² event area' },
    visitors: { ar: 'إجمالي عدد الزوار المتوقع', en: 'expected total visitors' },
    days: { ar: 'يوم تشغيل متواصل', en: 'days of continuous operation' },
    zones: { ar: 'مناطق رئيسية', en: 'main zones' },
    units: { ar: 'وحدة تأجيرية', en: 'leasable units' },
    seats: { ar: 'مقعد في المسرح', en: 'stage seats' },
  },
  masterplan: {
    eyebrow: { ar: 'المخطط العام', en: 'Masterplan' },
    title: {
      ar: '46,353 م² بتخطيط واحد واضح',
      en: '46,353 m², one clear layout',
    },
    lead: {
      ar: 'موقع بطول 380.20 م وعمق 121.92 م: المتاجر الرئيسية حول ممر سوشال بوب، ثم المطاعم ومنطقة الأطفال، وصولًا إلى المسرح وبوب أوف.',
      en: 'A 380.20 m by 121.92 m site: main stores around the Social POP spine, then dining and the kids’ zone, leading to the stage and POP OFF.',
    },
    originalDrawing: { ar: 'عرض المخطط الأصلي', en: 'View the original drawing' },
    legendLabel: { ar: 'دليل المخطط', en: 'Map key' },
  },
  spaces: {
    eyebrow: { ar: 'المساحات التأجيرية', en: 'Leasable spaces' },
    title: { ar: '54 وحدة في ثلاث مناطق', en: '54 units across three zones' },
    lead: {
      ar: 'اختر نوع الوحدة المناسب لعلامتك. جميع الوحدات مؤجرة لكامل مدة الفعالية (40 يومًا).',
      en: 'Choose the unit that fits your brand. Every unit is leased for the full 40-day event.',
    },
    size: { ar: 'المساحة', en: 'Size' },
    height: { ar: 'الارتفاع', en: 'Height' },
    term: { ar: 'المدة', en: 'Term' },
    price: { ar: 'قيمة الاستثمار', en: 'Investment' },
    count: { ar: 'عدد الوحدات', en: 'Units' },
    days: { ar: 'يومًا', en: 'days' },
    idealFor: { ar: 'مناسبة لـ', en: 'Ideal for' },
    showOnMap: { ar: 'أظهر على المخطط', en: 'Show on map' },
    enquire: { ar: 'اطلب هذه الوحدة', en: 'Enquire about this unit' },
    note: {
      ar: 'القيمة لكامل مدة الفعالية. تُؤكَّد تفاصيل الضريبة والتجهيزات والتوفر عند التعاقد.',
      en: 'Prices cover the full event term. VAT, fit-out and availability are confirmed at contract.',
    },
  },
  sponsorship: {
    eyebrow: { ar: 'الرعاية', en: 'Sponsorship' },
    /** `{slots}` is the total sponsor count across tiers, written with `slotsOnly`. */
    title: { ar: 'ثلاث فئات، {slots}', en: 'Three tiers. {slots}.' },
    lead: {
      ar: 'من حقوق التسمية والحصرية إلى الظهور في كل نقطة تماس، اختر الفئة التي تناسب أهدافك.',
      en: 'From naming rights and exclusivity to visibility at every touchpoint, choose the tier that fits your goals.',
    },
    price: { ar: 'ريال سعودي', en: 'SAR' },
    vat: { ar: 'غير شاملة ضريبة القيمة المضافة', en: 'excl. VAT' },
    slots: { ar: 'عدد الرعاة', en: 'Sponsors' },
    /** Scarcity line, chosen with Intl.PluralRules; `{n}` is the slot count. */
    slotsOnly: {
      one: { ar: 'راعٍ واحد فقط', en: '1 sponsor only' },
      two: { ar: 'راعيان فقط', en: '2 sponsors only' },
      few: { ar: '{n} رعاة فقط', en: '{n} sponsors only' },
      many: { ar: '{n} راعيًا فقط', en: '{n} sponsors only' },
      other: { ar: '{n} راعٍ فقط', en: '{n} sponsors only' },
    },
    benefits: { ar: 'ميزة', en: 'benefits' },
    /** `{n}` benefits included out of `{total}` rows in the matrix. */
    benefitsOf: { ar: '{n} ميزة من أصل {total}', en: '{n} of {total} benefits' },
    highlights: { ar: 'أبرز ما تتميز به', en: 'Stand-out rights' },
    choose: { ar: 'اطلب هذه الفئة', en: 'Enquire about this tier' },
    sharedTitle: { ar: 'في جميع الفئات', en: 'Included in every tier' },
    compareTitle: { ar: 'المقارنة الكاملة', en: 'Full comparison' },
    compareLead: {
      ar: 'جميع الحقوق كما وردت في عرض الرعاية، مقسّمة إلى مجموعات.',
      en: 'Every right in the sponsorship offer, grouped by type.',
    },
    benefitColumn: { ar: 'الحق / الميزة', en: 'Right / benefit' },
    included: { ar: 'مشمول', en: 'Included' },
    notIncluded: { ar: 'غير مشمول', en: 'Not included' },
    legendShare: { ar: 'نسبة من مساحة الشعارات', en: 'Share of logo space' },
    legendCount: { ar: 'عدد', en: 'Quantity' },
    expandAll: { ar: 'افتح كل المجموعات', en: 'Expand all groups' },
    collapseAll: { ar: 'اطوِ كل المجموعات', en: 'Collapse all groups' },
    /** `{n}` rows of `{m}` in a group are included for one tier. */
    groupCount: { ar: '{n} من {m} مشمولة', en: '{n} of {m} included' },
    showTier: { ar: 'اعرض مزايا الفئة', en: 'Show benefits for' },
    /** Mobile status line under the tier switcher. */
    showing: {
      ar: 'تعرض الآن: {tier}، {n} ميزة من أصل {total}',
      en: 'Showing {tier}: {n} of {total} benefits',
    },
  },
  delivery: {
    eyebrow: { ar: 'مسؤوليات مفيد', en: 'What Mufeed delivers' },
    title: {
      ar: 'نتولّى التنفيذ، لتركّز على علامتك',
      en: 'We run the city, so you can focus on your brand',
    },
    groups: [
      {
        id: 'build',
        title: { ar: 'التصميم والتنفيذ', en: 'Design and build' },
        items: [
          {
            title: { ar: 'الأعمال الإنشائية للمناطق', en: 'Construction of every zone' },
            text: {
              ar: 'بناء وتجهيز ذا هب وسوشال بوب ومنطقة الأطفال بمعايير أمان كاملة.',
              en: 'Building and fitting out The Hub, Social POP and the kids’ zone to full safety standards.',
            },
          },
          {
            title: { ar: 'التخطيط المكاني', en: 'Site planning' },
            text: {
              ar: 'تصميم المخطط العام وتوزيع المناطق وتحديد المسارات التقنية واللوجستية.',
              en: 'Masterplan design, zone layout and technical and logistics routes.',
            },
          },
          {
            title: { ar: 'البنية التحتية التقنية', en: 'Technical infrastructure' },
            text: {
              ar: 'شبكات الطاقة، والإضاءة الديناميكية، والمؤثرات البصرية، وتقنيات جدار السوق التفاعلي.',
              en: 'Power, dynamic lighting, visual effects and the technology behind the interactive market wall.',
            },
          },
          {
            title: { ar: 'التصاميم ثلاثية الأبعاد', en: '3D design' },
            text: {
              ar: 'هوية بصرية فريدة تدمج العناصر الثقافية المحلية بما يتماشى مع كل مدينة مستضيفة.',
              en: 'A distinctive visual identity that weaves in local culture for each host city.',
            },
          },
        ],
      },
      {
        id: 'operations',
        title: { ar: 'العمليات واللوجستيات', en: 'Operations and logistics' },
        items: [
          {
            title: { ar: 'إدارة الحشود', en: 'Crowd management' },
            text: {
              ar: 'تنظيم مسارات الدخول والخروج وإدارة الطوابير عبر جميع المناطق.',
              en: 'Entry and exit routes and queue management across every zone.',
            },
          },
          {
            title: { ar: 'الأمن على مدار الساعة', en: 'Round-the-clock security' },
            text: {
              ar: 'حراس أمن محترفون لتأمين محيط الموقع والمناطق الرئيسية.',
              en: 'Professional guards securing the perimeter and main zones.',
            },
          },
          {
            title: { ar: 'الصيانة وإدارة المرافق', en: 'Maintenance and facilities' },
            text: {
              ar: 'فرق صيانة ميدانية للأنظمة التقنية والكهربائية، ونظافة مستمرة.',
              en: 'On-site maintenance for technical and electrical systems, and continuous cleaning.',
            },
          },
          {
            title: { ar: 'نظام التجزئة الذكي', en: 'Smart retail system' },
            text: {
              ar: 'تشغيل جدران التسوّق وربط رموز QR بالتطبيق، وتنفيذ حملة العروض اليومية.',
              en: 'Running the shopping walls, the QR-to-app journey and the daily-deals campaign.',
            },
          },
          {
            title: { ar: 'الطوارئ والسلامة', en: 'Emergency and safety' },
            text: {
              ar: 'خطط إخلاء ولوحات سلامة وتنسيق مع الجهات الطبية والدفاع المدني.',
              en: 'Evacuation plans, safety signage and coordination with medical services and civil defence.',
            },
          },
        ],
      },
      {
        id: 'marketing',
        title: { ar: 'التسويق', en: 'Marketing' },
        items: [
          {
            title: { ar: 'حملات متكاملة', en: 'Integrated campaigns' },
            text: {
              ar: 'حملات رقمية مكثّفة ومستهدفة عبر منصات التواصل قبل الفعالية وأثناءها.',
              en: 'Targeted digital campaigns across social platforms before and during the event.',
            },
          },
          {
            title: { ar: 'إدارة المؤثرين', en: 'Influencer programme' },
            text: {
              ar: 'زيارات أبرز مؤثري الأزياء والجمال، وزوايا تصوير حصرية تحفّز المحتوى العضوي.',
              en: 'Visits from leading fashion and beauty creators, and photo spots built for organic content.',
            },
          },
          {
            title: { ar: 'تحليل الأداء', en: 'Performance tracking' },
            text: {
              ar: 'مراقبة حركة الزوّار وجمع ملاحظاتهم وتقارير تحليلية دورية.',
              en: 'Visitor-flow monitoring, feedback and regular analytics reports.',
            },
          },
        ],
      },
      {
        id: 'content',
        title: { ar: 'المحتوى والفعاليات', en: 'Content and events' },
        items: [
          {
            title: { ar: 'المحتوى التجريبي', en: 'Experience design' },
            text: {
              ar: 'تطوير الحبكات والعناصر التفاعلية لذا هب.',
              en: 'Storylines and interactive elements for The Hub.',
            },
          },
          {
            title: { ar: 'العروض الحية', en: 'Live performances' },
            text: {
              ar: 'عروض حية وأنشطة ثقافية وفنانو شارع على امتداد سوشال بوب.',
              en: 'Live shows, cultural activities and street performers along Social POP.',
            },
          },
          {
            title: { ar: 'برامج الأطفال', en: 'Kids’ programme' },
            text: {
              ar: 'ورش تعليمية يومية وألعاب تفاعلية وأنشطة إبداعية في تايني بوب.',
              en: 'Daily learning workshops, interactive games and creative activities in Tiny POP.',
            },
          },
        ],
      },
      {
        id: 'permits',
        title: { ar: 'التصاريح والعلاقات الحكومية', en: 'Permits and government relations' },
        items: [
          {
            title: { ar: 'التراخيص والموافقات', en: 'Licences and approvals' },
            text: {
              ar: 'إعداد المستندات والمخططات وشهادات السلامة لاستخراج جميع التصاريح.',
              en: 'Documents, drawings and safety certificates for every permit.',
            },
          },
          {
            title: { ar: 'التنسيق الحكومي', en: 'Government coordination' },
            text: {
              ar: 'التنسيق المباشر مع الأمانات والدفاع المدني والجهات المحلية المعنية.',
              en: 'Direct coordination with municipalities, civil defence and local authorities.',
            },
          },
        ],
      },
    ],
  },
  enquire: {
    eyebrow: { ar: 'تواصل معنا', en: 'Enquire' },
    title: { ar: 'لنبدأ الحديث', en: 'Let’s talk' },
    lead: {
      ar: 'أخبرنا بما يهمّك وسيتواصل معك فريق سيتي بوب.',
      en: 'Tell us what you are interested in and the City Pop team will get back to you.',
    },
    interest: { ar: 'مجال الاهتمام', en: 'I am interested in' },
    interests: {
      unit: { ar: 'استئجار وحدة', en: 'Leasing a unit' },
      sponsor: { ar: 'الرعاية', en: 'Sponsorship' },
      other: { ar: 'استفسار آخر', en: 'Something else' },
    },
    unitType: { ar: 'نوع الوحدة', en: 'Unit type' },
    unitNumber: { ar: 'رقم الوحدة (اختياري)', en: 'Unit number (optional)' },
    tier: { ar: 'فئة الرعاية', en: 'Sponsorship tier' },
    name: { ar: 'الاسم', en: 'Name' },
    company: { ar: 'الشركة أو العلامة التجارية', en: 'Company or brand' },
    email: { ar: 'البريد الإلكتروني', en: 'Email' },
    phone: { ar: 'رقم الجوال', en: 'Mobile number' },
    message: { ar: 'رسالتك', en: 'Message' },
    submit: { ar: 'أرسل الطلب', en: 'Send enquiry' },
    whatsapp: { ar: 'راسلنا عبر واتساب', en: 'Message us on WhatsApp' },
    emailUs: { ar: 'راسلنا بالبريد', en: 'Email us' },
    sent: {
      ar: 'وصل طلبك. سيتواصل معك فريق سيتي بوب قريبًا.',
      en: 'Thank you. The City Pop team will be in touch soon.',
    },
    failed: {
      ar: 'تعذّر الإرسال. حاول مجددًا أو تواصل معنا مباشرة.',
      en: 'We could not send that. Please try again or contact us directly.',
    },
    channelsPending: {
      ar: 'تُضاف قنوات التواصل المباشرة قريبًا.',
      en: 'Direct contact details will be added shortly.',
    },
  },
} as const;
