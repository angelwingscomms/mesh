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
	st: string;
};

type Line = StatRow & { ty: string; s: string };
type Award = { n: string; ty: string; d: number };

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = platform!.env.DB;
	const p = await one<Player>(db, 'select i, n, j, ps, b, h, t, st from p where i = ?', params.i);
	if (!p) error(404, 'no such player');
	const t = p.t
		? await one<{ n: string; ab: string }>(db, 'select n, ab from t where i = ?', p.t)
		: null;
	const se = await active_season(db);
	const seasons = await all<{ i: string; n: string; c: number }>(
		db,
		'select i, n, c from se order by c desc'
	);
	const lines = await all<Line>(
		db,
		"select gs.*, g.ty as ty, g.s as s from gs join g on g.i = gs.gi where gs.pi = ? and g.st = 'f'",
		p.i
	);
	const snaps = await all<{ d: number; v: string }>(
		db,
		'select d, v from at where p = ? order by d asc',
		p.i
	);
	const rank = se
		? await one<{ n: number }>(
				db,
				"select count(*) + 1 as n from (select gs.pi as pi, sum(gs.gl) + sum(gs.a) as pt from gs join g on g.i = gs.gi where g.s = ? and g.st = 'f' and gs.sv is null group by gs.pi) where pt > (select coalesce(sum(gs.gl) + sum(gs.a), 0) from gs join g on g.i = gs.gi where g.s = ? and g.st = 'f' and gs.pi = ?)",
				se.i,
				se.i,
				p.i
			)
		: null;

	return {
		p,
		t,
		se,
		rank: rank?.n ?? 0,
		s: {
			r: totals(lines.filter((l) => l.s === se?.i && l.ty === 'r')),
			p: totals(lines.filter((l) => l.s === se?.i && l.ty === 'p')),
			c: totals(lines)
		},
		history: seasons
			.map((x) => ({ n: x.n, t: totals(lines.filter((l) => l.s === x.i)) }))
			.filter((x) => x.t.gp > 0),
		w: await all<Award>(db, 'select n, ty, d from aw where p = ? order by d desc', p.i),
		snaps: snaps.map((x) => ({ d: x.d, v: JSON.parse(x.v) as Record<string, number> }))
	};
};
