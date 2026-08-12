import { one, all, active_season } from '#lib/db';
import { totals, type StatRow } from '#lib/stats';
import type { PageServerLoad } from './$types';

type Line = StatRow & {
	i: string;
	gi: string;
	ti: string | null;
	ty: string;
	s: string;
	dt: number;
	gh: string;
	ga2: string;
	r: string | null;
};

type Logged = Line & { opp: string };

export const load: PageServerLoad = async ({ locals, platform }) => {
	const db = platform!.env.DB;
	const p = await one<{ i: string; ps: string }>(
		db,
		'select i, ps from p where u = ? limit 1',
		locals.user!.i
	);
	if (!p) return { s: null, l: [] as Logged[], ps: '', se: null };
	const se = await active_season(db);
	const lines = await all<Line>(
		db,
		"select gs.*, g.ty as ty, g.s as s, g.dt as dt, g.h as gh, g.a as ga2 from gs join g on g.i = gs.gi where gs.pi = ? and g.st = 'f' order by g.dt desc",
		p.i
	);
	const tm = await all<{ i: string; ab: string }>(db, 'select i, ab from t');
	const ab = Object.fromEntries(tm.map((t) => [t.i, t.ab]));
	return {
		ps: p.ps,
		se,
		s: {
			r: totals(lines.filter((l) => l.s === se?.i && l.ty === 'r')),
			p: totals(lines.filter((l) => l.s === se?.i && l.ty === 'p')),
			c: totals(lines)
		},
		l: lines.map((l) => ({ ...l, opp: ab[l.gh === l.ti ? l.ga2 : l.gh] ?? '—' }))
	};
};
