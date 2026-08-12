import { one } from '#lib/db';
import type { LayoutServerLoad } from './$types';

export type Me = {
	i: string;
	n: string;
	j: number | null;
	ps: string;
	b: string;
	h: string | null;
	t: string | null;
};

export const load: LayoutServerLoad = async ({ locals, platform }) => ({
	p: await one<Me>(
		platform!.env.DB,
		"select i, n, j, ps, b, h, t from p where u = ? and st = 'a' limit 1",
		locals.user!.i
	)
});
