import { error } from '@sveltejs/kit';
import { one } from '#lib/db';
import type { PageServerLoad } from './$types';

type Post = { i: string; ti: string; sl: string; bd: string; pb: number; an: string };

export const load: PageServerLoad = async ({ params, platform }) => {
	const n = await one<Post>(
		platform!.env.DB,
		'select ns.*, u.n as an from ns join u on u.i = ns.u where ns.sl = ? and ns.pb is not null',
		params.sl
	);
	if (!n) error(404, 'no such post');
	return { n };
};
