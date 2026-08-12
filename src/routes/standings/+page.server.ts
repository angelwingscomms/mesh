import { all, active_season, team_map } from '#lib/db';
import { standings, type GameRow } from '#lib/stats';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform!.env.DB;
	const se = await active_season(db);
	if (!se) return { s: [], se: null };
	const games = await all<GameRow>(
		db,
		"select h, a, hg, ag, ot, st from g where s = ? and ty = 'r'",
		se.i
	);
	const tm = await team_map(db);
	return {
		s: standings(games).map((r) => ({ ...r, n: tm[r.t].n, ab: tm[r.t].ab, d: tm[r.t].d })),
		se
	};
};
