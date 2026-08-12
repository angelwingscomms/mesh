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

- `http://localhost:5173/google`
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
