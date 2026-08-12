import { fail } from '@sveltejs/kit';
import { one, all, run, uid, now, active_season } from '#lib/db';
import type { Actions, PageServerLoad } from './$types';

type Team = { i: string; n: string; ab: string; d: string };
type Player = {
	i: string;
	n: string;
	j: number | null;
	ps: string;
	st: string;
	t: string | null;
	ab: string | null;
	u: string | null;
};
type User = { i: string; e: string; n: string };
type Game = {
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

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform!.env.DB;
	const se = await active_season(db);
	return {
		se,
		t: await all<Team>(db, 'select i, n, ab, d from t order by d, n'),
		p: await all<Player>(
			db,
			'select p.i as i, p.n as n, p.j as j, p.ps as ps, p.st as st, p.t as t, p.u as u, tm.ab as ab from p left join t tm on tm.i = p.t order by p.n'
		),
		u: await all<User>(db, 'select i, e, n from u order by e'),
		g: await all<Game>(
			db,
			'select g.i as i, g.dt as dt, g.st as st, g.ty as ty, g.hg as hg, g.ag as ag, g.ot as ot, g.rc as rc, ht.ab as h, at.ab as a from g join t ht on ht.i = g.h join t at on at.i = g.a where g.s = ? order by g.dt asc',
			se?.i ?? ''
		)
	};
};

const text = (form: FormData, k: string) => String(form.get(k) ?? '').trim();

export const actions: Actions = {
	team_new: async ({ request, platform }) => {
		const db = platform!.env.DB;
		const form = await request.formData();
		const ab = text(form, 'ab').toLowerCase();
		if (await one(db, 'select i from t where ab = ?', ab)) return fail(400, { m: 'abbrev taken' });
		await run(
			db,
			'insert into t (i, n, ab, d) values (?, ?, ?, ?)',
			uid(),
			text(form, 'n').toLowerCase(),
			ab,
			text(form, 'd').toLowerCase()
		);
	},

	player_new: async ({ request, platform }) => {
		const form = await request.formData();
		await run(
			platform!.env.DB,
			"insert into p (i, u, n, t, j, ps, b, st, c) values (?, null, ?, ?, ?, ?, '', 'a', ?)",
			uid(),
			text(form, 'n').toLowerCase(),
			text(form, 't') || null,
			Number(text(form, 'j')) || null,
			text(form, 'ps') || 'c',
			now()
		);
	},

	player_move: async ({ request, platform }) => {
		const form = await request.formData();
		await run(
			platform!.env.DB,
			'update p set t = ? where i = ?',
			text(form, 't') || null,
			text(form, 'i')
		);
	},

	player_edit: async ({ request, platform }) => {
		const form = await request.formData();
		await run(
			platform!.env.DB,
			'update p set j = ?, ps = ?, st = ? where i = ?',
			Number(text(form, 'j')) || null,
			text(form, 'ps'),
			text(form, 'st'),
			text(form, 'i')
		);
	},

	player_link: async ({ request, platform }) => {
		const db = platform!.env.DB;
		const form = await request.formData();
		const i = text(form, 'i');
		const u = text(form, 'u');
		if (u && (await one(db, 'select i from p where u = ? and i != ?', u, i)))
			return fail(400, { m: 'that user already has a player' });
		await run(db, 'update p set u = ? where i = ?', u || null, i);
	},

	game_new: async ({ request, platform }) => {
		const db = platform!.env.DB;
		const form = await request.formData();
		const se = await active_season(db);
		if (!se) return fail(400, { m: 'no active season' });
		await run(
			db,
			"insert into g (i, s, ty, h, a, dt, st) values (?, ?, ?, ?, ?, ?, 's')",
			uid(),
			se.i,
			text(form, 'ty') || 'r',
			text(form, 'h'),
			text(form, 'a'),
			Date.parse(text(form, 'dt'))
		);
	},

	game_result: async ({ request, platform }) => {
		const form = await request.formData();
		await run(
			platform!.env.DB,
			"update g set hg = ?, ag = ?, ot = ?, st = 'f' where i = ?",
			Number(text(form, 'hg')) || 0,
			Number(text(form, 'ag')) || 0,
			text(form, 'ot'),
			text(form, 'i')
		);
	},

	game_recap: async ({ request, platform }) => {
		const form = await request.formData();
		await run(
			platform!.env.DB,
			'update g set rc = ? where i = ?',
			text(form, 'rc'),
			text(form, 'i')
		);
	}
};
