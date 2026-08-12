export type StatRow = {
	gl?: number;
	a?: number;
	pm?: number;
	pim?: number;
	sog?: number;
	hit?: number;
	blk?: number;
	toi?: number;
	fow?: number;
	fol?: number;
	sv?: number | null;
	ga?: number | null;
	sa?: number | null;
	so?: number | null;
};

export type Totals = Record<string, number>;

const SUMMED = [
	'gl',
	'a',
	'pm',
	'pim',
	'sog',
	'hit',
	'blk',
	'toi',
	'fow',
	'fol',
	'sv',
	'ga',
	'sa',
	'so'
] as const;

export function totals(rows: StatRow[]): Totals {
	const out: Totals = { gp: rows.length };
	for (const k of SUMMED) {
		let n = 0;
		for (const r of rows) n += Number(r[k] ?? 0) || 0;
		out[k] = n;
	}
	out.pt = out.gl + out.a;
	out.sv_pct = out.sa ? out.sv / out.sa : 0;
	out.gaa = out.toi ? (out.ga * 3600) / out.toi : 0;
	return out;
}

export type GameRow = {
	h: string;
	a: string;
	hg: number | null;
	ag: number | null;
	ot: string | null;
	st: string;
};

export type TeamRow = {
	t: string;
	gp: number;
	w: number;
	l: number;
	o: number;
	pt: number;
	gf: number;
	ga: number;
};

export function standings(games: GameRow[]): TeamRow[] {
	const table = new Map<string, TeamRow>();
	const seat = (t: string) => {
		let r = table.get(t);
		if (!r) {
			r = { t, gp: 0, w: 0, l: 0, o: 0, pt: 0, gf: 0, ga: 0 };
			table.set(t, r);
		}
		return r;
	};
	for (const g of games) {
		if (g.st !== 'f') continue;
		const hg = Number(g.hg ?? 0);
		const ag = Number(g.ag ?? 0);
		const home = seat(g.h);
		const away = seat(g.a);
		home.gp += 1;
		away.gp += 1;
		home.gf += hg;
		home.ga += ag;
		away.gf += ag;
		away.ga += hg;
		const winner = hg > ag ? home : away;
		const loser = hg > ag ? away : home;
		winner.w += 1;
		winner.pt += 2;
		if (g.ot) {
			loser.o += 1;
			loser.pt += 1;
		} else {
			loser.l += 1;
		}
	}
	return [...table.values()].sort(
		(x, y) =>
			y.pt - x.pt || y.w - x.w || y.gf - y.ga - (x.gf - x.ga) || (x.t < y.t ? -1 : x.t > y.t ? 1 : 0)
	);
}
