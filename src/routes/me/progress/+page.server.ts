import { one, all } from '#lib/db';
import type { PageServerLoad } from './$types';

type Snap = { d: number; v: Record<string, number>; no: string };
type Award = { n: string; ty: string; s: string | null; d: number };
type Point = { dt: number; pt: number };

export const load: PageServerLoad = async ({ locals, platform }) => {
	const db = platform!.env.DB;
	const p = await one<{ i: string }>(db, 'select i from p where u = ? limit 1', locals.user!.i);
	if (!p) return { a: [] as Snap[], w: [] as Award[], m: [] as Point[] };
	const rows = await all<{ d: number; v: string; no: string }>(
		db,
		'select d, v, no from at where p = ? order by d asc',
		p.i
	);
	const games = await all<{ dt: number; gl: number; a: number }>(
		db,
		"select g.dt as dt, gs.gl as gl, gs.a as a from gs join g on g.i = gs.gi where gs.pi = ? and g.st = 'f' order by g.dt asc",
		p.i
	);
	let running = 0;
	return {
		a: rows.map((r) => ({ d: r.d, no: r.no, v: JSON.parse(r.v) as Record<string, number> })),
		w: await all<Award>(db, 'select n, ty, s, d from aw where p = ? order by d desc', p.i),
		m: games.map((g) => ({ dt: g.dt, pt: (running += g.gl + g.a) }))
	};
};
