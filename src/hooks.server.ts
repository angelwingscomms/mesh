import { redirect, error } from '@sveltejs/kit';
import { is_expired, is_admin } from '#lib/session';
import { one } from '#lib/db';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = null;
	const s = event.cookies.get('s');
	if (s && event.platform) {
		const row = await one<{ x: number; i: string; e: string; n: string; r: string }>(
			event.platform.env.DB,
			'select ss.x as x, u.i as i, u.e as e, u.n as n, u.r as r from ss join u on u.i = ss.u where ss.i = ?',
			s
		);
		if (row && !is_expired(row.x, Date.now()))
			event.locals.user = { i: row.i, e: row.e, n: row.n, r: row.r };
	}
	if (event.url.pathname.startsWith('/me') && !event.locals.user) redirect(303, '/login');
	if (event.url.pathname.startsWith('/admin') && !is_admin(event.locals.user))
		error(403, 'admins only');
	return resolve(event);
};
