import { all } from '#lib/db';
import type { PageServerLoad } from './$types';

type Post = { i: string; ti: string; sl: string; bd: string; pb: number; an: string };

export const load: PageServerLoad = async ({ platform }) => ({
	n: await all<Post>(
		platform!.env.DB,
		'select ns.i as i, ns.ti as ti, ns.sl as sl, ns.bd as bd, ns.pb as pb, u.n as an from ns join u on u.i = ns.u where ns.pb is not null order by ns.pb desc'
	)
});
