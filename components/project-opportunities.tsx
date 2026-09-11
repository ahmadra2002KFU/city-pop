'use client';

/* oxlint-disable nextjs/no-img-element -- Original project drawings are static local assets. */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The three overflow regions need keyboard focus for scrolling and the brief review focus transition. */
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type SubmitEvent,
} from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Expand,
  Footprints,
  Gamepad2,
  Handshake,
  Map,
  Minus,
  Palette,
  Store,
  Utensils,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { assetPath } from '@/lib/asset-path';
import {
  masterplans,
  planAnchors,
  sharedBenefits,
  spaceDetails,
  sponsorBenefits,
  sponsorships,
  type Localized,
} from '@/lib/project-content';

type Zone = { id: string; ar: string; en: string; color: string };
const audiences = [
  {
    id: 'stores',
    name: ['المتاجر وأصحابها', 'Stores & brands'],
    icon: Store,
    text: [
      'استكشف مساحات العرض وجهّز تفاصيل مشاركة متجرك.',
      'Explore exhibition spaces and prepare your store’s participation brief.',
    ],
    zone: 'hub',
  },
  {
    id: 'visitors',
    name: ['الزوار', 'Visitors'],
    icon: Footprints,
    text: [
      'اكتشف المناطق الست، وصمّم مسار زيارتك واحفظه.',
      'Discover the six zones, build your route, and save your visit plan.',
    ],
    zone: 'hub',
  },
  {
    id: 'sponsors',
    name: ['الرعاة', 'Sponsors'],
    icon: Handshake,
    text: [
      'قارن باقات الرعاية واختر نطاق المشاركة المناسب.',
      'Compare the sponsorship packages and choose your preferred scope.',
    ],
    zone: 'hub',
  },
  {
    id: 'food',
    name: ['المطاعم والكافيهات', 'Restaurants & cafés'],
    icon: Utensils,
    text: [
      'اطّلع على توزيع مساحات الطعام وحدّد نشاطك واحتياجاته.',
      'View the food spaces and outline your concept and requirements.',
    ],
    zone: 'food',
  },
  {
    id: 'operators',
    name: ['شركات ألعاب الأطفال', 'Children’s play operators'],
    icon: Gamepad2,
    text: [
      'استكشف مناطق الأطفال والألعاب، وجهّز وصف تجربتك.',
      'Explore children’s and play zones and describe your experience.',
    ],
    zone: 'kids',
  },
  {
    id: 'families',
    name: ['الأسر المنتجة', 'Home-based businesses'],
    icon: Palette,
    text: [
      'تعرّف على أكشاك الشارع الاجتماعي وجهّز تعريفًا بمنتجاتك.',
      'Explore Social Street kiosks and prepare an introduction to your products.',
    ],
    zone: 'souq',
  },
] as const;
type AudienceId = (typeof audiences)[number]['id'];
type Brief = {
  audience: AudienceId;
  zone: string;
  sponsor: string;
  name: string;
  notes: string;
};

export function ProjectStats({ ar }: { ar: boolean }) {
  const t = (a: string, e: string) => (ar ? a : e);
  return (
    <section
      className="project-stats section-shell"
      aria-labelledby="project-stats-title"
    >
      <div className="stats-intro">
        <p className="eyebrow blue">
          {t('حجم التجربة', 'THE EXPERIENCE IN NUMBERS')}
        </p>
        <h2 id="project-stats-title">
          {t('مدينة بحجم طموحك.', 'Room for big ideas.')}
        </h2>
        <p>
          {t('مؤشرات من تصوّر المشروع', 'Figures from the project proposal')}
        </p>
      </div>
      <div className="stats-grid">
        <div>
          <strong dir="ltr">
            28,189 <small>{t('م²', 'm²')}</small>
          </strong>
          <span>{t('مساحة المقترح الأول', 'First proposal footprint')}</span>
          <small>{t('المخطط الأول · ص 9', 'First masterplan · p. 9')}</small>
        </div>
        <div>
          <strong dir="ltr">2,100</strong>
          <span>
            {t(
              'الحد الأقصى المقترح لسعة الزوار',
              'Proposed maximum visitor capacity',
            )}
          </span>
          <small>
            {t('حتى 2,100 زائر · ص 9', 'Up to 2,100 visitors · p. 9')}
          </small>
        </div>
        <div>
          <strong>
            01 <small>{t('شهر', 'month')}</small>
          </strong>
          <span>{t('مدة الفعالية المقترحة', 'Proposed event duration')}</span>
          <small>{t('شهر كامل · ص 62', 'One full month · p. 62')}</small>
        </div>
        <div>
          <strong>06</strong>
          <span>{t('مناطق متنوعة', 'Distinct experience zones')}</span>
          <small>{t('مناطق المشروع · ص 7', 'Project zones · p. 7')}</small>
        </div>
      </div>
      <p className="source-note">
        {t(
          'الأرقام تخص تصوّر المشروع وليست نتائج فعلية أو توقعات حضور تراكمية. سعة المناطق المفتوحة بالمقترح الأول 1,500–1,700 زائر، وسعة الخيمة الرئيسية تُحدّد بعد استكمال التخطيط الداخلي.',
          'These are proposal figures, not achieved results or cumulative attendance forecasts. The first proposal allows 1,500–1,700 visitors outdoors; The Hub’s capacity awaits completion of its interior plan.',
        )}
      </p>
    </section>
  );
}

