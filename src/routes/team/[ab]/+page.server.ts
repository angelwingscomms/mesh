import { error } from '@sveltejs/kit';
import { one, all, active_season } from '#lib/db';
import type { PageServerLoad } from './$types';

type Team = { i: string; n: string; ab: string; d: string };
type Skater = {
	i: string;
	n: string;
	j: number | null;
	ps: string;
	gl: number;
	a: number;
	gp: number;
};

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = platform!.env.DB;
	const t = await one<Team>(db, 'select i, n, ab, d from t where ab = ?', params.ab);
	if (!t) error(404, 'no such team');
	const se = await active_season(db);
	return {
		t,
		se,
		p: await all<Skater>(
			db,
			"select p.i as i, p.n as n, p.j as j, p.ps as ps, coalesce(sum(gs.gl), 0) as gl, coalesce(sum(gs.a), 0) as a, coalesce(count(gs.i), 0) as gp from p left join gs on gs.pi = p.i left join g on g.i = gs.gi and g.s = ? and g.st = 'f' where p.t = ? and p.st = 'a' group by p.i order by p.j",
			se?.i ?? '',
			t.i
		)
	};
};
