import { all } from '#lib/db';
import type { PageServerLoad } from './$types';

type Post = { i: string; ti: string; sl: string; pb: number };

export const load: PageServerLoad = async ({ platform }) => ({
	n: await all<Post>(
		platform!.env.DB,
		'select i, ti, sl, pb from ns where pb is not null order by pb desc'
	)
});
