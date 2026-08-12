import { describe, it, expect } from 'vitest';
import { totals, standings } from './stats';

const rows = [
	{ gl: 1, a: 2, pm: 1, pim: 2, sog: 4, hit: 3, blk: 1, toi: 1104, fow: 5, fol: 4 },
	{ gl: 0, a: 1, pm: -1, pim: 0, sog: 2, hit: 1, blk: 0, toi: 900, fow: 2, fol: 6 }
];

describe('totals', () => {
	it('sums counting stats and derives points and games played', () => {
		expect(totals(rows)).toMatchObject({
			gp: 2,
			gl: 1,
			a: 3,
			pt: 4,
			pm: 0,
			pim: 2,
			sog: 6,
			hit: 4,
			blk: 1,
			toi: 2004,
			fow: 7,
			fol: 10
		});
	});

	it('is all zeros for no rows', () => {
		expect(totals([])).toMatchObject({ gp: 0, gl: 0, a: 0, pt: 0, toi: 0, sv_pct: 0, gaa: 0 });
	});

	it('treats missing columns as zero', () => {
		expect(totals([{ gl: 2 }])).toMatchObject({ gp: 1, gl: 2, a: 0, pt: 2 });
	});

	it('derives goalie save percentage and goals against average', () => {
		const g = totals([
			{ sv: 30, ga: 2, sa: 32, so: 0, toi: 3600 },
			{ sv: 20, ga: 0, sa: 20, so: 1, toi: 3600 }
		]);
		expect(g.sv).toBe(50);
		expect(g.ga).toBe(2);
		expect(g.sa).toBe(52);
		expect(g.so).toBe(1);
		expect(g.sv_pct).toBeCloseTo(0.9615, 4);
		expect(g.gaa).toBeCloseTo(1, 3);
	});
});

describe('standings', () => {
	const games = [
		{ h: 'a', a: 'b', hg: 3, ag: 2, ot: '', st: 'f' },
		{ h: 'b', a: 'c', hg: 4, ag: 1, ot: '', st: 'f' },
		{ h: 'c', a: 'a', hg: 2, ag: 3, ot: 'o', st: 'f' },
		{ h: 'a', a: 'b', hg: 0, ag: 0, ot: '', st: 's' }
	];

	it('ranks by points', () => {
		expect(standings(games).map((r) => r.t)).toEqual(['a', 'b', 'c']);
	});

	it('counts a regulation win as two points and an overtime loss as one', () => {
		const [a, b, c] = standings(games);
		expect(a).toEqual({ t: 'a', gp: 2, w: 2, l: 0, o: 0, pt: 4, gf: 6, ga: 4 });
		expect(b).toEqual({ t: 'b', gp: 2, w: 1, l: 1, o: 0, pt: 2, gf: 6, ga: 4 });
		expect(c).toEqual({ t: 'c', gp: 2, w: 0, l: 1, o: 1, pt: 1, gf: 3, ga: 7 });
	});

	it('ignores games that are not final', () => {
		expect(standings(games).every((r) => r.gp === 2)).toBe(true);
	});

	it('breaks a points tie on wins, then goal difference, then team id', () => {
		const tied = [
			{ h: 'q', a: 's', hg: 2, ag: 1, ot: '', st: 'f' },
			{ h: 'p', a: 's', hg: 1, ag: 0, ot: '', st: 'f' },
			{ h: 'p', a: 's', hg: 2, ag: 0, ot: '', st: 'f' },
			{ h: 't', a: 'q', hg: 2, ag: 1, ot: 'o', st: 'f' },
			{ h: 'u', a: 'q', hg: 3, ag: 2, ot: 'o', st: 'f' }
		];
		expect(standings(tied).map((r) => r.t)).toEqual(['p', 'q', 't', 'u', 's']);
	});

	it('is empty with no games', () => {
		expect(standings([])).toEqual([]);
	});
});
