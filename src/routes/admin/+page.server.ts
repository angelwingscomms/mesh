import { one, all } from '#lib/db';
import type { PageServerLoad } from './$types';

type Import = { i: string; f: string; n: number; st: string; er: string | null; c: number };
const count = async (db: D1Database, sql: string) => (await one<{ n: number }>(db, sql))?.n ?? 0;

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform!.env.DB;
	return {
		a: await count(db, "select count(*) as n from pe where st = 'r'"),
		t: await count(db, 'select count(*) as n from t'),
		p: await count(db, "select count(*) as n from p where st = 'a'"),
		g: await count(db, "select count(*) as n from g where st = 'f'"),
		n: await count(db, 'select count(*) as n from ns where pb is null'),
		i: await all<Import>(db, 'select i, f, n, st, er, c from im order by c desc limit 5')
	};
};
