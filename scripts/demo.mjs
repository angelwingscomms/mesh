import { writeFileSync } from 'node:fs';

// Every row this writes is prefixed d_ so `delete from <table> where i like 'd_%'`
// removes the whole demo league and touches nothing a real league has entered.

const seed = 20260113;
let state = seed;
const rnd = () => {
	state = (state + 0x6d2b79f5) | 0;
	let t = Math.imul(state ^ (state >>> 15), 1 | state);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = (list) => list[Math.floor(rnd() * list.length)];
const between = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));

const TEAMS = [
	['harbour city kraken', 'hck', 'east', 1.08],
	['ridgeway wolves', 'rgw', 'east', 1.0],
	['north bay bears', 'nbb', 'east', 0.92],
	['st albans saints', 'sta', 'east', 0.86],
	['lakeshore lightning', 'lsl', 'west', 1.05],
	['granite falls miners', 'gfm', 'west', 0.97],
	['cedar point cyclones', 'cpc', 'west', 0.9],
	['westport whalers', 'wpw', 'west', 0.84]
];

const FIRST = [
	'ed',
	'sam',
	'kai',
	'milo',
	'theo',
	'arno',
	'jonas',
	'rhys',
	'niko',
	'felix',
	'otto',
	'luca',
	'emil',
	'bo',
	'pierre',
	'anders',
	'dmitri',
	'callum',
	'tobias',
	'noel',
	'ivar',
	'matteo',
	'sasha',
	'ruben',
	'jarno',
	'oskar',
	'linus',
	'devon',
	'marek',
	'yuri',
	'aleksi',
	'gustav',
	'roman',
	'tariq',
	'ines',
	'joel',
	'kasper',
	'nils',
	'viktor',
	'zane'
];

const LAST = [
	'gold',
	'rivers',
	'osei',
	'hart',
	'lindqvist',
	'boucher',
	'novak',
	'tremblay',
	'kallio',
	'brandt',
	'sarkisian',
	'okonkwo',
	'delacroix',
	'vasquez',
	'halvorsen',
	'petrov',
	'mbeki',
	'lindgren',
	'kovac',
	'daniels',
	'strand',
	'moreau',
	'ivanov',
	'nyman',
	'castellano',
	'ferreira',
	'holm',
	'aaltonen',
	'rask',
	'dupont',
	'engel',
	'sandoval',
	'virtanen',
	'laurent',
	'kirby',
	'zima',
	'ferrand',
	'olsson',
	'moreno',
	'bakken'
];

const SLOTS = ['c', 'c', 'l', 'l', 'r', 'r', 'd', 'd', 'd', 'g'];
const ATTRS = ['sk', 'sh', 'pa', 'ck', 'df', 'en', 'fo', 'iq'];

const q = (s) => "'" + String(s).replaceAll("'", "''") + "'";
const out = [];
const say = (s) => out.push(s);

for (const table of ['gs', 'at', 'aw', 'pe', 'g', 'p', 't', 'ns'])
	say(`delete from ${table} where i like 'd_%';`);

say(
	`insert or replace into u (i, e, n, g, r, c) values ('d_u_office', 'office@mesh.invalid', 'league office', 'd_no_google_sub', 'u', 0);`
);

const teams = TEAMS.map(([n, ab, d, strength], i) => ({
	i: 'd_t' + i,
	n,
	ab,
	d,
	strength
}));

for (const t of teams)
	say(
		`insert into t (i, n, ab, d, pr) values (${q(t.i)}, ${q(t.n)}, ${q(t.ab)}, ${q(t.d)}, '#123a6b');`
	);

const used = new Set();
const players = [];
for (const t of teams) {
	const numbers = new Set();
	SLOTS.forEach((ps, s) => {
		let name;
		do {
			name = pick(FIRST) + ' ' + pick(LAST);
		} while (used.has(name));
		used.add(name);
		let j;
		do {
			j = between(1, 97);
		} while (numbers.has(j));
		numbers.add(j);
		const skill = ps === 'g' ? 0 : (ps === 'd' ? 0.35 : 0.55) + rnd() * 0.5;
		players.push({ i: `${t.i}_p${s}`, n: name, t: t.i, j, ps, skill, team: t });
	});
}

const BIOS = {
	c: 'takes the hard faceoffs and never says a word about it.',
	l: 'shoots first, thinks about it on the bench.',
	r: 'quiet on the forecheck until he is not.',
	d: 'blocks shots like rent is due.',
	g: 'plays deep in the crease and dares you to find room.'
};

for (const p of players)
	say(
		`insert into p (i, u, n, t, j, ps, b, h, st, c) values (${q(p.i)}, null, ${q(p.n)}, ${q(p.t)}, ${p.j}, ${q(p.ps)}, ${q(BIOS[p.ps])}, null, 'a', 0);`
	);

