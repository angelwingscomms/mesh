import { all, team_map } from './db';
import { standings, type GameRow, type TeamRow } from './stats';

export type Fixture = GameRow & { i: string; dt: number; ty: string };

export type Standing = TeamRow & {
	n: string;
	ab: string;
	d: string;
	streak: string;
	form: number[];
};

export const season_games = (db: D1Database, season: string) =>
	all<Fixture>(
		db,
		'select i, h, a, hg, ag, ot, st, dt, ty from g where s = ? order by dt asc',
		season
	);

const outcome = (g: Fixture, team: string) => {
	const hg = Number(g.hg ?? 0);
	const ag = Number(g.ag ?? 0);
	const won = (g.h === team && hg > ag) || (g.a === team && ag > hg);
	if (won) return 'w';
	return g.ot ? 'o' : 'l';
};

export async function standing_table(
	db: D1Database,
	season: string,
	games?: Fixture[]
): Promise<Standing[]> {
	const rows = games ?? (await season_games(db, season));
	const league = rows.filter((g) => g.ty !== 'e');
	const tm = await team_map(db);
	const ranked = standings(league);
	const seen = new Set(ranked.map((r) => r.t));
	const idle = Object.values(tm)
		.filter((t) => !seen.has(t.i))
		.sort((x, y) => (x.n < y.n ? -1 : 1))
		.map((t) => ({ t: t.i, gp: 0, w: 0, l: 0, o: 0, pt: 0, gf: 0, ga: 0 }));
	return [...ranked, ...idle].map((r) => {
		const played = league.filter((g) => g.st === 'f' && (g.h === r.t || g.a === r.t));
		const marks = played.map((g) => outcome(g, r.t));
		let run = 0;
		for (let i = marks.length - 1; i >= 0 && marks[i] === marks.at(-1); i -= 1) run += 1;
		let total = 0;
		const form = played.slice(-10).map((g) => {
			const mark = outcome(g, r.t);
			total += mark === 'w' ? 2 : mark === 'o' ? 1 : 0;
			return total;
		});
		return {
			...r,
			n: tm[r.t]?.n ?? r.t,
			ab: tm[r.t]?.ab ?? r.t,
			d: tm[r.t]?.d ?? '',
			streak: marks.length ? marks.at(-1)! + run : '—',
			form
		};
	});
}

export const SKATER_BOARDS: [string, string, string][] = [
	['pt', 'points', 'sum(gs.gl) + sum(gs.a)'],
	['gl', 'goals', 'sum(gs.gl)'],
	['a', 'assists', 'sum(gs.a)'],
	['pm', 'plus minus', 'sum(gs.pm)'],
	['sog', 'shots', 'sum(gs.sog)'],
	['hit', 'hits', 'sum(gs.hit)'],
	['blk', 'blocks', 'sum(gs.blk)'],
	['pim', 'penalty minutes', 'sum(gs.pim)']
];

export type Leader = {
	i: string;
	n: string;
	ab: string | null;
	ps: string;
	gp: number;
	gl: number;
	a: number;
	v: number;
};

export const skater_board = (db: D1Database, season: string, expr: string, limit = 10) =>
	all<Leader>(
		db,
		'select p.i as i, p.n as n, p.ps as ps, tm.ab as ab, count(gs.i) as gp, coalesce(sum(gs.gl), 0) as gl, coalesce(sum(gs.a), 0) as a, ' +
			expr +
			" as v from gs join p on p.i = gs.pi join g on g.i = gs.gi left join t tm on tm.i = p.t where g.s = ? and g.st = 'f' and gs.sv is null group by p.i order by v desc, gp asc limit " +
			limit,
		season
	);

export type Goalie = {
	i: string;
	n: string;
	ab: string | null;
	gp: number;
	sv: number;
	sa: number;
	ga: number;
	so: number;
	toi: number;
};

export const goalie_board = (db: D1Database, season: string, limit = 10) =>
	all<Goalie>(
		db,
		"select p.i as i, p.n as n, tm.ab as ab, count(gs.i) as gp, coalesce(sum(gs.sv), 0) as sv, coalesce(sum(gs.sa), 0) as sa, coalesce(sum(gs.ga), 0) as ga, coalesce(sum(gs.so), 0) as so, coalesce(sum(gs.toi), 0) as toi from gs join p on p.i = gs.pi join g on g.i = gs.gi left join t tm on tm.i = p.t where g.s = ? and g.st = 'f' and gs.sv is not null group by p.i order by (cast(sum(gs.sv) as real) / max(sum(gs.sa), 1)) desc limit " +
			limit,
		season
	);
