<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working on this invitation

A single-page wedding invitation for Rithwik & Kalyani, opened almost entirely on
phones via a WhatsApp link. **Design mobile-first and check narrow, short viewports
before anything else.** The intended feel is a posh, traditional South Indian
(Telugu) invitation card, so err towards restraint and craft over extra effects.

`README.md` documents what the site *does*. This file covers what tends to go wrong
when changing it.

## Shape of the code

Everything renders from three files plus a handful of presentational components:

- `app/page.tsx` — the event data array, the ceremony cards, the RSVP form, the
  scroll container and the keep-scrolling button.
- `app/components/wedding-opening.tsx` — the landing act state machine.
- `app/globals.css` — the entire visual system, hand-written, ~2000 lines. Add
  styles here, in the existing commented section that matches (`act 1: the seal`,
  `portraits`, `the card`, …).

Tailwind v4 is imported at the top of `globals.css`, but the project does not style
with utility classes — every component uses semantic class names resolved in that
file. Follow that. Note that because Tailwind *is* loaded, a stray utility-looking
class name in markup will silently take effect and fight the hand-written rules.

Animation is `framer-motion`. There is no component library and no CSS-in-JS.

## The landing acts

`wedding-opening.tsx` drives a `data-act` attribute on `.landing`, and most landing
CSS is written as `.landing[data-act="..."] …`. The acts are
`sealed → unsealing → announcing → revealed`.

Two things about this are deliberate and easy to break:

- **`announcing` mounts the background photo, the names and the scratch card all at
  once.** There used to be a separate `scratching` act, and splitting them back out
  reintroduces a visible stall where the user stares at an empty stage.
- **`revealed` does not immediately mount the hero portrait and countdown.** A
  `heroReady` flag delays them until the scratch panel has finished its exit
  animation. Mounting them while the panel still occupies space makes the whole
  stage squeeze and snap back.

Act timings are tuned against each other — the door-flap swing, the seal fade-out
and the `unsealing → announcing` timeout overlap on purpose so text starts rising
while the doors are still moving. Changing one in isolation usually reintroduces
dead air after the tap. The user is sensitive to this; retime as a set.

## Portrait cropping (the recurring trap)

All four couple photos are 848×1264 (ratio 0.671) and the subjects sit high in the
frame. Fitting them into an oval has caused more revisions than anything else.

`WeddingPortrait` takes a `zoom` prop that applies `transform: scale()` with
`transform-origin: 50% 0%`, so **the top edge stays pinned and the visible window
shrinks downward**. Combined with `object-position`, the maths is:

```
f = 0.671 / R                 # visible fraction of image height, R = frame w/h
t = objectPositionY * (1 - f) # top of the window, as a fraction of the image
W = f / zoom                  # window height after the zoom
```

A feature at image fraction `F` lands at `(F - t) / W` of the frame. Work the
numbers before changing `zoom` or `objectPosition`; guessing reliably clips heads.

The ovals are `aspect-ratio: 1 / 1.15`, not square. An ellipse pinches towards the
top, so a squarer frame cuts the sides of their heads no matter how the zoom is set.
If you change the aspect ratio, every `zoom`/`objectPosition` pair needs redoing.

`.wedding-portrait` has `overflow: hidden` — that clipping is what keeps the zoomed
photo inside the oval. **Decoration that must extend beyond the oval cannot live on
the portrait**; put it on the wrapper (`.event-portrait` / `.landing-hero-portrait`)
pseudo-elements, which are not clipped. Box-shadow rings on the portrait itself are
unclipped and do work.

## Scene theming

Each ceremony section sets `data-scene` on `.event-stop`, which supplies
`--scene-veil`, `--scene-glow`, `--accent` and `--accent-soft`. Scene-specific rules
are written as `.event-stop[data-scene="haldi"] .event-portrait::before`.

Each scene gets **one** decorative ring around the oval and no more. The portrait
previously carried an inner hairline, a glint border, its own border and two
box-shadow rings on top of the frame, which read as clutter and crowded the faces.
Frame colours should track what is actually in the photograph — the wedding frame is
cream and maroon because those are the garlands the couple wear.

Artefact layers (marigolds, thalambralu, diyas) come from `celebration-artefacts.tsx`
and position themselves with a seeded `mulberry32` PRNG so server and client markup
match. **Do not introduce `Math.random()` there** or you will get hydration errors.

## Constraints that will bite

- The `events` array in `page.tsx` must stay `as const`, and the ids must stay
  `haldi` / `wedding` / `reception` — `RsvpState` keys and `form[event.id]` indexing
  depend on the literal types.
- `.invitation-scroller[data-locked="true"]` is what keeps guests on the landing
  until the date is revealed. It needs both `overflow-y: hidden` and
  `touch-action: none`; dropping the latter lets touch devices scroll past the gate.
- `@media (prefers-reduced-motion: reduce)` near the bottom of `globals.css` kills
  animation globally via `*, *::before, *::after`, so new keyframes do not need their
  own guard. Reduced-motion paths through the landing are also handled in JS (`reduced`
  shortcuts every timeout) — keep both working.
- `.landing-stage` is centre-justified, so `padding-top` only shifts its content down
  by **half** the value. Offsets there look wrong until you account for it.
- `.event-stop` has `min-height: 100svh`, which overrides an inline `height`.
- `.landing-stage` must paint above `.paper-flap` (z-index 6) or the wax seal
  disappears behind the doors.

## Copy

The invitation is written in the couple's third-person voice throughout and signed
from them both; it is sent to friends and plus-ones, not whole families. Keep it
specific and warm rather than generic. Use plain English event names (Haldi,
Wedding, Reception) rather than transliterating from Telugu. No references to
alcohol or non-vegetarian food.

**No em dashes anywhere in guest-facing copy** (this rule is about the site's text,
not these notes). Recast the sentence or use a comma instead.

## Before you finish

```bash
npm run lint && npx tsc --noEmit && npm run build
```

Animation *feel* — pacing, smoothness, whether a crop looks right — cannot be checked
programmatically. Where a change is a judgement call, say which numbers you derived
and which you guessed, so the user knows what to look at.