export function ProjectOpportunities({
  ar,
  zones,
  onOpenPlanner,
}: {
  ar: boolean;
  zones: Zone[];
  onOpenPlanner: () => void;
}) {
  const t = (a: string, e: string) => (ar ? a : e);
  const local = (value: Localized) => value[ar ? 0 : 1];
  const Arrow = ar ? ArrowUpLeft : ArrowUpRight;
  const [planIndex, setPlanIndex] = useState(0);
  const [selectedZone, setSelectedZone] = useState('hub');
  const [mapAudience, setMapAudience] = useState<AudienceId | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [review, setReview] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>(
    'idle',
  );
  const [brief, setBrief] = useState<Brief>({
    audience: 'stores',
    zone: 'hub',
    sponsor: '',
    name: '',
    notes: '',
  });
  const briefReturnFocus = useRef<HTMLElement | null>(null);
  const mapReturnFocus = useRef<HTMLElement | null>(null);
  const reviewRef = useRef<HTMLPreElement | null>(null);
  const audienceRef = useRef<HTMLSelectElement | null>(null);
  useEffect(() => {
    if (briefOpen) {
      if (review) reviewRef.current?.focus();
      else audienceRef.current?.focus();
    }
  }, [briefOpen, review]);
  const plan = masterplans[planIndex];
  const zone = zones.find((z) => z.id === selectedZone)!;
  const detail = spaceDetails[zone.id];
  const sponsor = sponsorships.find((s) => s.id === brief.sponsor);
  const audience = audiences.find((a) => a.id === brief.audience)!;
  const briefZone = zones.find((z) => z.id === brief.zone)!;
  const briefText = [
    t('سيتي بوب — مسودة طلب مشاركة', 'City Pop — participation brief'),
    t(
      'هذه مسودة محلية لم تُرسل، ولا تمثل حجزًا أو قبولًا للمشاركة.',
      'This local draft has not been submitted and is not a reservation or participation approval.',
    ),
    '',
    `${t('الفئة', 'Audience')}: ${local(audience.name)}`,
    `${t('المشروع أو النشاط', 'Business or concept')}: ${brief.name.trim()}`,
    `${t('المنطقة المفضلة', 'Preferred zone')}: ${ar ? briefZone.ar : briefZone.en}`,
    brief.audience === 'sponsors'
      ? `${t('باقة الرعاية المفضلة', 'Preferred sponsorship package')}: ${sponsor ? local(sponsor.name) : t('لم تُحدد بعد', 'Not selected yet')}`
      : '',
    brief.notes.trim()
      ? `${t('تفاصيل المشاركة والاحتياجات', 'Participation details and requirements')}: ${brief.notes.trim()}`
      : '',
    '',
    t(
      'المساحات والمزايا بحسب تصوّر المشروع؛ التخصيص والتسعير والمواعيد تتطلب اعتماد فريق سيتي بوب.',
      'Spaces and benefits follow the project proposal. Allocation, pricing, and dates require confirmation by the City Pop team.',
    ),
    t(
      'أحد مشاريع شركة مفيد، بالتعاون مع الاستديو الإبداعي.',
      'A Mufeed project, in collaboration with the Creative Studio.',
    ),
  ]
    .filter(Boolean)
    .join('\n');

  function openBrief(
    id: AudienceId,
    preferredZone?: string,
    preferredSponsor?: string,
  ) {
    briefReturnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setBrief((current) => ({
      ...current,
      audience: id,
      zone:
        preferredZone ||
        (current.audience === id
          ? current.zone
          : audiences.find((a) => a.id === id)!.zone),
      sponsor:
        preferredSponsor ?? (current.audience === id ? current.sponsor : ''),
    }));
    setReview(false);
    setDownloaded(false);
    setCopyStatus('idle');
    setBriefOpen(true);
  }
  function reviewBrief(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!brief.name.trim()) return;
    setReview(true);
  }
  function downloadBrief() {
    const url = URL.createObjectURL(
      new Blob(['\uFEFF', briefText], { type: 'text/plain;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `city-pop-${brief.audience}-brief.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(briefText);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
  }

  return (
    <>
      <section
        className="services-section section-shell"
        id="services"
        aria-labelledby="services-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow pink">
              {t('لك مكان في سيتي بوب', 'FIND YOUR PLACE IN CITY POP')}
            </p>
            <h2 id="services-title">
              {t('كيف تحب تشارك؟', 'How will you be part of it?')}
            </h2>
          </div>
          <p>
            {t(
              'خدمات إلكترونية تبدأ من احتياجك.\nاختر مسارك واكتشف الخطوة التالية.',
              'Digital services built around your needs.\nChoose your path and take the next step.',
            )}
          </p>
        </div>
        <div className="service-grid">
          {audiences.map((item, index) => (
            <article className="service-card" key={item.id}>
              <div className="service-card-top">
                <item.icon size={25} />
                <span>0{index + 1}</span>
              </div>
              <h3>{local(item.name)}</h3>
              <p>{local(item.text)}</p>
              <div className="service-actions">
                {item.id === 'visitors' ? (
                  <button onClick={onOpenPlanner}>
                    {t('صمّم زيارتك', 'Build your visit')}
                    <Arrow size={18} />
                  </button>
                ) : (
                  <>
                    <button onClick={() => openBrief(item.id)}>
                      {t('جهّز مسودة مشاركة', 'Prepare a participation brief')}
                      <Arrow size={18} />
                    </button>
                    <a
                      href={
                        item.id === 'sponsors' ? '#sponsorship' : '#masterplan'
                      }
                      onClick={() => {
                        setSelectedZone(item.zone);
                        setPlanIndex(0);
                        setMapAudience(item.id);
                      }}
                    >
                      {item.id === 'sponsors'
                        ? t('قارن الباقات', 'Compare packages')
                        : t('استكشف المساحات', 'Explore spaces')}
                    </a>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="service-availability">
          <span className="availability-label">
            {t('متاح في هذه النسخة', 'AVAILABLE IN THIS DEMO')}
          </span>
          <p>
            {t(
              'تخطيط الزيارة وحفظ المسار، استعراض المخططات، مقارنة الباقات، وتجهيز مسودة طلب قابلة للتنزيل. الإرسال والحجز والدفع الإلكتروني لم تُفعّل بعد.',
              'Plan and save a visit, explore layouts, compare packages, and download a participation brief. Submission, booking, and online payment are not enabled yet.',
            )}
          </p>
        </div>
      </section>

      <section
        className="masterplan-section section-shell"
        id="masterplan"
        aria-labelledby="masterplan-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow blue">
              {t('من التصوّر إلى المساحة', 'SEE THE BIGGER PICTURE')}
            </p>
            <h2 id="masterplan-title">
              {t('المخطط والمساحات', 'The layout. Your space.')}
            </h2>
          </div>
          <p>
            {t(
              'ثلاثة مقترحات من ملف المشروع.\nاستكشف توزيع المدينة وفرص المشاركة.',
              'Three layouts from the project brief.\nExplore the city and its participation spaces.',
            )}
          </p>
        </div>
        <div className="masterplan-board">
          <div className="plan-toolbar">
            <fieldset
              className="plan-options"
              aria-label={t('اختيار المخطط', 'Choose a layout')}
            >
              {masterplans.map((item, index) => (
                <button
                  key={item.image}
                  aria-pressed={planIndex === index}
                  onClick={() => setPlanIndex(index)}
                >
                  {local(item.label)}
                </button>
              ))}
            </fieldset>
            <div className="plan-area" aria-live="polite">
              <Map size={19} />
              <b dir="ltr">{plan.area}</b>
              <span>{t('م²', 'm²')}</span>
            </div>
          </div>
          <figure className="plan-figure">
            <div className="plan-image-wrap" dir="ltr">
              <img
                src={assetPath(`/images/${plan.image}`)}
                alt={t(
                  `المخطط العام — ${local(plan.label)}، بمساحة ${plan.area} متر مربع، من صفحة ${plan.page} في ملف المشروع`,
                  `${local(plan.label)} masterplan, ${plan.area} square metres, from page ${plan.page} of the project brief`,
                )}
                width={4096}
                height={planIndex === 2 ? 1285 : 1437}
                loading="lazy"
              />
              {planIndex === 0 &&
                zones.map((z) => (
                  <button
                    key={z.id}
                    className="plan-marker"
                    style={
                      {
                        left: `${planAnchors[z.id].x}%`,
                        top: `${planAnchors[z.id].y}%`,
                        '--zone-color': z.color,
                      } as CSSProperties
                    }
                    aria-label={t(`استكشف ${z.ar}`, `Explore ${z.en}`)}
                    aria-pressed={selectedZone === z.id}
                    onClick={() => setSelectedZone(z.id)}
                  >
                    {planAnchors[z.id].number}
                  </button>
                ))}
            </div>
            <figcaption>
              <span>
                {t(
                  `رسم أصلي من ملف المشروع · ص ${plan.page}`,
                  `Original project drawing · p. ${plan.page}`,
                )}
              </span>
              <button
                onClick={() => {
                  mapReturnFocus.current =
                    document.activeElement instanceof HTMLElement
                      ? document.activeElement
                      : null;
                  setMapOpen(true);
                }}
              >
                <Expand size={16} />
                {t('تكبير المخطط', 'Enlarge layout')}
              </button>
              <a href={assetPath(`/images/${plan.image}`)} download>
                <Download size={16} />
                {t('تنزيل المخطط', 'Download layout')}
              </a>
            </figcaption>
          </figure>
          {planIndex === 0 ? (
            <>
              <fieldset
                className="map-legend"
                aria-label={t('مناطق المقترح الأول', 'First proposal zones')}
              >
                {zones.map((z) => (
                  <button
                    key={z.id}
                    aria-pressed={selectedZone === z.id}
                    onClick={() => setSelectedZone(z.id)}
                    style={{ '--zone-color': z.color } as CSSProperties}
                  >
                    <span>{planAnchors[z.id].number}</span>
                    {ar ? z.ar : z.en}
                  </button>
                ))}
              </fieldset>
              <div className="space-detail" aria-live="polite">
                <div>
                  <span className="space-kicker">
                    {t('المساحة المختارة', 'SELECTED AREA')}
                  </span>
                  <h3>{ar ? zone.ar : zone.en}</h3>
                  <p>{local(detail.format)}</p>
                </div>
                <div>
                  <strong>{local(detail.dimension)}</strong>
                  <p>
                    {t(
                      `الأبعاد والتوزيع بحسب ملف المشروع · ص ${detail.source}`,
                      `Dimensions and layout from the project brief · p. ${detail.source}`,
                    )}
                  </p>
                </div>
                <Button
                  className="outline-action"
                  onClick={() =>
                    openBrief(
                      mapAudience ??
                        (zone.id === 'food'
                          ? 'food'
                          : zone.id === 'kids' || zone.id === 'play'
                            ? 'operators'
                            : zone.id === 'stage'
                              ? 'sponsors'
                              : 'stores'),
                      zone.id,
                    )
                  }
                >
                  {t('أضف لمسودة المشاركة', 'Use in my brief')}
                  <Arrow size={18} />
                </Button>
              </div>
            </>
          ) : (
            <p className="alternate-plan-note">
              {t(
                'هذا مقترح مستقل للمقارنة، وليس توسعة للمقترح الأول. استعرض المقترح الأول للاطّلاع على تفاصيل المناطق والمساحات.',
                'This is a separate layout alternative, not an extension of the first. Select proposal one to explore the area and space details.',
              )}
            </p>
          )}
        </div>
        <p className="source-note">
          {t(
            'المخططات تصوّر أولي، والأرقام على الصورة مفاتيح تعريف للمناطق وليست أرقام وحدات تأجيرية. لا يتضمن الملف حصرًا نهائيًا للوحدات أو أسعارًا أو حالة توفر؛ تخصيص المساحات يخضع للاتفاق.',
            'The drawings are preliminary. Image markers identify areas, not rental unit numbers. The brief has no final unit inventory, prices, or availability; space allocation is subject to agreement.',
          )}
        </p>
      </section>

      <section
        className="sponsor-section section-shell"
        id="sponsorship"
        aria-labelledby="sponsor-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow pink">
              {t('علامتك، وسط التجربة', 'YOUR BRAND. IN THE EXPERIENCE.')}
            </p>
            <h2 id="sponsor-title">
              {t('باقات الرعاية', 'Sponsorship packages')}
            </h2>
          </div>
          <p>
            {t(
              'ثلاث باقات بنطاقات مختلفة،\nكما وردت في ملف المشروع.',
              'Three packages with distinct scopes,\nas set out in the project brief.',
            )}
          </p>
        </div>
        <div className="sponsor-cards">
          {sponsorships.map((item, index) => (
            <article
              key={item.id}
              className={`sponsor-card sponsor-${item.id}`}
              style={{ '--tier-color': item.color } as CSSProperties}
            >
              <div className="sponsor-card-heading">
                <span className="tier-index">0{index + 1}</span>
                <span>{item.name[1].toUpperCase()}</span>
              </div>
              <h3>{local(item.name)}</h3>
              <p>{local(item.focus)}</p>
              <ul>
                {sponsorBenefits.map((benefit) => {
                  const value = benefit.values[index];
                  return value === false ? null : (
                    <li key={benefit.label[1]}>
                      <Check size={17} />
                      <span>
                        {typeof value === 'boolean'
                          ? local(benefit.label)
                          : `${local(benefit.label)}: ${local(value)}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <button
                className="tier-action"
                onClick={() => openBrief('sponsors', 'hub', item.id)}
              >
                {t('جهّز طلب هذه الباقة', 'Prepare a package brief')}
                <Arrow size={18} />
              </button>
            </article>
          ))}
        </div>
        <div className="shared-benefits">
          <h3>{t('في جميع الباقات', 'Included in every package')}</h3>
          {sharedBenefits.map((item) => (
            <span key={item[1]}>
              <Check size={18} />
              {local(item)}
            </span>
          ))}
        </div>
        <details className="sponsor-comparison">
          <summary>
            {t('عرض المقارنة التفصيلية', 'View the detailed comparison')}
            <PlusMinus />
          </summary>
          <section
            className="comparison-scroll"
            tabIndex={0}
            aria-label={t(
              'جدول مقارنة الباقات قابل للتمرير',
              'Scrollable package comparison',
            )}
          >
            <table>
              <caption className="sr-only">
                {t(
                  'مقارنة باقات الرعاية من صفحة 59 في ملف المشروع',
                  'Sponsorship package comparison from page 59 of the project brief',
                )}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{t('الميزة', 'Benefit')}</th>
                  {sponsorships.map((item) => (
                    <th key={item.id} scope="col">
                      {local(item.name)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sponsorBenefits.map((benefit) => (
                  <tr key={benefit.label[1]}>
                    <th scope="row">{local(benefit.label)}</th>
                    {benefit.values.map((value, index) => (
                      <td key={sponsorships[index].id}>
                        {typeof value === 'boolean' ? (
                          <span className="benefit-state">
                            {value ? <Check size={18} /> : <Minus size={18} />}
                            <span>
                              {value
                                ? t('مشمول', 'Included')
                                : t('غير مشمول', 'Not included')}
                            </span>
                          </span>
                        ) : (
                          local(value)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </details>
        <p className="source-note">
          {t(
            'المصدر: مقارنة الباقات، ص 59. لا يحدد الملف أسعار الرعاية؛ النطاق النهائي والتخصيص يخضعان للاتفاق. هذه الباقات جزء من تصوّر المشروع وليست عرضًا تعاقديًا.',
            'Source: package comparison, p. 59. Sponsorship prices are not specified; final scope and allocation are subject to agreement. These packages describe the project concept and are not a contractual offer.',
          )}
        </p>
      </section>

      <Dialog open={mapOpen} onOpenChange={setMapOpen}>
        <DialogContent
          className="map-dialog"
          dir={ar ? 'rtl' : 'ltr'}
          showCloseButton={false}
          finalFocus={() =>
            mapReturnFocus.current?.isConnected
              ? mapReturnFocus.current
              : document.getElementById('language-switch')
          }
        >
          <button
            className="dialog-close"
            onClick={() => setMapOpen(false)}
            aria-label={t('إغلاق', 'Close')}
          >
            <X size={22} />
          </button>
          <DialogTitle>
            {t('المخطط العام', 'Masterplan')} — {local(plan.label)}
          </DialogTitle>
          <DialogDescription>
            {t(
              'مرّر أفقيًا لرؤية تفاصيل الرسم. يمكنك تنزيل النسخة الأصلية وتكبيرها على جهازك.',
              'Scroll horizontally to see the drawing details, or download the original to zoom on your device.',
            )}
          </DialogDescription>
          <section
            className="full-map-scroll"
            tabIndex={0}
            aria-label={t(
              'المخطط المكبر قابل للتمرير',
              'Scrollable enlarged masterplan',
            )}
            dir="ltr"
          >
            <img
              src={assetPath(`/images/${plan.image}`)}
              width={4096}
              height={planIndex === 2 ? 1285 : 1437}
              alt={t(
                `المخطط العام، ${local(plan.label)}`,
                `Masterplan, ${local(plan.label)}`,
              )}
            />
          </section>
          <a
            className="outline-action"
            href={assetPath(`/images/${plan.image}`)}
            download
          >
            <Download size={18} />
            {t('تنزيل المخطط الأصلي', 'Download the original drawing')}
          </a>
        </DialogContent>
      </Dialog>

      <Dialog open={briefOpen} onOpenChange={setBriefOpen}>
        <DialogContent
          className="brief-dialog"
          dir={ar ? 'rtl' : 'ltr'}
          showCloseButton={false}
          finalFocus={() =>
            briefReturnFocus.current?.isConnected
              ? briefReturnFocus.current
              : document.getElementById('language-switch')
          }
        >
          <button
            className="dialog-close"
            onClick={() => setBriefOpen(false)}
            aria-label={t('إغلاق', 'Close')}
          >
            <X size={22} />
          </button>
          <p className="eyebrow pink">
            {t('خطوتك الأولى للمشاركة', 'YOUR FIRST STEP TO PARTICIPATE')}
          </p>
          <DialogTitle>
            {review
              ? t('راجع مسودة مشاركتك', 'Review your participation brief')
              : t('جهّز مسودة مشاركتك', 'Prepare your participation brief')}
          </DialogTitle>
          <DialogDescription>
            {t(
              'جهّز اختياراتك لتنزيلها على جهازك. لا يُرسل هذا النموذج إلى فريق سيتي بوب، ولا يحجز مساحة أو باقة.',
              'Prepare your choices to download to your device. This form is not sent to the City Pop team and does not reserve a space or package.',
            )}
          </DialogDescription>
          {review ? (
            <div className="brief-review">
              <pre ref={reviewRef} tabIndex={0}>
                {briefText}
              </pre>
              <div className="brief-buttons">
                <Button className="primary-link" onClick={downloadBrief}>
                  <Download size={18} />
                  {t('تنزيل المسودة', 'Download brief')}
                </Button>
                <button className="outline-action" onClick={copyBrief}>
                  <Copy size={18} />
                  {t('نسخ النص', 'Copy text')}
                </button>
                <button
                  className="outline-action"
                  onClick={() => {
                    setReview(false);
                    setDownloaded(false);
                    setCopyStatus('idle');
                  }}
                >
                  {t('تعديل التفاصيل', 'Edit details')}
                </button>
              </div>
              <output className="brief-status">
                {copyStatus === 'copied'
                  ? t(
                      'تم نسخ النص. لم تُرسل المسودة إلى فريق سيتي بوب.',
                      'Text copied. The brief has not been submitted to City Pop.',
                    )
                  : copyStatus === 'error'
                    ? t(
                        'تعذّر النسخ التلقائي. يمكنك تحديد النص ونسخه أو تنزيل الملف.',
                        'Automatic copying is unavailable. Select and copy the text, or download the file.',
                      )
                    : downloaded
                      ? t(
                          'تم تجهيز الملف للتنزيل. لم تُرسل المسودة إلى فريق سيتي بوب.',
                          'The file is ready to download. The brief has not been submitted to City Pop.',
                        )
                      : t(
                          'راجع التفاصيل ثم نزّل نسختك.',
                          'Review the details, then download your copy.',
                        )}
              </output>
            </div>
          ) : (
            <form className="brief-form" onSubmit={reviewBrief}>
              <label htmlFor="brief-audience">
                {t('نوع المشاركة', 'Participation type')}
                <select
                  id="brief-audience"
                  ref={audienceRef}
                  value={brief.audience}
                  onChange={(event) => {
                    const next = audiences.find(
                      (a) => a.id === event.target.value,
                    )!;
                    setBrief({ ...brief, audience: next.id, zone: next.zone });
                  }}
                >
                  {audiences
                    .filter((a) => a.id !== 'visitors')
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {local(item.name)}
                      </option>
                    ))}
                </select>
              </label>
              <label htmlFor="brief-name">
                {t('اسم المشروع أو النشاط', 'Business or concept name')}{' '}
                <span className="required-label">
                  {t('(مطلوب)', '(required)')}
                </span>
                <input
                  id="brief-name"
                  name="business"
                  required
                  maxLength={100}
                  pattern=".*\S.*"
                  value={brief.name}
                  onChange={(event) =>
                    setBrief({ ...brief, name: event.target.value })
                  }
                />
              </label>
              {brief.audience === 'sponsors' && (
                <label htmlFor="brief-sponsor">
                  {t('باقة الرعاية المفضلة', 'Preferred sponsorship package')}
                  <select
                    id="brief-sponsor"
                    value={brief.sponsor}
                    onChange={(event) =>
                      setBrief({ ...brief, sponsor: event.target.value })
                    }
                  >
                    <option value="">
                      {t(
                        'لم أحدد باقة بعد',
                        'I have not selected a package yet',
                      )}
                    </option>
                    {sponsorships.map((item) => (
                      <option key={item.id} value={item.id}>
                        {local(item.name)}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {
                <label htmlFor="brief-zone">
                  {t('المنطقة المفضلة', 'Preferred zone')}
                  <select
                    id="brief-zone"
                    value={brief.zone}
                    onChange={(event) =>
                      setBrief({ ...brief, zone: event.target.value })
                    }
                  >
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {ar ? z.ar : z.en}
                      </option>
                    ))}
                  </select>
                </label>
              }
              <label htmlFor="brief-notes">
                {t(
                  'عن المشاركة والاحتياجات',
                  'Participation details and requirements',
                )}
                <textarea
                  id="brief-notes"
                  rows={3}
                  maxLength={600}
                  value={brief.notes}
                  onChange={(event) =>
                    setBrief({ ...brief, notes: event.target.value })
                  }
                  placeholder={t(
                    'وصف مختصر للمنتجات أو التجربة واحتياجات المساحة.',
                    'Briefly describe your products or experience and space requirements.',
                  )}
                />
              </label>
              <Button className="primary-link full-width" type="submit">
                {t('مراجعة المسودة', 'Review brief')}
                <Arrow size={18} />
              </Button>
              <p className="brief-status">
                {t(
                  'تبقى التفاصيل في هذه الصفحة حتى إغلاقها أو إعادة تحميلها؛ نزّل المسودة للاحتفاظ بها.',
                  'Details stay on this page until it is closed or reloaded. Download the brief to keep a copy.',
                )}
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function PlusMinus() {
  return (
    <span aria-hidden="true" className="comparison-toggle">
      +
    </span>
  );
}
