# City Pop

Bilingual (Arabic-first) website for City Pop, Mufeed's pop-up city of shopping, entertainment and experiences in Al Khobar, 25 November 2026 to 5 January 2027.

Two pages, each in Arabic and English:

| Route | Audience |
|---|---|
| `/` · `/en/` | Visitors: concept, six zones, The Hub, site map, visit info |
| `/partners/` · `/en/partners/` | Partners: numbers, masterplan, 54 leasable units, sponsorship tiers, enquiry |

## Run locally

Node.js 22.13 or newer.

```sh
npm install
npm run dev
```

## Verify and build

```sh
npm run lint
npx tsc --noEmit
npm run build
npm run check:export
```

On Windows, build from PowerShell (or set `MSYS_NO_PATHCONV=1` in Git Bash) when `NEXT_PUBLIC_BASE_PATH` is set, otherwise the base path is rewritten into a Windows path.

`check:export` confirms all four routes exist with the right `lang` and section ids, that every referenced asset and every generated image variant is present, and that retired facts from the 2026-09 deck (for example 28,189 m², "one full month") never reappear.

## Where things live

| Path | What |
|---|---|
| `content/facts.ts` | Every event fact (dates, area, visitors, seats, location), with its source deck page |
| `content/zones.ts`, `units.ts`, `sponsorship.ts` | Zones (V06 deck), 54 leasable units (partnerships deck), tiers and the 39-row benefit matrix (sponsorships deck) |
| `content/copy/*.ts`, `content/site.ts` | Bilingual page copy, navigation, metadata and contact channels |
| `components/sections/*` | One folder per page section, each with its own CSS module |
| `components/site/*`, `components/primitives/*` | Header, footer, document shell; shared heading, button, picture and modal |
| `app/(ar)`, `app/(en)` | Route groups with their own root layout, so each page ships the correct `lang`/`dir` |
| `app/styles/tokens.css` | Colours (brand and zone legend), type scale, spacing |
| `assets/source`, `assets/media.json` | Original images; `npm run images` regenerates `public/media` and `content/media.generated.ts` |

Copy and facts change in `content/`, never inside components. Contact channels are `null` in `content/site.ts` until Mufeed supplies them; the UI hides any channel that is not set.

## Enquiries

The site is a static export with no backend. The enquiry form posts to `contact.formEndpoint` when set, otherwise it opens WhatsApp or email pre-filled with the visitor's choices. Links such as `#enquire?interest=unit&unitType=main-store` pre-fill the form without reloading (`lib/enquiry-link.ts`).

## Deployment

`.github/workflows/pages.yml` lints, type-checks, builds with the GitHub Pages base path and origin, runs `check:export`, and deploys `dist/client` to https://card.ahmadgra.com/city-pop/. `scripts/finalize-export.mjs` adds `partners/index.html`-style copies so directory URLs resolve on Pages.

Search indexing is off (`indexable` in `lib/page-metadata.ts`) until the launch facts and contact channels are confirmed.

## Sources and licences

Facts and copy come from `City PoP V06.pdf`, `الشراكات - CITY POP.pdf` and `الرعايات - CITY POP.pdf` (October 2026). Slide-by-slide reviews are in `../Claude Docs/source-review/`. Images are concept renders from those decks, not event photography. Tajawal and Outfit are subset WOFF2 builds of the Google Fonts releases; their OFL licences are in `public/licenses`.
