/**
 * Client-side checks for the enquiry form. The form service (when configured)
 * must still validate on its side; these rules only help people fix typos early.
 */
export type FieldName = 'name' | 'email' | 'phone';
export type FieldValues = Record<FieldName, string>;
export type ErrorKey =
  | 'nameRequired'
  | 'emailRequired'
  | 'emailInvalid'
  | 'phoneInvalid';
export type FieldErrors = Partial<Record<FieldName, ErrorKey>>;

/** Field order on screen; the first invalid one in this order receives focus. */
export const fieldOrder: readonly FieldName[] = ['name', 'email', 'phone'];

const arabicIndicZero = 0x0660;
const easternArabicIndicZero = 0x06f0;

/** Converts Arabic-Indic and Eastern Arabic-Indic digits to Latin digits. */
export function toLatinDigits(value: string): string {
  return value.replace(/[٠-٩۰-۹]/g, (digit) => {
    const code = digit.charCodeAt(0);
    const zero =
      code >= easternArabicIndicZero ? easternArabicIndicZero : arabicIndicZero;
    return String(code - zero);
  });
}

/** Phone numbers as people type them: spaces, dashes, dots and brackets are ignored. */
export function normalizePhone(value: string): string {
  return toLatinDigits(value).replace(/[\s\-().]/g, '');
}

const emailPattern = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[^\s@.]{2,}$/;
const phonePattern = /^\+?\d{7,15}$/;

export function validateField(
  field: FieldName,
  raw: string,
): ErrorKey | undefined {
  const value = raw.trim();
  switch (field) {
    case 'name':
      return value ? undefined : 'nameRequired';
    case 'email':
      if (!value) return 'emailRequired';
      return emailPattern.test(value) ? undefined : 'emailInvalid';
    case 'phone':
      // Optional: only checked when something was typed.
      if (!value) return undefined;
      return phonePattern.test(normalizePhone(value))
        ? undefined
        : 'phoneInvalid';
  }
}

export function validate(values: FieldValues): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of fieldOrder) {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  }
  return errors;
}
