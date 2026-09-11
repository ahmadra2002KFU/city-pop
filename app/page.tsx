'use client';

/* oxlint-disable nextjs/no-img-element -- Static export serves the original artwork locally, without an image service. */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { decodePlan } from '@/lib/visit-plan';
import { assetPath } from '@/lib/asset-path';
import {
  ProjectOpportunities,
  ProjectStats,
} from '@/components/project-opportunities';
import {
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Sparkles,
  ShoppingBag,
  Utensils,
  Music2,
  Gamepad2,
  Palette,
  Check,
  Plus,
  X,
  Menu,
  ScanLine,
  PackageCheck,
  Bookmark,
  Route,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

type Language = 'ar' | 'en';
const zones = [
  {
    id: 'hub',
    en: 'The Hub',
    ar: 'الخيمة الرئيسية',
    tag: ['الجمال وأسلوب الحياة', 'Beauty & lifestyle'],
    image: 'hub.jpg',
    icon: ShoppingBag,
    color: '#ffb6c3',
    description: [
      'عالم الجمال وأسلوب الحياة. اكتشف علاماتك المفضلة، جرّب منتجات جديدة، وتعلّم شيئًا تحبه.',
      'A world of beauty and lifestyle. Meet your favorite brands, try something new, and learn something you love.',
    ],
    experiences: [
      ['تجارب الجمال', 'ورش قصيرة', 'تسوّق تفاعلي'],
      ['Beauty experiences', 'Bite-size workshops', 'Interactive shopping'],
    ],
  },
  {
    id: 'souq',
    en: 'Social Street',
    ar: 'الشارع الاجتماعي',
    tag: ['المتاجر والحرف', 'Shops & local makers'],
    image: 'souq.jpg',
    icon: Sparkles,
    color: '#45bafa',
    description: [
      'شارع ينبض بالحياة، يجمع الحرفيين والمتاجر المؤقتة وعروض الشارع. في كل زاوية، حكاية تستحق الاكتشاف.',
      'A lively social street of local makers, pop-up stores, and street performances. Every corner has a story.',
    ],
    experiences: [
      ['حرفيون محليون', 'متاجر مؤقتة', 'عروض الشارع'],
      ['Local makers', 'Pop-up stores', 'Street performances'],
    ],
  },
  {
    id: 'food',
    en: 'Restaurants & Cafés',
    ar: 'المطاعم والمقاهي',
    tag: ['ذُق واستمتع', 'Taste & unwind'],
    image: 'food.jpg',
    icon: Utensils,
    color: '#ffc58d',
    description: [
      'من أول قهوة إلى آخر لقمة. مطاعم ومقاهٍ ونكهات محلية، وجلسات تخلّي اللحظة أحلى.',
      'From your first coffee to your last bite. Restaurants, cafés, and local flavors made for slowing down together.',
    ],
    experiences: [
      ['مطاعم ومقاهٍ', 'نكهات محلية', 'جلسات اجتماعية'],
      ['Restaurants & cafés', 'Local flavors', 'Social spaces'],
    ],
  },
  {
    id: 'kids',
    en: 'Tiny Town',
    ar: 'المدينة الصغيرة',
    tag: ['ألعاب وأنشطة الأطفال', 'Children’s play & activities'],
    image: 'kids.jpg',
    icon: Palette,
    color: '#b5a0f7',
    description: [
      'مدينة صغيرة لخيال كبير. عالم للصغار يجمع اللعب والفنون والورش المصغّرة في تجربة مليئة بالاكتشاف.',
      'A little city for big imaginations. A world of play, art, and mini workshops that gives curiosity room to grow.',
    ],
    experiences: [
      ['ألعاب تفاعلية', 'فنون وإبداع', 'ورش للصغار'],
      ['Interactive play', 'Arts & creativity', 'Mini workshops'],
    ],
  },
  {
    id: 'stage',
    en: 'Main Stage',
    ar: 'المسرح الرئيسي',
    tag: ['الموسيقى والعروض', 'Music & performances'],
    image: 'stage.jpg',
    icon: Music2,
    color: '#fa9bbc',
    description: [
      'هنا ترتفع الموسيقى وتبدأ الحكايات. مساحة للعروض الحية، والفنون، ولحظات الإطلاق التي تجمعنا.',
      'Where the music rises and stories begin. A home for live performances, the arts, and shared moments.',
    ],
    experiences: [
      ['موسيقى حيّة', 'عروض وفنون', 'لحظات الإطلاق'],
      ['Live music', 'Performances & arts', 'Launch moments'],
    ],
  },
  {
    id: 'play',
    en: 'Pop Off',
    ar: 'بوب أوف',
    tag: ['الألعاب والتحديات', 'Games & challenges'],
    image: 'play.jpg',
    icon: Gamepad2,
    color: '#74d8d2',
    description: [
      'شوية منافسة، وكثير من الضحك. اجمع أصحابك للأركيد والألعاب الكرنفالية والليزر وغرف الهروب.',
      'A little friendly competition. A lot of laughter. Bring your crew for arcades, carnival games, laser tag, and escape rooms.',
    ],
    experiences: [
      ['أركيد وكرنفال', 'ليزر تاغ', 'غرف الهروب'],
      ['Arcade & carnival', 'Laser tag', 'Escape rooms'],
    ],
  },
].sort(
  (a, b) =>
    ['hub', 'souq', 'kids', 'food', 'stage', 'play'].indexOf(a.id) -
    ['hub', 'souq', 'kids', 'food', 'stage', 'play'].indexOf(b.id),
);

const zoneIds = zones.map((zone) => zone.id);
function subscribePlan(notify: () => void) {
  window.addEventListener('storage', notify);
  window.addEventListener('city-pop-plan-updated', notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener('city-pop-plan-updated', notify);
  };
}
function readPlanSnapshot() {
  try {
    return localStorage.getItem('city-pop-plan') || '[]';
  } catch {
    return '[]';
  }
}
function emptyPlanSnapshot() {
  return '[]';
}

export default function Home() {
  const plannerReturnFocus = useRef<HTMLElement | null>(null);
  function openPlanner() {
    plannerReturnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setPlanner(true);
  }
  const [lang, setLang] = useState<Language>('ar');
  const storedPlan = useSyncExternalStore(
    subscribePlan,
    readPlanSnapshot,
    emptyPlanSnapshot,
  );
  const [draft, setDraft] = useState<string[] | null>(null);
  const selected = draft ?? decodePlan(storedPlan, zoneIds);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [planner, setPlanner] = useState(false);
  const [saved, setSaved] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [menu, setMenu] = useState(false);
  const ar = lang === 'ar';
  const t = (arabic: string, english: string) => (ar ? arabic : english);
  const Arrow = ar ? ArrowLeft : ArrowRight;
  const Diagonal = ar ? ArrowUpLeft : ArrowUpRight;
  const current = zones.find((zone) => zone.id === activeZone);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ar ? 'rtl' : 'ltr';
  }, [lang, ar]);
  function toggleZone(id: string) {
    setDraft(
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id],
    );
    setSaved(false);
    setStorageError(false);
  }
  function savePlan() {
    try {
      localStorage.setItem('city-pop-plan', JSON.stringify(selected));
      window.dispatchEvent(new Event('city-pop-plan-updated'));
      setDraft(null);
      setSaved(true);
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }
  return (
    <div className="city-site" id="top" dir={ar ? 'rtl' : 'ltr'}>
      <a className="skip-link" href="#main">
        {t('انتقل إلى المحتوى', 'Skip to content')}
      </a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="City Pop">
          <img
            src={assetPath('/images/city-pop-wordmark.png')}
            alt="CITY POP"
            width={175}
            height={35}
          />
        </a>
        <nav
          className="desktop-nav"
          aria-label={t('القائمة الرئيسية', 'Main navigation')}
        >
          <a href="#zones">{t('المناطق', 'Zones')}</a>
          <a href="#services">{t('الخدمات الإلكترونية', 'Digital services')}</a>
          <a href="#masterplan">{t('المخطط والمساحات', 'Layout & spaces')}</a>
          <a href="#sponsorship">{t('الرعاية', 'Sponsorship')}</a>
        </nav>
        <div className="header-actions">
          <button
            id="language-switch"
            className="language-button"
            onClick={() => setLang(ar ? 'en' : 'ar')}
            aria-label={t('Switch to English', 'التبديل إلى العربية')}
          >
            {ar ? 'EN' : 'عربي'}
          </button>
          <Button className="header-cta" onClick={() => openPlanner()}>
            {t('صمّم زيارتك', 'Make it your day')}
            <Diagonal size={17} />
          </Button>
          <button
            className="menu-button"
            aria-expanded={menu}
            aria-controls="mobile-nav"
            aria-label={t('القائمة', 'Menu')}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {menu && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label={t('التنقل', 'Navigation')}
        >
          {[
            ['#about', t('عن سيتي بوب', 'The story')],
            ['#zones', t('اكتشف المناطق', 'Explore the zones')],
            ['#services', t('الخدمات الإلكترونية', 'Digital services')],
            ['#masterplan', t('المخطط والمساحات', 'Layout & spaces')],
            ['#sponsorship', t('باقات الرعاية', 'Sponsorship packages')],
            ['#experience', t('التجربة', 'The experience')],
          ].map(([href, label]) => (
            <a href={href} key={href} onClick={() => setMenu(false)}>
              {label}
              <Arrow size={18} />
            </a>
          ))}
          <button
            onClick={() => {
              openPlanner();
              setMenu(false);
            }}
          >
            {t('صمّم زيارتك', 'Make it your day')}
            <Plus size={18} />
          </button>
        </nav>
      )}
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="eyebrow hero-eyebrow">
              <span className="live-dot" />
              {t('وجهتك القادمة للاكتشاف', 'YOUR NEXT GREAT DISCOVERY')}
            </p>
            <h1 id="hero-title">
              {t('من الشاشة', 'From your feed.')}
              <br />
              <span>{t('إلى الشارع.', 'Into your world.')}</span>
            </h1>
            <p className="hero-copy">
              {t(
                'مدينة تنبض بالجمال، والمذاق، والموسيقى.',
                'A city of beauty, flavor, and music.',
              )}
              <br />
              {t(
                'وكل الأشياء اللي تحبّها… في مكان واحد.',
                'Everything you love. All in one place.',
              )}
            </p>
            <div className="hero-links">
              <a className="hero-action hero-discover-link" href="#zones">
                {t('اكتشف سيتي بوب', 'Step into City Pop')}
                <Arrow size={19} />
              </a>
              <a className="hero-action hero-partner-link" href="#services">
                {t('المشاركة والرعاية', 'Participation & sponsorship')}
                <Diagonal size={18} />
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="hero-image"
              src={assetPath('/images/city-pop-gate.jpg')}
              alt={t(
                'تصوّر بوابة سيتي بوب المضيئة بالنيون الوردي والأزرق',
                'City Pop concept entrance illuminated in pink and blue neon',
              )}
              width={3594}
              height={2006}
              fetchPriority="high"
            />
          </div>
          <div className="hero-edge-label" aria-hidden="true">
            A LITTLE ESCAPE. A LOT TO DISCOVER.
          </div>
          <div className="hero-bottom">
            <span>
              <MapPin size={17} />
              {t('الخبر، المملكة العربية السعودية', 'Al Khobar, Saudi Arabia')}
            </span>
            <span className="concept-note">
              {t(
                'تصوّر التجربة · الانطلاقة المقترحة',
                'EXPERIENCE CONCEPT · PROPOSED FIRST STOP',
              )}
            </span>
            <a
              href="#about"
              className="scroll-cue"
              aria-label={t('اكتشف المزيد', 'Discover more')}
            >
              <ArrowDown size={19} />
            </a>
          </div>
        </section>
        <div className="ticker" aria-hidden="true">
          <div>
            {[0, 1].map((n) => (
              <span className="ticker-group" key={n}>
                {['SHOP', 'DISCOVER', 'TASTE', 'PLAY', 'CONNECT', 'REPEAT'].map(
                  (word, i) => (
                    <span key={word}>
                      <b className={i % 2 ? 'pink' : 'blue'}>✳</b>
                      {word}
                    </span>
                  ),
                )}
              </span>
            ))}
          </div>
        </div>
        <section className="about section-shell" id="about">
          <div>
            <p className="eyebrow pink">
              {t('مو بس وجهة. عالم كامل.', 'MORE THAN A DESTINATION.')}
            </p>
            <h2>
              {t('كلّ اللي تحبّه،', 'Your kind of people.')}
              <br />
              <span className="muted-title">
                {t('بطريقة ما جرّبتها.', 'Your kind of place.')}
              </span>
            </h2>
          </div>
          <div className="about-copy">
            <p>
              {t(
                'سيتي بوب مدينة متنقلة تحتفي بالجمال وأسلوب الحياة. نقرّب لك عالمك الرقمي، ونحوّله إلى تجارب تعيشها بكل حواسك؛ من اكتشاف علامة جديدة، إلى ضحكة مع أصحابك، ولحظة تستاهل تتصوّر.',
                'City Pop is a traveling celebration of beauty and lifestyle. We bring your digital world to life through experiences you can feel, taste, and share. Discover a new brand. Make a memory with your people. Find a moment worth keeping.',
              )}
            </p>
            <p className="project-credit">
              {t(
                'أحد مشاريع شركة مفيد، بالتعاون مع الاستديو الإبداعي.',
                'A Mufeed project, in collaboration with the Creative Studio.',
              )}
            </p>
            <div className="about-facts">
              <div>
                <strong>06</strong>
                <span>{t('مناطق تنتظرك', 'zones to explore')}</span>
              </div>
              <div>
                <strong>01</strong>
                <span>{t('مدينة تجمعنا', 'city, endless connections')}</span>
              </div>
              <span className="tiny-manifesto">
                {t(
                  'تسوّق. جرّب. تعلّم.\nالتقِ. العب. شارك.',
                  'SHOP. TRY. LEARN.\nMEET. PLAY. SHARE.',
                )}
              </span>
            </div>
          </div>
        </section>
        <ProjectStats ar={ar} />
        <section className="zones-section section-shell" id="zones">
          <div className="section-heading">
            <div>
              <p className="eyebrow blue">
                {t('عالمك، على مزاجك', 'FIND YOUR KIND OF HAPPY')}
              </p>
              <h2>
                {t(
                  'ست مناطق. واحتمالات بلا حدود.',
                  'Six zones. Endless possibilities.',
                )}
              </h2>
            </div>
            <p>
              {t(
                'كل منطقة لها روح.\nابدأ باللي يشبهك.',
                'Every zone has its own energy.\nStart with the one that feels like you.',
              )}
            </p>
          </div>
          <div className="zone-grid">
            {zones.map((zone, index) => {
              const Icon = zone.icon;
              return (
                <button
                  className="zone-card"
                  key={zone.id}
                  onClick={() => setActiveZone(zone.id)}
                  style={{ '--zone-color': zone.color } as React.CSSProperties}
                  aria-label={t(`اكتشف ${zone.ar}`, `Explore ${zone.en}`)}
                >
                  <img
                    src={assetPath(`/images/${zone.image}`)}
                    alt=""
                    loading="lazy"
                    width={720}
                    height={600}
                  />
                  <div className="card-shade" />
                  <span className="zone-number">0{index + 1} /</span>
                  <span className="zone-tag">
                    <Icon size={14} />
                    {zone.tag[ar ? 0 : 1]}
                  </span>
                  <div className="zone-card-bottom">
                    <div>
                      <span className="zone-english">
                        {zone.en.toUpperCase()}
                      </span>
                      <h3>{ar ? zone.ar : zone.en}</h3>
                    </div>
                    <span className="round-arrow">
                      <Diagonal size={21} />
                    </span>
                  </div>
                  {selected.includes(zone.id) && (
                    <span className="selected-label">
                      <Check size={14} />
                      {t('في مسارك', 'On your route')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="zone-footnote">
            <span className="live-dot" />
            {t(
              'المشاهد تصوّرات من المشروع، تعكس روح التجربة المرتقبة.',
              'Scenes from the project vision. A glimpse of the experience to come.',
            )}
          </p>
        </section>
        <ProjectOpportunities
          ar={ar}
          zones={zones}
          onOpenPlanner={openPlanner}
        />
        <section className="experience section-shell" id="experience">
          <div className="experience-visual">
            <img
              src={assetPath('/images/experience.jpg')}
              alt={t(
                'تصوّر الساحة الاجتماعية داخل سيتي بوب',
                'Concept of the social courtyard inside City Pop',
              )}
              loading="lazy"
              width={960}
              height={900}
            />
            <div className="experience-image-shade" />
            <div className="experience-stamp">
              <ScanLine size={28} />
              <span>
                OFFLINE MOMENTS.
                <br />
                ONLINE POSSIBILITIES.
              </span>
            </div>
          </div>
          <div className="experience-copy">
            <p className="eyebrow pink">
              {t('من إعجاب… إلى تجربة', 'LESS SCROLLING. MORE LIVING.')}
            </p>
            <h2>
              {t('لا تكتفي تشوفه.', 'Don’t just see it.')}
              <br />
              <span className="gradient-text">
                {t('جرّبه بنفسك.', 'Make it a moment.')}
              </span>
            </h2>
            <p>
              {t(
                'المنتجات اللي لفتت انتباهك، تصير قدّامك. تصوّر تسوّق يمزج متعة الاكتشاف على أرض الواقع بسهولة الشراء الرقمي.',
                'The products that caught your eye, right in front of you. A shopping concept that brings real-world discovery together with the ease of buying online.',
              )}
            </p>
            <ol className="experience-steps">
              {[
                {
                  icon: Sparkles,
                  title: t('اكتشف وجرّب', 'Discover & try'),
                  text: t(
                    'تعرّف على العلامة، وجرّب اللي يناسبك.',
                    'Meet the brand. Find what feels right for you.',
                  ),
                },
                {
                  icon: ScanLine,
                  title: t('امسح وتسوّق', 'Scan & shop'),
                  text: t(
                    'تصوّر شراء رقمي عبر رمز QR.',
                    'A proposed QR journey to buy digitally.',
                  ),
                },
                {
                  icon: PackageCheck,
                  title: t('كمّل يومك بخفّة', 'Keep your hands free'),
                  text: t(
                    'توصيل مشترياتك، ومزيد من الوقت للتجربة.',
                    'Delivery for your finds. More time for the experience.',
                  ),
                },
              ].map((step, i) => (
                <li key={step.title}>
                  <span className="step-icon">
                    <step.icon size={21} />
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                  <span className="step-number">0{i + 1}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="planner-banner section-shell">
          <div>
            <p className="eyebrow">
              {t(
                'أصحابك. عائلتك. أو وقت لنفسك.',
                'YOUR FRIENDS. YOUR FAMILY. YOUR OWN LITTLE ESCAPE.',
              )}
            </p>
            <h2>
              {t('اليوم يومك.', 'The day is yours.')}
              <br />
              {t('خلّه على ذوقك.', 'Make it your own.')}
            </h2>
            <p>
              {t(
                'اختر المناطق اللي تحبّها، وابنِ مسارك الخاص في سيتي بوب.',
                'Pick the zones you love and put together your own City Pop route.',
              )}
            </p>
            <Button className="primary-link" onClick={() => openPlanner()}>
              {t('صمّم زيارتك', 'Build your visit')}
              <Diagonal size={20} />
            </Button>
          </div>
          <div className="planner-display" aria-hidden="true">
            <div className="route-label">
              <Route size={19} />
              <span>YOUR CITY. YOUR WAY.</span>
            </div>
            {[zones[0], zones[2], zones[4]].map((z, i) => (
              <div className="sample-stop" key={z.id}>
                <span>0{i + 1}</span>
                <z.icon size={21} />
                <strong>{ar ? z.ar : z.en}</strong>
                <span className="sample-dot" style={{ background: z.color }} />
              </div>
            ))}
            <div className="route-ending">
              {t(
                'ومساحة لمفاجأة جديدة.',
                'And a little room for the unexpected.',
              )}
              <Sparkles size={16} />
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer section-shell">
        <div className="organizer-credit">
          <img
            src={assetPath('/images/mufeed-logo-white.png')}
            width={188}
            height={56}
            alt={t('شركة مفيد', 'Mufeed')}
            loading="lazy"
          />
          <div>
            <strong>{t('أحد مشاريع شركة مفيد', 'A Mufeed project')}</strong>
            <p>
              {t(
                'بالتعاون مع الاستديو الإبداعي',
                'In collaboration with the Creative Studio',
              )}
            </p>
          </div>
          <a href="#services">
            {t('استكشف فرص المشاركة', 'Explore participation opportunities')}
            <Diagonal size={18} />
          </a>
        </div>
        <div className="footer-top">
          <a className="wordmark footer-wordmark" href="#top">
            <img
              src={assetPath('/images/city-pop-wordmark.png')}
              alt="CITY POP"
              width={175}
              height={35}
            />
          </a>
          <p>
            {t(
              'مدينة متنقلة. تجارب تبقى.',
              'A traveling city. Lasting memories.',
            )}
          </p>
          <a className="back-top" href="#top">
            {t('إلى الأعلى', 'Back to top')}
            <Diagonal size={18} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 CITY POP.{' '}
            {t('شركة مفيد × الاستديو الإبداعي', 'MUFEED × CREATIVE STUDIO')}
          </span>
          <span>
            {t(
              'عرض تجريبي للمشروع · المواعيد والتذاكر لم تُعلن بعد',
              'PROJECT DEMO · DATES AND TICKETS TO BE ANNOUNCED',
            )}
          </span>
        </div>
      </footer>
      <Dialog
        open={!!current}
        onOpenChange={(open) => {
          if (!open) setActiveZone(null);
        }}
      >
        <DialogContent
          className="zone-dialog"
          dir={ar ? 'rtl' : 'ltr'}
          showCloseButton={false}
        >
          {current && (
            <>
              <button
                className="dialog-close"
                onClick={() => setActiveZone(null)}
                aria-label={t('إغلاق', 'Close')}
              >
                <X size={22} />
              </button>
              <img
                className="dialog-hero"
                src={assetPath(`/images/${current.image}`)}
                alt={t(`تصوّر منطقة ${current.ar}`, `Concept of ${current.en}`)}
              />
              <div className="dialog-body">
                <p className="eyebrow" style={{ color: current.color }}>
                  {current.en.toUpperCase()}
                </p>
                <DialogTitle>{ar ? current.ar : current.en}</DialogTitle>
                <DialogDescription>
                  {current.description[ar ? 0 : 1]}
                </DialogDescription>
                <div className="experience-tags">
                  {current.experiences[ar ? 0 : 1].map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <Button
                  className="primary-link full-width"
                  onClick={() => toggleZone(current.id)}
                >
                  {selected.includes(current.id) ? (
                    <Check size={18} />
                  ) : (
                    <Plus size={18} />
                  )}{' '}
                  {selected.includes(current.id)
                    ? t(
                        'أُضيفت لمسارك · اضغط للإزالة',
                        'On your route · click to remove',
                      )
                    : t('أضف إلى مساري', 'Add to my route')}
                </Button>
                <button
                  className="text-link"
                  onClick={() => {
                    setActiveZone(null);
                    openPlanner();
                  }}
                >
                  {t('شاهد مسارك', 'View your route')} ({selected.length})
                  <Arrow size={17} />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={planner} onOpenChange={setPlanner}>
        <DialogContent
          finalFocus={() =>
            plannerReturnFocus.current?.isConnected
              ? plannerReturnFocus.current
              : document.getElementById('language-switch')
          }
          className="planner-dialog"
          dir={ar ? 'rtl' : 'ltr'}
          showCloseButton={false}
        >
          <button
            className="dialog-close"
            onClick={() => setPlanner(false)}
            aria-label={t('إغلاق', 'Close')}
          >
            <X size={22} />
          </button>
          <div className="planner-dialog-heading">
            <p className="eyebrow pink">YOUR CITY. YOUR WAY.</p>
            <DialogTitle>{t('صمّم زيارتك', 'Make it your day')}</DialogTitle>
            <DialogDescription>
              {t(
                'اختر مناطقك المفضلة. مسارك المقترح يُحفظ على هذا الجهاز فقط، ولا يمثّل حجزًا.',
                'Choose your favorites. Your suggested route is saved on this device only and is not a reservation.',
              )}
            </DialogDescription>
          </div>
          <div className="planner-choices">
            {zones.map((zone) => (
              <label
                htmlFor={`zone-choice-${zone.id}`}
                key={zone.id}
                className={
                  selected.includes(zone.id)
                    ? 'planner-choice is-selected'
                    : 'planner-choice'
                }
              >
                <Checkbox
                  id={`zone-choice-${zone.id}`}
                  checked={selected.includes(zone.id)}
                  onCheckedChange={() => toggleZone(zone.id)}
                  aria-label={ar ? zone.ar : zone.en}
                />
                <zone.icon size={23} style={{ color: zone.color }} />
                <span>
                  <strong>{ar ? zone.ar : zone.en}</strong>
                  <small>{zone.tag[ar ? 0 : 1]}</small>
                </span>
              </label>
            ))}
          </div>
          <div className="selected-route" aria-live="polite">
            <span>
              {t('مسارك المقترح', 'Your suggested route')}{' '}
              <b>({selected.length}/6)</b>
            </span>
            {selected.length ? (
              <ol>
                {selected.map((id) => {
                  const z = zones.find((item) => item.id === id)!;
                  return <li key={id}>{ar ? z.ar : z.en}</li>;
                })}
              </ol>
            ) : (
              <p>
                {t(
                  'ابدأ بمنطقة تحبّها، واترك الباقي للاكتشاف.',
                  'Start with a zone you love. Leave some room for discovery.',
                )}
              </p>
            )}
          </div>
          <Button className="primary-link full-width" onClick={savePlan}>
            {saved ? <Check size={19} /> : <Bookmark size={19} />}{' '}
            {saved
              ? t('تم حفظ مسارك', 'Your route is saved')
              : t('احفظ مساري', 'Save my route')}
          </Button>
          <output className="save-status">
            {storageError
              ? t(
                  'تعذّر الحفظ على الجهاز. مسارك متاح هنا ما دامت الصفحة مفتوحة.',
                  'Device storage is unavailable. Your route is available while this page is open.',
                )
              : saved
                ? t(
                    'كل شيء جاهز! تقدر ترجع وتعدّل اختياراتك في أي وقت.',
                    'All set. Come back and change your picks whenever you like.',
                  )
                : t(
                    'تجربة تخطيط تفاعلية · لا مواعيد أو تذاكر متاحة بعد',
                    'INTERACTIVE PLANNER · DATES AND TICKETS NOT YET AVAILABLE',
                  )}
          </output>
        </DialogContent>
      </Dialog>
    </div>
  );
}
