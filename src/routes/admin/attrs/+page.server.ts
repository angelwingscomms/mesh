import { fail } from '@sveltejs/kit';
import { one, all, run, uid, now, active_season } from '#lib/db';
import { ATTRS } from '#lib/attrs';
import type { Actions, PageServerLoad } from './$types';

type Pick = { i: string; n: string; ab: string | null };
type Snap = { i: string; d: number; v: string; no: string };

export const load: PageServerLoad = async ({ url, platform }) => {
	const db = platform!.env.DB;
	const players = await all<Pick>(
		db,
		"select p.i as i, p.n as n, tm.ab as ab from p left join t tm on tm.i = p.t where p.st = 'a' order by p.n"
	);
	const id = url.searchParams.get('p');
	if (!id) return { pl: players, p: null, a: [] as Snap[] };
	return {
		pl: players,
		p: await one<{ i: string; n: string }>(db, 'select i, n from p where i = ?', id),
		a: await all<Snap>(db, 'select i, d, v, no from at where p = ? order by d desc', id)
	};
};

export const actions: Actions = {
	snap: async ({ request, platform }) => {
		const form = await request.formData();
		const id = String(form.get('p') ?? '');
		if (!id) return fail(400, { m: 'choose a player' });
		const v: Record<string, number> = {};
		for (const [key] of ATTRS) {
			const n = Number(form.get(key));
			v[key] = Number.isFinite(n) ? Math.min(99, Math.max(0, Math.round(n))) : 0;
		}
		await run(
			platform!.env.DB,
			'insert into at (i, p, d, v, no) values (?, ?, ?, ?, ?)',
			uid(),
			id,
			now(),
			JSON.stringify(v),
			String(form.get('no') ?? '').trim()
		);
	},

	award: async ({ request, platform }) => {
		const db = platform!.env.DB;
		const form = await request.formData();
		const se = await active_season(db);
		await run(
			db,
			'insert into aw (i, p, n, s, ty, d) values (?, ?, ?, ?, ?, ?)',
			uid(),
			String(form.get('p') ?? ''),
			String(form.get('n') ?? '')
				.trim()
				.toLowerCase(),
			se?.i ?? null,
			String(form.get('ty') ?? 'a'),
			now()
		);
	}
};
