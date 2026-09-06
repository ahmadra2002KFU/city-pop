/** Treat browser storage as untrusted, while preserving a visitor's stop order. */
export function decodePlan(
  raw: string,
  allowedIds: readonly string[],
): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter(
      (id, index): id is string =>
        typeof id === 'string' &&
        allowedIds.includes(id) &&
        value.indexOf(id) === index,
    );
  } catch {
    return [];
  }
}
