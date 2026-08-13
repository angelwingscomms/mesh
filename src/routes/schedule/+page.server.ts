import { all, active_season, team_map } from '#lib/db';
import { season_games, type Fixture } from '#lib/league';
import type { PageServerLoad } from './$types';

type Team = { i: string; n: string; ab: string };

export const load: PageServerLoad = async ({ url, platform }) => {
	const db = platform!.env.DB;
	const se = await active_season(db);
	const teams = await all<Team>(db, 'select i, n, ab from t order by n');
	if (!se) return { g: [] as Fixture[], se: null, teams, tm: {}, t: '' };
	const pick = url.searchParams.get('t') ?? '';
	const chosen = teams.find((x) => x.ab === pick);
	const games = await season_games(db, se.i);
	return {
		se,
		teams,
		t: chosen?.ab ?? '',
		tm: await team_map(db),
		g: chosen ? games.filter((x) => x.h === chosen.i || x.a === chosen.i) : games
	};
};
