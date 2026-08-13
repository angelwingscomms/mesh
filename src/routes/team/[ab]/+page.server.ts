import { error } from '@sveltejs/kit';
import { one, all, active_season, team_map } from '#lib/db';
import { season_games, standing_table } from '#lib/league';
import type { PageServerLoad } from './$types';

type Team = { i: string; n: string; ab: string; d: string };

type Skater = {
	i: string;
	n: string;
	j: number | null;
	ps: string;
	gp: number;
	gl: number;
	a: number;
	pm: number;
	sog: number;
	sv: number | null;
	sa: number | null;
	ga: number | null;
};

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = platform!.env.DB;
	const t = await one<Team>(db, 'select i, n, ab, d from t where ab = ?', params.ab);
	if (!t) error(404, 'no such team');
	const se = await active_season(db);
	if (!se) return { t, se: null, rank: 0, row: null, g: [], p: [] as Skater[], tm: {} };
	const games = await season_games(db, se.i);
	const table = await standing_table(db, se.i, games);
	return {
		t,
		se,
		tm: await team_map(db),
		rank: table.findIndex((r) => r.t === t.i) + 1,
		row: table.find((r) => r.t === t.i) ?? null,
		g: games.filter((x) => x.h === t.i || x.a === t.i),
		p: await all<Skater>(
			db,
			"select p.i as i, p.n as n, p.j as j, p.ps as ps, count(gs.i) as gp, coalesce(sum(gs.gl), 0) as gl, coalesce(sum(gs.a), 0) as a, coalesce(sum(gs.pm), 0) as pm, coalesce(sum(gs.sog), 0) as sog, sum(gs.sv) as sv, sum(gs.sa) as sa, sum(gs.ga) as ga from p left join gs on gs.pi = p.i left join g on g.i = gs.gi and g.s = ? and g.st = 'f' where p.t = ? and p.st = 'a' group by p.i order by p.j",
			se.i,
			t.i
		)
	};
};
