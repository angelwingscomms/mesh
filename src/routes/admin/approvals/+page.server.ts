import { one, all, run, now } from '#lib/db';
import { apply_edit } from '#lib/approve';
import type { Actions, PageServerLoad } from './$types';

type Row = { i: string; f: string; v: string; c: number; pi: string; pn: string; ue: string };
type Decided = Row & { st: string; rd: number; rn: string | null };

const PENDING =
	"select pe.i as i, pe.f as f, pe.v as v, pe.c as c, p.i as pi, p.n as pn, u.e as ue from pe join p on p.i = pe.p join u on u.i = pe.u where pe.st = 'r' order by pe.c asc";

const DECIDED =
	"select pe.i as i, pe.f as f, pe.v as v, pe.c as c, pe.st as st, pe.rd as rd, p.i as pi, p.n as pn, u.e as ue, rv.n as rn from pe join p on p.i = pe.p join u on u.i = pe.u left join u rv on rv.i = pe.rv where pe.st != 'r' order by pe.rd desc limit 20";

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform!.env.DB;
	return { q: await all<Row>(db, PENDING), h: await all<Decided>(db, DECIDED) };
};

export const actions: Actions = {
	ok: async ({ request, locals, platform }) => {
		const db = platform!.env.DB;
		const i = String((await request.formData()).get('i') ?? '');
		const row = await one<{ p: string; f: string; v: string }>(
			db,
			"select p, f, v from pe where i = ? and st = 'r'",
			i
		);
		if (!row) return;
		const player = await one<Record<string, unknown>>(db, 'select * from p where i = ?', row.p);
		if (!player) return;
		let next: Record<string, unknown>;
		try {
			next = apply_edit(player, row.f, row.v);
		} catch {
			await run(
				db,
				"update pe set st = 'f', rv = ?, rd = ? where i = ?",
				locals.user!.i,
				now(),
				i
			);
			return;
		}
		const column = { n: 'n', j: 'j', b: 'b', h: 'h' }[row.f];
		if (!column) return;
		await run(db, 'update p set ' + column + ' = ? where i = ?', next[row.f], row.p);
		await run(db, "update pe set st = 's', rv = ?, rd = ? where i = ?", locals.user!.i, now(), i);
	},

	no: async ({ request, locals, platform }) => {
		const i = String((await request.formData()).get('i') ?? '');
		await run(
			platform!.env.DB,
			"update pe set st = 'f', rv = ?, rd = ? where i = ?",
			locals.user!.i,
			now(),
			i
		);
	}
};
