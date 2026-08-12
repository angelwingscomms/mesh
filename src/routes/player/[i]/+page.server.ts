import { error } from '@sveltejs/kit';
import { one, all, active_season } from '#lib/db';
import { totals, type StatRow } from '#lib/stats';
import type { PageServerLoad } from './$types';

type Player = {
	i: string;
	n: string;
	j: number | null;
	ps: string;
	b: string;
	h: string | null;
	t: string | null;
};
type Line = StatRow & { ty: string; s: string };
type Award = { n: string; ty: string; d: number };

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = platform!.env.DB;
	const p = await one<Player>(db, 'select i, n, j, ps, b, h, t from p where i = ?', params.i);
	if (!p) error(404, 'no such player');
	const t = p.t ? await one<{ n: string; ab: string }>(db, 'select n, ab from t where i = ?', p.t) : null;
	const se = await active_season(db);
	const lines = await all<Line>(
		db,
		"select gs.*, g.ty as ty, g.s as s from gs join g on g.i = gs.gi where gs.pi = ? and g.st = 'f'",
		p.i
	);
	const snap = await one<{ v: string; d: number }>(
		db,
		'select v, d from at where p = ? order by d desc limit 1',
		p.i
	);
	return {
		p,
		t,
		s: {
			r: totals(lines.filter((l) => l.s === se?.i && l.ty === 'r')),
			p: totals(lines.filter((l) => l.s === se?.i && l.ty === 'p')),
			c: totals(lines)
		},
		w: await all<Award>(db, 'select n, ty, d from aw where p = ? order by d desc', p.i),
		at: snap ? { d: snap.d, v: JSON.parse(snap.v) as Record<string, number> } : null
	};
};
