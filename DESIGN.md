# mesh design system

Everything visual comes from `src/routes/layout.css`. There is no other stylesheet.

## Tokens

| Token             | Use                                           |
| ----------------- | --------------------------------------------- |
| `--color-ice`     | page background                               |
| `--color-board`   | card and table surfaces                       |
| `--color-line`    | borders and table rules                       |
| `--color-ink`     | body text                                     |
| `--color-mute`    | secondary text, dates, empty states           |
| `--color-brand`   | headings, links, primary buttons              |
| `--color-brand-2` | hover and active states of brand elements     |
| `--color-accent`  | live and alert states only, never decoration  |
| `--color-good`    | wins, positive deltas, approve                |
| `--color-bad`     | losses, negative deltas, reject               |
| `--radius-card`   | corner radius of every card                   |
| `--spacing-gut`   | standard gutter between blocks                |
| `--font-sans`     | the only font stack; system fonts, no webfont |

Tailwind exposes each token as a utility, so `--color-brand` is `text-brand`, `bg-brand`,
`border-brand`, and so on.

## Rules

- All user-facing text is lowercase.
- Only Tailwind utilities built from the tokens above. No raw colour, size or radius values
  in markup.
- No `<style>` blocks and no `style=` attributes anywhere in `src/`. A value that cannot be
  expressed as a utility is a value this design system does not have yet.
- Every table lives inside `<div class="overflow-x-auto">` so a phone scrolls the table
  rather than the page.
- Grids are single column by default and gain columns at `sm:`, `md:` and `lg:`.
- Every text form submits on ctrl/cmd+enter via `use:ctrlEnter` from `src/lib/actions.ts`.
  Plain enter keeps its browser default, so a textarea still makes newlines. File-upload-only
  forms are exempt.
- Fonts, if ever added, live in `static/fonts`.
