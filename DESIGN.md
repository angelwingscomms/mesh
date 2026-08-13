# mesh design system

Everything visual comes from `src/routes/layout.css`. There is no other stylesheet, no `<style>`
block, and no `style=` attribute anywhere in `src/`.

## The concept

A site for a sim hockey league that feels like **fresh ice under arena light**, behaves like **a
blade laying a line that does not fade**, and is remembered for **the cut**.

Two consequences run through every decision:

1. **Content sits on the ice, chrome sits beyond the boards.** The page field is cold off-white.
   The header, the footer, and the league-office bar are near-black. Nothing else inverts.
2. **Colour exists only as a line, never as a fill.** On a real sheet the only colour is the paint
   under the ice. So links, traces, deltas, and rules carry colour; surfaces never do. Buttons are
   ink, not blue. This single rule is what keeps the palette from drifting.

## Tokens

| Token                                             | Use                                                                     |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| `--color-ice`                                     | the sheet — page field                                                  |
| `--color-board`                                   | freshly resurfaced ice — cards, tables, text on ink                     |
| `--color-line`                                    | a skate scuff — hairlines, borders, table rules                         |
| `--color-ink`                                     | the dark beyond the boards — text, header, footer                       |
| `--color-mute`                                    | secondary text, dates, empty states                                     |
| `--color-brand`                                   | the blue line — links, traces, positive deltas                          |
| `--color-brand-2`                                 | brand hover                                                             |
| `--color-accent`                                  | the goal line — alerts and destructive actions only                     |
| `--color-good` / `--color-bad`                    | aliases of blue and red, so semantics cannot invent a colour            |
| `--ease-out`                                      | `cubic-bezier(0.16, 1, 0.3, 1)` — a blade entering fast and gliding out |
| `--ease-inout`                                    | `cubic-bezier(0.83, 0, 0.17, 1)` — the resurfacing pass                 |
| `--text-display` / `--text-title` / `--text-head` | fluid sizes, clamped                                                    |

Tailwind exposes each token as a utility: `--color-brand` becomes `text-brand`, `bg-brand`,
`border-brand`.

## Type

One family carries three registers through its width and weight axes, which is why there is no
second sans:

- **Archivo** (variable, weight 100–900, width 62–125%), self-hosted from `static/fonts`.
  - `.display` — 112% width, 800, tight leading. Arena signage.
  - `.title` / `.head` — section scale.
  - `.numeral` — 88% width, 800, tabular figures. Sweater numbers and every statistic.
  - `.label` — 11px, uppercase, +0.14em tracking. The micro register.
- **Newsreader** (variable), used only for prose: game recaps, news bodies, player bios. Because
  no other page references it, the browser never downloads it on a page without writing.

## Motion

One personality, applied everywhere. Ice has no bounce, so nothing bounces.

- micro and hover: 280–420ms on `--ease-out`
- content reveals: 900ms, staggered 60–80ms, triggered by `use:reveal` at 10% into the viewport
- page transitions: a left-to-right resurfacing wipe through the View Transitions API
- scroll stays native — this is a site people scan, not tour

Only `transform` and `opacity` animate, with one deliberate exception: the trace charts draw
themselves with `stroke-dashoffset`, which repaints but never reflows.

## The cut

The signature, at three scales:

1. **Traces** — every chart is a blade cut: a blue stroke with a white spray edge over dotted ice
   ruling, drawn on load (`Trace.svelte`, `Cut.svelte`).
2. **The underline** — `.cut` wipes a hairline in from the left on hover and out to the right on
   leave, and stays drawn on the current page.
3. **The transition** — the resurfacing wipe between pages.

`Rink.svelte` draws a real rink to scale and appears only where a page has nothing else to say:
the error page, the sign-in card, and the empty portal.

## Rules

- All user-facing text is lowercase.
- Only Tailwind utilities built from the tokens above. No raw colour, size, or radius values.
- Surfaces are square. The boards are flat; the only curve on the sheet is the rink itself.
- Every table lives inside `.sheet` so a phone scrolls the table, not the page.
- Grids are single column by default and gain columns at `sm:`, `md:`, and `lg:`.
- Every text form submits on ctrl/cmd+enter via `use:ctrlEnter`. Plain enter keeps its browser
  default. File-upload-only forms are exempt.
- Reveals are wrapped in `@media (scripting: enabled)`, so the site is complete without JavaScript,
  and `use:reveal` shows everything at once under `prefers-reduced-motion`.
- Grain sits over the whole page at 3.5%. Ice is scuffed, never sterile.