// three dated snapshots per player, trending the way a career does
const day = 86400000;
const start = Date.parse('2026-01-05T00:00:00Z');
for (const p of players) {
	const base = {};
	for (const a of ATTRS)
		base[a] = between(52, 74) + Math.round((p.ps === 'g' ? 0.6 : p.skill) * 12);
	[start - 120 * day, start - 40 * day, start + 30 * day].forEach((d, s) => {
		const v = {};
		for (const a of ATTRS) v[a] = Math.min(99, base[a] + s * between(1, 4));
		const note = ['drafted', 'training camp', 'midseason review'][s];
		say(
			`insert into at (i, p, d, v, no) values (${q(p.i + '_a' + s)}, ${q(p.i)}, ${d}, ${q(JSON.stringify(v))}, ${q(note)});`
		);
	});
}

// single round robin: 28 games over 14 dates, then 8 more on the calendar
const pairs = [];
for (let a = 0; a < teams.length; a += 1)
	for (let b = a + 1; b < teams.length; b += 1) pairs.push([teams[a], teams[b]]);
for (let i = pairs.length - 1; i > 0; i -= 1) {
	const j = Math.floor(rnd() * (i + 1));
	[pairs[i], pairs[j]] = [pairs[j], pairs[i]];
}

const skaters = (t) => players.filter((p) => p.t === t.i && p.ps !== 'g');
const keeper = (t) => players.find((p) => p.t === t.i && p.ps === 'g');

const score = (t, opp) => {
	const edge = t.strength / (t.strength + opp.strength);
	const base = 1 + Math.floor(rnd() * 5);
	return Math.max(0, Math.min(8, base + (rnd() < edge ? 1 : 0)));
};

// pack two games onto each date, never the same club twice in a day
const pack = (list, firstDay) => {
	const left = [...list];
	const dated = [];
	let d = firstDay;
	while (left.length) {
		const busy = new Set();
		let placed = 0;
		for (let i = 0; i < left.length && placed < 2;) {
			const [a, b] = left[i];
			if (busy.has(a) || busy.has(b)) {
				i += 1;
				continue;
			}
			busy.add(a);
			busy.add(b);
			dated.push({ pair: left.splice(i, 1)[0], dt: start + d * day });
			placed += 1;
		}
		d += 1;
	}
	return dated;
};

const games = [];
pack(pairs, 0).forEach(({ pair: [home, away], dt }, n) => {
	let hg = score(home, away);
	let ag = score(away, home);
	let ot = '';
	if (hg === ag) {
		ot = rnd() < 0.5 ? 'o' : 's';
		if (rnd() < 0.5) hg += 1;
		else ag += 1;
	}
	games.push({ i: 'd_g' + n, home, away, hg, ag, ot, dt });
});

// the return fixtures, home and away swapped, sitting on the calendar ahead
const returns = pairs.slice(0, 8).map(([a, b]) => [b, a]);
pack(returns, 16).forEach(({ pair: [home, away], dt }, n) => {
	games.push({ i: 'd_gs' + n, home, away, hg: null, ag: null, ot: '', dt, scheduled: true });
});

const RECAPS = [
	'the visitors had the better of the first period and none of the goals, which is how this rivalry usually opens.\n\nthe game turned on a shift midway through the second when the fourth line hemmed the puck in for the better part of a minute and got rewarded for it.\n\nboth clubs are back at it inside a fortnight.',
	'a goaltending duel until it very much was not. the third period produced more shots than the first two together.\n\nthe home side blocked fourteen and looked every bit of it by the final horn.',
	'nothing pretty about this one. four penalties inside the opening ten minutes set the tone and neither bench ever settled.\n\nthe difference was one clean entry off the rush with six minutes to play.',
	'they traded chances all night and the goaltenders traded answers.\n\novertime was decided on the first real mistake either side made, which is a hard way to lose and a fine way to win.',
	'the road team arrived on the second half of a back to back and looked it early, then spent forty minutes proving it did not matter.',
	'a statement from a club that has not made many yet. the top line was on the ice for three of the goals and did not concede once.'
];

