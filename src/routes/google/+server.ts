import { redirect, error } from '@sveltejs/kit';
import { get_secret } from '#lib/secret';
import { new_id, cookie_opts, SESSION_COOKIE, SESSION_MS } from '#lib/session';
import { one, run, now } from '#lib/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, platform, cookies }) => {
	const code = url.searchParams.get('code');
	if (!code || url.searchParams.get('state') !== cookies.get('st')) error(400, 'bad login');
	cookies.delete('st', { path: '/' });
	const db = platform!.env.DB;
	const res = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			code,
			client_id: await get_secret(platform!.env.GOOGLE_ID),
			client_secret: await get_secret(platform!.env.GOOGLE_SECRET),
			redirect_uri: new URL('/google', url.origin).toString(),
			grant_type: 'authorization_code'
		})
	});
	if (!res.ok) error(502, 'google rejected the login');
	const tok = (await res.json()) as { access_token: string };
	const me = (await (
		await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
			headers: { authorization: 'Bearer ' + tok.access_token }
		})
	).json()) as { sub: string; email: string; name?: string };
	let u = await one<{ i: string }>(db, 'select i from u where g = ?', me.sub);
	if (!u) {
		const i = new_id();
		await run(
			db,
			'insert into u (i, e, n, g, r, c) values (?, ?, ?, ?, ?, ?)',
			i,
			me.email,
			(me.name || me.email).toLowerCase(),
			me.sub,
			'u',
			now()
		);
		u = { i };
	}
	const s = new_id();
	await run(db, 'insert into ss (i, u, x) values (?, ?, ?)', s, u.i, now() + SESSION_MS);
	cookies.set(SESSION_COOKIE, s, cookie_opts(url.protocol === 'https:'));
	redirect(303, '/me');
};
