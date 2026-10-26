'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  Award,
  CircleAlert,
  Info,
  LoaderCircle,
  Mail,
  MessageCircle,
  MessageSquareText,
  Store,
  X,
} from 'lucide-react';
import { formatDate, formatSar, tr, type Lang } from '@/content/i18n';
import { contact } from '@/content/site';
import { facts } from '@/content/facts';
import { tiers, type TierId } from '@/content/sponsorship';
import { leaseTermDays, unitTypes, type UnitTypeId } from '@/content/units';
import { zoneById } from '@/content/zones';
import { partnersCopy } from '@/content/copy/partners';
import {
  enquiryAnchor,
  hasSelection,
  parseEnquiryHash,
  type EnquiryPrefill,
} from '@/lib/enquiry-link';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import {
  fieldOrder,
  normalizePhone,
  toLatinDigits,
  validate,
  validateField,
  type FieldErrors,
  type FieldName,
  type FieldValues,
} from './validation';
import styles from './enquire.module.css';

const copy = partnersCopy.enquire;
const spacesCopy = partnersCopy.spaces;
const sponsorCopy = partnersCopy.sponsorship;

type Interest = NonNullable<EnquiryPrefill['interest']>;
type Status =
  | 'idle'
  | 'invalid'
  | 'sending'
  | 'sent'
  | 'failed'
  | 'opened-whatsapp'
  | 'opened-email'
  | 'no-channel'
  | 'cleared';

const interestIcons = {
  unit: Store,
  sponsor: Award,
  other: MessageSquareText,
} as const;
const emptyValues: FieldValues = { name: '', email: '', phone: '' };

/** No channel is configured until Mufeed supplies one (plan decision D4). */
const hasAnyChannel = Boolean(
  contact.formEndpoint || contact.whatsapp || contact.email,
);