let recapAt = 0;
for (const g of games) {
	const rc = !g.scheduled && recapAt < RECAPS.length && rnd() < 0.35 ? RECAPS[recapAt++] : null;
	say(
		`insert into g (i, s, ty, h, a, hg, ag, ot, dt, st, rc) values (${q(g.i)}, 'se1', 'r', ${q(g.home.i)}, ${q(g.away.i)}, ${g.hg ?? 'null'}, ${g.ag ?? 'null'}, ${q(g.ot)}, ${g.dt}, ${q(g.scheduled ? 's' : 'f')}, ${rc ? q(rc) : 'null'});`
	);

	if (g.scheduled) continue;

	for (const side of ['home', 'away']) {
		const team = g[side];
		const mine = side === 'home' ? g.hg : g.ag;
		const theirs = side === 'home' ? g.ag : g.hg;
		const roster = skaters(team);
		const weight = roster.reduce((n, p) => n + p.skill, 0);

		const goals = new Map();
		for (let k = 0; k < mine; k += 1) {
			let r = rnd() * weight;
			const scorer = roster.find((p) => (r -= p.skill) <= 0) ?? roster[0];
			goals.set(scorer.i, (goals.get(scorer.i) ?? 0) + 1);
		}

		const assists = new Map();
		for (let k = 0; k < mine; k += 1) {
			for (let a = 0; a < between(0, 2); a += 1) {
				let r = rnd() * weight;
				const helper = roster.find((p) => (r -= p.skill) <= 0) ?? roster[0];
				assists.set(helper.i, (assists.get(helper.i) ?? 0) + 1);
			}
		}

		let shots = 0;
		for (const p of roster) {
			const gl = goals.get(p.i) ?? 0;
			const a = assists.get(p.i) ?? 0;
			const sog = gl + between(0, p.ps === 'd' ? 2 : 4);
			shots += sog;
			const pm = mine > theirs ? between(0, 2) : mine < theirs ? between(-2, 0) : between(-1, 1);
			const toi = p.ps === 'd' ? between(1080, 1500) : between(720, 1180);
			const fo = p.ps === 'c';
			say(
				`insert into gs (i, gi, pi, ti, gl, a, pm, pim, sog, hit, blk, toi, fow, fol) values (${q(g.i + '_' + p.i)}, ${q(g.i)}, ${q(p.i)}, ${q(team.i)}, ${gl}, ${a}, ${pm}, ${rnd() < 0.25 ? 2 : 0}, ${sog}, ${between(0, 5)}, ${p.ps === 'd' ? between(1, 5) : between(0, 2)}, ${toi}, ${fo ? between(4, 14) : 0}, ${fo ? between(4, 14) : 0});`
			);
		}
		team.lastShots = shots;
	}

	const hs = g.home.lastShots ?? 24;
	const as = g.away.lastShots ?? 24;
	for (const side of ['home', 'away']) {
		const team = g[side];
		const gk = keeper(team);
		const ga = side === 'home' ? g.ag : g.hg;
		const faced = (side === 'home' ? as : hs) + between(2, 8);
		const sa = Math.max(faced, ga + 8);
		const mine = side === 'home' ? g.hg : g.ag;
		const result = mine > ga ? 'w' : g.ot ? 'o' : 'l';
		say(
			`insert into gs (i, gi, pi, ti, toi, sv, ga, sa, so, r) values (${q(g.i + '_' + gk.i)}, ${q(g.i)}, ${q(gk.i)}, ${q(team.i)}, 3600, ${sa - ga}, ${ga}, ${sa}, ${ga === 0 ? 1 : 0}, ${q(result)});`
		);
	}
}

const stars = [...players].filter((p) => p.ps !== 'g').sort((a, b) => b.skill - a.skill);
const AWARDS = [
	'player of the month',
	'rookie of the month',
	'hardest shot',
	'best defensive forward',
	'iron man',
	'most improved'
];
AWARDS.forEach((n, i) =>
	say(
		`insert into aw (i, p, n, s, ty, d) values (${q('d_w' + i)}, ${q(stars[i].i)}, ${q(n)}, 'se1', 'a', ${start + (5 + i) * day});`
	)
);

// the closing headline is written from the table this run actually produced,
// so the copy can never contradict the standings
const table = teams.map((t) => {
	let pt = 0;
	let gp = 0;
	for (const g of games) {
		if (g.scheduled || (g.home !== t && g.away !== t)) continue;
		gp += 1;
		const mine = g.home === t ? g.hg : g.ag;
		const theirs = g.home === t ? g.ag : g.hg;
		pt += mine > theirs ? 2 : g.ot ? 1 : 0;
	}
	return { t, pt, gp };
});
table.sort((a, b) => b.pt - a.pt);
const front = table[0];
const chasing = table.filter((r) => front.pt - r.pt <= 2).length;

const NEWS = [
	[
		'the season opens on fresh ice',
		'eight clubs, one sheet, and eighty players whose entire record now lives here.\n\nevery game is simulated in nhl 25 overnight. by the time you wake up the box score is already cut into the page: goals, assists, time on ice, and the save percentage that decided it.\n\ncoaches can claim their skater from the portal once an admin links the account.'
	],
	[
		'how ratings work now',
		'a rating is never overwritten. every change an admin makes writes a new dated snapshot, so the line on your progress page is the whole climb rather than a single number.\n\nthat means a bad camp stays on the record next to the good one. it also means the first season you take a real step forward, everyone can see exactly when it happened.'
	],
	[
		front.t.n + ' set the early pace',
		front.t.n +
			' leads on ' +
			front.pt +
			' points through ' +
			front.gp +
			' games, and has been the more complete club for most of them.\n\nthe chasing pack is closer than the table suggests: ' +
			chasing +
			' clubs sit within a win of top spot and the schedule turns hard in a fortnight.'
	]
];

NEWS.forEach(([ti, bd], i) =>
	say(
		`insert into ns (i, ti, sl, bd, u, pb, c) values (${q('d_n' + i)}, ${q(ti)}, ${q(ti.replaceAll(' ', '-'))}, ${q(bd)}, 'd_u_office', ${start + (2 + i * 4) * day}, ${start});`
	)
);

writeFileSync('scripts/demo.sql', out.join('\n') + '\n');
console.log(
	`wrote scripts/demo.sql — ${teams.length} teams, ${players.length} players, ${games.length} games, ${out.length} statements`
);
