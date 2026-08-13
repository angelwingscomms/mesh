import { all } from '#lib/db';
import type { PageServerLoad } from './$types';

type Hit = { i: string; n: string; ab: string | null; ps: string; st: string };
type TeamHit = { i: string; n: string; ab: string; d: string };

export const load: PageServerLoad = async ({ url, platform }) => {
	const q = (url.searchParams.get('q') ?? '').trim();
	if (q.length < 2) return { q, p: [] as Hit[], t: [] as TeamHit[] };
	const db = platform!.env.DB;
	const like = '%' + q.toLowerCase() + '%';
	return {
		q,
		p: await all<Hit>(
			db,
			'select p.i as i, p.n as n, p.ps as ps, p.st as st, tm.ab as ab from p left join t tm on tm.i = p.t where lower(p.n) like ? order by p.st, p.n limit 30',
			like
		),
		t: await all<TeamHit>(
			db,
			'select i, n, ab, d from t where lower(n) like ? or lower(ab) like ? order by n limit 10',
			like,
			like
		)
	};
};
