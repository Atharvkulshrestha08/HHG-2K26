> ### 🛡️ Author & Original Creator
> **Atharv Kulshrestha** — [@Atharvkulshrestha08](https://github.com/Atharvkulshrestha08)  
> *This repository and its codebase are the original work of Atharv Kulshrestha. All rights reserved.*

---

# HH Goa 2026 — Frame & ID Card Generator

A client-side web tool for Hacker House Goa 2026 Task 1. Upload a photo, pick a
format, get a branded graphic in seconds. No signup, no cropping, nothing
uploaded — everything renders in the browser on a `<canvas>`.

Built to be unmistakably *HH Goa 2026*: a flat, high-contrast festival-poster
look — deep forest green base, golden yellow wordmark and linework, hot pink
"गोवा" badges and floral accents, black fine-line detailing, dotted borders,
mandala motifs and palm silhouettes. Dates/location render in mono; the
wordmark in serif display.

## Formats

| Mode        | Canvas        | What it produces                                             |
| ----------- | ------------- | ------------------------------------------------------------ |
| `passport`  | 1240 × 800    | Stamped Builder Passport — photo, name, class, stack, visa stamps, QR |
| `boarding`  | 1240 × 800    | Boarding pass — flight HH-247, gate Paradise, seat B-247, barcode |
| `squad`     | 1240 × 800    | Combined team card — up to 3 members in one frame            |
| `pfp`       | 1080 × 1080   | Square X profile picture frame with circular photo           |

## Files

```
hhgoa-frame/
├── index.html          # single-page site
├── css/styles.css      # design system (mobile-first, reduced-motion aware)
├── js/
│   ├── canvas-kit.js   # drawing helpers (dot borders, mandala, palm, arcs, stamps)
│   ├── themes.js       # the 4 canvas renderers (festival-poster palette)
│   ├── share.js        # download, Web Share, X intent, captions
│   └── main.js         # state, uploads, HEIC, wiring
├── scripts/make-og.js  # generates public/og.png (pure Node, no deps)
└── public/             # static files copied to dist/ (og.png lives here)
```

## Run locally

```sh
npm install        # first time only
npm run dev        # starts Vite at http://localhost:5173 (hot reload)
```

Other useful commands:

```sh
npm run build      # production build into dist/
npm run preview    # serve the built dist/ to check it locally
```

## Deploy (pick one)

**Vercel / Netlify** — point them at this folder. No config needed:
Vercel auto-detects Vite; Netlify defaults to `npm run build` + `dist`.

**GitHub Pages** — run `npm run build`, then push the `dist/` folder
(or use an action). Note: project-page URLs need `base: './'` in a
`vite.config.js`.

## The share flow (what to know)

- **Mobile:** `navigator.share` opens the native share sheet with the image
  attached — post straight to the X app.
- **Desktop:** it opens an X intent with the caption + `#FrameInGoa`
  pre-filled; attach the downloaded PNG manually.

The tweet caption always contains `#FrameInGoa` — the task checks for it.
The caption is editable before posting, so keep the hashtag.

> OG image note: `index.html` references `og.png` (from `public/`) for link
> previews. Regenerate the branded preview with `npm run og` (pure Node, no
> deps), or overwrite `public/og.png` with a real screenshot of your best
> frame before sharing links, so previews show the graphic instead of a
> blank thumbnail. It's copied into `dist/` automatically on build.

## Customizing

- Brand colors and fonts: `css/styles.css` `:root` and `js/canvas-kit.js` (P/F).
- Layout of each card: `js/themes.js` — each theme is one `draw(ctx, state)`
  function with hardcoded coordinates for its canvas size.
- Builder classes: the keyword→class table in `js/main.js`.
- HEIC support is loaded from a CDN (`heic2any`); if you want zero
  dependencies, the app degrades gracefully for non-HEIC images.

## Notes

- One submission per team — make sure the team lead registers the team only
  once and the X post (with `#FrameInGoa`) is published.
- "Selection ≠ seat": the RSVP & Stake step in late September locks the seat.
- Works fully offline except Google Fonts and the HEIC decoder.
