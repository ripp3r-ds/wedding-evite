# Rithwik & Kalyani Wedding Invitation

## Run locally

```bash
npm install
npm run dev
```

## The opening sequence

The landing is a single pinned screen that plays three acts, driven by the `data-act`
attribute on `.landing` in [`wedding-opening.tsx`](./app/components/wedding-opening.tsx):

1. **`sealed`** — a royal backdrop (mandala engraving, gold dust, temple frame) behind
   "You are invited" and a wax [`WaxSeal`](./app/components/wax-seal.tsx) button carrying the
   **R & K** monogram, set in the invitation's own Cinzel Decorative display face so it reads
   as engraved lettering. The seal is the only interactive element.
2. **`unsealing`** — tapping the seal dissolves the whole sealed panel at once and the paper
   flaps unfold, left leading right.
3. **`announcing`** — `opening.png` fades up in the background while the names and the
   gold-foil scratch panel ([`scratch-reveal.tsx`](./app/components/scratch-reveal.tsx))
   arrive together. Enter/Space reveals the date without scratching.
4. **`revealed`** — the date springs in, then a `heroReady` flag mounts the half-length oval
   portrait and the countdown once the scratch panel has finished exiting, so the stage never
   reflows mid-transition. The **keep scrolling** button leads to Haldi, Wedding, Reception
   and RSVP.

Each ceremony section carries its own palette, portrait and celebration artefacts —
marigolds for Haldi, thalambralu for the wedding, floating diyas for the reception — via
[`celebration-artefacts.tsx`](./app/components/celebration-artefacts.tsx). Artefact positions
come from a seeded PRNG so the server and client render identically, and the whole layer is
removed under `prefers-reduced-motion`.

The oval portraits are framed per scene from `.event-portrait`/`.landing-hero-portrait`
pseudo-elements: a gold rope for the opening, a rippling turmeric ring for Haldi, a strung
garland of cream buds over deep maroon for the wedding (matching the garlands the couple
actually wear), and a soft lamplit rim crowned by a single flickering diya for the reception.
Each scene gets one decorative ring and no more, so the portrait itself only carries a single
hairline.

The ovals are `1 / 1.15` rather than square: an ellipse pinches towards the top, and a
squarer frame clipped the sides of their heads. `WeddingPortrait` takes a `zoom` prop that
scales the photo from its top edge, and the `zoom`/`object-position` pairs are tuned against
that exact ratio — the faces sit at 20–30% of the source image height, which the current
values land at roughly 40% of the frame with the top of their heads clear of the rim.

## Typography

Loaded with `next/font`: **Cinzel Decorative** (`--font-display`), **Cinzel**
(`--font-label`), **Cormorant Garamond** (`--font-body`), **Noto Serif Telugu**
(`--font-telugu`) and the local **Tangerine** (`--font-script`, used for the couple's names).

## Update the couple's portraits

Replace the supplied PNGs in `public/images/couple/`:

- `opening.png`
- `haldi.png`
- `wedding.png`
- `reception.png`

The shared [`WeddingPortrait`](./app/components/wedding-portrait.tsx) component maps each scene to its image and renders it in one of three frames via its `variant` prop — `arch` (the landing hero), `medallion` (ceremony cards) or `bleed` (full-bleed backdrop). The opening portrait is preloaded; ceremony portraits are lazy-loaded.

## Optional Google Sheets RSVP logging

The invitation already opens the pre-filled WhatsApp reply. Google Sheets logging is skipped until a Google Apps Script web app URL is configured.

1. Create a Google Sheet and copy its ID from the URL (the part between `/d/` and `/edit`).
2. Open **Extensions → Apps Script** and paste in [`scripts/google-apps-script.gs`](./scripts/google-apps-script.gs). Replace `YOUR_SPREADSHEET_ID` with the ID you copied.
3. Deploy the script as a **Web app**, execute it as yourself, allow access to anyone with the link, and copy its deployment URL.
4. Put `NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec` in `.env.local` (or `.env`) and restart the Next.js app.

When configured, the RSVP JSON is sent in a background `no-cors` POST; WhatsApp remains the guest's visible confirmation step.

The RSVP payload keys match the Apps Script handler: `name`, `attendingHaldi`, `attendingWedding`, `attendingReception`, `travelNotes`, and `timestamp`. If you change the Apps Script code, update the existing web app deployment to a new version before testing new submissions.

## Wedding countdown

The countdown targets **29 October 2026 at 10:30 PM India Standard Time**.
