import { error } from '@sveltejs/kit';
import { one, all } from '#lib/db';
import type { PageServerLoad } from './$types';

export type Game = {
	i: string;
	dt: number;
	st: string;
	ty: string;
	hg: number | null;
	ag: number | null;
	ot: string;
	rc: string | null;
	h: string;
	a: string;
};

export type Team = { i: string; n: string; ab: string };

export type Line = {
	i: string;
	ti: string | null;
	pi: string;
	pn: string;
	pj: number | null;
	pps: string;
	gl: number;
	a: number;
	pm: number;
	pim: number;
	sog: number;
	hit: number;
	blk: number;
	toi: number;
	sv: number | null;
	ga: number | null;
	sa: number | null;
};

const star_score = (l: Line) =>
	l.sv === null ? l.gl * 2 + l.a + l.sog * 0.05 : (l.sv - (l.ga ?? 0) * 2) / 6;

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = platform!.env.DB;
	const g = await one<Game>(db, 'select * from g where i = ?', params.i);
	if (!g) error(404, 'no such game');
	const h = await one<Team>(db, 'select i, n, ab from t where i = ?', g.h);
	const a = await one<Team>(db, 'select i, n, ab from t where i = ?', g.a);
	const lines = await all<Line>(
		db,
		'select gs.*, p.n as pn, p.j as pj, p.ps as pps from gs join p on p.i = gs.pi where gs.gi = ? order by (gs.gl + gs.a) desc',
		g.i
	);
	return {
		g,
		h,
		a,
		s: { h: lines.filter((l) => l.ti === g.h), a: lines.filter((l) => l.ti === g.a) },
		stars:
			g.st === 'f'
				? [...lines].sort((x, y) => star_score(y) - star_score(x)).slice(0, 3)
				: ([] as Line[])
	};
};
