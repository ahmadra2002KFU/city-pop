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
- Six audience journeys cover stores, visitors, sponsors, restaurants/cafés, children's play operators, and home-based businesses.
- Three original masterplans can be explored, enlarged, and downloaded; first-proposal area markers have an equivalent accessible text selector.
- Sponsorship cards and the detailed comparison reproduce Silver, Gold and Platinum terms from page 59.
- Participants can prepare, review, copy, and download a brief. It stays in page memory until reload and is never submitted to a backend. Closing and reopening preserves the entered business name and notes.
- No live booking, payment, tickets, partner agreements, or event schedule is implied.

## Source fidelity

The original wordmark, entrance rendering and zone imagery are extracted from the supplied PDF. The visual palette follows its navy/black, blue, pink and violet identity. PDF fonts were encoded as unnamed Type3 glyphs; Tajawal and Outfit are readable web alternatives, supplied locally with their OFL licenses in `public/fonts`.

Image provenance (PDF pages): entrance and wordmark 1; six zone scenes 7; courtyard experience 19. Source project proposes Al Khobar as its first stop. Imagery is concept artwork. Food and café operators, retail brands, dates and ticket prices are not confirmed, and the demo does not present them as confirmed.

The manager update uses the zone names and order on page 7. Masterplans are original embedded drawings from pages 9, 12 and 13, with footprints of 28,189, 26,500 and 32,760 m². The first proposal's maximum capacity is up to 2,100 visitors; outdoor capacity is 1,500–1,700 and the Hub capacity awaits interior planning. These are capacity figures, not cumulative attendance forecasts. The proposed duration is one full month (page 62), with no announced dates. The Social Street kiosk is shown as 4 × 3 m in the first drawing; the site does not invent a rental inventory, prices, or availability. Package terms are transcribed in `lib/project-content.ts` from page 59. Mufeed's original mark comes from the PDF; Creative Studio collaboration credit follows the supplied manager feedback.

Navigation and audience journeys were informed by the official [Saudi Event Show](https://informaconnect.com/saudi-event-show/), [ATM exhibitor guide](https://www.wtm.com/atm/en-gb/exhibit/prepare-to-exhibit.html), and [Gulfood enquiry](https://event.gulfood.com/exhibitor-enquiry). All project facts remain sourced from the supplied PDF rather than those events.

## GitHub Pages

The public demo is deployed from `main` by `.github/workflows/pages.yml` to:

https://card.ahmadgra.com/city-pop/

The workflow installs locked dependencies, lints and type-checks the site, builds and checks the static export, and deploys `dist/client`. It reads the domain and project path directly from GitHub Pages settings. GitHub Pages uses **GitHub Actions** as its publishing source.

For a local GitHub Pages build, set `NEXT_PUBLIC_BASE_PATH=/city-pop` and `NEXT_PUBLIC_SITE_ORIGIN=https://card.ahmadgra.com`, then run `npm run build` and `npm run check:export`. Without these variables, the normal root-path local and Sites builds still work. Source fonts in `app/fonts` are bundled with hashed asset URLs so both deployment paths resolve correctly. Font licenses are retained in `public/fonts`.

The demo uses local UI state and hash navigation; it does not depend on a server for routes, bookings, or payments.
