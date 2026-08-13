import { all, active_season, team_map } from '#lib/db';
import {
	season_games,
	standing_table,
	skater_board,
	type Standing,
	type Fixture,
	type Leader
} from '#lib/league';
import type { PageServerLoad } from './$types';

type Post = { i: string; ti: string; sl: string; bd: string; pb: number };

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform!.env.DB;
	const se = await active_season(db);
	const n = await all<Post>(
		db,
		'select i, ti, sl, bd, pb from ns where pb is not null order by pb desc limit 3'
	);
	if (!se)
		return {
			se: null,
			st: [] as Standing[],
			g: [] as Fixture[],
			r: [] as Fixture[],
			n,
			l: [] as Leader[],
			tm: {} as Record<string, { i: string; n: string; ab: string; d: string }>
		};
	const games = await season_games(db, se.i);
	return {
		se,
		n,
		tm: await team_map(db),
		st: await standing_table(db, se.i, games),
		g: games.filter((x) => x.st === 's').slice(0, 4),
		r: games
			.filter((x) => x.st === 'f')
			.reverse()
			.slice(0, 4),
		l: await skater_board(db, se.i, 'sum(gs.gl) + sum(gs.a)', 8)
	};
};
