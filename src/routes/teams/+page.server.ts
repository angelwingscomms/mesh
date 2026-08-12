import { all } from '#lib/db';
import type { PageServerLoad } from './$types';

type Team = { i: string; n: string; ab: string; d: string };

export const load: PageServerLoad = async ({ platform }) => ({
	t: await all<Team>(platform!.env.DB, 'select i, n, ab, d from t order by d, n')
});
