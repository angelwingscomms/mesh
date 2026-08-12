import { all, active_season } from '#lib/db';
import type { PageServerLoad } from './$types';

export type Fixture = {
	i: string;
	dt: number;
	st: string;
	ty: string;
	hg: number | null;
	ag: number | null;
	ot: string;
	h: string;
	a: string;
	hn: string;
	an: string;
};

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform!.env.DB;
	const se = await active_season(db);
	if (!se) return { g: [] as Fixture[], se: null };
	return {
		g: await all<Fixture>(
			db,
			'select g.i as i, g.dt as dt, g.st as st, g.ty as ty, g.hg as hg, g.ag as ag, g.ot as ot, ht.ab as h, at.ab as a, ht.n as hn, at.n as an from g join t ht on ht.i = g.h join t at on at.i = g.a where g.s = ? order by g.dt asc',
			se.i
		),
		se
	};
};
