import { fail } from '@sveltejs/kit';
import { one, all, run, uid, now, active_season } from '#lib/db';
import {
	parse_csv,
	auto_map,
	missing_fields,
	header_hash,
	map_rows,
	ALIASES,
	REQUIRED
} from '#lib/csv';
import type { Actions, PageServerLoad } from './$types';

type Log = { i: string; f: string; n: number; st: string; er: string | null; c: number };

const DAY = 86400000;

const STATS = [
	'gl',
	'a',
	'pm',
	'pim',
	'sog',
	'hit',
	'blk',
	'toi',
	'fow',
	'fol',
	'sv',
	'ga',
	'sa',
	'so'
];

export const load: PageServerLoad = async ({ platform }) => ({
	fields: Object.keys(ALIASES),
	required: REQUIRED,
	h: await all<Log>(platform!.env.DB, 'select i, f, n, st, er, c from im order by c desc limit 20')
});

export const actions: Actions = {
	upload: async ({ request, platform }) => {
		const db = platform!.env.DB;
		const file = (await request.formData()).get('file');
		if (
			!(file instanceof File) ||
			!file.size ||
			file.size > 5 * 1024 * 1024 ||
			!file.name.toLowerCase().endsWith('.csv')
		)
			return fail(400, { m: 'choose a csv file' });
		const rows = parse_csv(await file.text());
		if (rows.length < 2) return fail(400, { m: 'that file has no rows' });
		const headers = rows[0];
		const hs = header_hash(headers);
		const preset = await one<{ v: string }>(db, 'select v from mp where hs = ?', hs);
		const m = preset ? (JSON.parse(preset.v) as Record<string, string>) : auto_map(headers);
		const k = 'im/' + uid() + '.csv';
		await platform!.env.R2.put(k, await file.arrayBuffer(), {
			httpMetadata: { contentType: 'text/csv' }
		});
		return {
			k,
			f: file.name,
			h: headers,
			m,
			mi: missing_fields(m),
			pv: map_rows(headers, rows.slice(1, 6), m)
		};
	},

	commit: async ({ request, locals, platform }) => {
		const db = platform!.env.DB;
		const form = await request.formData();
		const k = String(form.get('k') ?? '');
		const f = String(form.get('f') ?? 'import.csv');
		const m: Record<string, string> = {};
		for (const field of Object.keys(ALIASES)) {
			const header = String(form.get(field) ?? '');
			if (header) m[field] = header;
		}
		if (missing_fields(m).length) return fail(400, { m: 'map the required columns' });

		const object = k ? await platform!.env.R2.get(k) : null;
		if (!object) return fail(400, { m: 'that upload expired, start again' });
		const rows = parse_csv(await object.text());
		const headers = rows[0];
		const data = map_rows(headers, rows.slice(1), m);

		const log = uid();
		await run(
			db,
			"insert into im (i, f, k, n, st, u, c) values (?, ?, ?, 0, 'r', ?, ?)",
			log,
			f,
			k,
			locals.user!.i,
			now()
		);

		try {
			const se = await active_season(db);
			if (!se) throw new Error('no active season');
			const teams = await all<{ i: string; ab: string }>(db, 'select i, ab from t');
			const by_ab = new Map(teams.map((t) => [t.ab.toLowerCase(), t.i]));
			const players = await all<{ i: string; n: string; t: string | null }>(
				db,
				'select i, n, t from p'
			);

			let written = 0;
			let skipped = 0;
			const created = new Set<string>();
			const touched = new Set<string>();

			for (const r of data) {
				const ti = by_ab.get(String(r.team).toLowerCase());
				const oi = by_ab.get(String(r.opp).toLowerCase());
				if (!ti || !oi) {
					skipped += 1;
					continue;
				}
				const name = String(r.player).toLowerCase();
				const candidates = players.filter((p) => p.n.toLowerCase() === name);
				const player = candidates.find((p) => p.t === ti) ?? candidates[0];
				if (!player) {
					skipped += 1;
					continue;
				}
				const stamp = Date.parse(String(r.date));
				if (!Number.isFinite(stamp)) {
					skipped += 1;
					continue;
				}
				const from = Math.floor(stamp / DAY) * DAY;
				let game = await one<{ i: string; hg: number | null }>(
					db,
					'select i, hg from g where s = ? and dt >= ? and dt < ? and ((h = ? and a = ?) or (h = ? and a = ?)) limit 1',
					se.i,
					from,
					from + DAY,
					ti,
					oi,
					oi,
					ti
				);
				if (!game) {
					const gi = uid();
					await run(
						db,
						"insert into g (i, s, ty, h, a, dt, st) values (?, ?, 'r', ?, ?, ?, 'f')",
						gi,
						se.i,
						ti,
						oi,
						from
					);
					game = { i: gi, hg: null };
					created.add(gi);
				}
				touched.add(game.i);
				const values = STATS.map((s) => (s in r ? Number(r[s]) : 0));
				await run(
					db,
					'insert into gs (i, gi, pi, ti, ' +
						STATS.join(', ') +
						') values (?, ?, ?, ?, ' +
						STATS.map(() => '?').join(', ') +
						') on conflict (gi, pi) do update set ' +
						STATS.map((s) => s + ' = excluded.' + s).join(', '),
					uid(),
					game.i,
					player.i,
					ti,
					...values
				);
				written += 1;
			}

			for (const gi of touched) {
				const g = await one<{ h: string; a: string; hg: number | null }>(
					db,
					'select h, a, hg from g where i = ?',
					gi
				);
				if (!g || g.hg !== null) continue;
				const hg =
					(
						await one<{ n: number }>(
							db,
							'select coalesce(sum(gl), 0) as n from gs where gi = ? and ti = ?',
							gi,
							g.h
						)
					)?.n ?? 0;
				const ag =
					(
						await one<{ n: number }>(
							db,
							'select coalesce(sum(gl), 0) as n from gs where gi = ? and ti = ?',
							gi,
							g.a
						)
					)?.n ?? 0;
				await run(db, "update g set hg = ?, ag = ?, st = 'f' where i = ?", hg, ag, gi);
			}

			await run(
				db,
				'insert or replace into mp (i, n, hs, v, c) values (?, ?, ?, ?, ?)',
				uid(),
				f,
				header_hash(headers),
				JSON.stringify(m),
				now()
			);
			await run(db, "update im set st = 's', n = ? where i = ?", written, log);
			return { n: written, sk: skipped, gc: created.size };
		} catch (e) {
			await run(db, "update im set st = 'f', er = ? where i = ?", (e as Error).message, log);
			return fail(500, { m: (e as Error).message });
		}
	}
};
