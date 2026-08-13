import { active_season } from '#lib/db';
import { skater_board, goalie_board, SKATER_BOARDS, type Leader, type Goalie } from '#lib/league';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform!.env.DB;
	const se = await active_season(db);
	if (!se) return { se: null, pts: [] as Leader[], boards: [], gk: [] as Goalie[] };
	const [, ...rest] = SKATER_BOARDS;
	return {
		se,
		pts: await skater_board(db, se.i, SKATER_BOARDS[0][2], 15),
		boards: await Promise.all(
			rest.map(async ([key, name, expr]) => ({
				key,
				name,
				rows: await skater_board(db, se.i, expr, 5)
			}))
		),
		gk: await goalie_board(db, se.i, 10)
	};
};
