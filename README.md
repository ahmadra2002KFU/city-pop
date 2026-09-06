# City Pop

A bilingual Arabic/English landing page and interactive visit planner based on the supplied 69-page `City Pop.pdf`.

## Run locally

Use Node.js 22.13 or newer and npm.

```sh
npm install
npm run dev
```

## Verify and build

```sh
npm run lint
npx tsc --noEmit
npm run build
```

The site uses React, Vinext, Tailwind CSS, and the bundled Base UI dialog and checkbox components. It exports a static site to `dist/client`; no backend credentials are required.

## Demo behavior

- Arabic is the default, with complete English content and layout direction switching.
- All six zones open detail dialogs.
- Visitors can add or remove zones and save their ordered route to this browser's local storage.
- Empty routes can be saved to clear previous selections.
- Storage failures leave the current in-memory plan usable.
- No live booking, payment, tickets, partner agreements, or event schedule is implied.

## Source fidelity

The original wordmark, entrance rendering and zone imagery are extracted from the supplied PDF. The visual palette follows its navy/black, blue, pink and violet identity. PDF fonts were encoded as unnamed Type3 glyphs; Tajawal and Outfit are readable web alternatives, supplied locally with their OFL licenses in `public/fonts`.

Image provenance (PDF pages): entrance and wordmark 1; six zone scenes 7; courtyard experience 19. Source project proposes Al Khobar as its first stop. Imagery is concept artwork. Food and café operators, retail brands, dates and ticket prices are not confirmed, and the demo does not present them as confirmed.