export function Enquire({ lang }: { lang: Lang }) {
  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;
  const sectionRef = useRef<HTMLElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<Partial<Record<FieldName, HTMLInputElement | null>>>(
    {},
  );

  const [interest, setInterest] = useState<Interest>('unit');
  const [unitType, setUnitType] = useState<UnitTypeId>(unitTypes[0].id);
  const [unit, setUnit] = useState('');
  const [tier, setTier] = useState<TierId>(tiers[0].id);
  const [fromLink, setFromLink] = useState(false);
  const [values, setValues] = useState<FieldValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  // Bumped on every status change so a repeated message is announced again.
  const [statusKey, setStatusKey] = useState(0);

  const selectedType =
    unitTypes.find((type) => type.id === unitType) ?? unitTypes[0];
  const selectedTier = tiers.find((item) => item.id === tier) ?? tiers[0];

  function announce(next: Status) {
    setStatus(next);
    setStatusKey((key) => key + 1);
  }

  useEffect(() => {
    const apply = () => {
      const prefill = parseEnquiryHash(window.location.hash);
      if (!prefill) return;
      if (prefill.interest) setInterest(prefill.interest);
      if (prefill.unitType) {
        setUnitType(prefill.unitType);
        setUnit(prefill.unit ?? '');
      }
      if (prefill.tier) setTier(prefill.tier);
      const selected = hasSelection(prefill);
      setFromLink(selected);
      sectionRef.current?.scrollIntoView({ block: 'start' });
      // Land on the selection summary so screen readers hear what was chosen.
      const target = selected ? ticketRef.current : inputRefs.current.name;
      target?.focus({ preventScroll: true });
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  function changeSelection(update: () => void) {
    update();
    setFromLink(false);
  }

  function clearSelection() {
    setInterest('other');
    setUnit('');
    setFromLink(false);
    // Drop the query so a reload does not re-apply the old selection.
    window.history.replaceState(null, '', `#${enquiryAnchor}`);
    announce('cleared');
    ticketRef.current?.focus({ preventScroll: true });
  }

  function updateField(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // After a submit attempt, errors follow the input live so they clear as soon as fixed.
    if (attempted || errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: validateField(field, value),
      }));
    }
  }

  function blurField(field: FieldName) {
    // Arabic-Indic digits display reversed in a left-to-right field; show them as
    // Latin digits once the person leaves the field (the value is the same number).
    if (field === 'phone' && values.phone !== toLatinDigits(values.phone)) {
      setValues((current) => ({
        ...current,
        phone: toLatinDigits(current.phone),
      }));
    }
    // Do not nag about empty fields on blur; only flag what was typed wrongly.
    if (values[field].trim()) {
      setErrors((current) => ({
        ...current,
        [field]: validateField(field, values[field]),
      }));
    }
  }

  function subjectLine(): string {
    if (interest === 'unit') {
      const unitLabel = unit ? ` ${unit}` : '';
      return `${tr(copy.interests.unit, lang)}: ${tr(selectedType.name, lang)}${unitLabel}`;
    }
    if (interest === 'sponsor') {
      return `${tr(copy.interests.sponsor, lang)}: ${tr(selectedTier.name, lang)}`;
    }
    return tr(copy.interests.other, lang);
  }

  function summary(form: FormData): string {
    const field = (name: string) => {
      const value = form.get(name);
      return typeof value === 'string' ? value.trim() : '';
    };
    return [
      `City Pop: ${subjectLine()}`,
      `${tr(copy.name, lang)}: ${field('name')}`,
      `${tr(copy.company, lang)}: ${field('company')}`,
      `${tr(copy.email, lang)}: ${field('email')}`,
      `${tr(copy.phone, lang)}: ${field('phone')}`,
      '',
      field('message'),
    ].join('\n');
  }

  async function onSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    if (form.get('website')) return; // Honeypot: bots fill hidden fields.
    form.delete('website');

    setAttempted(true);
    const found = validate(values);
    setErrors(found);
    const firstInvalid = fieldOrder.find((field) => found[field]);
    if (firstInvalid) {
      announce('invalid');
      inputRefs.current[firstInvalid]?.focus();
      return;
    }

    if (values.phone.trim()) form.set('phone', normalizePhone(values.phone));
    form.set('subject', `City Pop: ${subjectLine()}`);

    if (contact.formEndpoint) {
      announce('sending');
      try {
        const response = await fetch(contact.formEndpoint, {
          method: 'POST',
          body: form,
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          formElement.reset();
          setValues(emptyValues);
          setAttempted(false);
          announce('sent');
        } else {
          announce('failed');
        }
      } catch {
        announce('failed');
      }
      return;
    }
    const text = summary(form);
    if (contact.whatsapp) {
      window.open(
        `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`,
        '_blank',
        'noopener',
      );
      announce('opened-whatsapp');
      return;
    }
    if (contact.email) {
      const [subject, ...body] = text.split('\n');
      window.location.assign(
        `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.join('\n'))}`,
      );
      announce('opened-email');
      return;
    }
    // Nothing is configured: say so plainly. Never pretend the enquiry was sent.
    announce('no-channel');
  }

  const describedBy = (field: FieldName, hint?: boolean) =>
    [
      hint ? fieldId(`${field}-hint`) : '',
      errors[field] ? fieldId(`${field}-error`) : '',
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  function errorText(field: FieldName) {
    const key = errors[field];
    if (!key) return null;
    return (
      <p id={fieldId(`${field}-error`)} className={styles.error}>
        <CircleAlert aria-hidden size={16} className={styles.errorIcon} />
        {tr(copy.errors[key], lang)}
      </p>
    );
  }

  const tag = (kind: 'required' | 'optional') => (
    <span
      className={kind === 'required' ? styles.requiredTag : styles.optionalTag}
    >
      {tr(copy[kind], lang)}
    </span>
  );

  // The ticket: a live summary of what this enquiry is about.
  const accent =
    interest === 'unit'
      ? `var(--zone-${selectedType.zone})`
      : interest === 'sponsor'
        ? selectedTier.color
        : 'var(--violet)';
  const ticketTitle =
    interest === 'unit'
      ? tr(selectedType.name, lang)
      : interest === 'sponsor'
        ? tr(selectedTier.name, lang)
        : tr(copy.selection.general, lang);
  const ticketFacts: {
    label: string;
    value: string;
    latin?: boolean;
    note?: string;
  }[] =
    interest === 'unit'
      ? [
          {
            label: tr(copy.selection.unit, lang),
            value: unit || tr(copy.anyUnit, lang),
            latin: Boolean(unit),
          },
          {
            label: tr(spacesCopy.size, lang),
            value: `${selectedType.width} × ${selectedType.depth} m`,
            latin: true,
          },
          {
            label: tr(spacesCopy.term, lang),
            value: `${leaseTermDays} ${tr(spacesCopy.days, lang)}`,
          },
          {
            label: tr(spacesCopy.price, lang),
            value: formatSar(selectedType.price, lang),
          },
        ]
      : interest === 'sponsor'
        ? [
            {
              label: tr(sponsorCopy.slots, lang),
              value: String(selectedTier.slots),
              latin: true,
            },
            {
              label: tr(spacesCopy.price, lang),
              value: formatSar(selectedTier.price, lang),
              note: tr(sponsorCopy.vat, lang),
            },
          ]
        : [];
  const ticketZone =
    interest === 'unit' ? zoneById(selectedType.zone).name : null;
  const ticketKey = `${interest}:${unitType}:${unit}:${tier}`;
  // The stub prints numeric dates in a left-to-right block; the Arabic locale's
  // date marks would reorder them, and the digits are Latin in both languages.
  const shortDate = (iso: string) =>
    formatDate(iso, 'en', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });

  const statusTone =
    status === 'invalid' || status === 'failed'
      ? 'error'
      : status === 'sent' ||
          status === 'opened-whatsapp' ||
          status === 'opened-email'
        ? 'success'
        : 'info';
  const statusText: Partial<Record<Status, string>> = {
    invalid: tr(copy.errors.summary, lang),
    sending: tr(copy.sending, lang),
    sent: tr(copy.sent, lang),
    failed: tr(copy.failed, lang),
    'opened-whatsapp': tr(copy.openedWhatsapp, lang),
    'opened-email': tr(copy.openedEmail, lang),
    'no-channel': `${tr(copy.notSent, lang)} ${tr(copy.channelsPending, lang)}`,
    cleared: tr(copy.selection.cleared, lang),
  };

  return (
    <section
      id="enquire"
      ref={sectionRef}
      className={`container ${styles.section}`}
      aria-labelledby="enquire-title"
    >
      <div className={styles.layout}>
        <div className={styles.aside}>
          <SectionHeader
            id="enquire-title"
            eyebrow={tr(copy.eyebrow, lang)}
            title={tr(copy.title, lang)}
            lead={tr(copy.lead, lang)}
            className={styles.header}
          />

          <div className={styles.ticketWrap}>
            <div
              ref={ticketRef}
              tabIndex={-1}
              className={styles.ticket}
              style={{ '--accent': accent } as React.CSSProperties}
            >
              <div key={ticketKey} className={styles.ticketMain}>
                <p className={styles.ticketLabel}>
                  {tr(copy.selection.label, lang)}
                  {fromLink && (
                    <span className={styles.fromLink}>
                      {tr(copy.selection.fromLink, lang)}
                    </span>
                  )}
                </p>
                <p className={styles.ticketTitle}>
                  {ticketTitle}
                  {ticketZone && (
                    <span className={`latin ${styles.ticketZone}`}>
                      {ticketZone}
                    </span>
                  )}
                </p>
                {ticketFacts.length > 0 && (
                  <dl className={styles.ticketFacts}>
                    {ticketFacts.map((fact) => (
                      <div key={fact.label}>
                        <dt>{fact.label}</dt>
                        <dd>
                          {fact.latin ? (
                            <bdi className="latin">{fact.value}</bdi>
                          ) : (
                            fact.value
                          )}
                          {fact.note && (
                            <span className={styles.factNote}>{fact.note}</span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
              <div className={styles.ticketStub} aria-hidden>
                <span className={`latin ${styles.stubBrand}`}>CITY POP</span>
                <span className={`latin ${styles.stubDates}`} dir="ltr">
                  {shortDate(facts.dates.start)}
                  <br />
                  {shortDate(facts.dates.end)}
                </span>
              </div>
            </div>
            {interest !== 'other' && (
              <button
                type="button"
                className={styles.clear}
                onClick={clearSelection}
              >
                <X aria-hidden size={14} />
                {tr(copy.selection.clear, lang)}
              </button>
            )}
          </div>

          {hasAnyChannel ? (
            (contact.whatsapp || contact.email) && (
              <div className={styles.channels}>
                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    rel="noopener"
                    target="_blank"
                  >
                    <MessageCircle aria-hidden size={18} />
                    {tr(copy.whatsapp, lang)}
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`}>
                    <Mail aria-hidden size={18} />
                    {tr(copy.emailUs, lang)}
                  </a>
                )}
              </div>
            )
          ) : (
            <div id={fieldId('pending')} className={styles.pending} role="note">
              <Info aria-hidden size={18} className={styles.pendingIcon} />
              <div>
                <p className={styles.pendingTitle}>
                  {tr(copy.channelsPendingNote.title, lang)}
                </p>
                <p>{tr(copy.channelsPendingNote.text, lang)}</p>
              </div>
            </div>
          )}
        </div>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <fieldset className={styles.interests}>
            <legend>{tr(copy.interest, lang)}</legend>
            <div className={styles.interestGrid}>
              {(['unit', 'sponsor', 'other'] as const).map((value) => {
                const Icon = interestIcons[value];
                return (
                  <label key={value} className={styles.interest}>
                    <input
                      type="radio"
                      name="interest"
                      value={value}
                      checked={interest === value}
                      onChange={() => changeSelection(() => setInterest(value))}
                    />
                    <Icon
                      aria-hidden
                      size={20}
                      className={styles.interestIcon}
                    />
                    <span>{tr(copy.interests[value], lang)}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {interest === 'unit' && (
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor={fieldId('unitType')}>
                  {tr(copy.unitType, lang)}
                </label>
                <select
                  id={fieldId('unitType')}
                  name="unitType"
                  value={unitType}
                  onChange={(event) =>
                    changeSelection(() => {
                      setUnitType(event.target.value as UnitTypeId);
                      setUnit('');
                    })
                  }
                >
                  {unitTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {tr(type.name, lang)}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor={fieldId('unit')}>
                  {tr(copy.unitNumber, lang)}
                </label>
                <select
                  id={fieldId('unit')}
                  name="unit"
                  value={unit}
                  onChange={(event) =>
                    changeSelection(() => setUnit(event.target.value))
                  }
                >
                  <option value="">{tr(copy.anyUnit, lang)}</option>
                  {selectedType.units.map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {interest === 'sponsor' && (
            <div className={styles.field}>
              <label htmlFor={fieldId('tier')}>{tr(copy.tier, lang)}</label>
              <select
                id={fieldId('tier')}
                name="tier"
                value={tier}
                onChange={(event) =>
                  changeSelection(() => setTier(event.target.value as TierId))
                }
              >
                {tiers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {tr(item.name, lang)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor={fieldId('name')}>
                {tr(copy.name, lang)} {tag('required')}
              </label>
              <input
                ref={(node) => {
                  inputRefs.current.name = node;
                }}
                id={fieldId('name')}
                name="name"
                autoComplete="name"
                aria-required="true"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={describedBy('name')}
                value={values.name}
                onChange={(event) => updateField('name', event.target.value)}
                onBlur={() => blurField('name')}
              />
              {errorText('name')}
            </div>
            <div className={styles.field}>
              <label htmlFor={fieldId('company')}>
                {tr(copy.company, lang)} {tag('optional')}
              </label>
              <input
                id={fieldId('company')}
                name="company"
                autoComplete="organization"
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor={fieldId('email')}>
                {tr(copy.email, lang)} {tag('required')}
              </label>
              <input
                ref={(node) => {
                  inputRefs.current.email = node;
                }}
                id={fieldId('email')}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
                aria-required="true"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describedBy('email')}
                value={values.email}
                onChange={(event) => updateField('email', event.target.value)}
                onBlur={() => blurField('email')}
              />
              {errorText('email')}
            </div>
            <div className={styles.field}>
              <label htmlFor={fieldId('phone')}>
                {tr(copy.phone, lang)} {tag('optional')}
              </label>
              <input
                ref={(node) => {
                  inputRefs.current.phone = node;
                }}
                id={fieldId('phone')}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={describedBy('phone', true)}
                value={values.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                onBlur={() => blurField('phone')}
              />
              <p id={fieldId('phone-hint')} className={styles.hint}>
                {tr(copy.phoneHint, lang)}
              </p>
              {errorText('phone')}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor={fieldId('message')}>
              {tr(copy.message, lang)} {tag('optional')}
            </label>
            <textarea id={fieldId('message')} name="message" rows={4} />
          </div>

          <input
            className={styles.honeypot}
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />

          <div className={styles.actions}>
            <button
              className={styles.submit}
              type="submit"
              disabled={status === 'sending'}
              aria-describedby={hasAnyChannel ? undefined : fieldId('pending')}
            >
              {status === 'sending' && (
                <LoaderCircle
                  aria-hidden
                  size={18}
                  className={styles.spinner}
                />
              )}
              {tr(status === 'sending' ? copy.sending : copy.submit, lang)}
            </button>
            <output
              className={styles.status}
              aria-live="polite"
              data-tone={statusTone}
            >
              {statusText[status] && (
                <span key={statusKey}>
                  {statusTone === 'error' && (
                    <CircleAlert
                      aria-hidden
                      size={18}
                      className={styles.statusIcon}
                    />
                  )}
                  {statusTone === 'info' && status !== 'sending' && (
                    <Info aria-hidden size={18} className={styles.statusIcon} />
                  )}
                  {statusText[status]}
                </span>
              )}
            </output>
          </div>
        </form>
      </div>
    </section>
  );
}
