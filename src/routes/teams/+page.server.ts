import { active_season } from '#lib/db';
import { standing_table, type Standing } from '#lib/league';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform!.env.DB;
	const se = await active_season(db);
	if (!se) return { t: [] as Standing[], se: null };
	return { t: await standing_table(db, se.i), se };
};
