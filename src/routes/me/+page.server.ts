import { one, all, active_season } from '#lib/db';
import type { PageServerLoad } from './$types';

type Recent = {
	i: string;
	gi: string;
	dt: number;
	gl: number;
	a: number;
	toi: number;
	opp: string;
};
type Pending = { i: string; f: string; v: string; c: number };

export const load: PageServerLoad = async ({ locals, platform }) => {
	const db = platform!.env.DB;
	const p = await one<{ i: string; t: string | null }>(
		db,
		'select i, t from p where u = ? limit 1',
		locals.user!.i
	);
	if (!p) return { t: null, l: [] as Recent[], e: [] as Pending[], rank: 0 };
	const se = await active_season(db);
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
		rank: rank?.n ?? 0,
		t: p.t
			? await one<{ n: string; ab: string }>(db, 'select n, ab from t where i = ?', p.t)
			: null,
		l: await all<Recent>(
			db,
			"select gs.i as i, gs.gi as gi, g.dt as dt, gs.gl as gl, gs.a as a, gs.toi as toi, case when g.h = gs.ti then ah.ab else hh.ab end as opp from gs join g on g.i = gs.gi join t hh on hh.i = g.h join t ah on ah.i = g.a where gs.pi = ? and g.st = 'f' order by g.dt desc limit 8",
			p.i
		),
		e: await all<Pending>(
			db,
			"select i, f, v, c from pe where p = ? and st = 'r' order by c desc",
			p.i
		)
	};
};
