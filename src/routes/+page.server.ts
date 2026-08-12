import { all, active_season } from '#lib/db';

type Fixture = { i: string; dt: number; h: string; a: string };
type Result = Fixture & { hg: number; ag: number; ot: string };
type Post = { i: string; ti: string; sl: string; pb: number };
type Leader = { i: string; n: string; ab: string | null; gl: number; a: number; pt: number };
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform!.env.DB;
	const se = await active_season(db);
	if (!se) return { g: [] as Fixture[], r: [] as Result[], n: [] as Post[], l: [] as Leader[] };
	return {
		g: await all<Fixture>(
			db,
			"select g.i as i, g.dt as dt, ht.ab as h, at.ab as a from g join t ht on ht.i = g.h join t at on at.i = g.a where g.s = ? and g.st = 's' order by g.dt asc limit 5",
			se.i
		),
		r: await all<Result>(
			db,
			"select g.i as i, g.dt as dt, g.hg as hg, g.ag as ag, g.ot as ot, ht.ab as h, at.ab as a from g join t ht on ht.i = g.h join t at on at.i = g.a where g.s = ? and g.st = 'f' order by g.dt desc limit 5",
			se.i
		),
		n: await all<Post>(db, 'select i, ti, sl, pb from ns where pb is not null order by pb desc limit 3'),
		l: await all<Leader>(
			db,
			"select p.i as i, p.n as n, tm.ab as ab, sum(gs.gl) as gl, sum(gs.a) as a, sum(gs.gl) + sum(gs.a) as pt from gs join p on p.i = gs.pi join g on g.i = gs.gi left join t tm on tm.i = p.t where g.s = ? and g.st = 'f' group by p.i order by pt desc, gl desc limit 10",
			se.i
		)
	};
};
