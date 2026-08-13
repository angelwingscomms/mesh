import { fail } from '@sveltejs/kit';
import { one, all, run, uid, now } from '#lib/db';
import { validate_edit } from '#lib/approve';
import type { Actions, PageServerLoad } from './$types';

type Pending = { i: string; f: string; v: string; c: number };

const EXT: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp'
};

const my_player = (db: D1Database, u: string) =>
	one<{ i: string; n: string; j: number | null; b: string; h: string | null }>(
		db,
		'select i, n, j, b, h from p where u = ? limit 1',
		u
	);

export const load: PageServerLoad = async ({ locals, platform }) => {
	const db = platform!.env.DB;
	const p = await my_player(db, locals.user!.i);
	if (!p) return { e: [] as Pending[] };
	return {
		e: await all<Pending>(
			db,
			"select i, f, v, c from pe where p = ? and st = 'r' order by c desc",
			p.i
		)
	};
};

const queue = async (db: D1Database, p: string, u: string, f: string, v: string) => {
	await run(db, "delete from pe where p = ? and f = ? and st = 'r'", p, f);
	await run(
		db,
		"insert into pe (i, p, u, f, v, st, c) values (?, ?, ?, ?, ?, 'r', ?)",
		uid(),
		p,
		u,
		f,
		v,
		now()
	);
};

export const actions: Actions = {
	request: async ({ request, locals, platform }) => {
		const db = platform!.env.DB;
		const p = await my_player(db, locals.user!.i);
		if (!p) return fail(400, { m: 'field' });
		const form = await request.formData();
		const f = String(form.get('f') ?? '');
		const v = String(form.get('v') ?? '');
		const bad = validate_edit(f, v);
		if (bad) return fail(400, { m: bad });
		await queue(db, p.i, locals.user!.i, f, v);
		return { m: '' };
	},

	headshot: async ({ request, locals, platform }) => {
		const db = platform!.env.DB;
		const p = await my_player(db, locals.user!.i);
		if (!p) return fail(400, { m: 'image' });
		const file = (await request.formData()).get('file');
		if (!(file instanceof File) || !file.size || file.size > 2 * 1024 * 1024 || !EXT[file.type])
			return fail(400, { m: 'image' });
		const k = 'h/' + uid() + '.' + EXT[file.type];
		await platform!.env.R2.put(k, await file.arrayBuffer(), {
			httpMetadata: { contentType: file.type }
		});
		await queue(db, p.i, locals.user!.i, 'h', k);
		return { m: '' };
	}
};
