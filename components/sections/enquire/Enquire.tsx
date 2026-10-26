'use client';

import { useEffect, useRef, useState } from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { tr, type Lang } from '@/content/i18n';
import { contact } from '@/content/site';
import { tiers, type TierId } from '@/content/sponsorship';
import { unitTypes, type UnitTypeId } from '@/content/units';
import { partnersCopy } from '@/content/copy/partners';
import { parseEnquiryHash, type EnquiryPrefill } from '@/lib/enquiry-link';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import styles from './enquire.module.css';

const copy = partnersCopy.enquire;
type Interest = NonNullable<EnquiryPrefill['interest']>;
type Status = 'idle' | 'sending' | 'sent' | 'failed' | 'no-channel';

export function Enquire({ lang }: { lang: Lang }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [interest, setInterest] = useState<Interest>('unit');
  const [unitType, setUnitType] = useState<UnitTypeId>(unitTypes[0].id);
  const [unit, setUnit] = useState('');
  const [tier, setTier] = useState<TierId>(tiers[0].id);
  const [status, setStatus] = useState<Status>('idle');
  const selectedType = unitTypes.find((type) => type.id === unitType) ?? unitTypes[0];

  useEffect(() => {
    const apply = () => {
      const prefill = parseEnquiryHash(window.location.hash);
      if (!prefill) return;
      if (prefill.interest) setInterest(prefill.interest);
      if (prefill.unitType && unitTypes.some((type) => type.id === prefill.unitType)) {
        setUnitType(prefill.unitType);
        setUnit(prefill.unit ?? '');
      }
      if (prefill.tier && tiers.some((item) => item.id === prefill.tier)) setTier(prefill.tier);
      sectionRef.current?.scrollIntoView({ block: 'start' });
      sectionRef.current?.querySelector<HTMLElement>('input, select')?.focus({ preventScroll: true });
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  function summary(form: FormData): string {
    const field = (name: string) => {
      const value = form.get(name);
      return typeof value === 'string' ? value : '';
    };
    const subject =
      interest === 'unit'
        ? `${tr(copy.interests.unit, lang)}: ${tr(selectedType.name, lang)}${unit ? ` ${unit}` : ''}`
        : interest === 'sponsor'
          ? `${tr(copy.interests.sponsor, lang)}: ${tr(tiers.find((item) => item.id === tier)!.name, lang)}`
          : tr(copy.interests.other, lang);
    return [
      `City Pop: ${subject}`,
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
    const form = new FormData(event.currentTarget);
    if (form.get('website')) return; // Honeypot: bots fill hidden fields.
    form.delete('website');
    if (contact.formEndpoint) {
      setStatus('sending');
      try {
        const response = await fetch(contact.formEndpoint, {
          method: 'POST',
          body: form,
          headers: { Accept: 'application/json' },
        });
        setStatus(response.ok ? 'sent' : 'failed');
      } catch {
        setStatus('failed');
      }
      return;
    }
    const text = summary(form);
    if (contact.whatsapp) {
      window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      return;
    }
    if (contact.email) {
      const [subject, ...body] = text.split('\n');
      window.location.assign(`mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.join('\n'))}`);
      return;
    }
    setStatus('no-channel');
  }

  return (
    <section id="enquire" ref={sectionRef} className={`container ${styles.section}`} aria-labelledby="enquire-title">
      <SectionHeader
        id="enquire-title"
        eyebrow={tr(copy.eyebrow, lang)}
        title={tr(copy.title, lang)}
        lead={tr(copy.lead, lang)}
      />
      <form className={styles.form} onSubmit={onSubmit}>
        <fieldset className={styles.interests}>
          <legend>{tr(copy.interest, lang)}</legend>
          {(['unit', 'sponsor', 'other'] as const).map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="interest"
                value={value}
                checked={interest === value}
                onChange={() => setInterest(value)}
              />
              {tr(copy.interests[value], lang)}
            </label>
          ))}
        </fieldset>

        {interest === 'unit' && (
          <div className={styles.row}>
            <label>
              {tr(copy.unitType, lang)}
              <select
                name="unitType"
                value={unitType}
                onChange={(event) => {
                  setUnitType(event.target.value as UnitTypeId);
                  setUnit('');
                }}
              >
                {unitTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {tr(type.name, lang)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {tr(copy.unitNumber, lang)}
              <select name="unit" value={unit} onChange={(event) => setUnit(event.target.value)}>
                <option value="">–</option>
                {selectedType.units.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {interest === 'sponsor' && (
          <label>
            {tr(copy.tier, lang)}
            <select name="tier" value={tier} onChange={(event) => setTier(event.target.value as TierId)}>
              {tiers.map((item) => (
                <option key={item.id} value={item.id}>
                  {tr(item.name, lang)}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className={styles.row}>
          <label>
            {tr(copy.name, lang)}
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            {tr(copy.company, lang)}
            <input name="company" autoComplete="organization" />
          </label>
        </div>
        <div className={styles.row}>
          <label>
            {tr(copy.email, lang)}
            <input name="email" type="email" required autoComplete="email" dir="ltr" />
          </label>
          <label>
            {tr(copy.phone, lang)}
            <input name="phone" type="tel" autoComplete="tel" dir="ltr" />
          </label>
        </div>
        <label>
          {tr(copy.message, lang)}
          <textarea name="message" rows={4} />
        </label>
        <input className={styles.honeypot} name="website" tabIndex={-1} autoComplete="off" aria-hidden />

        <button className={styles.submit} type="submit" disabled={status === 'sending'}>
          {tr(copy.submit, lang)}
        </button>
        <output className={styles.status}>
          {status === 'sent' && tr(copy.sent, lang)}
          {status === 'failed' && tr(copy.failed, lang)}
          {status === 'no-channel' && tr(copy.channelsPending, lang)}
        </output>
      </form>

      {(contact.whatsapp || contact.email) && (
        <div className={styles.channels}>
          {contact.whatsapp && (
            <a href={`https://wa.me/${contact.whatsapp}`} rel="noopener" target="_blank">
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
      )}
    </section>
  );
}
