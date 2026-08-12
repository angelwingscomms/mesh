import { fail } from '@sveltejs/kit';
import { one, all, run, uid, now } from '#lib/db';
import type { Actions, PageServerLoad } from './$types';

type Post = { i: string; ti: string; sl: string; bd: string; pb: number | null; c: number };

const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '') || 'post';

export const load: PageServerLoad = async ({ url, platform }) => {
	const db = platform!.env.DB;
	const i = url.searchParams.get('i');
	return {
		n: await all<Post>(db, 'select i, ti, sl, bd, pb, c from ns order by c desc'),
		e: i ? await one<Post>(db, 'select i, ti, sl, bd, pb, c from ns where i = ?', i) : null
	};
};

export const actions: Actions = {
	save: async ({ request, locals, platform }) => {
		const db = platform!.env.DB;
		const form = await request.formData();
		const ti = String(form.get('ti') ?? '').trim();
		const bd = String(form.get('bd') ?? '').trim();
		if (!ti || !bd) return fail(400, { m: 'title and body are required' });
		const i = String(form.get('i') ?? '');
		if (i) {
			await run(db, 'update ns set ti = ?, bd = ? where i = ?', ti, bd, i);
			return;
		}
		const base = slugify(ti);
		let sl = base;
		let n = 2;
		while (await one(db, 'select i from ns where sl = ?', sl)) sl = base + '-' + n++;
		await run(
			db,
			'insert into ns (i, ti, sl, bd, u, pb, c) values (?, ?, ?, ?, ?, null, ?)',
			uid(),
			ti,
			sl,
			bd,
			locals.user!.i,
			now()
		);
	},

	publish: async ({ request, platform }) => {
		const form = await request.formData();
		await run(platform!.env.DB, 'update ns set pb = ? where i = ?', now(), String(form.get('i')));
	},

	unpublish: async ({ request, platform }) => {
		const form = await request.formData();
		await run(platform!.env.DB, 'update ns set pb = null where i = ?', String(form.get('i')));
	}
};
