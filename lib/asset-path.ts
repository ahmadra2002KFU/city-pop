const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

/** Public assets need the project prefix when served by GitHub Pages. */
export function assetPath(path: string): string {
  return `${basePath}${path}`;
}
