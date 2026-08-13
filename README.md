# mesh

An online sim hockey league site for NHL 25, plus a player portal.

- Public pages: home, standings, schedule, game pages with box scores and recaps, teams, rosters,
  player pages, and news.
- Coach portal: one signed-in user owns one skater and sees season, playoff, and career splits,
  progression charts, milestones, awards, and profile edits that queue for admin approval.
- Admin dashboard: teams, roster moves, game results and recaps, attribute snapshots, the approval
  queue, news publishing, and a CSV importer for sim exports.

## Stack

SvelteKit (`@sveltejs/kit@next`) with Svelte 5 runes, Tailwind v4, Cloudflare Workers, D1, and R2.
Use `pnpm`, never `npm` or `npx`. Node 22 or later.

## Install

```bash
pnpm install
```

## Environment

Create `.env` with two keys. Never create `.dev.vars`.

```
GOOGLE_ID=...
GOOGLE_SECRET=...
```

Get both from the Google Cloud Console, under a new OAuth client of type "web application". Add two
authorised redirect URIs:

- `http://localhost:5175/google`
- `https://<your production origin>/google`

The callback path is `/google`. Nothing else works.

## Local database

Every `wrangler` command needs the `env -u CLOUDFLARE_API_TOKEN` prefix on this machine. The
exported token has no D1 scope and shadows the working OAuth login.

```bash
env -u CLOUDFLARE_API_TOKEN pnpm exec wrangler d1 migrations apply mesh --local
env -u CLOUDFLARE_API_TOKEN pnpm exec wrangler d1 execute mesh --local --file scripts/seed.sql
env -u CLOUDFLARE_API_TOKEN pnpm exec wrangler d1 execute mesh --local --command "select count(*) from p"
```

## Promote the first admin

There is no bootstrap screen. Sign in once with Google, then run this against the same database:

```bash
env -u CLOUDFLARE_API_TOKEN pnpm exec wrangler d1 execute mesh --local --command "update u set r = 'a' where e = '<your email>'"
```

Use `--remote` instead of `--local` to promote an admin in production.

## Development server

`pnpm dev` serves on port **5175**, pinned with `strictPort` in `vite.config.ts`. The port is fixed
because it is registered with Google as an authorised redirect URI, and a port that drifts breaks
sign-in.

## Demo league

The site ships with a generated demo season so it is never empty while you set the real league up.
`scripts/demo.mjs` writes `scripts/demo.sql` from a fixed seed: 8 clubs in two divisions, 80
players, a single round robin of 28 played games with full box scores, 8 fixtures ahead, three
dated rating snapshots per player, awards, recaps, and news.

```bash
node scripts/demo.mjs                                                     # regenerate the sql
env -u CLOUDFLARE_API_TOKEN pnpm exec wrangler d1 execute mesh --local --file scripts/demo.sql
env -u CLOUDFLARE_API_TOKEN pnpm exec wrangler d1 execute mesh --remote --file scripts/demo.sql
```

Every demo row has an id starting `d_`, so removing it never touches anything a real league has
entered:

```sql
delete from gs where i like 'd_%';
delete from at where i like 'd_%';
delete from aw where i like 'd_%';
delete from pe where i like 'd_%';
delete from g  where i like 'd_%';
delete from p  where i like 'd_%';
delete from t  where i like 'd_%';
delete from ns where i like 'd_%';
delete from u  where i = 'd_u_office';
```

## Seasons

Standings, stat splits, and the importer all read the active season. Exactly one season is active at
a time. Create one on `/admin/roster`, under "seasons"; adding a season makes it active and closes
the previous one. Use "make active" and "close" on that table to switch seasons later.

## Checks

```bash
pnpm test    # vitest
pnpm check   # svelte-check
pnpm build   # vite build
```

## Deploy

```bash
env -u CLOUDFLARE_API_TOKEN pnpm exec wrangler d1 create mesh
env -u CLOUDFLARE_API_TOKEN pnpm exec wrangler r2 bucket create mesh
env -u CLOUDFLARE_API_TOKEN pnpm exec wrangler d1 migrations apply mesh --remote
env -u CLOUDFLARE_API_TOKEN pnpm exec wrangler secret put GOOGLE_ID
env -u CLOUDFLARE_API_TOKEN pnpm exec wrangler secret put GOOGLE_SECRET
env -u CLOUDFLARE_API_TOKEN pnpm exec wrangler deploy
```

Copy the database id that `d1 create` prints into the `database_id` field of `wrangler.jsonc`.

## Importing stats

Read [docs/imports.md](docs/imports.md).

## Launch week

Report a bug as a GitHub issue on `angelwingscomms/mesh`. Include the page URL, what you did, what
you expected, and what happened instead. A screenshot helps.
